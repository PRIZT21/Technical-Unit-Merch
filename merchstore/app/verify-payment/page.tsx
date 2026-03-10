"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@/lib/store/useStore";
import { Skeleton } from "@/components/ui/skeleton";

type VerificationStatus = "loading" | "success" | "failed";

export default function VerifyPaymentPage() {
	const searchParams = useSearchParams();
	const clearCart = useStore((state) => state.clearCart);
	const [status, setStatus] = useState<VerificationStatus>("loading");
	const [message, setMessage] = useState("Verifying your payment...");

	const reference = useMemo(
		() => searchParams.get("reference") ?? searchParams.get("trxref") ?? "",
		[searchParams],
	);

	useEffect(() => {
		let cancelled = false;

		const verifyPayment = async () => {
			if (!reference) {
				if (cancelled) return;
				setStatus("failed");
				setMessage(
					"We could not find a payment reference in the callback URL.",
				);
				toast.error("Missing payment reference");
				return;
			}

			try {
				const response = await fetch(
					`/api/paystack/verify/${encodeURIComponent(reference)}`,
					{ cache: "no-store" },
				);

				const contentType = response.headers.get("content-type") ?? "";
				if (!contentType.includes("application/json")) {
					throw new Error(
						"Verification service returned an unexpected response",
					);
				}

				const data = (await response.json()) as {
					success?: boolean;
					message?: string;
				};

				if (!response.ok || !data?.success) {
					throw new Error(data?.message ?? "Payment verification failed");
				}

				if (cancelled) return;

				clearCart();
				setStatus("success");
				setMessage(
					"Payment confirmed. Your order has been recorded successfully.",
				);
				toast.success("Payment verified successfully");
			} catch (error) {
				if (cancelled) return;

				const reason =
					error instanceof Error
						? error.message
						: "Unable to verify your payment";
				setStatus("failed");
				setMessage(reason);
				toast.error(reason);
			}
		};

		verifyPayment();
		return () => {
			cancelled = true;
		};
	}, [clearCart, reference]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-lg rounded-xl bg-white p-6 text-center shadow-xl">
				<h1 className="text-2xl font-bold text-gray-900">Payment Status</h1>
				<p className="mt-3 text-sm text-gray-700">{message}</p>

				{status === "loading" && (
					<div className="mt-5 space-y-3">
						<Skeleton className="mx-auto h-4 w-44" />
						<Skeleton className="mx-auto h-4 w-36" />
						<Skeleton className="mx-auto mt-2 h-10 w-32 rounded-lg" />
					</div>
				)}

				{status === "success" && (
					<div className="mt-6 flex justify-center gap-3">
						<Link
							href="/"
							className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
						>
							Back to Home
						</Link>
					</div>
				)}

				{status === "failed" && (
					<div className="mt-6 flex justify-center gap-3">
						<Link
							href="/Checkout"
							className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
						>
							Try Again
						</Link>
						<Link
							href="/"
							className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
						>
							Go Home
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
