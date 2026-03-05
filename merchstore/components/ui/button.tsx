import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer hover:text-white",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				outline:
					"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				icon: "rounded-full h-9 w-9 p-0",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "h-9 w-9",
			},
			content: {
				default: "",
				leftIcon: "pl-3",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			content: "default",
		},
	},
);

export interface ButtonProps
	extends
		Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "content">,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	leftIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			content,
			asChild = false,
			leftIcon,
			children,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		const shouldRenderLeftIcon = !asChild && content === "leftIcon" && leftIcon;
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, content, className }))}
				ref={ref}
				{...props}
			>
				{shouldRenderLeftIcon ? (
					<span aria-hidden="true" className="inline-flex items-center">
						{leftIcon}
					</span>
				) : null}
				{children}
			</Comp>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
