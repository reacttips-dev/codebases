const baseStyle = {
    transition: `all 0.15s ease-out`,
    cursor: 'pointer',
    textDecoration: 'none',
    outline: 'none',
    color: 'inherit',
    _hover: {
        textDecoration: 'none',
    },
    _focus: {
        boxShadow: 'none',
    },
    _focusVisible: {
        boxShadow: 'outline',
    },
};
const variantBase = {
    fontSize: 'sm',
    lineHeight: '150%',
    fontWeight: 'semibold',
};
const variantUnstyled = {
    color: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
};
const variantPrimary = {
    ...variantBase,
    color: 'accent.base',
    _hover: {
        color: 'accent.hover',
    },
    _active: {
        color: 'accent.hover',
    },
};
const variants = {
    base: variantBase,
    primary: variantPrimary,
    unstyled: variantUnstyled,
};
const defaultProps = {
    variant: 'base',
};
export default {
    baseStyle,
    variants,
    defaultProps,
};
//# sourceMappingURL=style.js.map