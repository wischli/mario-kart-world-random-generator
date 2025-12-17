import { describe, it, expect } from 'vitest';
import { TRACKS, MAP_REF_WIDTH, MAP_REF_HEIGHT } from './tracks';

describe('TRACKS data validation', () => {
  it('contains exactly 30 tracks', () => {
    expect(TRACKS).toHaveLength(30);
  });

  it('has unique IDs from 1 to 30', () => {
    const ids = TRACKS.map(t => t.id).sort((a, b) => a - b);
    const expected = Array.from({ length: 30 }, (_, i) => i + 1);
    expect(ids).toEqual(expected);
  });

  it('has unique names for all tracks', () => {
    const names = TRACKS.map(t => t.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(30);
  });

  it('has non-empty names for all tracks', () => {
    TRACKS.forEach((track) => {
      expect(track.name).toBeTruthy();
      expect(track.name.trim().length).toBeGreaterThan(0);
    });
  });

  it('has valid x coordinates within map bounds', () => {
    TRACKS.forEach((track) => {
      expect(track.x).toBeGreaterThanOrEqual(0);
      expect(track.x).toBeLessThanOrEqual(MAP_REF_WIDTH);
    });
  });

  it('has valid y coordinates within map bounds', () => {
    TRACKS.forEach((track) => {
      expect(track.y).toBeGreaterThanOrEqual(0);
      expect(track.y).toBeLessThanOrEqual(MAP_REF_HEIGHT);
    });
  });

  it('has exactly 16 new tracks', () => {
    const newTracks = TRACKS.filter(t => t.isNew);
    expect(newTracks).toHaveLength(16);
  });

  it('has exactly 14 returning tracks', () => {
    const returningTracks = TRACKS.filter(t => !t.isNew);
    expect(returningTracks).toHaveLength(14);
  });

  it('new tracks do not have origin property', () => {
    const newTracks = TRACKS.filter(t => t.isNew);
    newTracks.forEach((track) => {
      expect(track.origin).toBeUndefined();
    });
  });

  it('returning tracks have valid origin property', () => {
    const returningTracks = TRACKS.filter(t => !t.isNew);
    returningTracks.forEach((track) => {
      expect(track.origin).toBeTruthy();
      expect(typeof track.origin).toBe('string');
      expect(track.origin!.trim().length).toBeGreaterThan(0);
    });
  });

  it('all coordinates are integers', () => {
    TRACKS.forEach((track) => {
      expect(Number.isInteger(track.x)).toBe(true);
      expect(Number.isInteger(track.y)).toBe(true);
    });
  });

  it('each track has required properties', () => {
    TRACKS.forEach((track) => {
      expect(track).toHaveProperty('id');
      expect(track).toHaveProperty('name');
      expect(track).toHaveProperty('x');
      expect(track).toHaveProperty('y');
      expect(track).toHaveProperty('isNew');
    });
  });
});

describe('MAP reference dimensions', () => {
  it('has valid reference width', () => {
    expect(MAP_REF_WIDTH).toBeGreaterThan(0);
    expect(MAP_REF_WIDTH).toBe(1420);
  });

  it('has valid reference height', () => {
    expect(MAP_REF_HEIGHT).toBeGreaterThan(0);
    expect(MAP_REF_HEIGHT).toBe(800);
  });
});
