"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";
import { useStore } from "@/lib/store/useStore";
import { useMerchStore } from "@/store/useProductStore";
import {
	calculatePaystackFee,
	calculatePaystackTotal,
} from "@/lib/paystackFees";
import CheckoutButton from "@/components/CheckoutButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	email: z.email("Invalid email address"),
	phoneNumber: z
		.string()
		.trim()
		.min(7, "Enter a valid phone number")
		.max(15, "Phone number is too long")
		.regex(/^[\d\s\+\-\(\)]+$/, "Enter a valid phone number"),
	department: z
		.string()
		.trim()
		.min(2, "Department must be at least 2 characters"),
	level: z.enum(["100", "200", "300", "400", "500"] as const, {
		message: "Please select a valid level",
	}),
});

type FormData = z.infer<typeof schema>;

export default function PayStackPayment() {
	const cart = useStore((state) => state.cart);
	const allProducts = useMerchStore((state) => state.allProducts);
	const fetchInventory = useMerchStore((state) => state.fetchInventory);
	const isInventoryLoading = useMerchStore((state) => state.isLoading);

	useEffect(() => {
		if (allProducts.length === 0) {
			fetchInventory();
		}
	}, [allProducts.length, fetchInventory]);

	const parsePrice = (price: string) => {
		const numeric = Number(price.replace(/[^\d.]/g, ""));
		return Number.isNaN(numeric) ? 0 : numeric;
	};

	const cartItems = useMemo(() => {
		return cart.map((item) => {
			const product = allProducts.find((p) => p.productId === item.productId);

			const variantById = product?.variants.find(
				(variant) => variant.variantId === item.variantId,
			);
			const parsedVariantIndex = Number(item.variantId);
			const variantByIndex = Number.isInteger(parsedVariantIndex)
				? product?.variants[parsedVariantIndex]
				: undefined;
			const variant = variantById ?? variantByIndex;

			const price = parsePrice(product?.price ?? "0");

			return {
				productId: item.productId,
				variantId: item.variantId,
				name: product?.name ?? "Unknown product",
				color: variant?.color ?? "N/A",
				size: item.size,
				price,
				quantity: item.quantity,
			};
		});
	}, [allProducts, cart]);

	const totalQty = useMemo(
		() => cartItems.reduce((sum, item) => sum + item.quantity, 0),
		[cartItems],
	);
	const subtotalAmount = useMemo(
		() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
		[cartItems],
	);
	const paystackFee = useMemo(
		() => calculatePaystackFee(subtotalAmount),
		[subtotalAmount],
	);
	const totalAmount = useMemo(
		() => calculatePaystackTotal(subtotalAmount),
		[subtotalAmount],
	);

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			maximumFractionDigits: 0,
		}).format(value);

	const shouldShowLoadingSkeleton =
		cart.length > 0 && isInventoryLoading && allProducts.length === 0;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			phoneNumber: "",
			department: "",
			level: undefined,
		},
	});

	const onSubmit = async (values: FormData) => {
		if (cartItems.length === 0 || subtotalAmount <= 0) {
			toast.error("Your cart is empty. Add items before checkout.");
			return;
		}

		try {
			const response = await fetch("/api/paystack/initialize", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: values.name,
					email: values.email,
					phoneNumber: values.phoneNumber,
					department: values.department,
					level: values.level,
					totalQty,
					amount: subtotalAmount,
					cartItems,
				}),
			});

			const data = await response.json();

			if (!response.ok || !data?.status || !data?.data?.authorization_url) {
				throw new Error(
					data?.message || "Failed to initialize Paystack checkout",
				);
			}

			toast.success("Redirecting to Paystack...");
			reset();
			window.location.href = data.data.authorization_url as string;
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Unable to initialize checkout";
			toast.error(message);
		}
	};

	if (shouldShowLoadingSkeleton) {
		return (
			<div className="min-h-screen bg-gray-100 p-4">
				<div className="mx-auto w-full max-w-5xl">
					<div className="mb-4">
						<Skeleton className="h-9 w-28 rounded-md" />
					</div>
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
						<div className="rounded-xl bg-white p-6 shadow-xl">
							<Skeleton className="h-8 w-32" />
							<div className="mt-4 space-y-3">
								<Skeleton className="h-16 w-full rounded-lg" />
								<Skeleton className="h-16 w-full rounded-lg" />
							</div>
							<div className="mt-4 rounded-lg border border-gray-200 p-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="mt-2 h-4 w-full" />
								<Skeleton className="mt-2 h-5 w-full" />
							</div>
						</div>
						<div className="rounded-xl bg-white p-6 shadow-xl">
							<Skeleton className="mx-auto h-8 w-44" />
							<div className="mt-6 space-y-4">
								<div>
									<Skeleton className="h-4 w-16" />
									<Skeleton className="mt-2 h-10 w-full rounded-lg" />
								</div>
								<div>
									<Skeleton className="h-4 w-16" />
									<Skeleton className="mt-2 h-10 w-full rounded-lg" />
								</div>
								<div>
									<Skeleton className="h-4 w-24" />
									<Skeleton className="mt-2 h-10 w-full rounded-lg" />
								</div>
								<div>
									<Skeleton className="h-4 w-12" />
									<Skeleton className="mt-2 h-10 w-full rounded-lg" />
								</div>
								<Skeleton className="mt-2 h-10 w-full rounded-lg" />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			<div className="mx-auto w-full max-w-5xl">
				<Button variant="outline" size="sm" className="mb-4">
					<Link href="/">Back to Home</Link>
				</Button>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
					<div className="rounded-xl bg-white p-6 shadow-xl">
						<h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>

						{cartItems.length === 0 ? (
							<p className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-6 text-center text-sm text-gray-600">
								Your cart is empty.
							</p>
						) : (
							<>
								<div className="mt-4 space-y-3">
									{cartItems.map((item) => (
										<div
											key={`${item.productId}-${item.variantId}-${item.size}`}
											className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 p-3"
										>
											<div>
												<p className="text-sm font-semibold text-gray-900">
													{item.name}
												</p>
												<p className="mt-1 text-xs text-gray-600">
													Color: {item.color} • Size: {item.size || "N/A"}
												</p>
											</div>
											<div className="text-right">
												<p className="text-sm font-semibold text-gray-900">
													{formatCurrency(item.price * item.quantity)}
												</p>
												<p className="mt-1 text-xs text-gray-600">
													Qty: {item.quantity}
												</p>
											</div>
										</div>
									))}
								</div>

								<div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
									<div className="flex items-center justify-between">
										<span>Subtotal</span>
										<span className="font-medium text-gray-900">
											{formatCurrency(subtotalAmount)}
										</span>
									</div>
									<div className="mt-1 flex items-center justify-between">
										<span>Paystack Fee</span>
										<span className="font-medium text-gray-900">
											{formatCurrency(paystackFee)}
										</span>
									</div>
									<div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2 text-xl font-semibold text-gray-900">
										<span>Total Charge</span>
										<span>{formatCurrency(totalAmount)}</span>
									</div>
									<div className="mt-2 flex items-center justify-between text-xs text-gray-600">
										<span>Items</span>
										<span>{totalQty}</span>
									</div>
								</div>
							</>
						)}
					</div>

					<div className="rounded-xl bg-white p-6 shadow-xl">
						<h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
							Checkout Details
						</h2>

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col gap-4"
						>
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Name
								</label>
								<input
									{...register("name")}
									type="text"
									placeholder="John Doe"
									className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-0 transition focus:border-black"
								/>
								{errors.name && (
									<p className="mt-1 text-sm text-red-500">
										{errors.name.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Email
								</label>
								<input
									{...register("email")}
									type="email"
									placeholder="john@example.com"
									className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-0 transition focus:border-black"
								/>
								{errors.email && (
									<p className="mt-1 text-sm text-red-500">
										{errors.email.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Phone Number
								</label>
								<input
									{...register("phoneNumber")}
									type="number"
									placeholder="08034523456"
									className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-0 transition focus:border-black"
								/>
								{errors.phoneNumber && (
									<p className="mt-1 text-sm text-red-500">
										{errors.phoneNumber.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Department
								</label>
								<input
									{...register("department")}
									type="text"
									placeholder="Computer Science"
									className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-0 transition focus:border-black"
								/>
								{errors.department && (
									<p className="mt-1 text-sm text-red-500">
										{errors.department.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Level
								</label>
								<select
									{...register("level")}
									className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 transition focus:border-black"
								>
									<option value="">Select level</option>
									{["100", "200", "300", "400", "500"].map((lvl) => (
										<option key={lvl} value={lvl}>
											{lvl} Level
										</option>
									))}
								</select>
								{errors.level && (
									<p className="mt-1 text-sm text-red-500">
										{errors.level.message}
									</p>
								)}
							</div>

							<CheckoutButton isSubmitting={isSubmitting} />
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
