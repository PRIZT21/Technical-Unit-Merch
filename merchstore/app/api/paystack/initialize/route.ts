import { NextResponse } from "next/server";

type InitializeBody = {
	name?: unknown;
	department?: unknown;
	level?: unknown;
	totalQty?: unknown;
	email?: unknown;
	amount?: unknown;
	cartItems?: unknown;
};

const isNonEmptyString = (value: unknown): value is string =>
	typeof value === "string" && value.trim().length > 0;

export async function POST(req: Request) {
	const secretKey = process.env.PAYSTACK_SECRET_KEY;
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

	if (!secretKey || !siteUrl) {
		return NextResponse.json(
			{ message: "Paystack environment variables are not configured" },
			{ status: 500 },
		);
	}

	let body: InitializeBody;
	try {
		body = (await req.json()) as InitializeBody;
	} catch {
		return NextResponse.json(
			{ message: "Invalid request payload" },
			{ status: 400 },
		);
	}

	const name = body.name;
	const department = body.department;
	const level = body.level;
	const email = body.email;
	const totalQty = Number(body.totalQty);
	const amount = Number(body.amount);
	const cartItems = Array.isArray(body.cartItems) ? body.cartItems : [];

	if (
		!isNonEmptyString(name) ||
		!isNonEmptyString(department) ||
		!isNonEmptyString(level) ||
		!isNonEmptyString(email) ||
		!Number.isFinite(totalQty) ||
		totalQty <= 0 ||
		!Number.isFinite(amount) ||
		amount <= 0 ||
		cartItems.length === 0
	) {
		return NextResponse.json(
			{ message: "Missing or invalid checkout details" },
			{ status: 400 },
		);
	}

	const amountInKobo = Math.round(amount * 100);

	const response = await fetch(
		"https://api.paystack.co/transaction/initialize",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${secretKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				amount: amountInKobo,
				callback_url: `${siteUrl.replace(/\/$/, "")}/verify-payment`,
				metadata: {
					customerName: name,
					department,
					level,
					cartItems,
					totalQuantity: totalQty,
				},
			}),
		},
	);

	const data = await response.json();

	if (!response.ok || !data?.status) {
		return NextResponse.json(
			{
				message: data?.message ?? "Unable to initialize Paystack checkout",
			},
			{ status: response.status || 502 },
		);
	}

	return NextResponse.json(data);
}
