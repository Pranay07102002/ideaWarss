"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

type TileProps = HTMLMotionProps<"div"> & {
  delay?: number;
  hover?: boolean;
};

/** A bento tile with entrance + subtle hover-lift animation. */
export function Tile({
  delay = 0,
  hover = true,
  children,
  className = "",
  ...rest
}: TileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -4, scale: 1.012 } : undefined}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
