"use client";
import ProductList from "@/components/ProductList";
import Filter from "@/components/Filter";
import { useState } from "react";
// import { products } from "@/lib/products";
import { motion } from "framer-motion";
import { useMerchStore } from "@/store/useProductStore";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function CategoriesSectionSkeleton() {
	return (
		<section className="relative mx-auto mt-8 w-full max-w-360 px-4 pb-16 sm:mt-12 sm:px-6 lg:px-8">
			<div className="grid items-start gap-8 lg:grid-cols-[minmax(auto,280px)_1fr] xl:gap-12">
				<aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-24">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="mt-3 h-4 w-56" />
					<div className="mt-6 space-y-3">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</aside>
				<div className="grid grid-cols-2 gap-6 xl:grid-cols-3 2xl:grid-cols-4">
					{Array.from({ length: 8 }).map((_, index) => (
						<div
							key={`catalog-skeleton-${index}`}
							className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4"
						>
							<Skeleton className="aspect-square w-full rounded-xl" />
							<Skeleton className="mt-4 h-6 w-3/4" />
							<Skeleton className="mt-2 h-4 w-1/3" />
							<Skeleton className="mt-5 h-9 w-full rounded-sm" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function CategoriesSection() {
	const [selectedColor, setSelectedColor] = useState<string | null>(null);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
	const products = useMerchStore((state) => state.allProducts);
	const [hasRequestedInventory, setHasRequestedInventory] = useState(
		products.length > 0,
	);
	const fetchInventory = useMerchStore((state) => state.fetchInventory);
	const isLoading = useMerchStore((state) => state.isLoading);

	useEffect(() => {
		if (products.length > 0) {
			setHasRequestedInventory(true);
			return;
		}

		setHasRequestedInventory(true);
		fetchInventory();
	}, [fetchInventory, products.length]);

	if (!hasRequestedInventory || (isLoading && products.length === 0)) {
		return <CategoriesSectionSkeleton />;
	}

	const filteredProducts = products.filter((product) => {
		const productMatch = !selectedProduct || product.name === selectedProduct;

		const colorMatch =
			!selectedColor ||
			product.variants.some(
				(v: { color: string }) => v.color === selectedColor,
			);

		return productMatch && colorMatch;
	});

	return (
		<motion.section
			id="productsSection"
			className="relative mx-auto mt-8 w-full max-w-360 px-4 pb-16 sm:mt-12 sm:px-6 lg:px-8"
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45, ease: "easeOut" }}
		>
			<div className="grid items-start gap-8 lg:grid-cols-[minmax(auto,280px)_1fr] xl:gap-12">
				<motion.aside
					className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-24"
					initial={{ opacity: 0, x: -18 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
				>
					<h3 className="text-2xl font-bold sm:text-3xl">Category</h3>
					<p className="mt-2 text-sm text-gray-500">
						Refine by product type, color, and size.
					</p>
					<Filter
						setSelectedColor={setSelectedColor}
						// setSelectedSize={setSelectedSize}
						setSelectedProduct={setSelectedProduct}
						selectedColor={selectedColor}
						selectedProduct={selectedProduct}
						// selectedSize={selectedSize}
					/>
				</motion.aside>
				<motion.div
					className="min-w-0"
					initial={{ opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
				>
					<ProductList
						selectedColor={selectedColor}
						selectedSize={selectedSize}
						filteredProducts={filteredProducts}
					/>
				</motion.div>
			</div>
		</motion.section>
	);
}
