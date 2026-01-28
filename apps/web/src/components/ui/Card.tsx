import type { HTMLAttributes } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";

type Props = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={clsx("rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6", className)}
      {...(props as any)}
      onDragStart={undefined}
      onDragEnd={undefined}
    />
  );
}
