import { toShadow } from '../utils/color.utils';
const parts = ['input', 'list', 'item'];
const baseStyle = (props) => {
    const { theme } = props;
    return {
        input: {
            cursor: 'pointer',
            borderRadius: 'base',
            _invalid: {
                borderColor: 'danger.base',
                bg: 'danger.hover',
            },
            _focus: {
                borderColor: 'accent.base',
                boxShadow: `0px 0px 0px 2px ${toShadow(theme, 'accent.base')}`,
            },
        },
        list: {
            minW: '3xs',
            maxH: 'sm',
            overflowX: 'hidden',
            overflowY: 'auto',
            zIndex: 'dropdown',
            borderRadius: 'base',
            borderWidth: '1px',
            borderColor: 'border.lite',
            bg: 'bg.base',
            boxShadow: 'low',
            outline: 0,
        },
        item: {
            alignItems: 'center',
            columnGap: 10,
            transition: 'background 50ms ease-in 0s',
            borderRadius: 'base',
            _hover: {
                bg: 'bg.secondary',
                color: 'label.primary',
            },
            _expanded: {
                bg: 'bg.secondary',
            },
            _disabled: {
                opacity: 'var(--tribe-opacity-disabled)',
                cursor: 'not-allowed',
            },
        },
    };
};
const sizes = {
    lg: {
        input: {
            fontSize: 'md',
            h: 12,
        },
        item: {
            fontSize: 'md',
            py: 2,
            px: 3,
        },
    },
    md: {
        input: {
            fontSize: 'sm',
            h: 10,
        },
        item: {
            fontSize: 'sm',
            py: 2,
            px: 3,
        },
    },
    sm: {
        input: {
            fontSize: 'sm',
            h: 8,
        },
        item: {
            fontSize: 'sm',
            py: 1,
            px: 3,
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
//# sourceMappingURL=Select.style.js.map