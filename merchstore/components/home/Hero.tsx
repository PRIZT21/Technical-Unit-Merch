import Image from "next/image";

export default function Hero() {
	return (
		<div>
			<div className="relative isolate px-6 pt-14 lg:px-8 h-screen flex items-end justify-center bg-[url(/images/hero_image.png)] bg-cover ">
				<Image
					src="/images/Light_Bearers_Theme.png"
					alt="Light Bearers Theme"
					height={600}
					width={600}
				/>
			</div>
		</div>
	);
}
