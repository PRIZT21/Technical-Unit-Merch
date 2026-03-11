"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ShoppingCart } from "lucide-react";
import Cart from "@/components/Cart";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { useStore } from "@/lib/store/useStore";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [open, setOpen] = useState(false);

	const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
		"& .MuiBadge-badge": {
			right: 6,
			top: 4,
			border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
			padding: "0 4px",
		},
	}));

	const cart = useStore((state) => state.cart);

	const totalItems = cart.length;

	return (
		<div>
			<Cart open={open} setOpen={setOpen} />
			<header className="fixed inset-x-0 top-0 z-5">
				<motion.nav
					aria-label="Global"
					className="mx-auto flex w-full max-w-360 items-center justify-between rounded-b-xl bg-white px-4 py-4 shadow-sm md:px-8"
					initial={{ opacity: 0, y: -14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: "easeOut" }}
				>
					<div className="flex flex-1 items-center">
						<Link href="/">
							<span className="sr-only">Technical Unit Logo</span>

							<Image
								alt="Technical Unit Merch"
								src="/images/technical_logo.webp"
								width={200}
								height={200}
								className="h-10 w-auto sm:h-12"
							/>
						</Link>
					</div>

					{/* <div className="flex items-center gap-2 lg:hidden">
						<StyledBadge badgeContent={totalItems} color="secondary">
							<button
								type="button"
								onClick={() => setOpen(true)}
								className="rounded-full border-2 border-gray-300 p-2 text-gray-900"
								aria-label="Open cart"
							>
								<ShoppingCart />
							</button>
						</StyledBadge>
						<button
							type="button"
							onClick={() => setMobileMenuOpen(true)}
							className="rounded-md p-2.5 text-gray-700"
							aria-label="Open main menu"
						>
							<Bars3Icon aria-hidden="true" className="size-6" />
						</button>
					</div> */}

					<div className=" lg:flex lg:flex-1 lg:justify-end">
						<StyledBadge badgeContent={totalItems} color="secondary">
							<button
								type="button"
								onClick={() => setOpen(true)}
								className="rounded-full border-2 border-gray-300 p-2 text-gray-900 cursor-pointer"
								aria-label="Open cart"
							>
								<ShoppingCart />
							</button>
						</StyledBadge>
					</div>
				</motion.nav>
{/* remove hamburger menu on mobile screens to display only cart */}
				{/* <AnimatePresence>
					{mobileMenuOpen && (
						<Dialog
							open={mobileMenuOpen}
							onClose={setMobileMenuOpen}
							className="lg:hidden"
						>
							<motion.div
								className="fixed inset-0 z-40 bg-black/35"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							/>
							<div className="fixed inset-y-0 right-0 z-50 w-[86%] max-w-sm">
								<motion.div
									initial={{ x: "100%" }}
									animate={{ x: 0 }}
									exit={{ x: "100%" }}
									transition={{ duration: 0.28, ease: "easeOut" }}
									className="h-full bg-white p-6 shadow-xl"
								>
									<DialogPanel className="flex h-full flex-col">
										<div className="flex items-center justify-between">
											<Link href="/" onClick={() => setMobileMenuOpen(false)}>
												<Image
													alt="Technical Unit Merch"
													src="/images/technical_logo.webp"
													width={130}
													height={130}
													className="h-8 w-auto"
												/>
											</Link>
											<button
												type="button"
												onClick={() => setMobileMenuOpen(false)}
												className="rounded-md p-2.5 text-gray-700"
												aria-label="Close menu"
											>
												<XMarkIcon aria-hidden="true" className="size-6" />
											</button>
										</div>

										<div className="mt-10 space-y-4">
											<Link
												href="#productsSection"
												onClick={() => setMobileMenuOpen(false)}
												className="block rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900"
											>
												Shop Collection
											</Link>
											<button
												type="button"
												onClick={() => {
													setOpen(true);
													setMobileMenuOpen(false);
												}}
												className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900"
											>
												<span>Open Cart</span>
												<span>{totalItems} item(s)</span>
											</button>
										</div>
									</DialogPanel>
								</motion.div>
							</div>
						</Dialog>
					)}
				</AnimatePresence> */}
			</header>
		</div>
	);
}
