import type { ButtonHTMLAttributes } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  ghost: "text-slate-200 hover:bg-white/10"
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const reduceMotion = useReducedMotion();

  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(base, variants[variant], className)}
      {...(props as any)}
      onDragStart={undefined}
      onDragEnd={undefined}
    />
  );
}
