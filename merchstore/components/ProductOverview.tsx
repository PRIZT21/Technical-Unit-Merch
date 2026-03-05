"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { useStore } from "@/lib/store/useStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ProductOverviewProps = {
	product: Product;
	variantIndex: number;
	onClose: () => void;
};

// const reviews = { href: "#", average: 4, totalCount: 117 };

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
	const [hasAddedToCart, setHasAddedToCart] = useState(false);
	// add to cart function
	const addToCart = useStore((state) => state.addToCart);

	const handleAddToCart = () => {
		const selectedVariant =
			product.variants[selectedVariantIndex] ?? product.variants[0];

		toast.promise<{ name: string }>(
			() =>
				new Promise((resolve, reject) => {
					try {
						addToCart({
							productId: product.productId,
							variantId: selectedVariant.variantId,
							size: selectedSize,
							quantity: 1,
						});

						// Optional delay so "Loading..." is visible
						setTimeout(() => resolve({ name: product.name }), 400);
					} catch (error) {
						reject(error);
					}
				}),
			{
				loading: "Adding to cart...",
				success: (data) => {
					setHasAddedToCart(true);
					return `${data.name} has been added to your bag`;
				},
				error: "Could not add to cart",
			},
		);
	};

	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const touchStartX = useRef<number | null>(null);
	const touchEndX = useRef<number | null>(null);

	useEffect(() => {
		setSelectedVariantIndex(variantIndex);
	}, [variantIndex]);

	const currentVariant =
		product.variants[selectedVariantIndex] ?? product.variants[0];
	const variantImages = [
		{
			src: currentVariant.imageSrc,
			alt: currentVariant.imageAlt,
		},
		...(currentVariant.imageBackSrc
			? [
					{
						src: currentVariant.imageBackSrc,
						alt:
							currentVariant.imageBackAlt ??
							`${product.name} ${currentVariant.color} back view`,
					},
				]
			: []),
	];

	useEffect(() => {
		setSelectedSize(currentVariant?.sizes[0] ?? "");
	}, [currentVariant?.variantId]);

	useEffect(() => {
		setSelectedImageIndex(0);
	}, [currentVariant?.variantId]);

	// image carousel handlers
	const showPreviousImage = () => {
		setSelectedImageIndex((prev) =>
			prev === 0 ? variantImages.length - 1 : prev - 1,
		);
	};

	const showNextImage = () => {
		setSelectedImageIndex((prev) =>
			prev === variantImages.length - 1 ? 0 : prev + 1,
		);
	};

	const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
		touchStartX.current = event.touches[0]?.clientX ?? null;
		touchEndX.current = null;
	};

	const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
		touchEndX.current = event.touches[0]?.clientX ?? null;
	};

	const handleTouchEnd = () => {
		if (
			touchStartX.current === null ||
			touchEndX.current === null ||
			variantImages.length < 2
		) {
			return;
		}

		const swipeDistance = touchStartX.current - touchEndX.current;
		const minSwipeDistance = 40;

		if (swipeDistance > minSwipeDistance) {
			showNextImage();
		}

		if (swipeDistance < -minSwipeDistance) {
			showPreviousImage();
		}
	};

	if (!currentVariant) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md "
			onClick={onClose}
		>
			<div
				className="bg-stone-100 max-h-screen w-full max-w-6xl overflow-hidden rounded-xl m-4 shadow-lg"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="pt-6">
					<div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
						<Button
							type="button"
							onClick={onClose}
							className="rounded-md border border-gray-300 px-3 py-1 text-sm bg-white text-gray-900 hover:bg-gray-100 hover:text-black"
						>
							Close
						</Button>
					</div>

					<nav aria-label="Breadcrumb">
						<ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
							<li className="text-sm">
								<a
									aria-current="page"
									className="font-medium text-gray-500 hover:text-gray-600"
								>
									{product.name}
								</a>
							</li>
						</ol>
					</nav>

					<div className="flex flex-col lg:flex-row items-center gap-8 p-8">
						<div className="shrink-0 flex-1">
							<div
								className="relative"
								onTouchStart={handleTouchStart}
								onTouchMove={handleTouchMove}
								onTouchEnd={handleTouchEnd}
							>
								<img
									alt={variantImages[selectedImageIndex].alt}
									src={variantImages[selectedImageIndex].src}
									className="aspect-3/4 w-full rounded-lg object-cover"
								/>
								{variantImages.length > 1 && (
									<>
										<button
											type="button"
											onClick={showPreviousImage}
											className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black px-3 py-2 text-sm shadow hover:bg-gray-800 text-white transition-colors"
											aria-label="Previous image"
										>
											‹
										</button>
										<button
											type="button"
											onClick={showNextImage}
											className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black px-3 py-2 text-sm shadow hover:bg-gray-800 text-white transition-colors"
											aria-label="Next image"
										>
											›
										</button>
										<div className="mt-3 flex justify-center gap-2">
											{variantImages.map((image, idx) => (
												<button
													key={image.src}
													type="button"
													onClick={() => setSelectedImageIndex(idx)}
													className={classNames(
														"h-2.5 w-2.5 rounded-full",
														idx === selectedImageIndex
															? "bg-black"
															: "bg-gray-300",
													)}
													aria-label={`Show image ${idx + 1}`}
												/>
											))}
										</div>
									</>
								)}
							</div>
						</div>

						<div className="flex-1">
							<div className="lg:border-r lg:border-gray-200 lg:pr-8">
								<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
									{product.name}
								</h1>
								<p className="mt-2 text-sm text-gray-500">
									Color:{" "}
									<span className="font-medium">{currentVariant.color}</span>
								</p>
							</div>

							<div className="mt-4">
								<p className="text-3xl tracking-tight text-gray-900">
									{product.price}
								</p>
								<div className="mt-10">
									<h3 className="text-sm font-medium text-gray-900">Variant</h3>
									<div className="mt-3 flex flex-wrap gap-2">
										{product.variants.map((variant, idx) => (
											<Button
												key={variant.variantId}
												type="button"
												onClick={() => setSelectedVariantIndex(idx)}
												className={classNames(
													"rounded-md border px-3 py-1 text-sm",
													idx === selectedVariantIndex
														? "border-black bg-black text-white hover-none"
														: "border-gray-300 bg-white text-gray-900",
												)}
											>
												{variant.color}
											</Button>
										))}
									</div>
								</div>
								<div className="mt-8">
									<h3 className="text-sm font-medium text-gray-900">Size</h3>
									<div className="mt-3 grid grid-cols-4 gap-2">
										{currentVariant.sizes.map((size) => (
											<Button
												key={size}
												type="button"
												onClick={() => setSelectedSize(size)}
												className={classNames(
													"rounded-md border px-3 py-2 text-sm uppercase",
													selectedSize === size
														? "border-black bg-black text-white"
														: "border-gray-300 bg-white text-gray-900",
												)}
											>
												{size}
											</Button>
										))}
									</div>
								</div>
								{hasAddedToCart ? (
									<a
										href="#productsSection"
										onClick={onClose}
										className="mt-10 flex w-full items-center justify-center rounded-md bg-black px-8 py-3 text-base font-medium text-white transition-colors hover:bg-black/90"
									>
										Continue Shopping
										<span aria-hidden="true"> &rarr;</span>
									</a>
								) : (
									<Button
										type="button"
										className="mt-10 flex w-full items-center justify-center rounded-md bg-black px-8 py-3 text-base font-medium text-white transition-colors hover:bg-black/90"
										onClick={handleAddToCart}
									>
										Add to bag
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
