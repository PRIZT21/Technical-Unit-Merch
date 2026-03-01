import ProductList from "@/components/ProductList";
import { Button } from "@/components/ui/button";
import { Handbag, Palette, Scaling } from "lucide-react";

export default function CategoriesSection() {
	return (
		<>
			<div className="flex gap-8 items-start mt-16 mx-32">
				<div>
					<h3 className="text-3xl font-bold">Category</h3>
					<div>
						<Button
							content="leftIcon"
							leftIcon={<Handbag />}
							className="mt-4 w-1/2 rounded-lg opacity-60"
						>
							All Categories
						</Button>{" "}
						<Button
							content="leftIcon"
							leftIcon={<Palette />}
							className="mt-4 w-1/2 rounded-lg opacity-60"
						>
							Color
						</Button>{" "}
						<Button
							content="leftIcon"
							leftIcon={<Scaling />}
							className="mt-4 w-1/2 rounded-lg opacity-60"
						>
							Size
						</Button>{" "}
					</div>
				</div>
				<div>
					<ProductList />
				</div>
			</div>
		</>
	);
}
