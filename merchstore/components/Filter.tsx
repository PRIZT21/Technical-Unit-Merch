'use client'
 
export default function Filter({ setSelectedColor, setSelectedSize, setSelectedProduct }: { setSelectedColor: (value: string) => void; setSelectedSize: (value: string) => void; setSelectedProduct: (value: string) => void }) {
return ( <>
    <div className="flex flex-col gap-8 mb-6">
      {/* Product Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Product</label>
        <div className="grid grid-cols-2 gap-2">
          {["All", "Tshirt", "Sweatshirt", "Varsity jacket", "Hoodie"].map(product => (
            <button
              key={product}
              onClick={() => setSelectedProduct(product === "All" ? "" : product)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition text-sm cursor-pointer"
            >
              {product}
            </button>
          ))}
        </div>
      </div>
      {/* Color Swatches */}
      <div>
        <label className="block text-sm font-medium mb-2">Color</label>
        <div className="flex gap-2">
          {[
            { name: "All", value: "", bg: "bg-gray-200" },
            { name: "Black", value: "Black", bg: "bg-black" },
            { name: "Purple", value: "Purple", bg: "bg-purple-600" },
            { name: "Grey", value: "Grey", bg: "bg-gray-500" }
          ].map(color => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`w-8 h-8 rounded-full border-2 transition cursor-pointer ${
                color.value === "" ? "border-gray-400" : "border-gray-400 hover:border-gray-600"
              } ${color.bg}`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Size Buttons */}
      <div>
        <label className="block text-sm font-medium mb-2">Size</label>
        <div className="flex gap-2">
          {["All", "S", "M", "L", "XL"].map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size === "All" ? "" : size)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition text-sm cursor-pointer"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  </>)
}