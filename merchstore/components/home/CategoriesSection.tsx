"use client";
import ProductList from "@/components/ProductList";
import { Button } from "@/components/ui/button";
import { Handbag, Palette, Scaling } from "lucide-react";
import Filter from "@/components/Filter";
import { useState } from "react";

export default function CategoriesSection() {
	const [selectedColor, setSelectedColor] =  useState<string>("Black");
	const [selectedSize, setSelectedSize] =  useState<string>("M");
	return (
		<>
			<div className="flex gap-8 items-start mt-16 mx-32">
				<div>
					<h3 className="text-3xl font-bold">Category</h3>
					<Filter
						setSelectedColor={setSelectedColor}
						setSelectedSize={setSelectedSize}
					/>
				</div>
				<div>
					<ProductList
						selectedColor={selectedColor}
						selectedSize={selectedSize}
					/>
				</div>
			</div>
		</>
	);
}
