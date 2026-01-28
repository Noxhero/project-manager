import { motion } from "framer-motion";
import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  className?: string;
}

const variants = {
  default: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
  primary: "bg-blue-500/20 text-blue-400 border border-blue-500/30", 
  success: "bg-green-500/20 text-green-400 border border-green-500/30",
  warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  danger: "bg-red-500/20 text-red-400 border border-red-500/30"
};

const sizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm"
};

export function Badge({ children, variant = "default", size = "md", className }: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.span>
  );
}
