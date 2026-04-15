import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function CTASection() {
	return (
		<>
			<div className="mx-2 md:mx-32 -mt-2 md:-mt-8 rounded-full py-4 md:py-8 px-16 flex justify-between items-center relative bg-white">
				<h2 className="text-xl md:text-4xl font-bold text-red-500">
					Sales of Merch is paused!
				</h2>
				{/* <InputGroup className="py-2 px-4 border-2 rounded-full w-1/2">
					<InputGroupInput placeholder="What would you like to get?..." />
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
					<Button>Search</Button>
				</InputGroup> */}
				{/* <p className=" hidden md:block text-lg text-gray-600 italic">Find the perfect fit for your personality</p> */}
				<p className=" hidden md:block text-lg text-gray-600 italic">
					Find the perfect fit for your personality
				</p>
			</div>
		</>
	);
}
