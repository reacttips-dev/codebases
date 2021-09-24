const parts = ['container', 'label', 'closeButton'];
const baseStyleContainer = {
    fontWeight: 'medium',
    lineHeight: 'regular',
    outline: 0,
    _focus: {
        boxShadow: 'outline',
    },
};
const baseStyleLabel = {
    lineHeight: 'regular',
    color: 'label.primary',
    fontWeight: 'medium',
};
const baseStyleCloseButton = {
    fontSize: '18px',
    w: '1.25rem',
    h: '1.25rem',
    borderRadius: 'full',
    ml: '0.375rem',
    mr: '-1',
    _disabled: {
        opacity: 'var(--tribe-opacity-disabled)',
    },
    _focus: {
        boxShadow: 0,
    },
    _hover: { opacity: 0.8 },
    _active: { opacity: 'var(--tribe-opacity-none)' },
};
const baseStyle = {
    container: baseStyleContainer,
    label: baseStyleLabel,
    closeButton: baseStyleCloseButton,
};
const sizes = {
    sm: {
        container: {
            minH: '1.25rem',
            minW: '1.25rem',
            fontSize: 'xs',
            px: 2,
            borderRadius: 'md',
        },
        closeButton: {
            mr: '-2px',
            ml: '0.35rem',
        },
    },
    md: {
        container: {
            minH: '1.5rem',
            minW: '1.5rem',
            fontSize: 'sm',
            borderRadius: 'md',
            px: 2,
        },
    },
    lg: {
        container: {
            minH: 8,
            minW: 8,
            fontSize: 'sm',
            borderRadius: 'md',
            px: 3,
        },
    },
};
const variantSolid = {
    bg: 'bg.secondary',
    color: 'label.primary',
};
const variantSubtle = {
    bg: 'bg.secondary',
    color: 'label.primary',
};
const variantSuccess = {
    bg: 'accent.base',
    color: 'label.button',
};
const variantSuccessOutline = {
    bg: 'accent.lite',
    color: 'accent.base',
    border: '1px',
    borderColor: 'accent.base',
};
const variantWarning = {
    bg: 'warning.base',
    color: 'label.button',
};
const variantWarningOutline = {
    bg: 'warning.lite',
    color: 'warning.base',
    border: '1px',
    borderColor: 'warning.base',
};
const variantOutline = {
    color: 'label.primary',
};
function variantDefault() {
    return {
        color: 'label.primary',
        bg: 'bg.secondary',
        boxShadow: 0,
        borderRadius: 'base',
    };
}
const variants = {
    subtle: () => ({
        container: variantSubtle,
    }),
    solid: () => ({
        container: variantSolid,
    }),
    outline: () => ({
        container: variantOutline,
    }),
    success: () => ({
        container: variantSuccess,
        label: {
            color: variantSuccess.color,
        },
    }),
    successOutline: () => ({
        container: variantSuccessOutline,
        label: {
            color: variantSuccessOutline.color,
        },
    }),
    warning: () => ({
        container: variantWarning,
        label: {
            color: variantWarning.color,
        },
    }),
    warningOutline: () => ({
        container: variantWarningOutline,
        label: {
            color: variantWarningOutline.color,
        },
    }),
    default: () => ({
        container: variantDefault(),
        closeButton: {
            _focus: {
                bg: 'transparent',
            },
        },
    }),
};
const defaultProps = {
    size: 'md',
    variant: 'default',
};
export default {
    parts,
    variants,
    baseStyle,
    sizes,
    defaultProps,
};
//# sourceMappingURL=Tag.style.js.map