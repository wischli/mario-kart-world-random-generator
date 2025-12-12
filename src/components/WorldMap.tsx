import { useRef, useState, useEffect } from 'react';
import { TRACKS, type SelectedTrack } from '../data/tracks';
import { TrackMarker } from './TrackMarker';

interface WorldMapProps {
  selectedTracks: SelectedTrack[];
  highlightedTrackId: number | null;
}

export function WorldMap({ selectedTracks, highlightedTrackId }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const img = containerRef.current.querySelector('img');
        if (img) {
          setDimensions({
            width: img.clientWidth,
            height: img.clientHeight,
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const selectedMap = new Map(selectedTracks.map(t => [t.id, t]));

  return (
    <div ref={containerRef} className="relative w-full">
      <img
        src={import.meta.env.BASE_URL + 'assets/mkw-map.png'}
        alt="Mario Kart World Map"
        className="w-full h-auto rounded-xl shadow-2xl"
        onLoad={() => {
          if (containerRef.current) {
            const img = containerRef.current.querySelector('img');
            if (img) {
              setDimensions({
                width: img.clientWidth,
                height: img.clientHeight,
              });
            }
          }
        }}
      />

      {/* Track markers overlay */}
      {dimensions.width > 0 && (
        <div
          className="absolute inset-0"
          style={{ width: dimensions.width, height: dimensions.height }}
        >
          {TRACKS.map((track, index) => {
            const selectedTrack = selectedMap.get(track.id);
            return (
              <TrackMarker
                key={track.id}
                track={track}
                selectedTrack={selectedTrack}
                mapWidth={dimensions.width}
                mapHeight={dimensions.height}
                isHighlighted={highlightedTrackId === track.id}
                animationDelay={selectedTrack ? selectedTrack.order * 50 : 0}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
