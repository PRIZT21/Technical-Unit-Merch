import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyPaymentLoading() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-lg rounded-xl bg-white p-6 text-center shadow-xl">
				<Skeleton className="mx-auto h-8 w-44" />
				<div className="mt-5 space-y-3">
					<Skeleton className="mx-auto h-4 w-56" />
					<Skeleton className="mx-auto h-4 w-40" />
					<Skeleton className="mx-auto mt-2 h-10 w-32 rounded-lg" />
				</div>
			</div>
		</div>
	);
}
