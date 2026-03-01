'use client'
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { products } from "@/lib/products";
import { useState } from "react";
// const products = [
//   {
//     id: 1,
//     name: "Basic Tee",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
//     imageAlt: "Front of men's Basic Tee in black.",
//     price: "₦5,500",
//     color: "Black",
//     size: "M",
//   },
//   {
//     id: 2,
//     name: "Basic Tee",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
//     imageAlt: "Front of men's Basic Tee in white.",
//     price: "₦5,800",
//     color: "Aspen White",
//     size: "M",
//   },
//   {
//     id: 3,
//     name: "Basic Tee",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
//     imageAlt: "Front of men's Basic Tee in dark gray.",
//     price: "₦6,000",
//     color: "Charcoal",
//     size: "M",
//   },
//   {
//     id: 4,
//     name: "Artwork Tee",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
//     imageAlt:
//       "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
//     price: "₦6,500",
//     color: "Iso Dots",
//     size: "M",
//   },
//   {
//     id: 5,
//     name: "Basic Tee",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
//     imageAlt: "Front of men's Basic Tee in black.",
//     price: "₦5,700",
//     color: "Black",
//     size: "L",
//   },
//   {
//     id: 6,
//     name: "Basic Tee",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
//     imageAlt: "Front of men's Basic Tee in white.",
//     price: "₦6,200",
//     color: "Aspen White",
//     size: "L",
//   },
//   {
//     id: 7,
//     name: "Basic Tee",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
//     imageAlt: "Front of men's Basic Tee in dark gray.",
//     price: "₦6,800",
//     color: "Charcoal",
//     size: "L",
//   },
//   {
//     id: 8,
//     name: "Artwork Tee",
//     href: "#",
//     imageSrc:
//       "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
//     imageAlt:
//       "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
//     price: "₦7,000",
//     color: "Iso Dots",
//     size: "L",
//   },
// ];

export default function ProductList() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  
const filteredProducts = products.map(product => ({
  ...product,
  variants: product.variants.filter(variant => {
    const colorMatch = selectedColor ? variant.color === selectedColor : true
    const sizeMatch = selectedSize
      ? variant.sizes.includes(selectedSize)
      : true

    return colorMatch && sizeMatch
  })
})).filter(product => product.variants.length > 0)

	return (
		<div className="bg-white">
			<div className="mx-auto px-4 sm:px-6 sm:pb-24  lg:px-8">
				<div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
					{filteredProducts.map((product) =>
						product.variants.map((variant, variantIndex) => (
							<div
								key={`${product.id}-${variantIndex}`}
								className="group relative"
							>
								<img
									alt={variant.imageAlt}
									src={variant.imageSrc}
									className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
								/>

								<div className="mt-4 flex justify-between px-4">
									<div>
										<h3 className="text-2xl font-bold">
											<a href={product.href}>
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
		</div>
	);
}
