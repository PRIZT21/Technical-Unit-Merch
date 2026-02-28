import ProductList from "@/components/ProductList";


export default function CategoriesSection() {
  return (
    <>
      <div className="flex justify-between items-start mt-16 mx-32">
        <div>
          <h3 className="text-3xl font-bold">Category</h3>
        </div>
        <div>
          <ProductList/>
        </div>
      </div>
    </>
  )
}