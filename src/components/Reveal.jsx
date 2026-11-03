import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Staggered text reveal. Animates in with a soft blur-lift when the
 * page opens, and animates out with the panel.
 * Use `delay` to stage items in reading order.
 */
export default function Reveal({
  as = "div",
  delay = 0,
  className,
  children,
  ...rest
}) {
  const Component = motion[as] ?? motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.55, ease: EASE, delay },
      }}
      exit={{
        opacity: 0,
        y: -12,
        filter: "blur(8px)",
        transition: { duration: 0.22, ease: "easeIn" },
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
