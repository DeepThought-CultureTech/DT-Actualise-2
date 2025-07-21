'use client';

import { motion } from 'framer-motion';

const roles = ['All', 'Business Growth Analyst', 'Behavioral Designer', 'Product Manager'];

interface RoleFiltersProps {
  selected: string;
  onSelect: (role: string) => void;
}

export default function RoleFilters({ selected, onSelect }: RoleFiltersProps) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-3 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      {roles.map((role) => (
        <button
          key={role}
          onClick={() => onSelect(role)}
          className={`px-4 py-2 text-sm rounded-full font-medium transition-transform duration-200 border
            ${selected === role
              ? 'bg-blue-600 text-white shadow-md border-transparent'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300'}
            hover:scale-105`}
        >
          {role}
        </button>
      ))}
    </motion.div>
  );
}
