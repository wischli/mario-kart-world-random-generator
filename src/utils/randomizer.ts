import type { Track, SelectedTrack } from '../data/tracks';

/**
 * Fisher-Yates shuffle algorithm for true randomness
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Selects random tracks from the pool
 */
export function selectRandomTracks(allTracks: Track[], count = 16): SelectedTrack[] {
  const shuffled = shuffleArray(allTracks);
  return shuffled.slice(0, count).map((track, index) => ({
    ...track,
    order: index + 1,
  }));
}

/**
 * Encodes selection to URL-safe string for sharing
 */
export function encodeSelection(selectedTracks: SelectedTrack[]): string {
  const ids = selectedTracks
    .sort((a, b) => a.order - b.order)
    .map(t => t.id);
  return btoa(ids.join(','));
}

/**
 * Decodes selection from URL-safe string
 */
export function decodeSelection(encoded: string, allTracks: Track[]): SelectedTrack[] | null {
  try {
    const ids = atob(encoded).split(',').map(Number);
    if (ids.length !== 16 || ids.some(isNaN)) return null;

    const trackMap = new Map(allTracks.map(t => [t.id, t]));
    const selected: SelectedTrack[] = [];

    for (let i = 0; i < ids.length; i++) {
      const track = trackMap.get(ids[i]);
      if (!track) return null;
      selected.push({ ...track, order: i + 1 });
    }

    return selected;
  } catch {
    return null;
  }
}

/**
 * Formats track list for clipboard
 */
export function formatTrackListForClipboard(selectedTracks: SelectedTrack[]): string {
  const sorted = [...selectedTracks].sort((a, b) => a.order - b.order);
  const lines = sorted.map(track => {
    const badge = track.isNew ? '[NEW]' : `[${track.origin}]`;
    return `${track.order}. ${track.name} ${badge}`;
  });
  return `Mario Kart World - Random Track Selection\n${'='.repeat(42)}\n${lines.join('\n')}`;
}
