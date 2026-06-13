"use client";

import Image from "next/image";
import { useState, useCallback, useMemo } from "react";

type OrderItem = {
	productId?: string | null;
	variantId?: string | null;
	name: string;
	color: string;
	size: string;
	quantity: number;
	price: number;
};

type Order = {
	id: string;
	paystackReference: string;
	customerName: string | null;
	customerEmail: string | null;
	phoneNumber: string | null;
	department: string | null;
	level: string | null;
	totalAmount: number;
	totalQuantity: number;
	orderItems: OrderItem[];
	status: string;
	createdAt: string;
};

type ItemFilter = "all" | "hoodie" | "sweatshirt" | "tshirt" | "varsity-jacket";

type ItemSalesStats = {
	hoodie: number;
	sweatshirt: number;
	tshirt: number;
	"varsity-jacket": number;
};

function getItemType(
	item: Pick<OrderItem, "name" | "productId" | "variantId">,
): Exclude<ItemFilter, "all"> | "other" {
	const normalizedName = String(item.name ?? "")
		.toLowerCase()
		.replace(/[-_]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	const normalizedHints =
		`${String(item.productId ?? "")} ${String(item.variantId ?? "")}`
			.toLowerCase()
			.replace(/[-_]/g, " ")
			.replace(/\s+/g, " ")
			.trim();
	const normalized = `${normalizedName} ${normalizedHints}`.trim();

	if (normalizedHints.includes("varsity")) return "varsity-jacket";
	if (
		normalizedHints.includes("sweatshirt") ||
		normalizedHints.includes("sweat shirt")
	) {
		return "sweatshirt";
	}
	if (normalizedHints.includes("hoodie")) return "hoodie";
	if (
		normalizedHints.includes("tshirt") ||
		normalizedHints.includes("t shirt") ||
		normalizedHints.includes("t-shirt")
	) {
		return "tshirt";
	}

	if (normalized.includes("varsity")) return "varsity-jacket";
	if (normalized.includes("sweatshirt") || normalized.includes("sweat shirt")) {
		return "sweatshirt";
	}
	if (/\bhoodie\b/.test(normalized)) return "hoodie";
	if (
		normalized.includes("tshirt") ||
		normalized.includes("t shirt") ||
		normalized.includes("t-shirt") ||
		/\bt\s?shirt\b/.test(normalized) ||
		/\btee\b/.test(normalized)
	) {
		return "tshirt";
	}

	return "other";
}

function formatDate(iso: string) {
	return new Date(iso).toLocaleString("en-NG", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function formatItems(items: OrderItem[]) {
	if (!Array.isArray(items) || items.length === 0) return "—";
	return items
		.map((i) => `${i.quantity}x ${i.name} (${i.color}, ${i.size})`)
		.join("; ");
}

function downloadCSV(orders: Order[]) {
	const headers = [
		"Reference",
		"Date",
		"Name",
		"Email",
		"Phone",
		"Department",
		"Level",
		"Amount (₦)",
		"Qty",
		"Status",
		"Items",
	];

	const escape = (v: string | number | null | undefined) => {
		const str = String(v ?? "");
		return str.includes(",") || str.includes('"') || str.includes("\n")
			? `"${str.replace(/"/g, '""')}"`
			: str;
	};

	const rows = orders.map((o) => [
		escape(o.paystackReference),
		escape(formatDate(o.createdAt)),
		escape(o.customerName),
		escape(o.customerEmail),
		escape(o.phoneNumber),
		escape(o.department),
		escape(o.level),
		escape(o.totalAmount),
		escape(o.totalQuantity),
		escape(o.status),
		escape(formatItems(o.orderItems)),
	]);

	const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `technical-unit-merch-orders-${new Date().toISOString().slice(0, 10)}.csv`;
	link.click();
	URL.revokeObjectURL(url);
}

// ─── Password Gate ────────────────────────────────────────────────────────────

function PasswordGate({ onAuth }: { onAuth: (secret: string) => void }) {
	const [value, setValue] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		const candidate = value.trim();
		if (!candidate) {
			setError("Enter your admin password.");
			return;
		}
		setLoading(true);
		try {
			const res = await fetch("/api/dashboard/orders", {
				headers: { Authorization: `Bearer ${candidate}` },
				cache: "no-store",
			});
			if (res.ok) {
				onAuth(candidate);
			} else {
				const payload = (await res.json().catch(() => null)) as {
					error?: string;
				} | null;
				setError(
					payload?.error === "Unauthorized"
						? "Invalid password."
						: (payload?.error ?? "Unable to sign in."),
				);
			}
		} catch {
			setError("Unable to connect. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl">
				<h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
					Admin Dashboard
				</h1>
				<p className="mb-6 text-center text-sm text-gray-500">
					Enter the admin password to continue.
				</p>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<input
						type="password"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder="Admin password"
						autoFocus
						className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-black"
					/>
					{error && <p className="text-sm text-red-500">{error}</p>}
					<button
						type="submit"
						disabled={loading || !value}
						className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
					>
						{loading ? "Checking…" : "Sign In"}
					</button>
				</form>
			</div>
		</div>
	);
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
	const [secret, setSecret] = useState<string | null>(null);
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [itemFilter, setItemFilter] = useState<ItemFilter>("all");

	const fetchOrders = useCallback(async (s: string) => {
		setLoading(true);
		setError("");
		try {
			const res = await fetch("/api/dashboard/orders", {
				headers: { Authorization: `Bearer ${s}` },
				cache: "no-store",
			});
			if (!res.ok) {
				const payload = (await res.json().catch(() => null)) as {
					error?: string;
					details?: string | null;
				} | null;
				throw new Error(
					payload?.details ?? payload?.error ?? "Failed to load orders.",
				);
			}
			const json = (await res.json()) as { orders: Order[] };
			setOrders(json.orders ?? []);
		} catch (err) {
			if (err instanceof Error && err.message === "Failed to fetch") {
				setError(
					"Unable to reach dashboard API. Restart dev server and try again.",
				);
				return;
			}
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	}, []);

	const handleAuth = (s: string) => {
		setSecret(s);
		void fetchOrders(s);
	};

	const filtered = orders.filter((o) => {
		const matchesSearch =
			search === "" ||
			[o.customerName, o.customerEmail, o.paystackReference, o.phoneNumber]
				.join(" ")
				.toLowerCase()
				.includes(search.toLowerCase());
		const matchesStatus = statusFilter === "all" || o.status === statusFilter;
		const matchesItem =
			itemFilter === "all" ||
			o.orderItems.some((item) => getItemType(item) === itemFilter);
		return matchesSearch && matchesStatus && matchesItem;
	});

	const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
	const totalQty = orders.reduce((sum, o) => sum + o.totalQuantity, 0);
	const itemSales = useMemo<ItemSalesStats>(() => {
		const soldOrders = orders.filter((order) => order.status === "success");

		return soldOrders.reduce<ItemSalesStats>(
			(stats, order) => {
				order.orderItems.forEach((item) => {
					const itemType = getItemType(item);
					if (itemType === "other") return;
					stats[itemType] += Number(item.quantity) || 0;
				});

				return stats;
			},
			{ hoodie: 0, sweatshirt: 0, tshirt: 0, "varsity-jacket": 0 },
		);
	}, [orders]);

	if (!secret) return <PasswordGate onAuth={handleAuth} />;
	return (
		<div className="min-h-screen bg-gray-100 p-4 md:p-8">
			{/* Header */}
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Orders Dashboard</h1>
					<p className="text-sm text-gray-500">Technical Unit Merch · Admin</p>
				</div>
				<div className="flex gap-2">
					<button
						onClick={() => void fetchOrders(secret)}
						disabled={loading}
						className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
					>
						{loading ? "Refreshing…" : "Refresh"}
					</button>
					<button
						onClick={() => downloadCSV(filtered)}
						disabled={filtered.length === 0}
						className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
					>
						Download CSV
					</button>
				</div>
			</div>

			{/* Stats */}
			<div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
				{[
					{ label: "Total Orders", value: orders.length },
					{
						label: "Total Revenue",
						value: `₦${totalRevenue.toLocaleString()}`,
					},
					{ label: "Items Sold", value: totalQty },
					{
						label: "Showing",
						value: filtered.length,
					},
				].map(({ label, value }) => (
					<div key={label} className="rounded-xl bg-white p-4 shadow-sm">
						<p className="text-xs font-medium uppercase tracking-wide text-gray-500">
							{label}
						</p>
						<p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
					</div>
				))}
			</div>

			<div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
				{[
					{ label: "Hoodies Sold", value: itemSales.hoodie },
					{ label: "Sweatshirts Sold", value: itemSales.sweatshirt },
					{ label: "T-Shirts Sold", value: itemSales.tshirt },
					{
						label: "Varsity Jackets Sold",
						value: itemSales["varsity-jacket"],
					},
				].map(({ label, value }) => (
					<div key={label} className="rounded-xl bg-white p-4 shadow-sm">
						<p className="text-xs font-medium uppercase tracking-wide text-gray-500">
							{label}
						</p>
						<p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
					</div>
				))}
			</div>

			{/* Filters */}
			<div className="mb-4 flex flex-col gap-3 sm:flex-row">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search by name, email, phone, reference…"
					className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-black"
				/>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-black"
				>
					<option value="all">All statuses</option>
					<option value="success">Success</option>
					<option value="pending">Pending</option>
					<option value="failed">Failed</option>
				</select>
				<select
					value={itemFilter}
					onChange={(e) => setItemFilter(e.target.value as ItemFilter)}
					className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-black"
				>
					<option value="all">All items</option>
					<option value="hoodie">Hoodies</option>
					<option value="sweatshirt">Sweatshirts</option>
					<option value="tshirt">T-Shirts</option>
					<option value="varsity-jacket">Varsity Jackets</option>
				</select>
			</div>

			{error && (
				<div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					{error}
				</div>
			)}

			{/* Table */}
			<div className="overflow-x-auto rounded-xl bg-white shadow-sm">
				<table className="w-full text-sm text-left">
					<thead>
						<tr className="border-b border-gray-100 bg-gray-50">
							{[
								"Date",
								"Reference",
								"Name",
								"Email",
								"Phone",
								"Dept",
								"Level",
								"Amount",
								"Qty",
								"Status",
								"Items",
							].map((h) => (
								<th
									key={h}
									className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap"
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-50">
						{loading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<tr key={i} className="animate-pulse">
									{Array.from({ length: 11 }).map((_, j) => (
										<td key={j} className="px-4 py-3">
											<div className="h-4 w-20 rounded bg-gray-200" />
										</td>
									))}
								</tr>
							))
						) : filtered.length === 0 ? (
							<tr>
								<td
									colSpan={11}
									className="px-4 py-12 text-center text-gray-400"
								>
									No orders found.
								</td>
							</tr>
						) : (
							filtered.map((o) => (
								<tr key={o.id} className="transition hover:bg-gray-50">
									<td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">
										{formatDate(o.createdAt)}
									</td>
									<td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-gray-700">
										{o.paystackReference}
									</td>
									<td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
										{o.customerName ?? "—"}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-gray-600">
										{o.customerEmail ?? "—"}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-gray-600">
										{o.phoneNumber ?? "—"}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-gray-600">
										{o.department ?? "—"}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-gray-600">
										{o.level ?? "—"}
									</td>
									<td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-900">
										₦{o.totalAmount.toLocaleString()}
									</td>
									<td className="px-4 py-3 whitespace-nowrap text-center text-gray-600">
										{o.totalQuantity}
									</td>
									<td className="px-4 py-3 whitespace-nowrap">
										<span
											className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
												o.status === "success"
													? "bg-green-100 text-green-700"
													: o.status === "pending"
														? "bg-yellow-100 text-yellow-700"
														: "bg-red-100 text-red-700"
											}`}
										>
											{o.status}
										</span>
									</td>
									<td className="px-4 py-3 text-gray-500 text-xs max-w-xs">
										{formatItems(o.orderItems)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<p className="mt-4 text-center text-xs text-gray-400">
				{filtered.length} of {orders.length} orders ·{" "}
				<button
					onClick={() => {
						setSecret(null);
						setOrders([]);
					}}
					className="underline hover:text-gray-600"
				>
					Sign out
				</button>
			</p>
		</div>
	);
}
