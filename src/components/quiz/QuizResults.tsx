'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Frown } from 'lucide-react';
import { RecommendationResult } from '@/types';
import PerfumeCard from './PerfumeCard';

interface QuizResultsProps {
    recommendations: RecommendationResult[];
    onRetake: () => void;
    eligibleCount?: number;
}

export default function QuizResults({ recommendations, onRetake, eligibleCount }: QuizResultsProps) {
    if (recommendations.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-[#e0e0e0] p-8 text-center max-w-md"
                >
                    <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Frown size={32} className="text-[#888888]" />
                    </div>
                    <h2 className="text-xl font-medium text-[#1a1a1a] mb-2">No Perfect Match Found</h2>
                    <p className="text-[#4a4a4a] text-sm mb-6">
                        We couldn&apos;t find a perfume that matches all your preferences. Try adjusting your selections.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onRetake}
                            className="bg-[#e53935] text-white px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#c62828] transition"
                        >
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="text-[#4a4a4a] hover:text-[#1a1a1a] text-sm"
                        >
                            Return Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            {/* Header */}
            <header className="bg-white border-b border-[#e0e0e0]">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-semibold tracking-wide text-[#1a1a1a]">
                        <span className="font-light">n</span>spired
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-[#4a4a4a] hover:text-[#e53935] transition flex items-center gap-2"
                    >
                        <Home size={16} />
                        Home
                    </Link>
                </div>
            </header>

            <div className="py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Results Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <p className="text-[#e53935] text-sm uppercase tracking-widest mb-2 font-medium">
                            Quiz Complete
                        </p>
                        <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-3">
                            Your <span className="font-semibold">Perfect Matches</span>
                        </h2>
                        <p className="text-[#4a4a4a]">
                            Based on your preferences, here are our top {recommendations.length} recommendations
                            {eligibleCount !== undefined && (
                                <span className="text-[#888888]"> from {eligibleCount} eligible perfumes</span>
                            )}
                        </p>
                    </motion.div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map((result, index) => (
                            <motion.div
                                key={result.perfume.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <PerfumeCard
                                    perfume={result.perfume}
                                    matchScore={result.matchScore}
                                    matchReasons={result.matchReasons}
                                    rank={index + 1}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
                    >
                        <button
                            onClick={onRetake}
                            className="px-8 py-3 border border-[#1a1a1a] text-[#1a1a1a] text-sm uppercase tracking-wider font-medium hover:bg-[#1a1a1a] hover:text-white transition"
                        >
                            Retake Quiz
                        </button>
                        <Link
                            href="/"
                            className="px-8 py-3 bg-[#e53935] text-white text-sm uppercase tracking-wider font-medium hover:bg-[#c62828] transition text-center"
                        >
                            Browse All
                        </Link>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-center mt-16 pt-8 border-t border-[#e0e0e0]"
                    >
                        <p className="text-[#888888] text-sm">
                            All fragrances available at{' '}
                            <a
                                href="https://nspiredbeauty.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#e53935] hover:underline"
                            >
                                nspired Beauty
                            </a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
