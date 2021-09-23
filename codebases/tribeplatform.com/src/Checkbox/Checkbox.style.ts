import { toShadow } from '../utils/color.utils';
const parts = ['container', 'control', 'label', 'icon'];
const baseStyleControl = (props) => {
    const { theme } = props;
    return {
        w: '100%',
        transition: 'box-shadow 250ms',
        borderRadius: 'base',
        border: '1px solid',
        borderColor: 'label.secondary',
        bg: 'light.base',
        _checked: {
            bg: 'accent.base',
            borderColor: 'accent.pressed',
            color: 'label.button',
            _hover: {
                bg: 'accent.hover',
                borderColor: 'accent.pressed',
            },
            _active: {
                bg: 'accent.pressed',
                borderColor: 'accent.pressed',
            },
            _focus: {
                bg: 'accent.base',
                borderColor: 'accent.pressed',
                boxShadow: `0px 0px 0px 2px ${toShadow(theme, 'accent.pressed')}`,
            },
            _disabled: {
                bg: 'accent.base',
                borderColor: 'accent.pressed',
                color: 'label.button',
                opacity: 'var(--tribe-opacity-disabled)',
            },
        },
        _hover: {
            bg: 'bg.secondary',
        },
        _active: {
            bg: 'highlight',
        },
        _indeterminate: {
            bg: 'highlight',
            borderColor: 'border.lite',
            color: 'label.button',
        },
        _focus: {
            outline: 0,
            borderColor: 'accent.pressed',
            boxShadow: `0px 0px 0px 2px ${toShadow(theme, 'accent.pressed')}`,
        },
        _disabled: {
            bg: 'bg.secondary',
            borderColor: 'label.secondary',
            opacity: 'var(--tribe-opacity-disabled)',
        },
        _invalid: {
            borderColor: 'danger.base',
        },
    };
};
const baseStyleLabel = {
    userSelect: 'none',
    _disabled: { opacity: 'var(--tribe-opacity-disabled)' },
};
const baseStyle = (props) => ({
    control: baseStyleControl(props),
    label: baseStyleLabel,
});
const sizes = {
    sm: {
        control: { h: 3, w: 3 },
        label: { fontSize: 'sm' },
        icon: { fontSize: '0.45rem' },
    },
    md: {
        control: { w: 4, h: 4 },
        label: { fontSize: 'md' },
        icon: { fontSize: '0.625rem' },
    },
    lg: {
        control: { w: 5, h: 5 },
        label: { fontSize: 'lg' },
        icon: { fontSize: '0.625rem' },
    },
};
const defaultProps = {
    size: 'md',
    colorScheme: 'accent',
};
export default {
    parts,
    baseStyle,
    sizes,
    defaultProps,
};
//# sourceMappingURL=Checkbox.style.js.map