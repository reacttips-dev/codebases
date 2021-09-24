const parts = ['tablist', 'tab', 'tabpanel', 'indicator'];
function baseStyleTab(props) {
    const { isFitted } = props;
    return {
        flex: isFitted ? 1 : undefined,
        transition: 'all 0.2s',
        _focus: {
            zIndex: 1,
        },
    };
}
function baseStyleTablist(props) {
    const { align = 'start', orientation } = props;
    const alignments = {
        end: 'flex-end',
        center: 'center',
        start: 'flex-start',
    };
    return {
        justifyContent: alignments[align],
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
    };
}
const baseStyleTabpanel = { p: 0 };
const baseStyle = (props) => ({
    tab: baseStyleTab(props),
    tablist: baseStyleTablist(props),
    tabpanel: baseStyleTabpanel,
});
const sizes = {
    sm: {
        tab: {
            fontSize: 'sm',
            py: '2',
            px: '3',
        },
    },
    md: {
        tab: {
            fontSize: 'md',
            py: '3',
            px: '3',
        },
    },
    lg: {
        tab: {
            fontSize: 'lg',
            py: '2',
            px: '3',
        },
    },
};
function variantDefault() {
    return {
        tab: {
            fontWeight: 'regular',
            lineHeight: '1.5',
            color: 'label.secondary',
            borderBottom: '2px solid',
            borderColor: 'transparent',
            px: 1,
            mr: 4,
            _selected: {
                color: 'accent.base',
                borderColor: 'accent.base',
            },
            _disabled: {
                opacity: 'var(--tribe-opacity-disabled)',
                cursor: 'not-allowed',
            },
            _focus: {
                outline: 0,
                boxShadow: 0,
            },
        },
        tablist: {
            bg: 'bg.base',
            borderBottom: '1px',
            borderColor: 'border.base',
            px: 4,
        },
    };
}
const variantUnstyled = {};
const variants = {
    default: variantDefault,
    unstyled: variantUnstyled,
};
const defaultProps = {
    size: 'md',
    variant: 'default',
    colorScheme: 'gray',
};
export default {
    parts,
    baseStyle,
    sizes,
    variants,
    defaultProps,
};
//# sourceMappingURL=style.js.map