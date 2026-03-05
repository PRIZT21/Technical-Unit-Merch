"use client";

export default function Filter({
	setSelectedColor,
	setSelectedSize,
	setSelectedProduct,
	selectedColor,
	selectedProduct,
}: {
	setSelectedColor: (value: string) => void;
	setSelectedSize: (value: string) => void;
	setSelectedProduct: (value: string) => void;
	selectedColor: string | null;
	selectedProduct: string | null;
}) {
	return (
		<>
			<div className="flex flex-col gap-8 mb-6">
				{/* Product Type */}
				<div>
					<label className="block text-sm font-medium mb-2">Product</label>
					<div className="grid grid-cols-2 gap-2">
						{["All", "T-Shirt", "Sweatshirt", "Varsity Jacket", "Hoodie"].map(
							(product) => (
								<button
									key={product}
									onClick={() =>
										setSelectedProduct(product === "All" ? "" : product)
									}
									className={`px-3 py-1 border rounded transition text-sm cursor-pointer text-center ${
										(product === "All" && !selectedProduct) ||
										selectedProduct === product
											? "border-gray-900 bg-gray-900 text-white"
											: "border-gray-300 hover:bg-gray-100"
									}`}
								>
									{product}
								</button>
							),
						)}
					</div>
				</div>
				{/* Color Swatches */}
				<div>
					<label className="block text-sm font-medium mb-2">Color</label>
					<div className="flex gap-2">
						{[
							{ name: "All", value: "", bg: "bg-gradient-to-br from-white via-blue-600 to-amber-800" },
							{ name: "Black", value: "Black", bg: "bg-black" },
							{ name: "Blue", value: "Blue", bg: "bg-blue-600" },
							{ name: "Brown", value: "Brown", bg: "bg-amber-800" },
							{ name: "White", value: "White", bg: "bg-white border border-gray-300" },
						].map((color) => (
							<button
								key={color.value}
								onClick={() => setSelectedColor(color.value)}
								className={`w-8 h-8 rounded-full border-2 transition cursor-pointer ${
									selectedColor === color.value ||
									(color.value === "" && !selectedColor)
										? "border-gray-900"
										: "border-gray-400 hover:border-gray-600"
								} ${color.bg}`}
								title={color.name}
								style={color.value === "" ? { backgroundImage: "radial-gradient(circle, white, black)" } : undefined}
							/>
						))}
					</div>
				</div>

				{/* Size Buttons */}
				<div>
        <label className="block text-sm font-medium mb-2">Size</label>
        <div className="flex gap-2">
         <p className="text-sm text-gray-800"> Products are available in all sizes.</p>
        </div>
      </div>
			</div>
		</>
	);
}
