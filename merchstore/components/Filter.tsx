"use client";

import { motion } from "framer-motion";

const productOptions = [
	"All",
	"T-Shirt",
	"Sweatshirt",
	"Varsity Jacket",
	"Hoodie",
];

const colorOptions = [
	{
		name: "All",
		value: "",
		bg: "bg-gradient-to-br from-white via-blue-600 to-amber-800",
	},
	{ name: "Black", value: "Black", bg: "bg-black" },
	{ name: "Blue", value: "Blue", bg: "bg-blue-600" },
	{ name: "Grey", value: "Grey", bg: "bg-gray-500" },
	{ name: "Brown", value: "Brown", bg: "bg-amber-800" },
	{
		name: "White",
		value: "White",
		bg: "bg-white border border-gray-300",
	},
];

// const sizeOptions = ["All", "XS", "S", "M", "L", "XL", "XXL"];

export default function Filter({
	setSelectedColor,
	// setSelectedSize,
	setSelectedProduct,
	selectedColor,
	selectedProduct,
	// selectedSize,
}: {
	setSelectedColor: (value: string) => void;
	// setSelectedSize: (value: string) => void;
	setSelectedProduct: (value: string) => void;
	selectedColor: string | null;
	selectedProduct: string | null;
	// selectedSize: string | null;
}) {
	return (
		<motion.div
			className="mb-1 mt-6 flex flex-col gap-6 sm:gap-8"
			initial="hidden"
			animate="show"
			variants={{
				hidden: { opacity: 0 },
				show: {
					opacity: 1,
					transition: {
						staggerChildren: 0.08,
						delayChildren: 0.05,
					},
				},
			}}
		>
			<motion.div
				variants={{
					hidden: { opacity: 0, y: 12 },
					show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
				}}
			>
				<label className="mb-2 block text-sm font-medium">Product</label>
				<div className="grid grid-cols-2 gap-2">
					{productOptions.map((product) => {
						const isSelected =
							(product === "All" && !selectedProduct) ||
							selectedProduct === product;

						return (
							<motion.button
								key={product}
								type="button"
								onClick={() =>
									setSelectedProduct(product === "All" ? "" : product)
								}
								whileHover={{ y: -2 }}
								whileTap={{ scale: 0.96 }}
								aria-pressed={isSelected}
								className={`rounded border px-1 py-1 text-center text-sm transition ${
									isSelected
										? "border-gray-900 bg-gray-900 text-white"
										: "border-gray-300 hover:bg-gray-100"
								}`}
							>
								{product}
							</motion.button>
						);
					})}
				</div>
			</motion.div>

			<motion.div
				variants={{
					hidden: { opacity: 0, y: 12 },
					show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
				}}
			>
				<label className="mb-2 block text-sm font-medium">Color</label>
				<div className="flex flex-wrap gap-2">
					{colorOptions.map((color) => {
						const isSelectedColor =
							selectedColor === color.value ||
							(color.value === "" && !selectedColor);

						return (
							<motion.button
								key={color.name}
								type="button"
								onClick={() => setSelectedColor(color.value)}
								whileHover={{ scale: 1.08 }}
								whileTap={{ scale: 0.92 }}
								aria-label={color.name}
								aria-pressed={isSelectedColor}
								className={`h-8 w-8 rounded-full border-2 transition ${
									isSelectedColor
										? "border-gray-900"
										: "border-gray-400 hover:border-gray-600"
								} ${color.bg}`}
								title={color.name}
								style={
									color.value === ""
										? {
												backgroundImage:
													"radial-gradient(circle, white, black)",
											}
										: undefined
								}
							/>
						);
					})}
				</div>
			</motion.div>

			<motion.div
				variants={{
					hidden: { opacity: 0, y: 12 },
					show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
				}}
			>
				<label className="mb-2 block text-sm font-medium">Size</label>
				<div className="flex flex-1">
					Products are available in all sizes
				</div>
			</motion.div>
		</motion.div>
	);
}
