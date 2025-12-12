interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Yes, do it!',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      confirmBg: 'bg-red-500 hover:bg-red-400',
      icon: '⚠️',
    },
    warning: {
      confirmBg: 'bg-yellow-400 hover:bg-yellow-300',
      icon: '🏁',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onCancel}
      />

      {/* Modal - Neo Brutalist style */}
      <div
        className="relative bg-white text-black w-full max-w-md border-4 border-black"
        style={{
          boxShadow: '8px 8px 0px 0px #000',
        }}
      >
        {/* Header */}
        <div className="bg-yellow-400 border-b-4 border-black px-6 py-4">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="text-2xl">{styles.icon}</span>
            {title}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 py-5 bg-white">
          <p className="text-base font-bold leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-100 border-t-4 border-black flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 font-black uppercase text-sm bg-white border-3 border-black hover:bg-gray-100 transition-transform active:translate-x-1 active:translate-y-1"
            style={{
              boxShadow: '4px 4px 0px 0px #000',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 font-black uppercase text-sm text-black border-3 border-black transition-transform active:translate-x-1 active:translate-y-1 ${styles.confirmBg}`}
            style={{
              boxShadow: '4px 4px 0px 0px #000',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
