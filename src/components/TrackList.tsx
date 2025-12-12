import type { SelectedTrack } from '../data/tracks';

interface TrackListProps {
  selectedTracks: SelectedTrack[];
  onTrackHover: (trackId: number | null) => void;
  onCopyList: () => void;
  completedOrders: Set<number>;
  nextTrackOrder: number | null;
  onToggleComplete: (order: number) => void;
}

export function TrackList({ selectedTracks, onTrackHover, onCopyList, completedOrders, nextTrackOrder, onToggleComplete }: TrackListProps) {
  const sortedTracks = [...selectedTracks].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 h-full flex flex-col">
      <h2 className="text-base sm:text-lg font-bold text-yellow-400 mb-2 sm:mb-3 flex items-center gap-2">
        <span className="text-xl sm:text-2xl">🏁</span>
        Race Order
        {selectedTracks.length > 0 && (
          <span className="text-xs font-normal text-gray-400 ml-auto">
            {completedOrders.size}/{selectedTracks.length} done
          </span>
        )}
      </h2>

      {selectedTracks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-center px-4 py-8 sm:py-4">
          <div>
            <div className="text-3xl sm:text-4xl mb-2">🎲</div>
            <p className="text-sm sm:text-base">Tap <strong>Generate</strong> to randomly select 16 tracks!</p>
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
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-2 rounded-lg cursor-pointer transition-all track-item-fade-in min-h-[44px]
                    ${isNext ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-white/5 hover:bg-white/10'}
                    ${isCompleted ? 'opacity-60' : ''}
                  `}
                  style={{ animationDelay: `${index * 30}ms` }}
                  onMouseEnter={() => onTrackHover(track.id)}
                  onMouseLeave={() => onTrackHover(null)}
                  onClick={() => onToggleComplete(track.order)}
                >
                  <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full ${getBadgeColor()} ${isCompleted ? 'text-white' : 'text-black'} font-bold flex items-center justify-center text-xs sm:text-sm`}>
                    {isCompleted ? '✓' : track.order}
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <div className={`font-medium truncate text-sm flex-1 ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                      {track.name}
                    </div>
                    {isNext && (
                      <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] rounded bg-green-500 text-white animate-pulse">
                        NEXT
                      </span>
                    )}
                    {!isNext && (track.isNew ? (
                      <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] rounded bg-green-500/80 text-white">
                        NEW
                      </span>
                    ) : (
                      <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] rounded bg-blue-500/80 text-white max-w-[80px] truncate hidden sm:block">
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
            className="mt-2 sm:mt-3 w-full py-2.5 sm:py-2 px-4 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>📋</span>
            Copy List
          </button>
        </>
      )}
    </div>
  );
}
