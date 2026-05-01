import { Perfume, QuizAnswers, RecommendationResult } from '@/types';
import { uniqueAllNotes } from '@/config/quizSteps';

const noteIdToLabel = new Map(uniqueAllNotes.map(note => [note.id, note.label]));

// Normalize a note for comparison
function normalizeNote(value: string): string {
    return value
        .toLowerCase()
        .replace(/[-_']/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// BUG-05 FIX: Word-boundary-aware matching instead of loose substring
// Returns true only if the term matches at a word boundary in the note
function wordBoundaryMatch(term: string, note: string): boolean {
    // Exact match
    if (term === note) return true;

    // Term is a full word in the note (word boundary)
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'i');
    if (regex.test(note)) return true;

    // If term is longer than note, check if note is a word in term
    if (note.length > 2 && term.length > note.length) {
        const escapedNote = note.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const noteRegex = new RegExp(`\\b${escapedNote}\\b`, 'i');
        if (noteRegex.test(term)) return true;
    }

    return false;
}

// Get all terms for a note (handles multi-part notes)
function normalizeNoteTerms(value: string): string[] {
    const label = noteIdToLabel.get(value) ?? value;
    const normalized = normalizeNote(label);
    // Split on common separators
    const parts = normalized
        .split(/[\/,&]/)
        .map(p => p.trim())
        .filter(Boolean);
    return Array.from(new Set([normalized, ...parts]));
}

// Infer intensity from notes
function inferIntensity(perfume: Perfume): 'light' | 'moderate' | 'strong' {
    const allNotes = [
        ...perfume.notes.top,
        ...perfume.notes.middle,
        ...perfume.notes.base
    ].map(n => n.toLowerCase());

    const strongNotes = ['oud', 'leather', 'tobacco', 'saffron', 'patchouli', 'amber', 'incense'];
    const lightNotes = ['citrus', 'bergamot', 'lemon', 'lime', 'grapefruit', 'green tea', 'water', 'aquatic', 'marine'];

    const hasStrong = strongNotes.some(n => allNotes.some(note => note.includes(n)));
    const hasLight = lightNotes.some(n => allNotes.some(note => note.includes(n)));

    if (hasStrong && !hasLight) return 'strong';
    if (hasLight && !hasStrong) return 'light';
    return 'moderate';
}

// BUG-04 FIX: Use explicit season ratings if present, fallback to inference
function getSeasonScore(perfume: Perfume, season: string): number {
    // Check for explicit season ratings in perfume data
    if (perfume.seasons && perfume.seasons[season as keyof typeof perfume.seasons] !== undefined) {
        const rating = perfume.seasons[season as keyof typeof perfume.seasons]!;
        // Convert 1-10 rating to our 1-10 scale
        return Math.max(1, Math.min(10, rating));
    }

    // Fallback to inference from notes
    return inferSeasonScore(perfume, season);
}

// Infer season suitability from notes
function inferSeasonScore(perfume: Perfume, season: string): number {
    const allNotes = [
        ...perfume.notes.top,
        ...perfume.notes.middle,
        ...perfume.notes.base
    ].map(n => n.toLowerCase());

    const seasonIndicators: Record<string, { boost: string[], penalty: string[] }> = {
        spring: {
            boost: ['floral', 'rose', 'jasmine', 'lily', 'violet', 'peony', 'green', 'fresh'],
            penalty: ['oud', 'leather', 'tobacco', 'heavy']
        },
        summer: {
            boost: ['citrus', 'bergamot', 'lemon', 'aquatic', 'marine', 'fresh', 'mint', 'cucumber'],
            penalty: ['oud', 'amber', 'tobacco', 'leather', 'heavy', 'spicy']
        },
        fall: {
            boost: ['amber', 'vanilla', 'cinnamon', 'spice', 'wood', 'cedar', 'sandalwood'],
            penalty: ['aquatic', 'marine', 'cucumber']
        },
        winter: {
            boost: ['oud', 'leather', 'tobacco', 'amber', 'vanilla', 'spice', 'incense', 'tonka'],
            penalty: ['aquatic', 'marine', 'citrus', 'fresh']
        }
    };

    const indicators = seasonIndicators[season] || { boost: [], penalty: [] };

    let score = 5; // Base score

    for (const note of allNotes) {
        if (indicators.boost.some(b => note.includes(b))) score += 1;
        if (indicators.penalty.some(p => note.includes(p))) score -= 1;
    }

    return Math.max(1, Math.min(10, score));
}

// Normalize display scores to 60-99% range so low matches aren't shown as 0%
function normalizeDisplayScore(rawScore: number, minRaw: number, maxRaw: number): number {
    if (maxRaw === minRaw) return 80; // All same score -> default
    const ratio = (rawScore - minRaw) / (maxRaw - minRaw);
    return Math.round(60 + ratio * 39); // Maps to 60-99
}

export function calculateRecommendations(
    answers: QuizAnswers,
    perfumeList: Perfume[]
): RecommendationResult[] {
    const results: RecommendationResult[] = [];
    let eligibleCount = 0;

    for (const perfume of perfumeList) {
        // ============ HARD FILTERS (Exclusions) ============

        // 1. Gender filter
        if (answers.gender && answers.gender !== 'unisex') {
            if (perfume.gender !== answers.gender && perfume.gender !== 'unisex') {
                continue;
            }
        }

        // 2. Avoided notes filter - BUG-05 FIX: word-boundary-aware matching
        if (answers.avoidedNotes.length > 0 && !answers.avoidedNotes.includes('none')) {
            const allPerfumeNotes = [
                ...perfume.notes.top,
                ...perfume.notes.middle,
                ...perfume.notes.base
            ].map(n => normalizeNote(n));

            const avoidedTerms = answers.avoidedNotes.flatMap(normalizeNoteTerms);

            const hasAvoidedNote = avoidedTerms.some(avoidedTerm =>
                allPerfumeNotes.some(note =>
                    wordBoundaryMatch(avoidedTerm, note)
                )
            );

            if (hasAvoidedNote) {
                continue;
            }
        }

        // 3. Stock check
        if (!perfume.inStock) continue;

        eligibleCount++;

        // ============ SCORING (Positive Matching) ============
        let score = 0;
        const reasons: string[] = [];

        // --- Favorite Notes Match (40 points max) - PRIMARY SCORING ---
        if (answers.favoriteNotes.length > 0 && !answers.favoriteNotes.includes('none')) {
            const allPerfumeNotes = [
                ...perfume.notes.top,
                ...perfume.notes.middle,
                ...perfume.notes.base
            ].map(n => normalizeNote(n));

            let noteMatches = 0;
            const matchedNotes: string[] = [];

            for (const favorite of answers.favoriteNotes) {
                const favoriteLabel = noteIdToLabel.get(favorite) ?? favorite;
                const terms = normalizeNoteTerms(favorite);

                // BUG-05 FIX: use word-boundary matching
                const isMatch = terms.some(term =>
                    allPerfumeNotes.some(note =>
                        wordBoundaryMatch(term, note)
                    )
                );

                if (isMatch) {
                    noteMatches++;
                    matchedNotes.push(favoriteLabel);
                }
            }

            const matchRatio = noteMatches / answers.favoriteNotes.length;
            const noteScore = matchRatio * 40;
            score += noteScore;

            if (matchedNotes.length > 0) {
                const displayNotes = matchedNotes.slice(0, 3).join(', ');
                reasons.push(`Contains ${displayNotes}`);
            }
        } else {
            score += 20;
        }

        // --- Season Match (20 points max) - BUG-04 FIX: use explicit ratings ---
        if (answers.season && answers.season !== 'all') {
            const seasonScore = getSeasonScore(perfume, answers.season);
            const seasonPoints = (seasonScore / 10) * 20;
            score += seasonPoints;

            if (seasonScore >= 7) {
                const seasonNames: Record<string, string> = {
                    spring: 'Spring',
                    summer: 'Summer',
                    fall: 'Fall',
                    winter: 'Winter'
                };
                reasons.push(`Perfect for ${seasonNames[answers.season]}`);
            }
        } else {
            score += 15;
        }

        // --- Intensity Match (20 points max) ---
        const perfumeIntensity = inferIntensity(perfume);
        const preferredIntensity = answers.intensity || 'moderate';

        const intensityOrder = ['light', 'moderate', 'strong'];
        const perfumeIdx = intensityOrder.indexOf(perfumeIntensity);
        const preferredIdx = intensityOrder.indexOf(preferredIntensity);
        const intensityDiff = Math.abs(perfumeIdx - preferredIdx);

        const intensityScore = intensityDiff === 0 ? 20 : intensityDiff === 1 ? 12 : 5;
        score += intensityScore;

        if (intensityDiff === 0) {
            reasons.push('Matches your intensity preference');
        }

        // --- Gender exact match bonus (10 points) ---
        if (perfume.gender === answers.gender) {
            score += 10;
        } else if (perfume.gender === 'unisex') {
            score += 5;
        }

        // --- Inspired by bonus (5 points) ---
        if (perfume.inspiredBy && perfume.inspiredBy !== 'nspired beauty' && perfume.inspiredBy.trim() !== '') {
            score += 5;
            reasons.push(`Inspired by ${perfume.inspiredBy}`);
        }

        // --- Rich note profile bonus / few-note penalty ---
        const totalNotes = perfume.notes.top.length + perfume.notes.middle.length + perfume.notes.base.length;
        if (totalNotes >= 6) {
            score += 5;
        } else if (totalNotes < 3) {
            // Penalize perfumes with very few notes - harder to match precisely
            score -= 5;
        }

        // Only include if score is reasonable
        if (score >= 20) {
            results.push({
                perfume,
                matchScore: Math.round(score), // raw score, will normalize below
                matchReasons: reasons.slice(0, 4)
            });
        }
    }

    // Sort by raw score descending
    results.sort((a, b) => b.matchScore - a.matchScore);

    // Normalize display scores to 60-99% range
    const topResults = results.slice(0, 6);
    if (topResults.length > 0) {
        const rawScores = topResults.map(r => r.matchScore);
        const minRaw = Math.min(...rawScores);
        const maxRaw = Math.max(...rawScores);

        for (const result of topResults) {
            result.matchScore = normalizeDisplayScore(result.matchScore, minRaw, maxRaw);
        }
    }

    // Dev logging
    if (process.env.NODE_ENV === 'development') {
        console.log('[RecommendationEngine] Results:', {
            eligibleCount,
            totalResults: results.length,
            topScores: topResults.map(r => ({
                name: r.perfume.name,
                score: r.matchScore,
                reasons: r.matchReasons
            }))
        });
    }

    return topResults;
}
