import './Card.css';

export default function Card({
    children,
    variant = 'default',
    size = 'md',
    interactive = false,
    onClick,
    className = '',
    ...props
}) {
    const classes = [
        'card',
        variant !== 'default' && `card--${variant}`,
        size !== 'md' && `card--${size}`,
        interactive && 'card--interactive',
        className
    ].filter(Boolean).join(' ');

    const Component = interactive ? 'button' : 'div';

    return (
        <Component
            className={classes}
            onClick={onClick}
            {...props}
        >
            {children}
        </Component>
    );
}

// Card sub-components
export function CardHeader({ children, icon, className = '' }) {
    return (
        <div className={`card__header ${className}`}>
            <div>{children}</div>
            {icon && <div className="card__icon">{icon}</div>}
        </div>
    );
}

export function CardTitle({ children, subtitle, className = '' }) {
    return (
        <div className={className}>
            <h3 className="card__title">{children}</h3>
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`card__content ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={`card__footer ${className}`}>
            {children}
        </div>
    );
}

export function CardMeta({ items = [], className = '' }) {
    return (
        <div className={`card__meta ${className}`}>
            {items.map((item, index) => (
                <span key={index}>
                    {index > 0 && <span className="card__meta-dot" />}
                    {item}
                </span>
            ))}
        </div>
    );
}

export function CardMood({ mood, className = '' }) {
    const moodEmojis = {
        happy: '😊',
        sad: '😢',
        calm: '😌',
        anxious: '😰'
    };

    const moodLabels = {
        happy: 'Happy',
        sad: 'Sad',
        calm: 'Calm',
        anxious: 'Anxious'
    };

    return (
        <span className={`card__mood card__mood--${mood} ${className}`}>
            <span>{moodEmojis[mood]}</span>
            <span>{moodLabels[mood]}</span>
        </span>
    );
}
