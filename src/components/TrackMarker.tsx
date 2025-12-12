import { useState, useCallback } from 'react';
import type { Track, SelectedTrack } from '../data/tracks';
import { MAP_REF_WIDTH, MAP_REF_HEIGHT } from '../data/tracks';

interface TrackMarkerProps {
  track: Track;
  selectedTrack?: SelectedTrack;
  mapWidth: number;
  mapHeight: number;
  isHighlighted?: boolean;
  animationDelay?: number;
  sizeScale?: number;
  isCompleted?: boolean;
  isNext?: boolean;
  onToggleComplete?: () => void;
}

// Base sizes at 100%
const BASE_SELECTED_SIZE = 36;
const BASE_UNSELECTED_SIZE = 16;
const BASE_SELECTED_FONT = 14;

export function TrackMarker({
  track,
  selectedTrack,
  mapWidth,
  mapHeight,
  isHighlighted,
  animationDelay = 0,
  sizeScale = 1,
  isCompleted = false,
  isNext = false,
  onToggleComplete,
}: TrackMarkerProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const left = (track.x / MAP_REF_WIDTH) * mapWidth;
  const top = (track.y / MAP_REF_HEIGHT) * mapHeight;

  const isSelected = !!selectedTrack;

  // Calculate scaled sizes
  const selectedSize = Math.round(BASE_SELECTED_SIZE * sizeScale);
  const unselectedSize = Math.round(BASE_UNSELECTED_SIZE * sizeScale);
  const fontSize = Math.round(BASE_SELECTED_FONT * sizeScale);
  const borderWidth = Math.max(2, Math.round(3 * sizeScale));

  // Handle tap on mobile - toggle tooltip (single tap) or complete (double tap)
  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setShowTooltip(prev => !prev);
  }, []);

  // Handle double-click to toggle completion
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleComplete) {
      onToggleComplete();
    }
  }, [onToggleComplete]);

  // Determine marker color based on state (Neo Brutalist style)
  const getMarkerStyle = () => {
    if (!selectedTrack) {
      return {
        bg: 'bg-white/70 hover:bg-white/90',
        textColor: 'text-black',
        shadow: '2px 2px 0px 0px rgba(0,0,0,0.5)',
      };
    }
    if (isCompleted) {
      return {
        bg: 'bg-red-500',
        textColor: 'text-white',
        shadow: '3px 3px 0px 0px #000',
      };
    }
    if (isNext) {
      return {
        bg: 'bg-green-400',
        textColor: 'text-black',
        shadow: '3px 3px 0px 0px #000',
      };
    }
    return {
      bg: 'bg-yellow-400',
      textColor: 'text-black',
      shadow: '3px 3px 0px 0px #000',
    };
  };

  const markerStyle = getMarkerStyle();

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: showTooltip ? 30 : (isSelected ? 20 : 10),
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleTap}
      onDoubleClick={handleDoubleClick}
    >
      {/* Marker with dynamic sizing and Neo Brutalist style */}
      <div
        className={`
          flex items-center justify-center font-black transition-all duration-200
          ${markerStyle.bg} ${markerStyle.textColor}
          ${isSelected ? `marker-pop-in ${isHighlighted ? 'marker-pulse' : ''}` : ''}
          ${isCompleted ? 'opacity-60' : ''}
        `}
        style={{
          width: `${isSelected ? selectedSize : unselectedSize}px`,
          height: `${isSelected ? selectedSize : unselectedSize}px`,
          fontSize: `${isSelected ? fontSize : 10}px`,
          animationDelay: isSelected ? `${animationDelay}ms` : '0ms',
          border: isSelected ? `${borderWidth}px solid #000` : '2px solid #000',
          boxShadow: markerStyle.shadow,
        }}
      >
        {isSelected && (isCompleted ? '✓' : selectedTrack?.order)}
      </div>

      {/* Tooltip - Neo Brutalist style */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-white text-black text-sm whitespace-nowrap z-50 pointer-events-none border-3 border-black"
          style={{ minWidth: '150px', textAlign: 'center', boxShadow: '4px 4px 0px 0px #000' }}
        >
          <div className="font-black uppercase">{track.name}</div>
          <div className="flex items-center justify-center gap-2 mt-1">
            {track.isNew ? (
              <span className="px-2 py-0.5 text-xs font-bold uppercase bg-green-400 text-black border border-black">NEW</span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-bold bg-blue-400 text-black border border-black">{track.origin}</span>
            )}
          </div>
          {isSelected && (
            <div className="mt-1 text-xs font-bold">
              {isCompleted ? '✓ Completed' : isNext ? '→ UP NEXT' : `Race #${selectedTrack?.order}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
