import { NavLink, useNavigate } from 'react-router-dom';
import './Navigation.css';

// Icons
const HomeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
);

const JournalIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

const PlusIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15,18 9,12 15,6" />
    </svg>
);

const MoreIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
    </svg>
);

// Bottom Navigation
export function BottomNav() {
    return (
        <nav className="bottom-nav">
            <div className="bottom-nav__inner">
                <NavLink
                    to="/"
                    className={({ isActive }) => `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
                >
                    <span className="bottom-nav__icon"><HomeIcon /></span>
                    <span className="bottom-nav__label">Home</span>
                </NavLink>

                <NavLink
                    to="/journal"
                    className={({ isActive }) => `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
                >
                    <span className="bottom-nav__icon"><JournalIcon /></span>
                    <span className="bottom-nav__label">Journal</span>
                </NavLink>
            </div>
        </nav>
    );
}

// Floating Action Button
export function FAB({ onClick }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate('/new');
        }
    };

    return (
        <button className="fab" onClick={handleClick} aria-label="New Entry">
            <span className="fab__icon"><PlusIcon /></span>
        </button>
    );
}

// Top Header with back button
export function TopHeader({ title, showBack = true, actions }) {
    const navigate = useNavigate();

    return (
        <header className="top-header">
            <div className="top-header__inner">
                {showBack ? (
                    <button
                        className="top-header__back"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <ChevronLeftIcon />
                    </button>
                ) : (
                    <div style={{ width: 40 }} />
                )}

                {title && <h1 className="top-header__title">{title}</h1>}

                <div className="top-header__actions">
                    {actions || <div style={{ width: 40 }} />}
                </div>
            </div>
        </header>
    );
}

// More button for actions
export function MoreButton({ onClick }) {
    return (
        <button className="top-header__action" onClick={onClick} aria-label="More options">
            <MoreIcon />
        </button>
    );
}

export { HomeIcon, JournalIcon, PlusIcon, ChevronLeftIcon, MoreIcon };
