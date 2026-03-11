import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type PaystackWebhookEvent = {
	event?: string;
	data?: {
		reference?: string;
		metadata?: {
			customerName?: string;
			department?: string;
			level?: string;
			totalQuantity?: number;
			cartItems?: unknown;
		};
		customer?: { email?: string };
		amount?: number;
	};
};

export async function POST(req: Request) {
	const secretKey = process.env.PAYSTACK_SECRET_KEY;

	if (!secretKey) {
		return NextResponse.json(
			{ error: "Paystack secret key is not configured" },
			{ status: 500 },
		);
	}

	const body = await req.text();
	const signature = req.headers.get("x-paystack-signature");

	if (!signature) {
		return new Response("Unauthorized", { status: 401 });
	}

	const hash = crypto
		.createHmac("sha512", secretKey)
		.update(body)
		.digest("hex");

	if (hash !== signature) {
		return new Response("Unauthorized", { status: 401 });
	}

	let event: PaystackWebhookEvent;
	try {
		event = JSON.parse(body) as PaystackWebhookEvent;
	} catch {
		return NextResponse.json(
			{ error: "Invalid webhook payload" },
			{ status: 400 },
		);
	}

	if (event.event !== "charge.success") {
		return NextResponse.json({ received: true }, { status: 200 });
	}

	const reference = event.data?.reference;
	if (!reference) {
		return NextResponse.json(
			{ error: "Missing transaction reference" },
			{ status: 400 },
		);
	}

	const { data: existingOrder, error: existingOrderError } = await supabaseAdmin
		.from("orders")
		.select("paystackReference")
		.eq("paystackReference", reference)
		.maybeSingle();

	if (existingOrderError) {
		return NextResponse.json(
			{ error: "Failed to check existing order" },
			{ status: 500 },
		);
	}

	if (!existingOrder) {
		const metadata = event.data?.metadata ?? {};
		const { error } = await supabaseAdmin.from("orders").insert([
			{
				customerEmail: event.data?.customer?.email ?? null,
				customerName: metadata.customerName ?? null,
				department: metadata.department ?? null,
				level: metadata.level ?? null,
				totalQuantity: metadata.totalQuantity ?? 0,
				totalAmount: (event.data?.amount ?? 0) / 100,
				paystackReference: reference,
				orderItems: metadata.cartItems ?? [],
				status: "success",
			},
		]);

		if (error) {
			return NextResponse.json(
				{ error: "Database save failed" },
				{ status: 500 },
			);
		}
	}

	// ACKNOWLEDGMENT: Paystack needs a 200 OK or they will keep retrying
	return NextResponse.json({ received: true }, { status: 200 });
}
