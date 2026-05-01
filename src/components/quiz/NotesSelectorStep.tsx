'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown } from 'lucide-react';
import { fragranceNotes, noteCategories } from '@/config/quizSteps';
import { RenderIcon } from '@/lib/iconRegistry';
import type { FragranceNote } from '@/types';

const MAX_LOVE_SELECTIONS = 10;
const MAX_AVOID_SELECTIONS = 20;

// Build categories with actual counts from fragranceNotes
const categoriesWithCounts = noteCategories.map((cat) => ({
    ...cat,
    count: (fragranceNotes as Record<string, FragranceNote[]>)[cat.id]?.length ?? 0,
}));

interface NotesSelectorStepProps {
    mode: 'love' | 'avoid';
    value: string[];
    onChange: (ids: string[]) => void;
    disabledNotes?: string[];
}

export default function NotesSelectorStep({ mode, value, onChange, disabledNotes = [] }: NotesSelectorStepProps) {
    const [search, setSearch] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(categoriesWithCounts[0]?.id ?? null);

    const selectedIds = useMemo(() => {
        const arr = Array.isArray(value) ? value : [];
        return arr.filter((id) => id !== 'none');
    }, [value]);

    const maxSelections = mode === 'love' ? MAX_LOVE_SELECTIONS : MAX_AVOID_SELECTIONS;
    const atLimit = selectedIds.length >= maxSelections;

    const selectedNotes = useMemo(() => {
        const notes: { id: string; label: string; icon: string }[] = [];
        for (const cat of categoriesWithCounts) {
            const items = (fragranceNotes as Record<string, FragranceNote[]>)[cat.id] ?? [];
            for (const n of items) {
                if (selectedIds.includes(n.id)) notes.push({ id: n.id, label: n.label, icon: n.icon });
            }
        }
        return notes.sort((a, b) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id));
    }, [selectedIds]);

    const handleToggle = (noteId: string) => {
        if (noteId === 'none') {
            onChange([]);
            return;
        }
        if (selectedIds.includes(noteId)) {
            onChange(selectedIds.filter((id) => id !== noteId));
        } else {
            if (atLimit) return;
            onChange([...selectedIds, noteId]);
        }
    };

    const removeSelected = (noteId: string) => {
        onChange(selectedIds.filter((id) => id !== noteId));
    };

    const filterNotes = (notes: FragranceNote[]) => {
        const q = search.trim().toLowerCase();
        if (!q) return notes;
        return notes.filter(
            (n) =>
                n.label.toLowerCase().includes(q) ||
                (n.labelAr && n.labelAr.includes(q))
        );
    };

    const isLove = mode === 'love';
    const highlightClass = isLove ? 'text-[#e53935]' : 'text-[#c62828]';

    // Check if any categories have filtered results (cheap vs. syncing useMemo deps with filterNotes)
    const trimmedSearch = search.trim();
    const hasAnyResults =
        !trimmedSearch ||
        categoriesWithCounts.some((cat) => {
            const notes = (fragranceNotes as Record<string, FragranceNote[]>)[cat.id] ?? [];
            return filterNotes(notes).length > 0;
        });

    return (
        <div className="space-y-5">
            {/* Title with highlighted word */}
            <div className="text-center mb-2">
                <h2 className="text-xl md:text-2xl font-light text-[#1a1a1a] mb-1">
                    {isLove ? (
                        <>Which notes do you <span className={`font-semibold ${highlightClass}`}>love</span>?</>
                    ) : (
                        <>Any notes you <span className={`font-semibold ${highlightClass}`}>avoid</span>?</>
                    )}
                </h2>
                <p className="text-sm text-[#4a4a4a]">
                    {isLove
                        ? 'Select the ingredients that make your heart sing'
                        : "We'll make sure to exclude these from your recommendations."}
                </p>
            </div>

            {/* Conflict warning banner (BUG-01) */}
            {mode === 'avoid' && disabledNotes.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 text-orange-800 text-sm rounded-lg px-4 py-2 mb-4 flex items-center gap-2">
                    <span className="font-medium">Note:</span>
                    Notes you already love are grayed out and cannot be avoided.
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search ingredients..."
                    className="w-full border border-[#e0e0e0] pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1a1a1a] bg-white"
                />
            </div>

            {/* Selected tags + count */}
            {(selectedNotes.length > 0 || isLove) && (
                <div className="flex flex-wrap items-center gap-2">
                    {selectedNotes.map((note) => (
                        <motion.span
                            key={note.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1.5 bg-white border border-[#e0e0e0] px-3 py-1.5 text-sm"
                        >
                            <RenderIcon name={note.icon} size={16} className="text-[#1a1a1a]" />
                            <span className="text-[#1a1a1a] font-medium">{note.label}</span>
                            <button
                                type="button"
                                onClick={() => removeSelected(note.id)}
                                className="ml-1 text-[#888888] hover:text-[#1a1a1a] transition"
                                aria-label={`Remove ${note.label}`}
                            >
                                <X size={12} />
                            </button>
                        </motion.span>
                    ))}
                    {isLove && (
                        <span className="text-sm text-[#888888] ml-1">
                            {selectedIds.length}/{MAX_LOVE_SELECTIONS}
                        </span>
                    )}
                </div>
            )}

            {/* Empty search state (UX-03) */}
            {trimmedSearch && !hasAnyResults && (
                <div className="text-center py-8 text-gray-400">
                    <Search size={24} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No notes match &quot;{search}&quot;</p>
                    <button onClick={() => setSearch('')} className="text-xs text-[#e53935] mt-1 underline">
                        Clear search
                    </button>
                </div>
            )}

            {/* Expandable categories */}
            <div className="max-h-[320px] overflow-y-auto pr-1 space-y-1">
                <AnimatePresence>
                    {categoriesWithCounts.map((cat) => {
                        const notes = (fragranceNotes as Record<string, FragranceNote[]>)[cat.id] ?? [];
                        const filtered = filterNotes(notes);
                        const isExpanded = expandedCategory === cat.id;
                        const selectedInCategory = notes.filter(n => selectedIds.includes(n.id)).length;

                        if (search && filtered.length === 0) return null;

                        return (
                            <motion.div
                                key={cat.id}
                                layout
                                className="border border-[#e0e0e0] bg-white overflow-hidden"
                            >
                                <button
                                    type="button"
                                    onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#f5f5f5] transition"
                                >
                                    <span className="flex items-center gap-2 font-medium text-[#1a1a1a]">
                                        <RenderIcon name={cat.icon} size={16} className="text-[#888888]" />
                                        {cat.label}
                                    </span>
                                    <span className="flex items-center gap-2 text-[#888888] text-sm">
                                        {selectedInCategory > 0 && (
                                            <span className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5 font-medium">
                                                {selectedInCategory} selected
                                            </span>
                                        )}
                                        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                                            {filtered.length}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-[#e0e0e0] overflow-hidden"
                                        >
                                            <div className="p-3 flex flex-wrap gap-2 bg-[#f5f5f5]">
                                                {filtered.map((note) => {
                                                    const selected = selectedIds.includes(note.id);
                                                    const disabledByLimit = !selected && atLimit;
                                                    const disabledByConflict = mode === 'avoid' && disabledNotes.includes(note.id);
                                                    const isDisabled = disabledByLimit || disabledByConflict;
                                                    return (
                                                        <button
                                                            key={note.id}
                                                            type="button"
                                                            onClick={() => !isDisabled && handleToggle(note.id)}
                                                            disabled={isDisabled}
                                                            title={disabledByConflict ? 'Already in your loved notes' : undefined}
                                                            className={`
                                                                inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition
                                                                ${selected
                                                                    ? 'bg-[#e53935] text-white'
                                                                    : 'bg-white text-[#1a1a1a] border border-[#e0e0e0] hover:border-[#888888]'
                                                                }
                                                                ${disabledByConflict ? 'opacity-40 cursor-not-allowed line-through' : ''}
                                                                ${disabledByLimit && !disabledByConflict ? 'opacity-50 cursor-not-allowed' : ''}
                                                            `}
                                                        >
                                                            {disabledByConflict && <X size={14} className="text-red-500 mr-1" />}
                                                            <RenderIcon name={note.icon} size={16} className={selected ? 'text-white' : 'text-[#888888]'} />
                                                            {note.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {atLimit && isLove && (
                <p className="text-sm text-[#e53935] text-center">
                    You&apos;ve reached the maximum of {MAX_LOVE_SELECTIONS} notes. Remove one to add another.
                </p>
            )}
        </div>
    );
}
