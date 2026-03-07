import { create } from "zustand";
import { persist } from "zustand/middleware";

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
	updateCartQuantity: (item: CartItem, quantity: number) => void;
	clearCart: () => void;

	selectedProductId: string | null;
	openProduct: (id: string) => void;
	closeProduct: () => void;
};

export const useStore = create<Store>()(
	persist(
		(set, get) => ({
			cart: [],
			// add to cart if the product does not exist and if it does exist, increase the quantity
			addToCart: (newItem) =>
				set((state) => {
					const existing = state.cart.find(
						(item) =>
							item.variantId === newItem.variantId &&
							item.size === newItem.size,
					);

					if (existing) {
						return {
							cart: state.cart.map((item) =>
								item.variantId === newItem.variantId &&
								item.size === newItem.size
									? { ...item, quantity: item.quantity + newItem.quantity }
									: item,
							),
						};
					}

					return {
						cart: [...state.cart, newItem],
					};
				}),

			removeFromCart: (item) =>
				set((state) => ({
					cart: state.cart.filter(
						(i) => !(i.variantId === item.variantId && i.size === item.size),
					),
				})),

			updateCartQuantity: (targetItem, quantity) =>
				set((state) => ({
					cart: state.cart.map((item) =>
						item.variantId === targetItem.variantId &&
						item.size === targetItem.size
							? { ...item, quantity: Math.max(1, quantity) }
							: item,
					),
				})),

			clearCart: () => set({ cart: [] }),

			selectedProductId: null,

			openProduct: (id) => set({ selectedProductId: id }),
			closeProduct: () => set({ selectedProductId: null }),
		}),
		{
			name: "tu-merch-cart",
			partialize: (state) => ({
				cart: state.cart,
			}),
		},
	),
);
