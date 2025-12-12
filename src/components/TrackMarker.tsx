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

  // Determine marker color based on state
  const getMarkerColors = () => {
    if (!selectedTrack) {
      return {
        bg: 'bg-gray-500/50 hover:bg-gray-400/70',
        shadow: '',
        textColor: 'text-white',
      };
    }
    if (isCompleted) {
      return {
        bg: 'bg-red-500',
        shadow: 'shadow-lg shadow-red-500/50',
        textColor: 'text-white',
      };
    }
    if (isNext) {
      return {
        bg: 'bg-green-500',
        shadow: 'shadow-lg shadow-green-500/50',
        textColor: 'text-white',
      };
    }
    return {
      bg: 'bg-yellow-400',
      shadow: 'shadow-lg shadow-yellow-400/50',
      textColor: 'text-black',
    };
  };

  const colors = getMarkerColors();

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
      {/* Marker with dynamic sizing and state-based colors */}
      <div
        className={`
          flex items-center justify-center rounded-full font-bold transition-all duration-200
          ${colors.bg} ${colors.textColor} ${colors.shadow}
          ${isSelected ? `marker-pop-in ${isHighlighted ? 'marker-pulse' : ''}` : ''}
          ${isCompleted ? 'opacity-70' : ''}
        `}
        style={{
          width: `${isSelected ? selectedSize : unselectedSize}px`,
          height: `${isSelected ? selectedSize : unselectedSize}px`,
          fontSize: `${isSelected ? fontSize : 10}px`,
          animationDelay: isSelected ? `${animationDelay}ms` : '0ms',
          border: isSelected ? `${borderWidth}px solid #fff` : '2px solid rgba(255,255,255,0.3)',
        }}
      >
        {isSelected && (isCompleted ? '✓' : selectedTrack?.order)}
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
