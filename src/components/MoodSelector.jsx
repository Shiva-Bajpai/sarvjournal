import { useState } from 'react';
import BottomSheet from './BottomSheet';
import './MoodSelector.css';

const MOODS = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'calm', emoji: '😌', label: 'Calm' },
    { value: 'anxious', emoji: '😰', label: 'Anxious' },
];

export default function MoodSelector({ value, onChange, className = '' }) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedMood = MOODS.find(m => m.value === value);

    const handleSelect = (mood) => {
        onChange(mood.value);
        setIsOpen(false);
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                type="button"
                aria-label="Select your mood" className={`mood-display ${!selectedMood ? 'mood-display--placeholder' : ''} ${className}`}
                onClick={() => setIsOpen(true)}
            >
                <span className="mood-display__emoji">
                    {selectedMood?.emoji || '🙂'}
                </span>
                <span className="mood-display__label">
                    {selectedMood?.label || 'Select mood'}
                </span>
                <svg className="mood-display__icon" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {/* Bottom Sheet */}
            <BottomSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="How are you feeling?"
            >
                <div className="mood-selector">
                    {MOODS.map((mood) => (
                        <button
                            key={mood.value}
                            type="button"
                            className={`mood-option mood-option--${mood.value} ${value === mood.value ? 'mood-option--selected' : ''}`}
                            onClick={() => handleSelect(mood)}
                        >
                            <span className="mood-option__emoji">{mood.emoji}</span>
                            <span className="mood-option__label">{mood.label}</span>
                        </button>
                    ))}
                </div>
            </BottomSheet>
        </>
    );
}

// Simple inline mood display (read-only)
export function MoodBadge({ mood, className = '' }) {
    const moodData = MOODS.find(m => m.value === mood);

    if (!moodData) return null;

    return (
        <span className={`card__mood card__mood--${mood} ${className}`}>
            <span>{moodData.emoji}</span>
            <span>{moodData.label}</span>
        </span>
    );
}

export { MOODS };
