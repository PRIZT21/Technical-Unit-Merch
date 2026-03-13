"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";

export default function ConditionalHeader() {
	const pathname = usePathname();

	if (pathname.startsWith("/dashboard") || pathname.startsWith("/Checkout")) {
		return null;
	}

	return <Header />;
}
