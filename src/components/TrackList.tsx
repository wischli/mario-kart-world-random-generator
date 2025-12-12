import type { SelectedTrack } from '../data/tracks';

type Theme = 'light' | 'dark' | 'system';

interface TrackListProps {
  selectedTracks: SelectedTrack[];
  onTrackHover: (trackId: number | null) => void;
  onCopyList: () => void;
  completedOrders: Set<number>;
  nextTrackOrder: number | null;
  onToggleComplete: (order: number) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const themeIcons: Record<Theme, string> = {
  light: '☀️',
  dark: '🌙',
  system: '💻',
};

const themeLabels: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'Auto',
};

export function TrackList({ selectedTracks, onTrackHover, onCopyList, completedOrders, nextTrackOrder, onToggleComplete, theme, onToggleTheme }: TrackListProps) {
  const sortedTracks = [...selectedTracks].sort((a, b) => a.order - b.order);

  return (
    <div
      className="panel-bg p-3 sm:p-4 h-full flex flex-col border-3 border-black"
      style={{ boxShadow: '6px 6px 0px 0px #000' }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3 border-b-3 border-black pb-2">
        <h2 className="text-base sm:text-lg font-black uppercase panel-text flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🏁</span>
          Race Order
        </h2>
        <div className="flex items-center gap-2">
          {selectedTracks.length > 0 && (
            <span className="text-xs font-bold text-black bg-yellow-400 px-2 py-0.5 border-2 border-black">
              {completedOrders.size}/{selectedTracks.length}
            </span>
          )}
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 border-2 border-black text-sm transition-transform active:translate-x-0.5 active:translate-y-0.5"
            style={{ boxShadow: '2px 2px 0px 0px #000' }}
            title={`Theme: ${themeLabels[theme]}`}
          >
            {themeIcons[theme]}
          </button>
        </div>
      </div>

      {selectedTracks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center panel-text-muted text-center px-4 py-8 sm:py-4">
          <div>
            <div className="text-3xl sm:text-4xl mb-2">🎲</div>
            <p className="text-sm sm:text-base font-bold">Tap <span className="panel-text">GENERATE</span> to randomly select 16 tracks!</p>
          </div>
        </div>
      ) : (
        <>
          {/* Grid layout on mobile for more compact display */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-1 gap-1.5 sm:gap-1 pr-1">
            {sortedTracks.map((track, index) => {
              const isCompleted = completedOrders.has(track.order);
              const isNext = track.order === nextTrackOrder;

              // Determine badge color based on state
              const getBadgeColor = () => {
                if (isCompleted) return 'bg-red-500';
                if (isNext) return 'bg-green-500';
                return 'bg-yellow-400';
              };

              return (
                <div
                  key={track.id}
                  className={`flex items-center gap-2 sm:gap-3 p-2 cursor-pointer transition-all track-item-fade-in min-h-[44px] border-2 border-black
                    ${isNext ? 'track-item-next' : 'track-item-default'}
                    ${isCompleted ? 'opacity-50 track-item-completed' : ''}
                  `}
                  style={{
                    animationDelay: `${index * 30}ms`,
                    boxShadow: isNext ? '3px 3px 0px 0px #000' : '2px 2px 0px 0px #000',
                  }}
                  onMouseEnter={() => onTrackHover(track.id)}
                  onMouseLeave={() => onTrackHover(null)}
                  onClick={() => onToggleComplete(track.order)}
                >
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 ${getBadgeColor()} ${isCompleted ? 'text-white' : 'text-black'} font-black flex items-center justify-center text-xs sm:text-sm border-2 border-black`}>
                    {isCompleted ? '✓' : track.order}
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <div className={`font-bold truncate text-sm flex-1 ${isCompleted ? 'line-through panel-text-muted' : 'panel-text'}`}>
                      {track.name}
                    </div>
                    {isNext && (
                      <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-black uppercase bg-green-500 text-white border-2 border-black animate-pulse">
                        NEXT
                      </span>
                    )}
                    {!isNext && (track.isNew ? (
                      <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-bold uppercase bg-green-400 text-black border border-black">
                        NEW
                      </span>
                    ) : (
                      <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-blue-400 text-black border border-black max-w-[80px] truncate hidden sm:block">
                        {track.origin}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onCopyList}
            className="mt-3 w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-black uppercase border-3 border-black transition-transform active:translate-x-1 active:translate-y-1 flex items-center justify-center gap-2 min-h-[44px]"
            style={{ boxShadow: '4px 4px 0px 0px #000' }}
          >
            <span>📋</span>
            Copy List
          </button>
        </>
      )}
    </div>
  );
}
