// @module Constants - App-wide constants for moods, emojis, and configuration
// App constants
export const APP_NAME = 'Sarv Journal';
export const APP_VERSION = '1.0.0';

export const MOODS = {
    happy: { emoji: '😊', label: 'Happy', color: '#E8B86D' },
    sad: { emoji: '😢', label: 'Sad', color: '#7B9EB8' },
    calm: { emoji: '😌', label: 'Calm', color: '#8FB89A' },
    anxious: { emoji: '😰', label: 'Anxious', color: '#C4A3C4' },
};

export const STORAGE_KEYS = {
    ENTRIES: 'sarvjournal_entries',
    SETTINGS: 'sarvjournal_settings',
};
