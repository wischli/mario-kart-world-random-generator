interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal - Neo Brutalist style */}
      <div
        className="relative bg-white text-black w-full max-w-lg max-h-[90vh] overflow-hidden border-4 border-black flex flex-col"
        style={{
          boxShadow: '8px 8px 0px 0px #000',
        }}
      >
        {/* Header */}
        <div className="bg-blue-400 border-b-4 border-black px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="text-2xl">❓</span>
            How to Use
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black font-black text-lg hover:bg-gray-100 transition-transform active:translate-x-0.5 active:translate-y-0.5"
            style={{ boxShadow: '2px 2px 0px 0px #000' }}
          >
            ✕
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="px-6 py-5 bg-white overflow-y-auto flex-1">
          {/* Getting Started */}
          <Section icon="🎲" title="Getting Started">
            <p>Select the number of tracks from the dropdown, then hit <strong>Generate</strong> to create a random track selection for your VS race!</p>
          </Section>

          {/* Map */}
          <Section icon="🗺️" title="World Map">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Click</strong> a marker to see track info</li>
              <li><strong>Double-click</strong> to mark as completed</li>
              <li>Use the <strong>Size slider</strong> below the map to adjust marker size</li>
            </ul>
          </Section>

          {/* Track List */}
          <Section icon="📋" title="Track List">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Click</strong> any track to toggle completion</li>
              <li>Tracks are ordered 1 to N for your race sequence</li>
              <li>Progress is shown in the header (e.g., "3/16")</li>
            </ul>
          </Section>

          {/* Color Legend */}
          <Section icon="🎨" title="Color Legend">
            <div className="flex flex-wrap gap-3 mt-2">
              <ColorBadge color="bg-yellow-400" label="Pending" />
              <ColorBadge color="bg-green-500" label="Up Next" />
              <ColorBadge color="bg-red-500" label="Completed" />
            </div>
          </Section>

          {/* Controls */}
          <Section icon="🎛️" title="Controls">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Re-roll</strong> — Generate new random tracks</li>
              <li><strong>Reset</strong> — Clear selection (appears after generating)</li>
              <li><strong>Theme toggle</strong> — Switch light/dark mode (☀️/🌙/💻)</li>
              <li><strong>Copy List</strong> — Copy track list to clipboard</li>
            </ul>
          </Section>

          {/* Tips */}
          <Section icon="💡" title="Tips" isLast>
            <ul className="list-disc list-inside space-y-1">
              <li>Your progress <strong>saves automatically</strong> — refresh anytime!</li>
              <li>The URL updates with your selection — <strong>share it</strong> with friends!</li>
              <li>Re-rolling with progress will ask for confirmation</li>
            </ul>
          </Section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-100 border-t-4 border-black flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-5 py-2.5 font-black uppercase text-sm bg-yellow-400 border-3 border-black hover:bg-yellow-300 transition-transform active:translate-x-1 active:translate-y-1"
            style={{
              boxShadow: '4px 4px 0px 0px #000',
            }}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children, isLast = false }: { icon: string; title: string; children: React.ReactNode; isLast?: boolean }) {
  return (
    <div className={isLast ? '' : 'mb-5 pb-5 border-b-2 border-gray-200'}>
      <h3 className="font-black uppercase text-sm flex items-center gap-2 mb-2">
        <span>{icon}</span>
        {title}
      </h3>
      <div className="text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function ColorBadge({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 ${color} border-2 border-black`} />
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
}
