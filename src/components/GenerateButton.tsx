interface GenerateButtonProps {
  onGenerate: () => void;
  onReset: () => void;
  hasSelection: boolean;
}

export function GenerateButton({ onGenerate, onReset, hasSelection }: GenerateButtonProps) {
  return (
    <div className="flex gap-3 flex-shrink-0">
      <button
        onClick={onGenerate}
        className="px-4 sm:px-5 py-2 sm:py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase text-sm sm:text-base border-3 border-black transition-transform active:translate-x-1 active:translate-y-1 flex items-center gap-2"
        style={{
          boxShadow: '4px 4px 0px 0px #000',
        }}
      >
        <span className="text-lg sm:text-xl">🎲</span>
        <span>{hasSelection ? 'Re-roll' : 'Generate'}</span>
      </button>

      {hasSelection && (
        <button
          onClick={onReset}
          className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-gray-100 text-black font-black uppercase text-sm sm:text-base border-3 border-black transition-transform active:translate-x-1 active:translate-y-1"
          style={{
            boxShadow: '4px 4px 0px 0px #000',
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
}
