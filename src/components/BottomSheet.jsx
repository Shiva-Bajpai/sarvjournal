import { useEffect } from 'react';
import './BottomSheet.css';

export default function BottomSheet({
    isOpen,
    onClose,
    title,
    children,
    showHandle = true,
}) {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('sheet-open');
        } else {
            document.body.classList.remove('sheet-open');
        }

        return () => {
            document.body.classList.remove('sheet-open');
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`bottom-sheet-overlay ${isOpen ? 'bottom-sheet-overlay--open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sheet */}
            <div
                className={`bottom-sheet ${isOpen ? 'bottom-sheet--open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'bottom-sheet-title' : undefined}
            >
                {showHandle && (
                    <div className="bottom-sheet__handle">
                        <div className="bottom-sheet__handle-bar" />
                    </div>
                )}

                {title && (
                    <div className="bottom-sheet__header">
                        <h2 id="bottom-sheet-title" className="bottom-sheet__title">
                            {title}
                        </h2>
                        <button
                            className="bottom-sheet__close"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M15 5L5 15M5 5L15 15"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="bottom-sheet__content">
                    {children}
                </div>
            </div>
        </>
    );
}
