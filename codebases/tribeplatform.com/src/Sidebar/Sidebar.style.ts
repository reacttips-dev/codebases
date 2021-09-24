export const SIDEBAR_VISIBLE = 'lg';
const parts = ['container', 'group', 'item', 'icon', 'label'];
const baseLabel = {
    fontSize: 'md',
    lineHeight: '18px',
    fontWeight: 'regular',
    color: 'inherit',
};
const baseGroup = {
    fontSize: 'lg',
    lineHeight: '22px',
    fontWeight: 'regular',
    color: 'label.secondary',
};
export const SIDEBAR_ICON_SIZE = 5;
const baseStyle = () => ({
    container: {
        px: { base: 3, [SIDEBAR_VISIBLE]: 6 },
    },
    item: {
        fontSize: 'md',
        lineHeight: '18px',
        fontWeight: 'regular',
        color: 'label.primary',
        borderRadius: { base: 0, [SIDEBAR_VISIBLE]: 'base' },
        px: 3,
    },
    icon: {
        p: {
            base: 2,
            [SIDEBAR_VISIBLE]: 1,
        },
    },
    label: baseLabel,
    group: baseGroup,
});
const variantBasic = {
    item: {
        height: { base: 12, [SIDEBAR_VISIBLE]: 10 },
        py: 2.5,
        _hover: {
            background: 'bg.secondary',
            color: 'label.primary',
        },
        _highlighted: {
            color: 'accent.base',
            backgroundColor: 'accent.lite',
        },
    },
    icon: {
        boxSize: { base: 8, [SIDEBAR_VISIBLE]: SIDEBAR_ICON_SIZE },
        color: 'white',
        background: 'label.secondary',
        borderRadius: 'full',
        _highlighted: {
            backgroundColor: 'accent.base',
        },
    },
};
const variantGhost = {
    item: {
        height: 8,
        py: 2,
    },
    icon: {
        color: 'label.secondary',
        background: 'transparent',
        boxSize: 4,
        p: 0,
        height: 5,
        mx: {
            base: 2,
            [SIDEBAR_VISIBLE]: 0,
        },
    },
};
const variants = {
    basic: variantBasic,
    ghost: variantGhost,
};
const sizes = {};
const defaultProps = {
    variant: 'basic',
};
export default {
    parts,
    baseStyle,
    variants,
    sizes,
    defaultProps,
};
//# sourceMappingURL=Sidebar.style.js.map