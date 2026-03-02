export type ProductVariant = {
	id: string;
	color: string;
	imageSrc: string;
	imageAlt: string;
	imageBackSrc?: string;
	imageBackAlt?: string;
	sizes: string[];
};

export type Product = {
	id: string;
	name: string;
	price: string;
	// href: string;
	variants: ProductVariant[];
};

export const products: Product[] = [
	{
		id: "tshirt",
		name: "T-Shirt",
		price: "₦7,000",
		// href: "#",
		variants: [
			{
				id: "tshirt-black",
				color: "Black",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
				imageAlt: "Classic T-Shirt in Black",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-product-02.jpg",
				imageBackAlt: "Classic T-Shirt back view in Black",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
			{
				id: "tshirt-navy",
				color: "Navy",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
				imageAlt: "Classic T-Shirt in Navy",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-product-01.jpg",
				imageBackAlt: "Classic T-Shirt back view in Navy",
				sizes: ["S", "M", "L", "XL"],
			},
		],
	},
	{
		id: "sweatshirt",
		name: "Sweatshirt",
		price: "₦10,500",
		// href: "#",
		variants: [
			{
				id: "sweatshirt-black",
				color: "Black",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
				imageAlt: "Sweatshirt in Black",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-featured-product-shot.jpg",
				imageBackAlt: "Sweatshirt back view in Black",
				sizes: ["S", "M", "L", "XL"],
			},
		],
	},
	{
		id: "varsity-jacket",
		name: "Varsity Jacket",
		price: "₦12,500",
		// href: "#",
		variants: [
			{
				id: "varsity-jacket-black",
				color: "Black",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
				imageAlt: "Varsity Jacket in Black",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
				imageBackAlt: "Varsity Jacket back view in Black",
				sizes: ["S", "M", "L", "XL"],
			},
		],
	},
	{
		id: "hoodie",
		name: "Light Bearers Hoodie",
		price: "₦13,500",
		// href: "#",
		variants: [
			{
				id: "hoodie-black",
				color: "Black",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
				imageAlt: "Light Bearers Hoodie in Black",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-featured-product-shot.jpg",
				imageBackAlt: "Light Bearers Hoodie back view in Black",
				sizes: ["S", "M", "L", "XL"],
			},
			{
				id: "hoodie-white",
				color: "White",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
				imageAlt: "Light Bearers Hoodie in White",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
				imageBackAlt: "Light Bearers Hoodie back view in White",
				sizes: ["S", "M", "L", "XL"],
			},
		],
	},
];
