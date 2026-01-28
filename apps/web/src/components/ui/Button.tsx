import type { ButtonHTMLAttributes } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const reduceMotion = useReducedMotion();

  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none";

  const styles =
    variant === "primary"
      ? "bg-indigo-500 text-white hover:bg-indigo-400 active:bg-indigo-600"
      : "bg-white/0 text-slate-200 hover:bg-white/5";

  return (
    <motion.button
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className={[base, styles, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
