"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { products } from "@/lib/products";
import ProductOverview from "@/components/ProductOverview";

export default function ProductList({filteredProducts, selectedColor, selectedSize}: {
	filteredProducts: typeof products;
	selectedColor: string | null;
	selectedSize: string | null;
}) {
	// const [colorValue, setColorValue] = useState<string>(selectedColor);
	// const [sizeValue, setSizeValue] = useState<string>(selectedSize);
	const [selectedProduct, setSelectedProduct] = useState<null | {
		productId: string;
		variantIndex: number;
	}>(null);


	return (
		<div className="bg-white">
			<div className="mx-auto px-4 sm:px-6 sm:pb-24  lg:px-8">
				<div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
					{filteredProducts.map((product) =>
						product.variants.map((variant, variantIndex) => (
							<div
								key={`${product.id}-${variantIndex}`}
								className="group relative"
								onClick={() =>
									setSelectedProduct({
										productId: product.id,
										variantIndex: variantIndex,
									})
								}
							>
								<img
									alt={variant.imageAlt}
									src={variant.imageSrc}
									className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
								/>

								<div className="mt-4 flex justify-between px-4">
									<div>
										<h3 className="text-2xl font-bold">
											<a
												// href={product.href}
											>
												<span aria-hidden="true" className="absolute inset-0" />
												{product.name}
											</a>
										</h3>
										<p className="mt-1 text-xs text-gray-500">
											{variant.color} • {variant.sizes.join(", ")}
										</p>
									</div>

									<p className="text-lg font-semibold self-center">
										{product.price}
									</p>
								</div>

								<Button
									className="w-full mt-8 rounded-sm"
									content="leftIcon"
									leftIcon={<ShoppingCart />}
								>
									Add to Cart
								</Button>
							</div>
						)),
					)}
				</div>
      </div>
	  {selectedProduct && (
  <ProductOverview
	product={
	  products.find(p => p.id === selectedProduct.productId)!
	}
	variantIndex={selectedProduct.variantIndex}
	onClose={() => setSelectedProduct(null)}
  />
)}
		</div>
	);
}
