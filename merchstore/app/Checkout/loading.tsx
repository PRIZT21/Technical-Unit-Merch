import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
				<Skeleton className="mx-auto h-8 w-44" />
				<div className="mt-6 space-y-4">
					{Array.from({ length: 4 }).map((_, index) => (
						<div key={`checkout-loading-${index}`}>
							<Skeleton className="h-4 w-20" />
							<Skeleton className="mt-2 h-10 w-full rounded-lg" />
						</div>
					))}
					<Skeleton className="h-10 w-full rounded-lg" />
				</div>
			</div>
		</div>
	);
}
