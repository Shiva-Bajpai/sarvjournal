// JournalContext - Global state management for journal entries and preferences
import { createContext, useContext, useReducer, useEffect } from 'react';
import * as storage from '../utils/storage';

// Initial State
const initialState = {
    entries: [],
    settings: {
        userName: '',
    },
    isLoading: true,
};

// Actions
const ACTIONS = {
    SET_ENTRIES: 'SET_ENTRIES',
    ADD_ENTRY: 'ADD_ENTRY',
    UPDATE_ENTRY: 'UPDATE_ENTRY',
    DELETE_ENTRY: 'DELETE_ENTRY',
    SET_SETTINGS: 'SET_SETTINGS',
    SET_LOADING: 'SET_LOADING',
};

// Reducer
function journalReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_ENTRIES:
            return { ...state, entries: action.payload };

        case ACTIONS.ADD_ENTRY:
            return { ...state, entries: [action.payload, ...state.entries] };

        case ACTIONS.UPDATE_ENTRY:
            return {
                ...state,
                entries: state.entries.map(e =>
                    e.id === action.payload.id ? action.payload : e
                ),
            };

        case ACTIONS.DELETE_ENTRY:
            return {
                ...state,
                entries: state.entries.filter(e => e.id !== action.payload),
            };

        case ACTIONS.SET_SETTINGS:
            return { ...state, settings: { ...state.settings, ...action.payload } };

        case ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };

        default:
            return state;
    }
}

// Context
const JournalContext = createContext(null);

// Provider
export function JournalProvider({ children }) {
    const [state, dispatch] = useReducer(journalReducer, initialState);

    // Load data on mount
    useEffect(() => {
        const entries = storage.getEntries();
        const settings = storage.getSettings();

        dispatch({ type: ACTIONS.SET_ENTRIES, payload: entries });
        dispatch({ type: ACTIONS.SET_SETTINGS, payload: settings });
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }, []);

    // Actions
    const addEntry = (entry) => {
        const saved = storage.saveEntry(entry);
        dispatch({ type: ACTIONS.ADD_ENTRY, payload: saved });
        return saved;
    };

    const updateEntry = (entry) => {
        const saved = storage.saveEntry(entry);
        dispatch({ type: ACTIONS.UPDATE_ENTRY, payload: saved });
        return saved;
    };

    const deleteEntry = (id) => {
        storage.deleteEntry(id);
        dispatch({ type: ACTIONS.DELETE_ENTRY, payload: id });
    };

    const updateSettings = (settings) => {
        const saved = storage.saveSettings(settings);
        dispatch({ type: ACTIONS.SET_SETTINGS, payload: saved });
        return saved;
    };

    const getEntry = (id) => {
        return state.entries.find(e => e.id === id) || null;
    };

    const getEntriesForDate = (date) => {
        const targetDate = new Date(date).toDateString();
        return state.entries.filter(e => new Date(e.createdAt).toDateString() === targetDate);
    };

    const getMoodStats = () => {
        const stats = {
            happy: 0,
            sad: 0,
            calm: 0,
            anxious: 0,
            total: state.entries.length,
        };

        state.entries.forEach(entry => {
            if (entry.mood && stats.hasOwnProperty(entry.mood)) {
                stats[entry.mood]++;
            }
        });

        return stats;
    };

    const value = {
        ...state,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntry,
        getEntriesForDate,
        getMoodStats,
        updateSettings,
        exportData: storage.exportToJSON,
        exportEntry: storage.exportEntryToMarkdown,
    };

    return (
        <JournalContext.Provider value={value}>
            {children}
        </JournalContext.Provider>
    );
}

// Hook
export function useJournal() {
    const context = useContext(JournalContext);
    if (!context) {
        throw new Error('useJournal must be used within a JournalProvider');
    }
    return context;
}
