/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [new URL("https://fazlswkqdaorliesiuxc.supabase.co/**")],
	},
};

module.exports = nextConfig;
