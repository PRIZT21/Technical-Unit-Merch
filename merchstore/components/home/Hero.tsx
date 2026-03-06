import Image from "next/image";
import CTASection from "@/components/home/CTASection";

export default function Hero() {
	return (
		<div>
			<div className="relative isolate px-6 pt-14 lg:px-8 h-[75vh] md:h-screen flex items-end justify-center bg-[url(/images/hero_image.webp)] bg-cover bg-top">
				<Image
					src="/images/Light_Bearers_Theme.webp"
					alt="Light Bearers Theme"
					height={600}
					width={600}
					className="mb-16 md:mb-2"
				/>
			</div>
			<CTASection />
		</div>
	);
}
