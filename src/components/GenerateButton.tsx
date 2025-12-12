interface GenerateButtonProps {
  onGenerate: () => void;
  onReset: () => void;
  hasSelection: boolean;
}

export function GenerateButton({ onGenerate, onReset, hasSelection }: GenerateButtonProps) {
  return (
    <div className="flex gap-2 flex-shrink-0">
      <button
        onClick={onGenerate}
        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-bold rounded-xl shadow-lg shadow-yellow-400/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
      >
        <span className="text-lg sm:text-xl">🎲</span>
        <span>{hasSelection ? 'Re-roll' : 'Generate'}</span>
      </button>

      {hasSelection && (
        <button
          onClick={onReset}
          className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          Reset
        </button>
      )}
    </div>
  );
}
