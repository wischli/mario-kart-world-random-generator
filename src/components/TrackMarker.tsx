import { useState } from 'react';
import type { Track, SelectedTrack } from '../data/tracks';
import { MAP_REF_WIDTH, MAP_REF_HEIGHT } from '../data/tracks';

interface TrackMarkerProps {
  track: Track;
  selectedTrack?: SelectedTrack;
  mapWidth: number;
  mapHeight: number;
  isHighlighted?: boolean;
  animationDelay?: number;
}

export function TrackMarker({
  track,
  selectedTrack,
  mapWidth,
  mapHeight,
  isHighlighted,
  animationDelay = 0,
}: TrackMarkerProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const left = (track.x / MAP_REF_WIDTH) * mapWidth;
  const top = (track.y / MAP_REF_HEIGHT) * mapHeight;

  const isSelected = !!selectedTrack;

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 20 : 10,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Marker */}
      <div
        className={`
          flex items-center justify-center rounded-full font-bold transition-all duration-200
          ${isSelected
            ? `bg-yellow-400 text-black shadow-lg shadow-yellow-400/50 marker-pop-in ${isHighlighted ? 'marker-pulse' : ''}`
            : 'bg-gray-500/50 hover:bg-gray-400/70'
          }
        `}
        style={{
          width: isSelected ? '36px' : '16px',
          height: isSelected ? '36px' : '16px',
          fontSize: isSelected ? '14px' : '10px',
          animationDelay: isSelected ? `${animationDelay}ms` : '0ms',
          border: isSelected ? '3px solid #fff' : '2px solid rgba(255,255,255,0.3)',
        }}
      >
        {isSelected && selectedTrack?.order}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg whitespace-nowrap z-50 pointer-events-none"
          style={{ minWidth: '150px', textAlign: 'center' }}
        >
          <div className="font-semibold">{track.name}</div>
          <div className="flex items-center justify-center gap-2 mt-1">
            {track.isNew ? (
              <span className="px-2 py-0.5 text-xs rounded bg-green-500 text-white">NEW</span>
            ) : (
              <span className="px-2 py-0.5 text-xs rounded bg-blue-500 text-white">{track.origin}</span>
            )}
          </div>
          {isSelected && (
            <div className="mt-1 text-yellow-400 text-xs">Race #{selectedTrack?.order}</div>
          )}
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/90" />
        </div>
      )}
    </div>
  );
}
