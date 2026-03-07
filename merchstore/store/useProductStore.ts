import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/inventory';


const BUCKET_URL = "https://fazlswkqdaorliesiuxc.supabase.co/storage/v1/object/public/product-images/";

interface ProductState {
  allProducts: Product[];
  isLoading: boolean;
  fetchInventory: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  allProducts: [],
  isLoading: false,

  fetchInventory: async () => {
    set({ isLoading: true });

    // This query gets products and their related variants automatically
    const { data, error } = await supabase
      .from('products')
      .select(`
        productId,
        name,
        price,
        variants (
          variantId,
          color,
          imageSrc,
          imageAlt,
          imageBackSrc,
          imageBackAlt,
          sizes
        )
      `);

    if (error) {
      console.error("Supabase Error:", error.message);
      set({ isLoading: false });
      return;
    }

    // adds the full storage URL to the image paths
    const formattedData = data.map((product: any) => ({
      ...product,
      variants: product.variants.map((v: any) => ({
        ...v,
        imageSrc: v.imageSrc ? `${BUCKET_URL}${v.imageSrc}` : null,
        imageBackSrc: v.imageBackSrc ? `${BUCKET_URL}${v.imageBackSrc}` : null
      }))
    }));

    set({ allProducts: formattedData as Product[], isLoading: false });
  },
}));