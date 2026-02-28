import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
const products = [
  {
    id: 1,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "₦5,500",
    color: "Black",
    size: "M",
  },
  {
    id: 2,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
    imageAlt: "Front of men's Basic Tee in white.",
    price: "₦5,800",
    color: "Aspen White",
    size: "M",
  },
  {
    id: 3,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
    imageAlt: "Front of men's Basic Tee in dark gray.",
    price: "₦6,000",
    color: "Charcoal",
    size: "M",
  },
  {
    id: 4,
    name: "Artwork Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
    imageAlt:
      "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
    price: "₦6,500",
    color: "Iso Dots",
    size: "M",
  },
  {
    id: 5,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    price: "₦5,700",
    color: "Black",
    size: "L",
  },
  {
    id: 6,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
    imageAlt: "Front of men's Basic Tee in white.",
    price: "₦6,200",
    color: "Aspen White",
    size: "L",
  },
  {
    id: 7,
    name: "Basic Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
    imageAlt: "Front of men's Basic Tee in dark gray.",
    price: "₦6,800",
    color: "Charcoal",
    size: "L",
  },
  {
    id: 8,
    name: "Artwork Tee",
    href: "#",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
    imageAlt:
      "Front of men's Artwork Tee in peach with white and brown dots forming an isometric cube.",
    price: "₦7,000",
    color: "Iso Dots",
    size: "L",
  },
];

export default function ProductOverview() {
	return (
		<div className="bg-white">
			<div className="mx-auto max-w-2xl px-4 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
				<div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
					{products.map((product) => (
						<div key={product.id} className="group relative">
							<img
								alt={product.imageAlt}
								src={product.imageSrc}
								className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
							/>
							<div className="mt-4 flex justify-between">
								<div>
									<h3 className="text-2xl font-bold">
										<a href={product.href}>
											<span aria-hidden="true" className="absolute inset-0" />
											{product.name}
										</a>
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										{product.color}, {product.size}
									</p>
								</div>
								<p className="text-lg font-semibold self-center">{product.price}</p>
							</div>
								<Button className="w-full mt-8 rounded-sm" content="leftIcon" leftIcon={<ShoppingCart />}>Add to Cart</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
