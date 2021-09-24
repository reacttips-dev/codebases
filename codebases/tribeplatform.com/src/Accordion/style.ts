const parts = ['container', 'item', 'title', 'subtitle', 'button', 'panel'];
const baseStyleContainer = {
    width: 'full',
    border: 'none',
    borderRadius: [0, 'base'],
    boxShadow: 'lowLight',
};
const baseStyleButton = {
    fontSize: '1rem',
    justifyContent: 'space-between',
    _hover: {
        bg: 'transparent',
    },
    _focus: {
        boxShadow: 0,
    },
    _disabled: {
        opacity: 'var(--tribe-opacity-disabled)',
        cursor: 'not-allowed',
    },
    px: 5,
    py: 5,
};
const baseStylePanel = {
    px: 5,
    pb: 5,
    pt: 1,
};
const baseStyleItem = {
    bg: 'bg.base',
    maxW: 'full',
    // Remove borders
    borderTop: 0,
    borderRight: 0,
    borderLeft: 0,
    borderRadius: 0,
    // Add top radiuses on first element
    _first: {
        borderTopLeftRadius: [0, 'base'],
        borderTopRightRadius: [0, 'base'],
    },
    // Add bottom radiuses on first element
    _last: {
        borderBottomLeftRadius: [0, 'base'],
        borderBottomRightRadius: [0, 'base'],
    },
    // Add border to all accordion items
    // besides the last one
    '&:not(:last-child)': {
        borderBottom: '1px solid',
        borderBottomColor: 'border.lite',
    },
};
const baseStyleTitle = {
    textAlign: 'left',
};
const baseStyleSubtitle = {
    color: 'label.secondary',
    textAlign: 'left',
};
const baseStyleToggleIcon = {
    color: 'label.secondary',
};
const baseStyle = {
    container: baseStyleContainer,
    button: baseStyleButton,
    panel: baseStylePanel,
    item: baseStyleItem,
    title: baseStyleTitle,
    subtitle: baseStyleSubtitle,
    toggleIcon: baseStyleToggleIcon,
};
const variantUnstyled = {
    container: {
        border: 'none',
    },
    button: {
        p: 0,
    },
    panel: {
        p: 0,
    },
    icon: {
        color: 'label.primary',
    },
    toggleIcon: {
        color: 'label.primary',
    },
};
const variants = {
    base: baseStyle,
    unstyled: variantUnstyled,
};
const defaultProps = {
    variant: 'base',
};
export default {
    parts,
    variants,
    defaultProps,
};
//# sourceMappingURL=style.js.map