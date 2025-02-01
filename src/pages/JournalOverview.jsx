// JournalOverview - Browse and search all journal entries
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import { Card, Button } from '../components';
import { MoodBadge, MOODS } from '../components/MoodSelector';
import { formatRelativeDate } from '../utils/storage';
import './JournalOverview.css';

export default function JournalOverview() {
    const { entries, getMoodStats } = useJournal();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMood, setSelectedMood] = useState(null);

    const moodStats = useMemo(() => getMoodStats(), [entries]);

    // Filter entries
    const filteredEntries = useMemo(() => {
        let result = [...entries];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(e =>
                e.title.toLowerCase().includes(query) ||
                e.content?.toLowerCase().includes(query) ||
                e.tags?.some(t => t.toLowerCase().includes(query))
            );
        }

        if (selectedMood) {
            result = result.filter(e => e.mood === selectedMood);
        }

        return result;
    }, [entries, searchQuery, selectedMood]);

    // Max mood count for bar calculation
    const maxMoodCount = useMemo(() => {
        return Math.max(moodStats.happy, moodStats.sad, moodStats.calm, moodStats.anxious, 1);
    }, [moodStats]);

    return (
        <div className="journal-overview">
            {/* Header */}
            <header className="journal-overview__header fade-in">
                <h1 className="journal-overview__title">Journal</h1>
                <p className="journal-overview__subtitle">
                    {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </p>
            </header>

            {/* Stats */}
            {entries.length > 0 && (
                <section className="stats-section fade-in" style={{ animationDelay: '50ms' }}>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-card__value">{entries.length}</span>
                            <span className="stat-card__label">Total Entries</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-card__value">
                                {Math.ceil(entries.reduce((acc, e) => acc + (e.content?.length || 0), 0) / 200)}
                            </span>
                            <span className="stat-card__label">Minutes Written</span>
                        </div>
                    </div>
                </section>
            )}

            {/* Mood Distribution */}
            {entries.length > 0 && (
                <section className="mood-distribution fade-in" style={{ animationDelay: '100ms' }}>
                    <h2 className="mood-distribution__title">Mood Patterns</h2>
                    <div className="mood-bars">
                        {MOODS.map(mood => (
                            <div key={mood.value} className="mood-bar">
                                <div className="mood-bar__label">
                                    <span className="mood-bar__emoji">{mood.emoji}</span>
                                    <span>{mood.label}</span>
                                </div>
                                <div className="mood-bar__track">
                                    <div
                                        className={`mood-bar__fill mood-bar__fill--${mood.value}`}
                                        style={{ width: `${(moodStats[mood.value] / maxMoodCount) * 100}%` }}
                                    />
                                </div>
                                <span className="mood-bar__count">{moodStats[mood.value]}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* New Entry CTA */}
            <section className="fade-in" style={{ animationDelay: '150ms', marginBottom: 'var(--space-6)' }}>
                <Link to="/new" style={{ textDecoration: 'none' }}>
                    <Button variant="primary" fullWidth size="lg">
                        Create New Entry
                    </Button>
                </Link>
            </section>

            {/* Search & Filter */}
            {entries.length > 0 && (
                <section className="fade-in" style={{ animationDelay: '200ms' }}>
                    <div className="search-bar">
                        <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            className="search-bar__input"
                            placeholder="Search entries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-chips">
                        <button
                            className={`filter-chip ${!selectedMood ? 'filter-chip--active' : ''}`}
                            onClick={() => setSelectedMood(null)}
                        >
                            All
                        </button>
                        {MOODS.map(mood => (
                            <button
                                key={mood.value}
                                className={`filter-chip ${selectedMood === mood.value ? 'filter-chip--active' : ''}`}
                                onClick={() => setSelectedMood(selectedMood === mood.value ? null : mood.value)}
                            >
                                {mood.emoji} {mood.label}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Entries List */}
            <section className="entries-section fade-in" style={{ animationDelay: '250ms' }}>
                {filteredEntries.length > 0 ? (
                    <div className="entries-list">
                        {filteredEntries.map((entry, index) => (
                            <Link
                                key={entry.id}
                                to={`/entry/${entry.id}`}
                                className="entry-card"
                            >
                                <Card interactive>
                                    <div className="entry-card__header">
                                        <div>
                                            <h3 className="entry-card__title">{entry.title}</h3>
                                            {entry.content && (
                                                <p className="entry-card__preview">{entry.content}</p>
                                            )}
                                        </div>
                                        {entry.mood && <MoodBadge mood={entry.mood} />}
                                    </div>
                                    <div className="entry-card__footer">
                                        <span className="entry-card__date">
                                            {formatRelativeDate(entry.createdAt)}
                                        </span>
                                        {entry.tags?.length > 0 && (
                                            <>
                                                <span className="card__meta-dot" />
                                                <span className="entry-card__date">
                                                    {entry.tags.slice(0, 2).join(', ')}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : entries.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">📔</div>
                        <h3 className="empty-state__title">Start your journal</h3>
                        <p className="empty-state__text">
                            Write freely. This stays with you.
                        </p>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">🔍</div>
                        <h3 className="empty-state__title">No matches found</h3>
                        <p className="empty-state__text">
                            Try a different search term or filter.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
