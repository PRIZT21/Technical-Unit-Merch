"use client";
import ProductList from "@/components/ProductList";
import { Button } from "@/components/ui/button";
import { Handbag, Palette, Scaling } from "lucide-react";
import Filter from "@/components/Filter";
import { useState } from "react";
import { products } from "@/lib/products";

export default function CategoriesSection() {
	const [selectedColor, setSelectedColor] = useState<string | null>(null);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

	const filteredProducts = products.filter((product) => {
		const productMatch = !selectedProduct || product.name === selectedProduct;

		const colorMatch =
			!selectedColor || product.variants.some((v) => v.color === selectedColor);

		return productMatch && colorMatch;
	});

	return (
		<>
			<div className="flex gap-12 items-start mt-16 mx-32">
				<div className="flex flex-col gap-6">
					<h3 className="text-3xl font-bold">Category</h3>
					<Filter
						setSelectedColor={setSelectedColor}
						setSelectedSize={setSelectedSize}
						setSelectedProduct={setSelectedProduct}
						selectedColor={selectedColor}
						selectedProduct={selectedProduct}
					/>
				</div>
				<div>
					<ProductList
						selectedColor={selectedColor}
						selectedSize={selectedSize}
						filteredProducts={filteredProducts}
					/>
				</div>
			</div>
		</>
	);
}
