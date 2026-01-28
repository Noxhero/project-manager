import type { HTMLAttributes } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={[
        "rounded-2xl border border-white/10 bg-slate-900/40 p-5 shadow-soft backdrop-blur",
        className
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
