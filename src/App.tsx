import { useState, useEffect, useCallback } from 'react';
import { TRACKS, type SelectedTrack } from './data/tracks';
import { selectRandomTracks, encodeSelection, decodeSelection, formatTrackListForClipboard } from './utils/randomizer';
import { WorldMap } from './components/WorldMap';
import { TrackList } from './components/TrackList';
import { GenerateButton } from './components/GenerateButton';

const STORAGE_KEYS = {
  TRACKS: 'mkw-selected-tracks',
  COMPLETED: 'mkw-completed-orders',
  MARKER_SIZE: 'mkw-marker-size',
};

function App() {
  const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>([]);
  const [highlightedTrackId, setHighlightedTrackId] = useState<number | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [markerSize, setMarkerSize] = useState(70); // percentage: 50-100
  const [completedOrders, setCompletedOrders] = useState<Set<number>>(new Set()); // track completion by order number
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage or URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlEncoded = params.get('s');
    const savedTracks = localStorage.getItem(STORAGE_KEYS.TRACKS);
    const savedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED);
    const savedSize = localStorage.getItem(STORAGE_KEYS.MARKER_SIZE);

    // Determine if this is a shared link (URL differs from localStorage)
    const isSharedLink = urlEncoded && urlEncoded !== savedTracks;

    try {
      // Load marker size from localStorage (always)
      if (savedSize) {
        setMarkerSize(Number(savedSize));
      }

      if (isSharedLink) {
        // This is a shared link - use URL and start fresh
        const decoded = decodeSelection(urlEncoded, TRACKS);
        if (decoded) {
          setSelectedTracks(decoded);
          setCompletedOrders(new Set());
        }
      } else {
        // Same session or no URL - restore from localStorage
        if (savedTracks) {
          const decoded = decodeSelection(savedTracks, TRACKS);
          if (decoded) {
            setSelectedTracks(decoded);
          }
        }

        if (savedCompleted) {
          const completedArray = JSON.parse(savedCompleted) as number[];
          setCompletedOrders(new Set(completedArray));
        }
      }
    } catch (err) {
      console.error('Failed to load state:', err);
    }

    setIsLoaded(true);
  }, []);

  // Save selectedTracks to localStorage when it changes
  useEffect(() => {
    if (!isLoaded) return;

    if (selectedTracks.length > 0) {
      const encoded = encodeSelection(selectedTracks);
      localStorage.setItem(STORAGE_KEYS.TRACKS, encoded);
      // Also update URL for sharing
      const newUrl = `${window.location.pathname}?s=${encoded}`;
      window.history.replaceState(null, '', newUrl);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TRACKS);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [selectedTracks, isLoaded]);

  // Save completedOrders to localStorage when it changes
  useEffect(() => {
    if (!isLoaded) return;

    if (completedOrders.size > 0) {
      localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify([...completedOrders]));
    } else {
      localStorage.removeItem(STORAGE_KEYS.COMPLETED);
    }
  }, [completedOrders, isLoaded]);

  // Save markerSize to localStorage when it changes
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.MARKER_SIZE, String(markerSize));
  }, [markerSize, isLoaded]);

  const handleGenerate = useCallback(() => {
    // Show confirmation if there's progress
    if (completedOrders.size > 0) {
      const confirmed = window.confirm(
        `You have completed ${completedOrders.size} of ${selectedTracks.length} tracks.\n\nAre you sure you want to generate a new selection? Your progress will be lost.`
      );
      if (!confirmed) return;
    }

    const selected = selectRandomTracks(TRACKS, 16);
    setSelectedTracks(selected);
    setCompletedOrders(new Set());
  }, [completedOrders.size, selectedTracks.length]);

  const handleReset = useCallback(() => {
    // Show confirmation if there's progress
    if (completedOrders.size > 0) {
      const confirmed = window.confirm(
        `You have completed ${completedOrders.size} of ${selectedTracks.length} tracks.\n\nAre you sure you want to reset? Your progress will be lost.`
      );
      if (!confirmed) return;
    }

    setSelectedTracks([]);
    setCompletedOrders(new Set());
  }, [completedOrders.size, selectedTracks.length]);

  // Toggle track completion status
  const handleToggleComplete = useCallback((order: number) => {
    setCompletedOrders(prev => {
      const next = new Set(prev);
      if (next.has(order)) {
        next.delete(order);
      } else {
        next.add(order);
      }
      return next;
    });
  }, []);

  // Find the next uncompleted track (lowest order not in completedOrders)
  const nextTrackOrder = selectedTracks.length > 0
    ? Math.min(...selectedTracks
        .map(t => t.order)
        .filter(order => !completedOrders.has(order))) || null
    : null;

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
    <div className="min-h-screen min-h-dvh p-4 md:p-6">
      {/* Header - sticky on mobile for easy access to Generate button */}
      <header className="max-w-7xl mx-auto mb-4 md:mb-6 mobile-sticky-header">
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">🎮</span>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                Mario Kart World
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Random Track Generator</p>
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
              markerSize={markerSize}
              completedOrders={completedOrders}
              nextTrackOrder={nextTrackOrder}
              onToggleComplete={handleToggleComplete}
            />
            {/* Marker size slider */}
            <div className="mt-3 flex items-center gap-3 px-1">
              <span className="text-xs text-gray-400 flex-shrink-0">Size</span>
              <input
                type="range"
                min="40"
                max="100"
                value={markerSize}
                onChange={(e) => setMarkerSize(Number(e.target.value))}
                className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-yellow-400"
              />
              <span className="text-xs text-gray-400 w-8 text-right">{markerSize}%</span>
            </div>
          </div>

          {/* Track list sidebar */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
              <TrackList
                selectedTracks={selectedTracks}
                onTrackHover={setHighlightedTrackId}
                onCopyList={handleCopyList}
                completedOrders={completedOrders}
                nextTrackOrder={nextTrackOrder}
                onToggleComplete={handleToggleComplete}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Copy feedback toast - positioned above safe area */}
      {copyFeedback && (
        <div
          className="fixed left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg animate-pulse z-50"
          style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
        >
          Track list copied to clipboard!
        </div>
      )}

      {/* Footer - hidden on mobile to save space */}
      <footer className="max-w-7xl mx-auto mt-6 md:mt-8 text-center text-gray-500 text-xs sm:text-sm hidden sm:block">
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
