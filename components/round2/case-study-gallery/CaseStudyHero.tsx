'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function HeroSection({ search, onSearchChange }: Props) {
  return (
    <section className="bg-blue-600 py-16 px-4 text-center" style={{
        backgroundImage: 'linear-gradient(to bottom right, rgba(33, 109, 223, 1), #002B80)',
      }}>
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-4xl md:text-5xl font-bold mb-4"
        >
          Explore Case Studies
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-white text-lg md:text-xl mb-8 max-w-2xl mx-auto"
        >
          Browse real-world case studies by role and learn through practical examples
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative max-w-md mx-auto flex items-center"
        >
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, keyword, or tag"
            className="w-full px-4 pr-10 py-3 text-base bg-white/90 backdrop-blur-md shadow-lg rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          />
          <Search className="absolute right-3 text-gray-400 w-7 h-7" />
        </motion.div>
      </div>
    </section>
  );
}
