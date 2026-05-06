import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md';
}

export function Modal({ open, onClose, title, children, footer, size = 'sm' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className={cn(
          'border border-border-strong bg-surface',
          size === 'sm' ? 'w-[420px]' : 'w-[560px]',
        )}
        style={{ boxShadow: 'var(--shadow-modal)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="text-sm font-semibold uppercase tracking-label">{title}</span>
          <button
            onClick={onClose}
            className="text-text-subtle hover:text-text"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-4 py-4 text-sm text-text">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-border px-4 py-2.5">{footer}</div>
        )}
      </div>
    </div>
  );
}
