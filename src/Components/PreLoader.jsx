"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ onFinish }) {
  const [slogan, setSlogan] = useState("We Code");

  useEffect(() => {
    const firstTimeout = setTimeout(() => setSlogan("We Explore"), 1000);
    const finalTimeout = setTimeout(() => onFinish(), 2000);

    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(finalTimeout);
    };
  }, [onFinish]);

  return (
    <div className="flex items-center justify-center flex-col h-screen w-screen bg-black text-white font-semibold text-2xl tracking-widest">
      {/* Static logo (no pulse) */}
      <img src="/codex.png" alt="Codex Logo" className="w-45 h-45 mb-2" />

      {/* Animated slogan */}
      <AnimatePresence mode="wait">
        <motion.span
          key={slogan}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mt-2"
        >
          {slogan}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
