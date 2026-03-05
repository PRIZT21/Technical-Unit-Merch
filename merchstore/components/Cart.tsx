"use client";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useStore } from "@/lib/store/useStore";
import { products } from "@/lib/products";
import { toast } from "sonner";
import QuantityCount from "@/components/ui/QuantityCount";

export default function Cart({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
}) {
	const items = useStore((state) => state.cart);
	const removeFromCart = useStore((state) => state.removeFromCart);
	const updateCartQuantity = useStore((state) => state.updateCartQuantity);

	const parsePrice = (price: string) => {
		const numeric = Number(price.replace(/[^\d.]/g, ""));
		return Number.isNaN(numeric) ? 0 : numeric;
	};

	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			maximumFractionDigits: 0,
		}).format(value);

	const getLineTotal = (price: string, quantity: number) =>
		formatCurrency(parsePrice(price) * quantity);

	const cartItems = items.map((item) => {
		const product = products.find((p) => p.productId === item.productId);
		const variantById = product?.variants.find(
			(v) => v.variantId === item.variantId,
		);
		const parsedVariantIndex = Number(item.variantId);
		const variantByIndex = Number.isInteger(parsedVariantIndex)
			? product?.variants[parsedVariantIndex]
			: undefined;
		const variant = variantById ?? variantByIndex;

		return {
			...item,
			name: product?.name ?? "Unknown product",
			price: product?.price ?? "",
			image: variant?.imageSrc ?? "",
			imageAlt: variant?.imageAlt ?? product?.name ?? "Cart item",
			size: item.size,
			color: variant?.color ?? "",
		};
	});

	const subtotal = cartItems.reduce(
		(total, item) => total + parsePrice(item.price) * item.quantity,
		0,
	);
	const totalUnits = cartItems.reduce(
		(count, item) => count + item.quantity,
		0,
	);

	const totalAmount = formatCurrency(subtotal);

	type StoreCartItem = (typeof items)[number];

	const handleRemoveFromCart = (
		originalItem: StoreCartItem,
		itemName: string,
	) => {
		toast.promise<{ name: string }>(
			() =>
				new Promise((resolve, reject) => {
					try {
						removeFromCart(originalItem);

						setTimeout(() => resolve({ name: itemName }), 400);
					} catch (error) {
						reject(error);
					}
				}),
			{
				loading: "Removing from cart...",
				success: (data) => `${data.name} has been removed from your bag`,
				error: "Could not remove item",
			},
		);
	};

	const confirmRemoveFromCart = (
		originalItem: StoreCartItem,
		itemName: string,
	) => {
		toast(`Remove ${itemName}?`, {
			description: "This item will be removed from your bag.",
			action: {
				label: "Yes",
				onClick: () => handleRemoveFromCart(originalItem, itemName),
			},
			cancel: {
				label: "No",
				onClick: () => console.log("Cancel!"),
			},
		});
	};

	const handleIncrementQuantity = (originalItem: StoreCartItem) => {
		updateCartQuantity(originalItem, originalItem.quantity + 1);
	};

	const handleDecrementQuantity = (
		originalItem: StoreCartItem,
		itemName: string,
	) => {
		if (originalItem.quantity <= 1) {
			confirmRemoveFromCart(originalItem, itemName);
			return;
		}

		updateCartQuantity(originalItem, originalItem.quantity - 1);
	};

	return (
		<div>
			<Dialog
				open={open}
				onClose={setOpen}
				className="relative z-50 rounded-md"
			>
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
				/>

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
							<DialogPanel
								transition
								className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
							>
								<div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
									<div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
										<div className="-mx-4 -mt-6 mb-6 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white px-4 py-5 sm:-mx-6 sm:px-6">
											<div className="flex items-start justify-between gap-4">
												<div>
													<DialogTitle className="text-xl font-semibold tracking-tight text-gray-900">
														Shopping cart
													</DialogTitle>
													<p className="mt-1 text-sm text-gray-600">
														{totalUnits} {totalUnits === 1 ? "item" : "items"}{" "}
														in your bag
													</p>
												</div>
												<button
													type="button"
													onClick={() => setOpen(false)}
													className="inline-flex size-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
												>
													<span className="sr-only">Close panel</span>
													<XMarkIcon aria-hidden="true" className="size-5" />
												</button>
											</div>
										</div>

										<div className="mt-8">
											{cartItems.length === 0 ? (
												<div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
													<p className="text-base font-medium text-gray-900">
														Your cart is empty
													</p>
													<p className="mt-2 text-sm text-gray-500">
														Add something from the store to see it here.
													</p>
												</div>
											) : (
												<ul role="list" className="space-y-4">
													{cartItems.map((item, index) => {
														const originalItem = items[index];

														return (
															<li
																key={`${item.productId}-${item.variantId}-${item.size}`}
																className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
															>
																<div className="flex gap-3 sm:gap-4">
																	<div className="size-24 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
																		{item.image ? (
																			<img
																				alt={item.imageAlt}
																				src={item.image}
																				className="size-full object-cover"
																			/>
																		) : (
																			<div className="flex size-full items-center justify-center px-2 text-center text-xs text-gray-500">
																				No image
																			</div>
																		)}
																	</div>

																	<div className="flex min-w-0 flex-1 flex-col justify-between">
																		<div className="flex items-start justify-between gap-3">
																			<h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
																				{item.name}
																			</h3>
																			<div className="text-right tabular-nums">
																				<p className="text-sm font-semibold text-gray-900 sm:text-base">
																					{getLineTotal(
																						item.price,
																						item.quantity,
																					)}
																				</p>
																				<p className="text-xs text-gray-500">
																					Each {item.price}
																				</p>
																			</div>
																		</div>

																		<div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
																			<span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
																				Color: {item.color || "N/A"}
																			</span>
																			<span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
																				Size: {item.size || "N/A"}
																			</span>
																		</div>

																		<div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
																			<div className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
																				<QuantityCount
																					quantity={item.quantity}
																					onIncrement={() =>
																						handleIncrementQuantity(
																							originalItem,
																						)
																					}
																					onDecrement={() =>
																						handleDecrementQuantity(
																							originalItem,
																							item.name,
																						)
																					}
																				/>
																			</div>

																			<button
																				type="button"
																				onClick={() =>
																					confirmRemoveFromCart(
																						originalItem,
																						item.name,
																					)
																				}
																				className="cursor-pointer rounded-md border border-red-200 px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
																			>
																				Remove
																			</button>
																		</div>
																	</div>
																</div>
															</li>
														);
													})}
												</ul>
											)}
										</div>
									</div>

									<div className="border-t border-gray-200 bg-gray-50 px-4 py-6 sm:px-6">
										<div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
											<div className="flex items-center justify-between text-base font-semibold text-gray-900">
												<p>Subtotal</p>
												<p>{totalAmount}</p>
											</div>
											<div className="mt-2 flex items-center justify-between text-sm text-gray-600">
												<p>Items</p>
												<p>{totalUnits}</p>
											</div>
											<p className="mt-3 text-xs text-gray-500">
												Shipping and taxes calculated at checkout.
											</p>
											<div className="mt-4">
												<button
													type="button"
													disabled={cartItems.length === 0}
													className={`flex w-full items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white shadow-xs transition-colors ${
														cartItems.length === 0
															? "cursor-not-allowed bg-gray-300"
															: "cursor-pointer bg-black hover:bg-gray-800"
													}`}
												>
													Checkout
												</button>
											</div>
										</div>
										<div className="mt-5 flex justify-center text-center text-sm text-gray-500">
											<p>
												or{" "}
												<a
													type="button"
													href="#productsSection"
													onClick={() => setOpen(false)}
													className="font-medium text-black transition-colors hover:text-gray-700 cursor-pointer"
												>
													Continue Shopping
													<span aria-hidden="true"> &rarr;</span>
												</a>
											</p>
										</div>
									</div>
								</div>
							</DialogPanel>
						</div>
					</div>
				</div>
			</Dialog>
		</div>
	);
}
