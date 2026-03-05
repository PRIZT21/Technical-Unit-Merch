import { useState } from 'react';

export default function QuantityCount() {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity(quantity + 1);
  const decrement = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={decrement}
        className="px-3 py-1 border rounded hover:bg-gray-100"
      >
        −
      </button>
      <span className="w-8 text-center">{quantity}</span>
      <button
        onClick={increment}
        className="px-3 py-1 border rounded hover:bg-gray-100"
      >
        +
      </button>
    </div>
  );
}