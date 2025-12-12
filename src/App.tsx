import { useState, useEffect, useCallback } from 'react';
import { TRACKS, type SelectedTrack } from './data/tracks';
import { selectRandomTracks, encodeSelection, decodeSelection, formatTrackListForClipboard } from './utils/randomizer';
import { WorldMap } from './components/WorldMap';
import { TrackList } from './components/TrackList';
import { GenerateButton } from './components/GenerateButton';

function App() {
  const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>([]);
  const [highlightedTrackId, setHighlightedTrackId] = useState<number | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Load selection from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('s');
    if (encoded) {
      const decoded = decodeSelection(encoded, TRACKS);
      if (decoded) {
        setSelectedTracks(decoded);
      }
    }
  }, []);

  // Update URL when selection changes
  useEffect(() => {
    if (selectedTracks.length > 0) {
      const encoded = encodeSelection(selectedTracks);
      const newUrl = `${window.location.pathname}?s=${encoded}`;
      window.history.replaceState(null, '', newUrl);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [selectedTracks]);

  const handleGenerate = useCallback(() => {
    const selected = selectRandomTracks(TRACKS, 16);
    setSelectedTracks(selected);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedTracks([]);
  }, []);

  const handleCopyList = useCallback(async () => {
    const text = formatTrackListForClipboard(selectedTracks);
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [selectedTracks]);

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl">🎮</span>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Mario Kart World
              </h1>
              <p className="text-sm text-gray-400">Random Track Generator</p>
            </div>
          </div>
          <GenerateButton
            onGenerate={handleGenerate}
            onReset={handleReset}
            hasSelection={selectedTracks.length > 0}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Map section */}
          <div className="flex-1 min-w-0">
            <WorldMap
              selectedTracks={selectedTracks}
              highlightedTrackId={highlightedTrackId}
            />
          </div>

          {/* Track list sidebar */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
              <TrackList
                selectedTracks={selectedTracks}
                onTrackHover={setHighlightedTrackId}
                onCopyList={handleCopyList}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Copy feedback toast */}
      {copyFeedback && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg animate-pulse z-50">
          Track list copied to clipboard!
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-8 text-center text-gray-500 text-sm">
        <p>
          Select 16 random tracks for your VS race!
          {selectedTracks.length > 0 && (
            <span className="ml-2">
              Share this selection by copying the URL.
            </span>
          )}
        </p>
      </footer>
    </div>
  );
}

export default App;
