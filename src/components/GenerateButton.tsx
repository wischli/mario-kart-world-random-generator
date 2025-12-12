interface GenerateButtonProps {
  onGenerate: () => void;
  onReset: () => void;
  hasSelection: boolean;
}

export function GenerateButton({ onGenerate, onReset, hasSelection }: GenerateButtonProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onGenerate}
        className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-bold rounded-xl shadow-lg shadow-yellow-400/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <span className="text-xl">🎲</span>
        {hasSelection ? 'Re-roll' : 'Generate'}
      </button>

      {hasSelection && (
        <button
          onClick={onReset}
          className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95"
        >
          Reset
        </button>
      )}
    </div>
  );
}
