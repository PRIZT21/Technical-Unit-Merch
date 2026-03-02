"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Search, ShoppingCart } from "lucide-react";
import Cart from "@/components/Cart";
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [open, setOpen] = useState(false);

	const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 1,
    top: 2,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

	return (
		<div className="">
			<Cart open={open} setOpen={setOpen} />
			<header className="absolute inset-x-0 top-0 z-20">
				<nav
					aria-label="Global"
					className="flex items-center justify-between mx-32 lg:px-8 bg-white rounded-b-xl py-4"
				>
					<div className="flex lg:flex-1">
						<Link href="/">
							<span className="sr-only">Technical Unit Logo</span>

							<Image
								alt="Technical Unit Merch"
								src="/images/technical_logo.png"
								width={200}
								height={200}
							/>
						</Link>
					</div>
					<div className="flex lg:hidden">
						<button
							type="button"
							onClick={() => setMobileMenuOpen(true)}
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
						>
							<span className="sr-only">Open main menu</span>
							<Bars3Icon aria-hidden="true" className="size-6" />
						</button>
					</div>
					<div className="hidden lg:flex lg:flex-1 lg:justify-end gap-8">
						<a
							href="#"
							className="text-sm/6 font-semibold text-gray-900 border-2 border-gray-300 rounded-full p-1"
						>
							<Search />
						</a>
						<StyledBadge badgeContent={4} color="secondary">
							<a
								onClick={() => setOpen(true)}
								className="text-sm/6 font-semibold text-gray-900 border-2 rounded-full p-1 border-gray-300 cursor-pointer"
							>
								<ShoppingCart />
							</a>
						</StyledBadge>
					</div>
				</nav>
				<Dialog
					open={mobileMenuOpen}
					onClose={setMobileMenuOpen}
					className="lg:hidden"
				>
					<div className="fixed inset-0 z-50" />
					<DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
						<div className="flex items-center justify-between">
							<a href="#" className="-m-1.5 p-1.5">
								<span className="sr-only">Technical Unit</span>
								<img
									alt="technical unit logo"
									src="/images/technical_logo.png"
									className="h-8 w-auto"
								/>
							</a>
							<button
								type="button"
								onClick={() => setMobileMenuOpen(false)}
								className="-m-2.5 rounded-md p-2.5 text-gray-700"
							>
								<span className="sr-only">Close menu</span>
								<XMarkIcon aria-hidden="true" className="size-6" />
							</button>
						</div>
						<div className="mt-6 flow-root">
							<div className="-my-6 divide-y divide-gray-500/10">
								<div className="py-6">
									<a
										href="#"
										className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
									>
										Log in
									</a>
								</div>
							</div>
						</div>
					</DialogPanel>
				</Dialog>
			</header>
		</div>
	);
}
