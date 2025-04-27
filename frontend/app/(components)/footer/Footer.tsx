'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      className="text-center py-6 text-sm text-blue-400"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      © {new Date().getFullYear()} MyLanding. Crafted with ❤️.
    </motion.footer>
  );
}
