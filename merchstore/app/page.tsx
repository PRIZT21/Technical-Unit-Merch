'use client';
import { useEffect } from 'react';
import { useMerchStore } from '@/store/useProductStore';

export default function TestPage() {
  const { allProducts, isLoading, fetchInventory } = useMerchStore();

  useEffect(() => {
    fetchInventory();
  }, []);

  if (isLoading) return <p>Loading your awesome merch...</p>;

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-5">Merch Inventory</h1>
      <div className="grid gap-4">
        {allProducts.map((product) => (
          <div key={product.productId} className="border p-4 rounded">
            <h2 className="text-xl">{product.name} - {product.price}</h2>
            <p className="text-sm text-gray-500">{product.variants.length} Variants found</p>
          </div>
        ))}
      </div>
    </main>
  );
}