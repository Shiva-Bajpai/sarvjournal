import './Button.css';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    iconOnly = false,
    loading = false,
    disabled = false,
    icon,
    onClick,
    type = 'button',
    className = '',
    ...props
}) {
    const classes = [
        'button',
        `button--${variant}`,
        `button--${size}`,
        fullWidth && 'button--full',
        iconOnly && 'button--icon',
        loading && 'button--loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {icon && <span className="button__icon">{icon}</span>}
            {children}
        </button>
    );
}
