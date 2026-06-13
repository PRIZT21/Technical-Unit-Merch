export const PAYSTACK_PERCENTAGE_FEE = 0.015;
export const PAYSTACK_FLAT_FEE_NAIRA = 100;

const roundTo2Dp = (value: number) => Number(value.toFixed(2));

export const calculatePaystackFee = (subtotal: number): number => {
	if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;

	return roundTo2Dp(
		subtotal * PAYSTACK_PERCENTAGE_FEE + PAYSTACK_FLAT_FEE_NAIRA,
	);
};

export const calculatePaystackTotal = (subtotal: number): number => {
	if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;

	return roundTo2Dp(subtotal + calculatePaystackFee(subtotal));
};

export const nairaToKobo = (amountInNaira: number): number =>
	Math.round(amountInNaira * 100);
