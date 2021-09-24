import { getColor } from '@chakra-ui/theme-tools';
import { textStyles } from '../theme/foundations/typography';
import { toShadow } from '../utils/color.utils';
const parts = ['field', 'addon'];
const baseStyle = ({ isDisabled }) => ({
    field: {
        width: '100%',
        outline: 0,
        position: 'relative',
        appearance: 'none',
        transition: 'all 0.2s',
    },
    addon: {
        opacity: isDisabled
            ? 'var(--tribe-opacity-disabled)'
            : 'var(--tribe-opacity-none)',
    },
});
const size = {
    '2xl': {
        ...textStyles['semantic/h3'],
        lineHeight: '32px',
        pl: 3,
        pr: 3,
        h: 16,
        borderRadius: 'md',
    },
    xl: {
        ...textStyles['semibold/xlarge'],
        pl: 3,
        pr: 3,
        h: 16,
        borderRadius: 'md',
    },
    lg: {
        fontSize: 'md',
        pl: 3,
        pr: 3,
        h: 12,
        borderRadius: 'md',
    },
    md: {
        fontSize: 'sm',
        pl: 3,
        pr: 3,
        h: 10,
        borderRadius: 'md',
    },
    sm: {
        fontSize: 'sm',
        pl: 3,
        pr: 3,
        h: 8,
        borderRadius: 'md',
    },
};
const sizes = {
    '2xl': {
        field: size['2xl'],
        addon: size['2xl'],
    },
    xl: {
        field: size.xl,
        addon: size.xl,
    },
    lg: {
        field: size.lg,
        addon: size.lg,
    },
    md: {
        field: size.md,
        addon: size.md,
    },
    sm: {
        field: size.sm,
        addon: size.sm,
    },
};
function getDefaults(props) {
    const { focusBorderColor: fc, errorBorderColor: ec, color, placeholderColor: pc, } = props;
    return {
        color: color || 'label.primary',
        placeholder: pc || 'label.secondary',
        focusBorderColor: fc || 'accent.base',
        errorBorderColor: ec || 'danger.base',
    };
}
function variantOutline(props) {
    const { theme, withLeftAddon, withRightAddon } = props;
    const { focusBorderColor: fc, errorBorderColor: ec, color, placeholder, } = getDefaults(props);
    return {
        field: {
            border: '1px solid',
            borderColor: 'border.base',
            color,
            borderLeftRadius: withLeftAddon ? 0 : 4,
            borderRightRadius: withRightAddon ? 0 : 4,
            boxShadow: 'none',
            _placeholder: {
                color: placeholder,
            },
            _disabled: {
                cursor: 'not-allowed',
                opacity: 'var(--tribe-opacity-disabled)',
            },
            _focus: {
                borderColor: getColor(theme, fc),
                boxShadow: `0px 0px 0px 2px ${toShadow(theme, fc)}`,
            },
            _invalid: {
                borderColor: getColor(theme, ec),
                backgroundColor: 'danger.lite',
                boxShadow: 'inset',
            },
        },
        addon: {
            border: '1px solid',
            borderColor: 'border.base',
            bg: 'bg.secondary',
            _disabled: {
                cursor: 'not-allowed',
                opacity: 'var(--tribe-opacity-disabled)',
            },
        },
    };
}
const variantUnstyled = (props) => {
    const { color, placeholder } = getDefaults(props);
    return {
        field: {
            color,
            border: 'none',
            boxShadow: 'none',
            bg: 'transparent',
            pl: 0,
            pr: 0,
            height: 'auto',
            _placeholder: {
                color: placeholder,
            },
        },
        addon: {
            border: 'none',
            bg: 'transparent',
            pl: 0,
            pr: 0,
            height: 'auto',
        },
    };
};
const variants = {
    unstyled: variantUnstyled,
    outline: variantOutline,
};
const defaultProps = {
    size: 'md',
    variant: 'outline',
};
export default {
    parts,
    baseStyle,
    sizes,
    variants,
    defaultProps,
};
//# sourceMappingURL=style.js.map