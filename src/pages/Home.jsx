// Home Page - Main dashboard with greeting and quick stats
import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import { Card, CardHeader, CardTitle, BottomSheet, Button, DateSelector } from '../components';
import { MoodBadge } from '../components/MoodSelector';
import { formatRelativeDate } from '../utils/storage';
import './Home.css';

// Inspirational quotes
const QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Write it on your heart that every day is the best day in the year.", author: "Ralph Waldo Emerson" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
];

export default function Home() {
    const navigate = useNavigate();
    const { entries, settings, updateSettings } = useJournal();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(settings.userName || '');

    // Get today's quote (based on day of year)
    const todayQuote = useMemo(() => {
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        return QUOTES[dayOfYear % QUOTES.length];
    }, []);

    // Get date with entries
    const datesWithEntries = useMemo(() => {
        return entries.map(e => new Date(e.createdAt));
    }, [entries]);

    // Recent entries (last 5)
    const recentEntries = useMemo(() => {
        return entries.slice(0, 5);
    }, [entries]);

    // Format today's date
    const todayFormatted = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    // Handle name save
    const handleSaveName = () => {
        updateSettings({ userName: nameInput.trim() });
        setIsEditingName(false);
    };

    // Quick action handlers
    const handleQuickAction = (type) => {
        navigate('/new', { state: { quickAction: type } });
    };

    const greeting = settings.userName ? `Hi, ${settings.userName}` : 'Hi there';

    return (
        <div className="home">
            {/* Greeting */}
            <section className="home__greeting fade-in">
                <h1 className="home__greeting-text">
                    {settings.userName ? (
                        <>
                            Hi, <span
                                className="home__greeting-name"
                                onClick={() => setIsEditingName(true)}
                            >
                                {settings.userName}
                            </span>
                        </>
                    ) : (
                        <span
                            className="home__greeting-name"
                            onClick={() => setIsEditingName(true)}
                        >
                            Tap to add your name
                        </span>
                    )}
                </h1>
                <p className="home__date">{todayFormatted}</p>
            </section>

            {/* Date Selector */}
            <section className="fade-in" style={{ animationDelay: '50ms' }}>
                <DateSelector
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                    datesWithEntries={datesWithEntries}
                />
            </section>

            {/* Daily Reflection Card */}
            <section className="fade-in" style={{ animationDelay: '100ms' }}>
                <Card className="reflection-card" size="lg">
                    <CardHeader icon={
                        <div className="reflection-card__icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                        </div>
                    }>
                        <CardTitle subtitle="Daily Reflection">Today's Thought</CardTitle>
                    </CardHeader>
                    <p className="reflection-card__quote">"{todayQuote.text}"</p>
                    <p className="reflection-card__author">— {todayQuote.author}</p>
                </Card>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions fade-in" style={{ animationDelay: '150ms' }}>
                <h2 className="quick-actions__title">Quick Journal</h2>
                <div className="quick-actions__grid">
                    <button className="quick-action" onClick={() => handleQuickAction('reflect')}>
                        <span className="quick-action__icon quick-action__icon--reflect">🧘</span>
                        <span className="quick-action__label">Pause & Reflect</span>
                    </button>
                    <button className="quick-action" onClick={() => handleQuickAction('intention')}>
                        <span className="quick-action__icon quick-action__icon--intention">🎯</span>
                        <span className="quick-action__label">Set Intention</span>
                    </button>
                    <button className="quick-action" onClick={() => handleQuickAction('win')}>
                        <span className="quick-action__icon quick-action__icon--win">✨</span>
                        <span className="quick-action__label">One Small Win</span>
                    </button>
                </div>
            </section>

            {/* Recent Entries */}
            <section className="recent-entries fade-in" style={{ animationDelay: '200ms' }}>
                <div className="recent-entries__header">
                    <h2 className="recent-entries__title">Recent Entries</h2>
                    {entries.length > 0 && (
                        <Link to="/journal" className="recent-entries__see-all">See all</Link>
                    )}
                </div>

                {recentEntries.length > 0 ? (
                    <div className="recent-entries__list">
                        {recentEntries.map((entry, index) => (
                            <Link
                                key={entry.id}
                                to={`/entry/${entry.id}`}
                                className="entry-card"
                                style={{ animationDelay: `${250 + index * 50}ms` }}
                            >
                                <Card interactive className="fade-in">
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
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">📝</div>
                        <h3 className="empty-state__title">No entries yet</h3>
                        <p className="empty-state__text">
                            Start your journaling journey by writing your first entry.
                        </p>
                    </div>
                )}
            </section>

            {/* Name Edit Bottom Sheet */}
            <BottomSheet
                isOpen={isEditingName}
                onClose={() => setIsEditingName(false)}
                title="What's your name?"
            >
                <div className="name-edit">
                    <input
                        type="text"
                        className="name-edit__input"
                        placeholder="Enter your name"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        autoFocus
                    />
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={handleSaveName}
                    >
                        Save
                    </Button>
                </div>
            </BottomSheet>
        </div>
    );
}
