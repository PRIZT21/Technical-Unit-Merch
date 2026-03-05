type QuantityCountProps = {
	quantity: number;
	onIncrement: () => void;
	onDecrement: () => void;
};

export default function QuantityCount({
	quantity,
	onIncrement,
	onDecrement,
}: QuantityCountProps) {
	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={onDecrement}
				className="rounded bg-black px-3 py-1 text-white hover:bg-gray-900"
			>
				-
			</button>
			<span className="w-8 text-center">{quantity}</span>
			<button
				type="button"
				onClick={onIncrement}
				className="rounded bg-black px-3 py-1 text-white hover:bg-gray-900"
			>
				+
			</button>
		</div>
	);
}
