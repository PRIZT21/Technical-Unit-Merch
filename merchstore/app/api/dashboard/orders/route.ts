 import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
	const adminSecret = process.env.ADMIN_SECRET;

	if (!adminSecret) {
		return NextResponse.json(
			{ error: "Admin secret is not configured" },
			{ status: 500 },
		);
	}

	const authHeader = req.headers.get("authorization");
	const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

	if (!token || token !== adminSecret) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { data, error } = await supabaseAdmin
		.from("orders")
		.select(
			"id, paystackReference, customerName, customerEmail, phoneNumber, department, level, totalAmount, totalQuantity, orderItems, status, created_at",
		)
		.order("created_at", { ascending: false });

	if (error) {
		return NextResponse.json(
			{ error: "Failed to fetch orders" },
			{ status: 500 },
		);
	}

	return NextResponse.json({ orders: data });
}
