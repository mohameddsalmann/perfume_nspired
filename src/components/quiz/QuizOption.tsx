'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { QuizOption as QuizOptionType } from '@/types';
import { RenderIcon } from '@/lib/iconRegistry';

interface QuizOptionProps {
    option: QuizOptionType;
    selected: boolean;
    onClick: () => void;
}

export default function QuizOption({ option, selected, onClick }: QuizOptionProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            role="option"
            aria-selected={selected}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            className={`
                relative p-4 border transition-all duration-200 text-left bg-white
                ${selected
                    ? 'border-[#e53935] bg-white'
                    : 'border-[#e0e0e0] hover:border-[#888888]'
                }
            `}
        >
            {/* Selection indicator */}
            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 bg-[#e53935] flex items-center justify-center"
                >
                    <Check size={14} strokeWidth={3} className="text-white" />
                </motion.div>
            )}

            {/* Icon */}
            <span className="mb-2 block">
                <RenderIcon name={option.icon} size={28} strokeWidth={1.5} className="text-[#1a1a1a]" />
            </span>

            {/* Label */}
            <span className={`font-medium block text-sm ${selected ? 'text-[#e53935]' : 'text-[#1a1a1a]'}`}>
                {option.label}
            </span>

            {/* Arabic label */}
            <span className="text-xs text-[#888888] block mt-0.5" dir="rtl">
                {option.labelAr}
            </span>

            {/* Description */}
            {option.description && (
                <span className="text-xs text-[#4a4a4a] mt-2 block">
                    {option.description}
                </span>
            )}
        </motion.button>
    );
}
