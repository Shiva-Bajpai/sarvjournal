import { useRef, useEffect, useMemo } from 'react';
import './DateSelector.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

export default function DateSelector({
    selectedDate,
    onSelect,
    datesWithEntries = [],
    className = ''
}) {
    const scrollRef = useRef(null);
    const selectedRef = useRef(null);

    // Generate dates for current week + surrounding days
    const dates = useMemo(() => {
        const result = [];
        const today = new Date();

        // Show 14 days before and 7 days after today
        for (let i = -14; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            result.push(date);
        }

        return result;
    }, []);

    // Scroll to selected date on mount
    useEffect(() => {
        if (selectedRef.current && scrollRef.current) {
            const container = scrollRef.current;
            const element = selectedRef.current;
            const containerWidth = container.offsetWidth;
            const elementLeft = element.offsetLeft;
            const elementWidth = element.offsetWidth;

            container.scrollLeft = elementLeft - (containerWidth / 2) + (elementWidth / 2);
        }
    }, []);

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        if (!selectedDate) return false;
        return date.toDateString() === new Date(selectedDate).toDateString();
    };

    const hasEntry = (date) => {
        return datesWithEntries.some(d =>
            new Date(d).toDateString() === date.toDateString()
        );
    };

    const currentMonth = selectedDate
        ? MONTHS[new Date(selectedDate).getMonth()]
        : MONTHS[new Date().getMonth()];

    return (
        <div aria-label="Select date" className={`date-selector ${className}`}>
            <div className="date-selector__header">
                <span className="date-selector__month">{currentMonth}</span>
            </div>

            <div className="date-selector__scroll" ref={scrollRef}>
                {dates.map((date, index) => {
                    const selected = isSelected(date);
                    const today = isToday(date);
                    const hasEntryForDate = hasEntry(date);

                    return (
                        <button
                            key={index}
                            ref={selected ? selectedRef : null}
                            type="button"
                            className={`date-item ${selected ? 'date-item--selected' : ''} ${today ? 'date-item--today' : ''} ${hasEntryForDate ? 'date-item--has-entry' : ''}`}
                            onClick={() => onSelect(date)}
                        >
                            <span className="date-item__day">{DAYS[date.getDay()]}</span>
                            <span className="date-item__date">{date.getDate()}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
