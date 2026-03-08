import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/inventory";

const BUCKET_URL =
	"https://fazlswkqdaorliesiuxc.supabase.co/storage/v1/object/public/product-images/";

interface MerchState {
	allProducts: Product[];
	isLoading: boolean;
	fetchInventory: () => Promise<void>;
}

export const useMerchStore = create<MerchState>((set) => ({
	allProducts: [],
	isLoading: false,

	fetchInventory: async () => {
		set({ isLoading: true });

		// Fetch broad records and normalize in JS so DB naming differences don't break queries.
		const { data, error } = await supabase.from("products").select(`
        *,
        variants (*)
      `);

		if (error) {
			console.error("Supabase Error:", error.message);
			set({ isLoading: false });
			return;
		}

		// Add storage URLs and normalize keys to the frontend Product type.
		const formattedData = (data ?? []).map((product: any) => {
			const variants = (product.variants ?? []).map(
				(variant: any, index: number) => {
					const imageSrc = variant.imageSrc ?? variant.image_src ?? null;
					const imageBackSrc =
						variant.imageBackSrc ?? variant.image_back_src ?? null;

					return {
						variantId: String(
							variant.variantId ??
								variant.variant_id ??
								variant.id ??
								`${product.productId ?? product.product_id ?? "product"}-${index}`,
						),
						color: variant.color ?? null,
						imageSrc: imageSrc ? `${BUCKET_URL}${imageSrc}` : null,
						imageAlt: variant.imageAlt ?? variant.image_alt ?? null,
						imageBackSrc: imageBackSrc ? `${BUCKET_URL}${imageBackSrc}` : null,
						imageBackAlt:
							variant.imageBackAlt ?? variant.image_back_alt ?? null,
						sizes: Array.isArray(variant.sizes) ? variant.sizes : [],
					};
				},
			);

			return {
				productId: String(
					product.productId ?? product.product_id ?? product.id ?? null,
				),
				name: product.name ?? null,
				price: String(product.price ?? null),
				variants,
			};
		});

		set({ allProducts: formattedData as Product[], isLoading: false });
	},
}));
