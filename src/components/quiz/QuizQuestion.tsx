'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { QuizStep, QuizAnswers } from '@/types';
import QuizOption from './QuizOption';
import NotesSelectorStep from './NotesSelectorStep';

interface QuizQuestionProps {
    step: QuizStep;
    value: unknown;
    onChange: (value: unknown) => void;
    answers?: QuizAnswers;
}

export default function QuizQuestion({ step, value, onChange, answers }: QuizQuestionProps) {
    const [search, setSearch] = useState('');

    const showSearch = step.options.length > 24;
    const filteredOptions = useMemo(() => {
        if (!showSearch) return step.options;
        const q = search.trim().toLowerCase();
        if (!q) return step.options;
        return step.options.filter((opt) => {
            if (opt.id === 'none') return true;
            return (
                opt.label.toLowerCase().includes(q) ||
                (opt.labelAr && opt.labelAr.toLowerCase().includes(q))
            );
        });
    }, [search, showSearch, step.options]);

    // Notes (love / avoid) steps use the dedicated selector
    if (step.name === 'favoriteNotes') {
        const ids = Array.isArray(value) ? (value as string[]).filter((id) => id !== 'none') : [];
        return (
            <NotesSelectorStep
                mode="love"
                value={ids}
                onChange={(ids) => onChange(ids)}
            />
        );
    }
    if (step.name === 'avoidedNotes') {
        const ids = Array.isArray(value) ? (value as string[]).filter((id) => id !== 'none') : [];
        const favoriteIds = Array.isArray(answers?.favoriteNotes)
            ? (answers.favoriteNotes as string[]).filter((id) => id !== 'none')
            : [];
        return (
            <NotesSelectorStep
                mode="avoid"
                value={ids}
                onChange={(ids) => onChange(ids)}
                disabledNotes={favoriteIds}
            />
        );
    }

    // Season: "When will you wear it?" style with clear section
    if (step.name === 'season') {
        return (
            <div>
                <h2 className="text-xl md:text-2xl font-light text-[#1a1a1a] mb-1">
                    When will you <span className="font-semibold">wear it</span>?
                </h2>
                <p className="text-[#4a4a4a] text-sm mb-6">
                    Different seasons call for different scents.
                </p>
                <p className="text-sm font-medium text-[#1a1a1a] mb-3">Season</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {step.options.map((option) => (
                        <QuizOption
                            key={option.id}
                            option={option}
                            selected={value === option.id}
                            onClick={() => onChange(option.id)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Default: other steps (gender, intensity)
    const handleSelect = (optionId: string) => {
        if (step.type === 'single') {
            onChange(optionId);
        } else {
            const currentValue = Array.isArray(value) ? value : [];
            if (optionId === 'none') {
                onChange(['none']);
            } else if (currentValue.includes(optionId)) {
                onChange(currentValue.filter((id: string) => id !== optionId));
            } else {
                onChange([...currentValue.filter((id: string) => id !== 'none'), optionId]);
            }
        }
    };

    const isSelected = (optionId: string) => {
        if (step.type === 'single') return value === optionId;
        return Array.isArray(value) && value.includes(optionId);
    };

    return (
        <div>
            <h2 className="text-xl md:text-2xl font-light text-[#1a1a1a] mb-2">
                {step.question}
            </h2>
            {step.questionAr && (
                <p className="text-[#888888] text-sm mb-6" dir="rtl">
                    {step.questionAr}
                </p>
            )}
            {step.type === 'multiple' && (
                <p className="text-sm text-[#e53935] mb-4">Select all that apply</p>
            )}
            {showSearch && (
                <div className="mb-5 relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search notes..."
                        className="w-full border border-[#e0e0e0] px-4 py-3 pl-10 text-sm outline-none focus:border-[#1a1a1a] bg-white"
                    />
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredOptions.map((option) => (
                    <QuizOption
                        key={option.id}
                        option={option}
                        selected={isSelected(option.id)}
                        onClick={() => handleSelect(option.id)}
                    />
                ))}
            </div>
        </div>
    );
}
