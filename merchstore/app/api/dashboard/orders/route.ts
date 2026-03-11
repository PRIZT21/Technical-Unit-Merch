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
	const token = authHeader?.startsWith("Bearer ")
		? authHeader.slice(7).trim()
		: null;
	const normalizedAdminSecret = adminSecret.trim();

	if (!token || token !== normalizedAdminSecret) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { data, error } = await supabaseAdmin
		.from("orders")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		return NextResponse.json(
			{
				error: "Failed to fetch orders",
				details: error.message ?? error.details ?? null,
				hint: error.hint ?? null,
			},
			{ status: 500 },
		);
	}

	return NextResponse.json({ orders: data });
}
