const baseStyle = {
    lineHeight: '1.2',
    borderRadius: 'base',
    fontWeight: 'medium',
    _focus: {
        boxShadow: 'none',
    },
    _focusVisible: {
        boxShadow: 'outline',
    },
    _disabled: {
        opacity: 'var(--tribe-opacity-disabled)',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
    _active: {
        borderColor: 'highlight',
        bg: 'bg.secondary',
    },
    _hover: {
        borderColor: 'border.lite',
        _disabled: {
            borderColor: 'border.base',
        },
    },
};
const variantGhost = {
    color: 'label.secondary',
    bg: 'transparent',
    _hover: {
        color: 'label.secondary',
        bg: 'transparent',
    },
    _active: {
        color: 'label.primary',
        bg: 'transparent',
    },
    _disabled: {
        opacity: 'var(--tribe-opacity-disabled)',
    },
};
const variantOutline = {
    border: '1px solid',
    borderColor: 'border.base',
    color: 'label.primary',
    bg: 'bg.base',
    _hover: {
        bg: 'bg.base',
        borderColor: 'border.lite',
    },
    _active: {
        bg: 'bg.secondary',
        borderColor: 'border.highlight',
    },
    _disabled: {
        opacity: 'var(--tribe-opacity-disabled)',
    },
};
const solidColors = {
    gray: {
        bg: 'bg.secondary',
        color: 'label.primary',
        _hover: {
            bg: 'bg.secondary',
            color: 'label.secondary',
            _disabled: {
                bg: 'bg.secondary',
                color: 'label.primary',
                opacity: 'var(--tribe-opacity-disabled)',
            },
        },
        _active: {
            color: 'label.primary',
            bg: 'highlight',
        },
        _disabled: {
            bg: 'bg.secondary',
            color: 'label.primary',
            opacity: 'var(--tribe-opacity-disabled)',
        },
    },
    red: {
        bg: 'bg.secondary',
        color: 'danger.base',
        _hover: {
            bg: 'danger.hover',
            color: 'danger.base',
            _disabled: {
                bg: 'bg.secondary',
                color: 'danger.base',
                opacity: 'var(--tribe-opacity-disabled)',
            },
        },
        _active: {
            bg: 'danger.pressed',
            color: 'danger.base',
        },
        _disabled: {
            bg: 'bg.secondary',
            color: 'danger.base',
            opacity: 'var(--tribe-opacity-disabled)',
        },
    },
    accent: {
        bg: 'accent.base',
        color: 'label.button',
        _hover: {
            bg: 'accent.hover',
            color: 'label.button',
            _disabled: {
                bg: 'accent.base',
                color: 'label.button',
                opacity: 'var(--tribe-opacity-disabled)',
            },
        },
        _active: {
            bg: 'accent.pressed',
            color: 'label.button',
        },
        _disabled: {
            bg: 'accent.base',
            color: 'label.button',
            opacity: 'var(--tribe-opacity-disabled)',
        },
    },
};
function variantSolid(props) {
    const { colorScheme } = props;
    return {
        border: '0',
        ...solidColors[colorScheme],
    };
}
const variantLink = {
    padding: 0,
    height: 'auto',
    lineHeight: 'normal',
    color: 'label.secondary',
    _hover: {
        textDecoration: 'underline',
        _disabled: {
            textDecoration: 'none',
        },
    },
    _active: {
        color: 'label.label.primary',
    },
};
const variantUnstyled = {
    bg: 'none',
    color: 'inherit',
    display: 'inline',
    lineHeight: 'inherit',
    m: 0,
    p: 0,
};
const variants = {
    ghost: variantGhost,
    outline: variantOutline,
    solid: variantSolid,
    link: variantLink,
    unstyled: variantUnstyled,
};
const sizes = {
    lg: {
        h: 12,
        minW: 12,
        fontSize: 'lg',
        px: 6,
    },
    md: {
        h: 10,
        minW: 10,
        fontSize: 'md',
        px: 4,
    },
    sm: {
        h: 8,
        minW: 8,
        fontSize: 'sm',
        px: 3,
    },
    xs: {
        h: 8,
        minW: 6,
        fontSize: 'xs',
        px: 2,
    },
};
const defaultProps = {
    variant: 'solid',
    size: 'md',
    colorScheme: 'gray',
};
export default {
    baseStyle,
    variants,
    sizes,
    defaultProps,
};
//# sourceMappingURL=Button.style.js.map