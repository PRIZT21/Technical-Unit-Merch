type CheckoutButtonProps = {
	isSubmitting?: boolean;
};

export default function CheckoutButton({
	isSubmitting = false,
}: CheckoutButtonProps) {
	return (
		<button
			type="submit"
			disabled={isSubmitting}
			className="mt-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
		>
			{isSubmitting ? "Initializing checkout..." : "Proceed to Paystack"}
		</button>
	);
}
