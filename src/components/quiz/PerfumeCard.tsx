'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { Perfume } from '@/types';
import MatchReasons from './MatchReasons';

interface PerfumeCardProps {
    perfume: Perfume;
    matchScore: number;
    matchReasons: string[];
    rank: number;
}

export default function PerfumeCard({ perfume, matchScore, matchReasons, rank }: PerfumeCardProps) {
    const getBadge = () => {
        switch (rank) {
            case 1: return { label: '#1 Best Match', color: 'bg-[#e53935] text-white' };
            case 2: return { label: '#2 Great Match', color: 'bg-[#1a1a1a] text-white' };
            case 3: return { label: '#3 Good Match', color: 'bg-[#666666] text-white' };
            default: return null;
        }
    };

    const badge = getBadge();

    const getGenderBadge = () => {
        switch (perfume.gender) {
            case 'female': return { label: 'Women', color: 'bg-[#e53935]' };
            case 'male': return { label: 'Men', color: 'bg-[#1a1a1a]' };
            default: return { label: 'Unisex', color: 'bg-[#666666]' };
        }
    };

    const genderBadge = getGenderBadge();

    // Match score bar color
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'bg-green-500';
        if (score >= 75) return 'bg-[#e53935]';
        if (score >= 60) return 'bg-orange-500';
        return 'bg-gray-400';
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white overflow-hidden h-full flex flex-col hover:shadow-lg transition-all"
        >
            {/* Image Container */}
            <div className="relative">
                {/* Gender Badge */}
                <span className={`absolute top-3 left-3 z-10 text-xs font-medium px-2 py-1 text-white ${genderBadge.color}`}>
                    {genderBadge.label}
                </span>

                {/* Wishlist Button */}
                <button
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#f5f5f5] transition"
                    aria-label="Add to wishlist"
                >
                    <Heart size={16} className="text-[#1a1a1a]" />
                </button>

                {/* Product Image */}
                <div className="h-56 bg-[#f5f5f5] relative overflow-hidden">
                    <Image
                        src={perfume.imageUrl}
                        alt={perfume.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Match Score Badge */}
                <div className="absolute bottom-3 right-3 bg-[#e53935] text-white text-xs font-semibold px-3 py-1.5">
                    {matchScore}% Match
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Rank Badge */}
                {badge && (
                    <span className={`inline-block w-fit text-xs font-medium px-2 py-1 mb-2 ${badge.color}`}>
                        {badge.label}
                    </span>
                )}

                {/* Name */}
                <h3 className="text-base font-medium text-[#1a1a1a]">{perfume.name}</h3>

                {/* Price */}
                <p className="text-sm text-[#4a4a4a] mt-1">
                    From {perfume.price} {perfume.currency}
                </p>

                {/* Match Score Bar (replaces hardcoded 4-star rating - BUG-03) */}
                <div className="my-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#888888]">Match Score</span>
                        <span className="font-medium text-[#1a1a1a]">{matchScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${getScoreColor(matchScore)}`}
                            style={{ width: `${matchScore}%` }}
                        />
                    </div>
                </div>

                {/* Inspired By - only if data present (UX-05) */}
                {perfume.inspiredBy && perfume.inspiredBy !== 'nspired beauty' && perfume.inspiredBy.trim() !== '' && (
                    <div className="mb-3 flex items-center gap-1.5">
                        <Sparkles size={12} className="text-[#e53935]" />
                        <div>
                            <p className="text-xs text-[#888888]">inspired by</p>
                            <p className="text-xs text-[#e53935] font-medium">{perfume.inspiredBy}</p>
                        </div>
                    </div>
                )}

                {/* Match Reasons */}
                <div className="mt-auto flex-1">
                    <MatchReasons reasons={matchReasons} />
                </div>

                {/* Notes Preview */}
                <div className="mt-4 pt-4 border-t border-[#e0e0e0]">
                    <p className="text-xs text-[#888888] uppercase tracking-wider mb-1">Key Notes</p>
                    <p className="text-sm text-[#4a4a4a]">
                        {[...perfume.notes.top, ...perfume.notes.middle].slice(0, 4).join(' · ')}
                    </p>
                </div>

                {/* CTA */}
                <a
                    href={perfume.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 bg-[#e53935] text-white text-center py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#c62828] transition"
                >
                    Buy Now
                </a>
            </div>
        </motion.div>
    );
}
