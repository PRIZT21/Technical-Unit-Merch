import { create } from "zustand";

type CartItem = {
	productId: string;
	variantId: string;
	size: string;
	quantity: number;
};

type Store = {
	cart: CartItem[];

	addToCart: (item: CartItem) => void;
	removeFromCart: (item: CartItem) => void;
	clearCart: () => void;

	selectedProductId: string | null;
	openProduct: (id: string) => void;
	closeProduct: () => void;
};

export const useStore = create<Store>((set) => ({
	cart: [],
	addToCart: (item) =>
		set((state) => ({
			cart: [...state.cart, item],
		})),

	removeFromCart: (item) =>
		set((state) => ({
			cart: state.cart.filter(
				(i) =>
					i.productId !== item.productId ||
					i.variantId !== item.variantId ||
					i.size !== item.size,
			),
		})),

	clearCart: () => set({ cart: [] }),

	selectedProductId: null,

	openProduct: (id) => set({ selectedProductId: id }),
  closeProduct: () => set({ selectedProductId: null }),
}));
