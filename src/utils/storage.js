// @module StorageUtils - LocalStorage wrapper with JSON serialization
// Local Storage utility for Journal entries
// Uses localStorage with JSON serialization

const STORAGE_KEYS = {
    ENTRIES: 'sarvjournal_entries',
    SETTINGS: 'sarvjournal_settings',
};

// Generate unique ID
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Journal Entries
// ============================================

export function getEntries() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading entries:', error);
        return [];
    }
}

export function saveEntry(entry) {
    try {
        const entries = getEntries();
        const newEntry = {
            ...entry,
            id: entry.id || generateId(),
            createdAt: entry.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const existingIndex = entries.findIndex(e => e.id === newEntry.id);

        if (existingIndex >= 0) {
            entries[existingIndex] = newEntry;
        } else {
            entries.unshift(newEntry);
        }

        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
        return newEntry;
    } catch (error) {
        console.error('Error saving entry:', error);
        throw error;
    }
}

export function getEntry(id) {
    const entries = getEntries();
    return entries.find(e => e.id === id) || null;
}

export function deleteEntry(id) {
    try {
        const entries = getEntries();
        const filtered = entries.filter(e => e.id !== id);
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error deleting entry:', error);
        throw error;
    }
}

// ============================================
// User Settings
// ============================================

const defaultSettings = {
    userName: '',
    createdAt: new Date().toISOString(),
};

export function getSettings() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch (error) {
        console.error('Error reading settings:', error);
        return defaultSettings;
    }
}

export function saveSettings(settings) {
    try {
        const current = getSettings();
        const updated = { ...current, ...settings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
        return updated;
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}

// ============================================
// Export Functions
// ============================================

export function exportToJSON() {
    const entries = getEntries();
    const settings = getSettings();
    const data = {
        exportedAt: new Date().toISOString(),
        settings,
        entries,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `sarvjournal-export-${formatDate(new Date())}.json`);
}

export function exportEntryToMarkdown(entry) {
    const content = `# ${entry.title}

**Date:** ${formatDateTime(entry.createdAt)}  
**Mood:** ${entry.mood}  
${entry.tags?.length ? `**Tags:** ${entry.tags.join(', ')}` : ''}

${entry.highlights?.length ? `## Highlights\n${entry.highlights.map(h => `- ${h}`).join('\n')}\n` : ''}
${entry.content ? `## Entry\n${entry.content}` : ''}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    downloadBlob(blob, `${entry.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`);
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// Utility Functions
// ============================================

export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function formatDateTime(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export function formatRelativeDate(date) {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return formatDate(date);
}

// Get entries for a specific date
export function getEntriesForDate(date) {
    const entries = getEntries();
    const targetDate = new Date(date).toDateString();
    return entries.filter(e => new Date(e.createdAt).toDateString() === targetDate);
}

// Get mood statistics
export function getMoodStats() {
    const entries = getEntries();
    const stats = {
        happy: 0,
        sad: 0,
        calm: 0,
        anxious: 0,
        total: entries.length,
    };

    entries.forEach(entry => {
        if (entry.mood && stats.hasOwnProperty(entry.mood)) {
            stats[entry.mood]++;
        }
    });

    return stats;
}
