import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type VerifyResponse = {
	status?: boolean;
	message?: string;
	data?: {
		status?: string;
		amount?: number;
		customer?: { email?: string };
		metadata?: {
			customerName?: string;
			department?: string;
			level?: string;
			totalQuantity?: number;
			cartItems?: unknown;
		};
	};
};

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ reference: string }> },
) {
	const { reference: rawReference } = await params;
	const reference = decodeURIComponent(rawReference ?? "").trim();
	const secretKey = process.env.PAYSTACK_SECRET_KEY;

	if (!secretKey) {
		return NextResponse.json(
			{ success: false, message: "Paystack secret key is not configured" },
			{ status: 500 },
		);
	}

	if (!reference) {
		return NextResponse.json(
			{ success: false, message: "Missing transaction reference" },
			{ status: 400 },
		);
	}

	let response: Response;
	let result: VerifyResponse;

	try {
		response = await fetch(
			`https://api.paystack.co/transaction/verify/${reference}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${secretKey}`,
				},
				cache: "no-store",
			},
		);

		const contentType = response.headers.get("content-type") ?? "";
		if (!contentType.includes("application/json")) {
			return NextResponse.json(
				{
					success: false,
					message: "Unexpected response from Paystack verification API",
				},
				{ status: 502 },
			);
		}

		result = (await response.json()) as VerifyResponse;
	} catch {
		return NextResponse.json(
			{
				success: false,
				message: "Unable to reach Paystack verification service",
			},
			{ status: 502 },
		);
	}

	if (!response.ok || !result.status) {
		return NextResponse.json(
			{
				success: false,
				message: result.message ?? "Unable to verify transaction",
			},
			{ status: response.status || 502 },
		);
	}

	if (result.data?.status !== "success") {
		return NextResponse.json(
			{ success: false, message: "Payment was not successful" },
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
			{ success: false, message: "Failed to check existing order" },
			{ status: 500 },
		);
	}

	if (!existingOrder) {
		const metadata = result.data.metadata ?? {};
		const { error } = await supabaseAdmin.from("orders").insert([
			{
				customerEmail: result.data.customer?.email ?? null,
				totalAmount: (result.data.amount ?? 0) / 100,
				paystackReference: reference,
				status: "success",
				customerName: metadata.customerName ?? null,
				department: metadata.department ?? null,
				level: metadata.level ?? null,
				totalQuantity: metadata.totalQuantity ?? 0,
				orderItems: metadata.cartItems ?? [],
			},
		]);

		if (error) {
			console.error("Insert error:", error);
			return NextResponse.json(
				{ error: "Order save failed", details: error.message },
				{ status: 500 },
			);
		}
	}

	return NextResponse.json({ success: true });
}

// [
//   {
//     "productId": "tshirt",
//     "variantId": "tshirt-blue",
//     "name": "T-Shirt",
//     "color": "Blue",
//     "size": "XL",
//     "price": 7000,
//     "quantity": 1
//   }
// ]
