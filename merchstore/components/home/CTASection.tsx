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
			<div className="mx-32 -mt-8 rounded-full py-8 px-16 flex justify-between items-center relative bg-white">
				<h2 className="text-4xl font-bold">Grab Your Style!</h2>
				{/* <InputGroup className="py-2 px-4 border-2 rounded-full w-1/2">
					<InputGroupInput placeholder="What would you like to get?..." />
					<InputGroupAddon>
						<Search />
					</InputGroupAddon>
					<Button>Search</Button>
				</InputGroup> */}
				<p className="text-lg text-gray-600 italic">Find the perfect fit for your personality</p>
			</div>
		</>
	);
}
