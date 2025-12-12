import type { SelectedTrack } from '../data/tracks';

interface TrackListProps {
  selectedTracks: SelectedTrack[];
  onTrackHover: (trackId: number | null) => void;
  onCopyList: () => void;
}

export function TrackList({ selectedTracks, onTrackHover, onCopyList }: TrackListProps) {
  const sortedTracks = [...selectedTracks].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 h-full flex flex-col">
      <h2 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
        <span className="text-2xl">🏁</span>
        Race Order
      </h2>

      {selectedTracks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-center px-4">
          <div>
            <div className="text-4xl mb-2">🎲</div>
            <p>Press <strong>Generate</strong> to randomly select 16 tracks!</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {sortedTracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all track-item-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
                onMouseEnter={() => onTrackHover(track.id)}
                onMouseLeave={() => onTrackHover(null)}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-sm">
                  {track.order}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate text-sm">
                    {track.name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {track.isNew ? (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-green-500/80 text-white">
                        NEW
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-500/80 text-white truncate">
                        {track.origin}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onCopyList}
            className="mt-3 w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span>📋</span>
            Copy List
          </button>
        </>
      )}
    </div>
  );
}
