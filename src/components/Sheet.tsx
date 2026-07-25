import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface SheetProps {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Shared modal shell. Flat ink panel — no glass, no blur. */
export const Sheet: React.FC<SheetProps> = ({ title, onClose, children, footer }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    if (!onClose) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
      onMouseDown={(e) => {
        if (onClose && !panelRef.current?.contains(e.target as Node)) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        className="flex max-h-[88vh] w-full max-w-sm flex-col rounded-sharp border border-rule bg-raise"
      >
        <header className="flex items-center justify-between border-b border-rule px-4 py-3">
          <h2 className="wordmark text-2xl text-chalk">{title}</h2>
          {onClose && (
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="p-1 text-dim transition-colors hover:text-chalk"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          )}
        </header>

        <div className="hide-scrollbar flex-1 overflow-y-auto px-4 py-4">{children}</div>

        {footer && <div className="border-t border-rule p-4">{footer}</div>}
      </motion.div>
    </div>
  );
};

interface SheetButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'quiet' | 'danger';
  className?: string;
}

const BUTTON_STYLES = {
  primary: 'bg-chalk text-ink hover:opacity-90',
  quiet: 'border border-rule text-chalk hover:bg-key',
  danger: 'border border-strike/50 text-strike hover:bg-strike/10',
} as const;

export const SheetButton: React.FC<SheetButtonProps> = ({
  onClick,
  children,
  variant = 'quiet',
  className = '',
}) => (
  <button
    onClick={onClick}
    className={`w-full rounded-sharp px-4 py-3 text-sm font-medium transition ${BUTTON_STYLES[variant]} ${className}`}
  >
    {children}
  </button>
);
