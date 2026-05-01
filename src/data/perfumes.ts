import { Perfume } from '@/types';
import rawData from '../../perfumes.json';

// Filter out discovery sets (perfumes with no notes)
// Add error handling for malformed data (BUG-07)
export const perfumes: Perfume[] = (() => {
    try {
        if (!rawData || !Array.isArray(rawData)) {
            console.error('[perfumes.ts] Invalid perfume data: expected array');
            return [];
        }
        return (rawData as Perfume[])
            .filter(p =>
                p &&
                p.notes &&
                (p.notes.top?.length > 0 || p.notes.middle?.length > 0 || p.notes.base?.length > 0)
            );
    } catch (err) {
        console.error('[perfumes.ts] Error loading perfume data:', err);
        return [];
    }
})();
