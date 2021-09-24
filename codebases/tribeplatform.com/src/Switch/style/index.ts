const parts = ['container', 'track', 'thumb'];
const baseStyleTrack = {
    bg: 'label.button',
    border: '1px solid',
    borderColor: 'label.secondary',
    borderRadius: 'full',
    p: 0,
    width: 'var(--slider-track-width)',
    height: 'var(--slider-track-height)',
    transition: 'all 120ms',
    _focus: {
        boxShadow: 'outline',
    },
    _disabled: {
        opacity: 'var(--tribe-opacity-disabled)',
        cursor: 'not-allowed',
    },
    _checked: {
        bg: 'accent.base',
        borderColor: 'accent.base',
    },
};
const baseStyleThumb = {
    border: '1px solid',
    borderColor: 'label.secondary',
    transition: 'transform 250ms',
    borderRadius: 'inherit',
    width: 'var(--slider-track-height)',
    height: 'var(--slider-track-height)',
    _checked: {
        borderColor: 'accent.base',
        transform: 'translateX(var(--slider-thumb-x))',
    },
};
const baseStyle = {
    container: {
        '--slider-track-diff': 'calc(var(--slider-track-width) - var(--slider-track-height))',
        '--slider-thumb-x': 'var(--slider-track-diff)',
        _rtl: {
            '--slider-thumb-x': 'calc(-1 * var(--slider-track-diff))',
        },
    },
    track: baseStyleTrack,
    thumb: baseStyleThumb,
};
const sizes = {
    sm: {
        container: {
            '--slider-track-width': '1.375rem',
            '--slider-track-height': '0.75rem',
        },
    },
    md: {
        container: {
            '--slider-track-width': '1.875rem',
            '--slider-track-height': '1rem',
        },
    },
    lg: {
        container: {
            '--slider-track-width': '2.875rem',
            '--slider-track-height': '1.5rem',
        },
    },
};
const defaultProps = {
    size: 'md',
};
export default {
    parts,
    baseStyle,
    sizes,
    defaultProps,
};
//# sourceMappingURL=index.js.map