'use client';

import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface QuizNavigationProps {
    onBack: () => void;
    onNext: () => void;
    onSkip?: () => void;
    canGoBack: boolean;
    canGoNext: boolean;
    isLastStep: boolean;
}

export default function QuizNavigation({
    onBack,
    onNext,
    onSkip,
    canGoBack,
    canGoNext,
    isLastStep
}: QuizNavigationProps) {
    return (
        <div className="flex items-center justify-between mt-6 gap-3">
            {/* Back button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                disabled={!canGoBack}
                className={`
                    flex items-center gap-2 px-5 py-3 text-sm font-medium transition
                    ${canGoBack
                        ? 'text-[#4a4a4a] hover:text-[#1a1a1a] border border-[#e0e0e0] bg-white'
                        : 'text-[#e0e0e0] cursor-not-allowed'
                    }
                `}
            >
                <ChevronLeft size={16} />
                Back
            </motion.button>

            {/* Skip + Next */}
            <div className="flex items-center gap-3">
                {/* Skip button */}
                {onSkip && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onSkip}
                        className="text-sm text-[#888888] hover:text-[#4a4a4a] transition px-4 py-3"
                    >
                        Skip this step
                    </motion.button>
                )}

                {/* Next / Submit button */}
                <motion.button
                    whileHover={{ scale: canGoNext ? 1.02 : 1 }}
                    whileTap={{ scale: canGoNext ? 0.98 : 1 }}
                    onClick={onNext}
                    disabled={!canGoNext}
                    className={`
                        px-6 py-3 text-sm font-medium transition
                        ${canGoNext
                            ? 'bg-[#e53935] text-white hover:bg-[#c62828]'
                            : 'bg-[#e0e0e0] text-[#888888] cursor-not-allowed'
                        }
                    `}
                >
                    {isLastStep ? 'Find My Perfumes' : 'Next'}
                </motion.button>
            </div>
        </div>
    );
}
