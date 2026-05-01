'use client';

import { Check } from 'lucide-react';

interface MatchReasonsProps {
    reasons: string[];
}

export default function MatchReasons({ reasons }: MatchReasonsProps) {
    if (reasons.length === 0) return null;

    return (
        <div className="space-y-2">
            <p className="text-xs text-[#888888] uppercase tracking-wider">Why this matches you</p>
            <ul className="space-y-1">
                {reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-[#4a4a4a]">
                        <Check size={14} className="text-[#e53935] mt-0.5 shrink-0" />
                        <span className="text-sm text-[#4a4a4a]">{reason}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
