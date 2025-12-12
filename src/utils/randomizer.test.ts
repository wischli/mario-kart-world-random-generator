import { describe, it, expect } from 'vitest';
import { selectRandomTracks, encodeSelection, decodeSelection, formatTrackListForClipboard } from './randomizer';
import type { Track, SelectedTrack } from '../data/tracks';

// Mock tracks for testing
const mockTracks: Track[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Track ${i + 1}`,
  x: i * 10,
  y: i * 10,
  isNew: i < 5, // First 5 are new
  origin: i >= 5 ? `Game ${Math.floor(i / 5)}` : undefined,
}));

describe('selectRandomTracks', () => {
  it('returns exactly the requested count of tracks', () => {
    const selected = selectRandomTracks(mockTracks, 16);
    expect(selected).toHaveLength(16);
  });

  it('returns all unique tracks', () => {
    const selected = selectRandomTracks(mockTracks, 16);
    const ids = selected.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(16);
  });

  it('assigns correct order numbers from 1 to count', () => {
    const selected = selectRandomTracks(mockTracks, 16);
    const orders = selected.map(t => t.order).sort((a, b) => a - b);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  });

  it('works with different count values', () => {
    const selected8 = selectRandomTracks(mockTracks, 8);
    expect(selected8).toHaveLength(8);

    const selected4 = selectRandomTracks(mockTracks, 4);
    expect(selected4).toHaveLength(4);
  });

  it('preserves track properties', () => {
    const selected = selectRandomTracks(mockTracks, 16);
    selected.forEach(track => {
      expect(track).toHaveProperty('id');
      expect(track).toHaveProperty('name');
      expect(track).toHaveProperty('x');
      expect(track).toHaveProperty('y');
      expect(track).toHaveProperty('isNew');
      expect(track).toHaveProperty('order');
    });
  });
});

describe('encodeSelection / decodeSelection', () => {
  it('round-trip preserves track selection and order', () => {
    const selected = selectRandomTracks(mockTracks, 16);
    const encoded = encodeSelection(selected);
    const decoded = decodeSelection(encoded, mockTracks);

    expect(decoded).not.toBeNull();
    expect(decoded).toHaveLength(16);

    // Sort both by order for comparison
    const sortedOriginal = [...selected].sort((a, b) => a.order - b.order);
    const sortedDecoded = [...decoded!].sort((a, b) => a.order - b.order);

    sortedOriginal.forEach((track, i) => {
      expect(sortedDecoded[i].id).toBe(track.id);
      expect(sortedDecoded[i].order).toBe(track.order);
    });
  });

  it('encodes to a valid base64 string', () => {
    const selected = selectRandomTracks(mockTracks, 16);
    const encoded = encodeSelection(selected);

    // Should be URL-safe base64
    expect(encoded).toMatch(/^[A-Za-z0-9+/=]+$/);

    // Should be decodable
    expect(() => atob(encoded)).not.toThrow();
  });

  it('returns null for invalid base64', () => {
    const decoded = decodeSelection('!!!invalid!!!', mockTracks);
    expect(decoded).toBeNull();
  });

  it('accepts variable track counts (1-30)', () => {
    // 8 tracks should work
    const encoded8 = btoa('1,2,3,4,5,6,7,8');
    const decoded8 = decodeSelection(encoded8, mockTracks);
    expect(decoded8).toHaveLength(8);

    // 4 tracks should work
    const encoded4 = btoa('1,2,3,4');
    const decoded4 = decodeSelection(encoded4, mockTracks);
    expect(decoded4).toHaveLength(4);

    // 30 tracks (all) should work
    const all30 = Array.from({ length: 30 }, (_, i) => i + 1).join(',');
    const encoded30 = btoa(all30);
    const decoded30 = decodeSelection(encoded30, mockTracks);
    expect(decoded30).toHaveLength(30);
  });

  it('returns null for empty selection', () => {
    const emptyEncoded = btoa('');
    const decoded = decodeSelection(emptyEncoded, mockTracks);
    expect(decoded).toBeNull();
  });

  it('returns null for too many tracks', () => {
    // 31 tracks exceeds total available (30)
    const tooMany = Array.from({ length: 31 }, (_, i) => (i % 30) + 1).join(',');
    const encoded = btoa(tooMany);
    const decoded = decodeSelection(encoded, mockTracks);
    expect(decoded).toBeNull();
  });

  it('returns null for non-existent track IDs', () => {
    // ID 999 doesn't exist
    const invalidEncoded = btoa('999,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16');
    const decoded = decodeSelection(invalidEncoded, mockTracks);
    expect(decoded).toBeNull();
  });

  it('returns null for non-numeric IDs', () => {
    const invalidEncoded = btoa('a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p');
    const decoded = decodeSelection(invalidEncoded, mockTracks);
    expect(decoded).toBeNull();
  });
});

describe('formatTrackListForClipboard', () => {
  it('includes header with title', () => {
    const selected: SelectedTrack[] = [
      { id: 1, name: 'Test Track', x: 0, y: 0, isNew: true, order: 1 },
    ];
    const formatted = formatTrackListForClipboard(selected);
    expect(formatted).toContain('Mario Kart World - Random Track Selection');
  });

  it('shows [NEW] badge for new tracks', () => {
    const selected: SelectedTrack[] = [
      { id: 1, name: 'New Track', x: 0, y: 0, isNew: true, order: 1 },
    ];
    const formatted = formatTrackListForClipboard(selected);
    expect(formatted).toContain('1. New Track [NEW]');
  });

  it('shows [origin] badge for retro tracks', () => {
    const selected: SelectedTrack[] = [
      { id: 1, name: 'Retro Track', x: 0, y: 0, isNew: false, origin: 'MK8', order: 1 },
    ];
    const formatted = formatTrackListForClipboard(selected);
    expect(formatted).toContain('1. Retro Track [MK8]');
  });

  it('sorts tracks by order number', () => {
    const selected: SelectedTrack[] = [
      { id: 3, name: 'Track C', x: 0, y: 0, isNew: true, order: 3 },
      { id: 1, name: 'Track A', x: 0, y: 0, isNew: true, order: 1 },
      { id: 2, name: 'Track B', x: 0, y: 0, isNew: true, order: 2 },
    ];
    const formatted = formatTrackListForClipboard(selected);
    const lines = formatted.split('\n');

    // Find track lines (skip header)
    const trackLines = lines.filter(l => /^\d+\./.test(l));
    expect(trackLines[0]).toContain('1. Track A');
    expect(trackLines[1]).toContain('2. Track B');
    expect(trackLines[2]).toContain('3. Track C');
  });

  it('formats all 16 tracks correctly', () => {
    const selected = selectRandomTracks(mockTracks, 16);
    const formatted = formatTrackListForClipboard(selected);

    // Should have 16 numbered lines
    const trackLines = formatted.split('\n').filter(l => /^\d+\./.test(l));
    expect(trackLines).toHaveLength(16);
  });
});
