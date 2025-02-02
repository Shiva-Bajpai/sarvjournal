// EntryDetail - View, edit and delete a journal entry
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import { TopHeader, Button, BottomSheet } from '../components';
import { MoodBadge } from '../components/MoodSelector';
import { formatDateTime } from '../utils/storage';
import './EntryDetail.css';

export default function EntryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getEntry, deleteEntry, exportEntry } = useJournal();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const entry = getEntry(id);

    if (!entry) {
        return (
            <div className="entry-detail">
                <TopHeader title="" />
                <div className="entry-not-found">
                    <span className="entry-not-found__icon">📝</span>
                    <h2 className="entry-not-found__title">Entry not found</h2>
                    <p className="entry-not-found__text">This entry may have been deleted.</p>
                    <Link to="/journal">
                        <Button variant="primary">Go to Journal</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            deleteEntry(id);
            navigate('/journal');
        } catch (error) {
            console.error('Error deleting entry:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleExport = () => {
        exportEntry(entry);
    };

    const handleShare = async () => {
        const shareText = `${entry.title}\n\n${entry.content || ''}\n\n— ${formatDateTime(entry.createdAt)}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: entry.title,
                    text: shareText,
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(shareText);
                // Could show a toast here
            } catch (error) {
                console.error('Error copying:', error);
            }
        }
    };

    return (
        <div className="entry-detail">
            <TopHeader
                title=""
                actions={
                    <button
                        className="top-header__action"
                        onClick={() => navigate(`/edit/${id}`)}
                        aria-label="Edit entry"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                }
            />

            <article className="entry-detail__content fade-in">
                {/* Header */}
                <header className="entry-detail__header">
                    <h1 className="entry-detail__title">{entry.title}</h1>
                    <div className="entry-detail__meta">
                        <span className="entry-detail__date">
                            {formatDateTime(entry.createdAt)}
                        </span>
                        {entry.mood && <MoodBadge mood={entry.mood} />}
                    </div>

                    {entry.tags?.length > 0 && (
                        <div className="entry-detail__tags">
                            {entry.tags.map((tag, index) => (
                                <span key={index} className="detail-tag">{tag}</span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Highlights */}
                {entry.highlights?.length > 0 && (
                    <section className="entry-detail__highlights fade-in" style={{ animationDelay: '100ms' }}>
                        <h2 className="highlights-title">Highlights</h2>
                        <div className="highlight-list">
                            {entry.highlights.map((highlight, index) => (
                                <div key={index} className="highlight-item-detail">
                                    <span className="highlight-item-detail__bullet" />
                                    <span className="highlight-item-detail__text">{highlight}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Content */}
                {entry.content && (
                    <section className="entry-detail__body fade-in" style={{ animationDelay: '150ms' }}>
                        <p className="entry-detail__body-text">{entry.content}</p>
                    </section>
                )}

                {/* Actions */}
                <footer className="entry-detail__actions fade-in" style={{ animationDelay: '200ms' }}>
                    <button className="action-btn" onClick={handleShare}>
                        <svg className="action-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        Share
                    </button>

                    <button className="action-btn" onClick={handleExport}>
                        <svg className="action-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7,10 12,15 17,10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export
                    </button>

                    <button
                        className="action-btn action-btn--danger"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <svg className="action-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                        Delete
                    </button>
                </footer>
            </article>

            {/* Delete Confirmation */}
            <BottomSheet
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Delete Entry"
            >
                <div className="delete-confirm">
                    <div className="delete-confirm__icon">🗑️</div>
                    <h3 className="delete-confirm__title">Delete this entry?</h3>
                    <p className="delete-confirm__text">
                        This action cannot be undone. The entry will be permanently removed from your journal.
                    </p>
                    <div className="delete-confirm__actions">
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleDelete}
                            loading={isDeleting}
                            style={{ backgroundColor: 'var(--color-error)' }}
                        >
                            Delete Entry
                        </Button>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </BottomSheet>
        </div>
    );
}
