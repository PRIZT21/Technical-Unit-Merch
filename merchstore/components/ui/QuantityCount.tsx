import { useState } from 'react';

export default function QuantityCount({ quantity }: { quantity: number }) {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  const increment = () => setCurrentQuantity(currentQuantity + 1);
  const decrement = () => setCurrentQuantity(currentQuantity > 1 ? currentQuantity - 1 : 1);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={decrement}
        className="px-3 py-1 bg-black rounded hover:bg-gray-900 text-white"
      >
        −
      </button>
      <span className="w-8 text-center">{currentQuantity}</span>
      <button
        onClick={increment}
        className="px-3 py-1 bg-black rounded hover:bg-gray-900 text-white"
      >
        +
      </button>
    </div>
  );
}