"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useStore } from "@/lib/store/useStore";
import { useMerchStore } from "@/store/useProductStore";
import CheckoutButton from "@/components/CheckoutButton";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters"),
	email: z.email("Invalid email address"),
	department: z
		.string()
		.trim()
		.min(2, "Department must be at least 2 characters"),
	level: z.string().trim().min(2, "Level must be at least 2 characters"),
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
	const amount = useMemo(
		() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
		[cartItems],
	);

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
			department: "",
			level: "",
		},
	});

	const onSubmit = async (values: FormData) => {
		if (cartItems.length === 0 || amount <= 0) {
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
					department: values.department,
					level: values.level,
					totalQty,
					amount,
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
			<div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
				<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
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
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
				<h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
					Checkout Details
				</h2>

				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
							<p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
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
						<input
							{...register("level")}
							type="text"
							placeholder="400"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none ring-0 transition focus:border-black"
						/>
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
	);
}
