'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
        <Button
          key={role}
          variant={selected === role ? 'default' : 'outline'}
          className={`text-sm rounded-3xl font-medium transition-transform   ${
            selected === role
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-muted text-foreground'
          } hover:scale-105`}
          onClick={() => onSelect(role)}
        >
          {role}
        </Button>
      ))}
    </motion.div>
  );
}
