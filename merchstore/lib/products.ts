export type ProductVariant = {
	variantId: string;
	color: string;
	imageSrc: string;
	imageAlt: string;
	imageBackSrc?: string;
	imageBackAlt?: string;
	sizes: string[];
};

export type Product = {
	productId: string;
	name: string;
	price: string;
	// href: string;
	variants: ProductVariant[];
};

export const products: Product[] = [
	{
		productId: "tshirt",
		name: "T-Shirt",
		price: "₦7,000",
		// href: "#",
		variants: [
			{
				variantId: "tshirt-navy-blue",
				color: "Navy Blue",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
				imageAlt: "Classic T-Shirt in Navy Blue",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-product-01.jpg",
				imageBackAlt: "Classic T-Shirt back view in Navy Blue",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
			{
				variantId: "tshirt-grey",
				color: "Grey",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
				imageAlt: "Classic T-Shirt in Grey",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-featured-product-shot.jpg",
				imageBackAlt: "Classic T-Shirt back view in Grey",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
			{
				variantId: "tshirt-black",
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
				variantId: "tshirt-white",
				color: "White",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
				imageAlt: "Classic T-Shirt in White",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
				imageBackAlt: "Classic T-Shirt back view in White",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
		],
	},
	{
		productId: "sweatshirt",
		name: "Sweatshirt",
		price: "₦10,500",
		// href: "#",
		variants: [
			{
				variantId: "sweatshirt-navy-blue",
				color: "Navy Blue",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
				imageAlt: "Sweatshirt in Navy Blue",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-featured-product-shot.jpg",
				imageBackAlt: "Sweatshirt back view in Navy Blue",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
			{
				variantId: "sweatshirt-grey",
				color: "Grey",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
				imageAlt: "Sweatshirt in Grey",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-product-01.jpg",
				imageBackAlt: "Sweatshirt back view in Grey",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
			{
				variantId: "sweatshirt-brown",
				color: "Brown",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
				imageAlt: "Sweatshirt in Brown",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
				imageBackAlt: "Sweatshirt back view in Brown",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
			{
				variantId: "sweatshirt-black",
				color: "Black",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
				imageAlt: "Sweatshirt in Black",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-product-02.jpg",
				imageBackAlt: "Sweatshirt back view in Black",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
		],
	},
	{
		productId: "varsity-jacket",
		name: "Varsity Jacket",
		price: "₦12,500",
		// href: "#",
		variants: [
			{
				variantId: "varsity-jacket-navy-blue",
				color: "Navy Blue",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
				imageAlt: "Varsity Jacket in Navy Blue",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-product-01.jpg",
				imageBackAlt: "Varsity Jacket back view in Navy Blue",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
			{
				variantId: "varsity-jacket-black",
				color: "Black",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
				imageAlt: "Varsity Jacket in Black",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
				imageBackAlt: "Varsity Jacket back view in Black",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
			{
				variantId: "varsity-jacket-grey",
				color: "Grey",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
				imageAlt: "Varsity Jacket in Grey",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-featured-product-shot.jpg",
				imageBackAlt: "Varsity Jacket back view in Grey",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
		],
	},
	{
		productId: "hoodie",
		name: "Hoodie",
		price: "₦13,500",
		// href: "#",
		variants: [
			{
				variantId: "hoodie-blue",
				color: "Blue",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
				imageAlt: "Light Bearers Hoodie in Blue",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-product-01.jpg",
				imageBackAlt: "Light Bearers Hoodie back view in Blue",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
			{
				variantId: "hoodie-grey",
				color: "Grey",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
				imageAlt: "Light Bearers Hoodie in Grey",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-product-02.jpg",
				imageBackAlt: "Light Bearers Hoodie back view in Grey",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
			{
				variantId: "hoodie-black",
				color: "Black",
				imageSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
				imageAlt: "Light Bearers Hoodie in Black",
				imageBackSrc:
					"https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-featured-product-shot.jpg",
				imageBackAlt: "Light Bearers Hoodie back view in Black",
				sizes: ["S", "M", "L", "XL", "XXL"],
			},
		],
	},
];
