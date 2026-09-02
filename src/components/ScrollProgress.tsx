import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[1px] origin-left bg-gold-400"
      style={{ scaleX }}
    />
  );
}
