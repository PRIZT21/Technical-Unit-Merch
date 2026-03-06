import { supabase } from "@/lib/supabase";

export async function getProducts() {
	const { data, error } = await supabase.from("products").select(`
      id,
      name,
      price,
      variants (
        id,
        color,
        image_src,
        image_alt,
        image_back_src,
        image_back_alt,
        sizes
      )
    `);

	if (error) throw error;

	return data.map((product) => ({
		productId: product.id,
		name: product.name,
		price: product.price,
		variants: product.variants.map((variant) => ({
			variantId: variant.id,
			color: variant.color,
			imageSrc: variant.image_src,
			imageAlt: variant.image_alt,
			imageBackSrc: variant.image_back_src,
			imageBackAlt: variant.image_back_alt,
			sizes: variant.sizes,
		})),
	}));
}
