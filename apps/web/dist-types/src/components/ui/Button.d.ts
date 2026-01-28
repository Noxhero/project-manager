import type { ButtonHTMLAttributes } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost";
};
export declare function Button({ className, variant, ...props }: Props): import("react/jsx-runtime").JSX.Element;
export {};
