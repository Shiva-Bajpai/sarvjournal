// NewEntry - Create a new journal entry with mood and rich text
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import { TopHeader, Button, MoodSelector } from '../components';
import './NewEntry.css';

const QUICK_ACTIONS = {
    reflect: {
        icon: '🧘',
        title: 'Pause & Reflect',
        subtitle: 'Take a moment to check in with yourself',
        defaultTitle: 'Reflection',
        placeholder: 'What\'s on your mind right now? How are you feeling in this moment?'
    },
    intention: {
        icon: '🎯',
        title: 'Set Intention',
        subtitle: 'Define what matters today',
        defaultTitle: 'Today\'s Intention',
        placeholder: 'What do I want to focus on today? What would make today meaningful?'
    },
    win: {
        icon: '✨',
        title: 'One Small Win',
        subtitle: 'Celebrate a moment of progress',
        defaultTitle: 'A Small Win',
        placeholder: 'What\'s something good that happened today, no matter how small?'
    }
};

// Debounce helper
function useDebounce(callback, delay) {
    const timeoutRef = useRef(null);

    const debouncedFn = useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    return debouncedFn;
}

export default function NewEntry() {
    const navigate = useNavigate();
    const location = useLocation();
    const { addEntry, updateEntry } = useJournal();

    const quickAction = location.state?.quickAction;
    const quickActionData = quickAction ? QUICK_ACTIONS[quickAction] : null;

    const [entryId, setEntryId] = useState(null);
    const [title, setTitle] = useState(quickActionData?.defaultTitle || '');
    const [mood, setMood] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [highlights, setHighlights] = useState(['']);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    // Auto-save function
    const autoSave = useCallback(() => {
        if (!title.trim() && !content.trim()) return;

        const entryData = {
            id: entryId,
            title: title.trim() || 'Untitled',
            mood: mood || undefined,
            content: content.trim() || undefined,
            tags: tags.length > 0 ? tags : undefined,
            highlights: highlights.filter(h => h.trim()).length > 0
                ? highlights.filter(h => h.trim())
                : undefined,
        };

        if (entryId) {
            // Update existing entry
            updateEntry(entryData);
        } else {
            // Create new entry and store ID
            const saved = addEntry(entryData);
            setEntryId(saved.id);
        }

        setSaveStatus('Saved');
        setTimeout(() => setSaveStatus(''), 2000);
    }, [entryId, title, mood, content, tags, highlights, addEntry, updateEntry]);

    // Debounced auto-save (saves 1 second after stopping typing)
    const debouncedSave = useDebounce(autoSave, 1000);

    // Trigger auto-save when content changes
    useEffect(() => {
        if (title.trim() || content.trim()) {
            setSaveStatus('Saving...');
            debouncedSave();
        }
    }, [title, content, mood, tags, highlights, debouncedSave]);

    // Handle tag input
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput('');
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    // Handle highlights
    const updateHighlight = (index, value) => {
        const newHighlights = [...highlights];
        newHighlights[index] = value;
        setHighlights(newHighlights);
    };

    const addHighlight = () => {
        setHighlights([...highlights, '']);
    };

    const removeHighlight = (index) => {
        if (highlights.length === 1) {
            setHighlights(['']);
        } else {
            setHighlights(highlights.filter((_, i) => i !== index));
        }
    };

    // Manual save and navigate
    const handleDone = () => {
        autoSave();
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        navigate('/journal');
    };

    const hasContent = title.trim().length > 0 || content.trim().length > 0;

    return (
        <div className="new-entry">
            <TopHeader
                title="New Entry"
                actions={
                    saveStatus && (
                        <span className="save-status">
                            {saveStatus === 'Saving...' ? '⏳' : '✓'} {saveStatus}
                        </span>
                    )
                }
            />

            <form className="new-entry__form" onSubmit={(e) => e.preventDefault()}>
                {/* Quick Action Banner */}
                {quickActionData && (
                    <div className="quick-action-banner fade-in">
                        <span className="quick-action-banner__icon">{quickActionData.icon}</span>
                        <div className="quick-action-banner__text">
                            <div className="quick-action-banner__title">{quickActionData.title}</div>
                            <div className="quick-action-banner__subtitle">{quickActionData.subtitle}</div>
                        </div>
                    </div>
                )}

                {/* Title */}
                <div className="form-group fade-in">
                    <input
                        type="text"
                        className="title-input"
                        placeholder="Entry title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                </div>

                {/* Mood & Meta */}
                <div className="form-group fade-in" style={{ animationDelay: '50ms' }}>
                    <label className="form-label">Mood</label>
                    <div className="meta-row">
                        <MoodSelector value={mood} onChange={setMood} />
                    </div>
                </div>

                {/* Tags */}
                <div className="form-group fade-in" style={{ animationDelay: '100ms' }}>
                    <label className="form-label">Tags</label>
                    <div className="tags-input-wrapper">
                        {tags.map((tag, index) => (
                            <span key={index} className="tag-chip">
                                {tag}
                                <button
                                    type="button"
                                    className="tag-chip__remove"
                                    onClick={() => removeTag(tag)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            className="tags-input"
                            placeholder={tags.length ? '' : 'Add tags...'}
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                        />
                    </div>
                </div>

                {/* Highlights */}
                <div className="form-group fade-in" style={{ animationDelay: '150ms' }}>
                    <label className="form-label">Highlights</label>
                    <div className="highlights-list">
                        {highlights.map((highlight, index) => (
                            <div key={index} className="highlight-item">
                                <span className="highlight-bullet" />
                                <input
                                    type="text"
                                    className="highlight-input"
                                    placeholder="One thing that mattered..."
                                    value={highlight}
                                    onChange={(e) => updateHighlight(index, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="highlight-remove"
                                    onClick={() => removeHighlight(index)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <button type="button" className="add-highlight-btn" onClick={addHighlight}>
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Add highlight
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="form-group fade-in" style={{ animationDelay: '200ms' }}>
                    <label className="form-label">Write freely</label>
                    <textarea
                        className="content-textarea"
                        placeholder={quickActionData?.placeholder || "What's on your mind? Write freely. This stays with you."}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                    />
                </div>
            </form>

            {/* Done Button */}
            <div className="save-button-container">
                <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={handleDone}
                    disabled={!hasContent}
                >
                    Done
                </Button>
            </div>
        </div>
    );
}

