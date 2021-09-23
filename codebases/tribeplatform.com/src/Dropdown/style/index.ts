const parts = ['button', 'list', 'item', 'divider'];
const listStyle = {
    minWidth: '3xs',
    maxHeight: 'md',
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'bg.base',
    borderRadius: 'md',
    border: 'none',
    boxShadow: 'md',
    zIndex: 'popover',
    py: {
        base: 0,
        lg: 2,
    },
    '&:focus:not([data-focus-visible-added])': {
        boxShadow: 'md',
    },
};
const button = {
    background: 'transparent',
    borderRadius: 'md',
    _hover: {
        background: 'bg.secondary',
        color: 'label.secondary',
    },
    _expanded: {
        background: 'bg.secondary',
    },
    _active: {
        bg: 'bg.secondary',
    },
};
const item = {
    background: 'bg.base',
    py: {
        base: 6,
        lg: 2,
    },
    px: 4,
    borderRadius: 'none',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'label.primary',
    _focus: {
        background: 'bg.secondary',
    },
    _hover: {
        background: 'bg.secondary',
    },
    _active: {
        bg: 'bg.secondary',
    },
    '&.ql-focused-item': {
        background: 'bg.secondary',
    },
};
const DropdownTheme = {
    parts,
    baseStyle: () => ({
        button: {
            ...button,
        },
        list: {
            ...listStyle,
        },
        mobileListContainer: {
            position: 'fixed',
            w: '90vw',
            left: 0,
            right: 0,
            bottom: 6,
            mx: 'auto',
            outline: 0,
            maxW: [300, 'auto'],
        },
        divider: {
            color: 'stroke',
            my: 2,
        },
        item: {
            ...item,
        },
        cancel: {
            ...item,
            borderRadius: 'md',
            mt: 2,
            border: 'none',
            boxShadow: 'md',
            w: 'full',
        },
    }),
    variants: {
        danger: {
            item: {
                color: 'danger.base',
            },
        },
    },
};
export default DropdownTheme;
//# sourceMappingURL=index.js.map