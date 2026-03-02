"use client";

import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import type { Product } from "@/lib/products";

type ProductOverviewProps = {
	product: Product;
	variantIndex: number;
	onClose: () => void;
};

const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(" ");
}

export default function ProductOverview({
	product,
	variantIndex,
	onClose,
}: ProductOverviewProps) {
	const [selectedVariantIndex, setSelectedVariantIndex] =
		useState(variantIndex);
	const [selectedSize, setSelectedSize] = useState(
		product.variants[variantIndex]?.sizes[0] ?? "",
	);

	useEffect(() => {
		setSelectedVariantIndex(variantIndex);
	}, [variantIndex]);

	const currentVariant =
		product.variants[selectedVariantIndex] ?? product.variants[0];

	useEffect(() => {
		setSelectedSize(currentVariant?.sizes[0] ?? "");
	}, [currentVariant?.id]);

	if (!currentVariant) return null;

	return (
		<div className="bg-white fixed inset-0 z-50 overflow-y-auto">
			<div className="pt-6">
				<div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
					<button
						type="button"
						onClick={onClose}
						className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
					>
						Close
					</button>
				</div>

				<nav aria-label="Breadcrumb">
					<ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
						<li className="text-sm">
							<a
								href={product.href}
								aria-current="page"
								className="font-medium text-gray-500 hover:text-gray-600"
							>
								{product.name}
							</a>
						</li>
					</ol>
				</nav>

				<div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8">
					<img
						alt={currentVariant.imageAlt}
						src={currentVariant.imageSrc}
						className="row-span-2 aspect-3/4 size-full rounded-lg object-cover max-lg:hidden"
					/>
				</div>

				<div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
					<div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
						<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
							{product.name}
						</h1>
						<p className="mt-2 text-sm text-gray-500">
							Color: <span className="font-medium">{currentVariant.color}</span>
						</p>
					</div>

					<div className="mt-4 lg:row-span-3 lg:mt-0">
						<p className="text-3xl tracking-tight text-gray-900">
							{product.price}
						</p>

						<div className="mt-6 flex items-center">
							<div className="flex items-center">
								{[0, 1, 2, 3, 4].map((rating) => (
									<StarIcon
										key={rating}
										aria-hidden="true"
										className={classNames(
											reviews.average > rating
												? "text-gray-900"
												: "text-gray-200",
											"size-5 shrink-0",
										)}
									/>
								))}
							</div>
							<a
								href={reviews.href}
								className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
							>
								{reviews.totalCount} reviews
							</a>
						</div>

						<div className="mt-10">
							<h3 className="text-sm font-medium text-gray-900">Variant</h3>
							<div className="mt-3 flex flex-wrap gap-2">
								{product.variants.map((variant, idx) => (
									<button
										key={variant.id}
										type="button"
										onClick={() => setSelectedVariantIndex(idx)}
										className={classNames(
											"rounded-md border px-3 py-1 text-sm",
											idx === selectedVariantIndex
												? "border-indigo-600 bg-indigo-600 text-white"
												: "border-gray-300 bg-white text-gray-900",
										)}
									>
										{variant.color}
									</button>
								))}
							</div>
						</div>

						<div className="mt-8">
							<h3 className="text-sm font-medium text-gray-900">Size</h3>
							<div className="mt-3 grid grid-cols-4 gap-2">
								{currentVariant.sizes.map((size) => (
									<button
										key={size}
										type="button"
										onClick={() => setSelectedSize(size)}
										className={classNames(
											"rounded-md border px-3 py-2 text-sm uppercase",
											selectedSize === size
												? "border-indigo-600 bg-indigo-600 text-white"
												: "border-gray-300 bg-white text-gray-900",
										)}
									>
										{size}
									</button>
								))}
							</div>
						</div>

						<button
							type="button"
							className="mt-10 flex w-full items-center justify-center rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700"
						>
							Add to bag
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
