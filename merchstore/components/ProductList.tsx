"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useMerchStore } from "@/store/useProductStore";
import ProductOverview from "@/components/ProductOverview";
import { AnimatePresence, motion } from "framer-motion";

export default function ProductList({
	filteredProducts,
	selectedColor,
	selectedSize,
}: {
	filteredProducts: typeof products;
	selectedColor: string | null;
	selectedSize: string | null;
}) {
	const products = useMerchStore((state) => state.allProducts);
	const [selectedProduct, setSelectedProduct] = useState<null | {
		productId: string;
		variantIndex: number;
	}>(null);

	const filterSignature = useMemo(
		() => filteredProducts.map((product) => product.productId).join("|"),
		[filteredProducts],
	);

	const visibleVariants = useMemo(
		() =>
			filteredProducts.flatMap((product) =>
				product.variants
					.map((variant, variantIndex) => ({ product, variant, variantIndex }))
					.filter(({ variant }) => {
						const colorMatch =
							!selectedColor || variant.color === selectedColor;
						const sizeMatch =
							!selectedSize || variant.sizes.includes(selectedSize);

						return colorMatch && sizeMatch;
					}),
			),
		[filteredProducts, selectedColor, selectedSize],
	);

	const activeFilterKey = useMemo(
		() =>
			`${filterSignature}-${selectedColor ?? "all"}-${selectedSize ?? "all"}`,
		[filterSignature, selectedColor, selectedSize],
	);

	return (
		<div className="w-full cursor-pointer bg-white">
			<div className="mx-auto w-full pb-6 sm:pb-12">
				<AnimatePresence mode="wait">
					{visibleVariants.length === 0 ? (
						<motion.div
							key={`empty-${activeFilterKey}`}
							className="mt-2 flex min-h-[50vh] items-center justify-center"
							initial={{ opacity: 0, y: 18 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 8 }}
							transition={{ duration: 0.25, ease: "easeOut" }}
						>
							<div className="w-full max-w-md rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
								<h3 className="text-lg font-semibold text-gray-900">
									No matching products
								</h3>
								<p className="mt-2 text-sm text-gray-600">
									No items match your selected filters. Try another combination.
								</p>
							</div>
						</motion.div>
					) : (
						<motion.div
							key={`grid-${activeFilterKey}`}
							className="grid grid-cols-2 gap-6 xl:grid-cols-3 2xl:grid-cols-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.25, ease: "easeOut" }}
						>
							<AnimatePresence>
								{visibleVariants.map(
									({ product, variant, variantIndex }, index) => (
										<motion.article
											layout
											key={`${product.productId}-${variant.variantId}`}
											className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-lg sm:p-4"
											onClick={() =>
												setSelectedProduct({
													productId: product.productId,
													variantIndex: variantIndex,
												})
											}
											initial={{ opacity: 0, y: 18, scale: 0.98 }}
											animate={{
												opacity: 1,
												y: 0,
												scale: 1,
												transition: {
													duration: 0.34,
													delay: index * 0.03,
													ease: "easeOut",
												},
											}}
											exit={{ opacity: 0, y: 12, scale: 0.98 }}
											whileHover={{ y: -5 }}
											whileTap={{ scale: 0.985 }}
										>
											<div className="relative overflow-hidden rounded-xl bg-gray-100">
												<Image
													alt={variant.imageAlt}
													src={variant.imageSrc}
													width={800}
													height={800}
													className="aspect-square w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
												/>
												<Image
													alt={
														variant.imageBackAlt ?? `${product.name} back view`
													}
													src={variant.imageBackSrc ?? variant.imageSrc}
													width={800}
													height={800}
													className="absolute inset-0 aspect-square w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
												/>
											</div>

											<div className="mt-4 flex items-end justify-between gap-3 px-1">
												<div className="min-w-0">
													<h3 className=" text-xl font-bold sm:text-2xl">
														{product.name}
													</h3>
													<p className="mt-1 text-xs text-gray-500">
														{variant.color}
													</p>
												</div>
												<p className="shrink-0 text-base font-semibold sm:text-lg">
													{product.price.startsWith("₦")
														? product.price
														: `₦${product.price}`}
												</p>
											</div>

											<Button
												className="mt-5 w-full rounded-sm"
												content="leftIcon"
												leftIcon={<ShoppingCart />}
											>
												Add to Cart
											</Button>
										</motion.article>
									),
								)}
							</AnimatePresence>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<AnimatePresence>
				{selectedProduct && (
					<ProductOverview
						product={
							products.find((p) => p.productId === selectedProduct.productId)!
						}
						variantIndex={selectedProduct.variantIndex}
						onClose={() => setSelectedProduct(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
