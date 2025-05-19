"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-white/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
