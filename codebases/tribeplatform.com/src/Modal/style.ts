import { mode } from '@chakra-ui/theme-tools';
const parts = [
    'overlay',
    'dialogContainer',
    'dialog',
    'header',
    'closeButton',
    'body',
    'footer',
];
const baseStyleOverlay = {
    bg: 'blackAlpha.600',
    zIndex: 'modal',
};
function baseStyleDialogContainer(props) {
    const { isCentered, scrollBehavior } = props;
    return {
        bg: 'modalOverlay',
        display: 'flex',
        zIndex: 'modal',
        justifyContent: 'center',
        alignItems: isCentered ? 'center' : 'flex-start',
        overflow: scrollBehavior === 'inside' ? 'hidden' : 'auto',
    };
}
function baseStyleDialog(props) {
    const { scrollBehavior } = props;
    return {
        borderRadius: 'md',
        bg: 'bg.base',
        color: 'inherit',
        my: '3.75rem',
        zIndex: 'modal',
        maxH: scrollBehavior === 'inside' ? 'calc(100vh - 7.5rem)' : undefined,
        boxShadow: mode('lg', 'dark-lg')(props),
    };
}
const baseStyleHeader = {
    px: 6,
    pt: 5,
    pb: 4,
    fontSize: 'xl',
    fontWeight: 'semibold',
};
const baseStyleCloseButton = {
    position: 'absolute',
    top: 2,
    insetEnd: 3,
};
function baseStyleBody(props) {
    const { scrollBehavior } = props;
    return {
        px: 6,
        py: 4,
        flex: 1,
        overflow: scrollBehavior === 'inside' ? 'auto' : undefined,
        zIndex: 'modal',
    };
}
const baseStyleFooter = {
    px: 6,
    pt: 4,
    pb: 5,
};
const baseStyle = (props) => ({
    overlay: baseStyleOverlay,
    dialogContainer: baseStyleDialogContainer(props),
    dialog: baseStyleDialog(props),
    header: baseStyleHeader,
    closeButton: baseStyleCloseButton,
    body: baseStyleBody(props),
    footer: baseStyleFooter,
});
const withBorderVariant = (props) => ({
    ...baseStyle(props),
    header: {
        ...baseStyle(props).header,
        borderWidth: 1,
        borderX: 'none',
        borderTop: 'none',
        borderColor: 'border.base',
    },
    footer: {
        ...baseStyle(props).footer,
        borderTop: '1px',
        borderColor: 'border.base',
    },
});
/**
 * Since the `maxWidth` prop references theme.sizes internally,
 * we can leverage that to size our modals.
 */
function getSize(value) {
    if (value === 'full') {
        return {
            dialog: {
                maxW: '100vw',
                // Fallback for the property below
                minH: '100vh',
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line react/jsx-no-duplicate-props
                minH: '-webkit-fill-available',
            },
        };
    }
    return { dialog: { maxW: value } };
}
const sizes = {
    xs: getSize('xs'),
    sm: getSize('sm'),
    md: getSize('md'),
    lg: getSize('lg'),
    xl: getSize('xl'),
    '2xl': getSize('2xl'),
    '3xl': getSize('3xl'),
    '4xl': getSize('4xl'),
    '5xl': getSize('5xl'),
    '6xl': getSize('6xl'),
    full: getSize('full'),
};
export const variants = {
    default: baseStyle,
    withBorder: withBorderVariant,
};
const defaultProps = {
    variant: 'default',
    size: 'md',
};
export default {
    parts,
    baseStyle,
    variants,
    sizes,
    defaultProps,
};
//# sourceMappingURL=style.js.map