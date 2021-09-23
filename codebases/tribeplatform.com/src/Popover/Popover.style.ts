import { breakpoints } from '../theme/foundations/breakpoints';
import { sizes as themeSizes } from '../theme/foundations/sizes';
import zIndices from '../theme/foundations/z-index';
const parts = [
    'arrow',
    'body',
    'content',
    'footer',
    'header',
    'popper',
    'title',
];
const MOBILE_HEIGHT = 'calc(100vh - 65px)';
function getSize(width, height, shouldIncludeMediaQueries = false) {
    const themeWidth = themeSizes[width];
    const themeHeight = height && themeSizes[height];
    return {
        content: {
            maxWidth: themeWidth,
            ...(themeHeight && {
                height: themeHeight,
                maxHeight: themeHeight,
                overflow: 'hidden',
                ...(shouldIncludeMediaQueries && {
                    [`@media only screen and (max-width: ${breakpoints.sm})`]: {
                        height: MOBILE_HEIGHT,
                        maxHeight: MOBILE_HEIGHT,
                        width: '100%',
                        maxWidth: '100%',
                    },
                }),
            }),
        },
        popper: {
            maxWidth: themeWidth,
            ...(themeHeight && {
                height: themeHeight,
                maxHeight: themeHeight,
                ...(shouldIncludeMediaQueries && {
                    [`@media only screen and (max-width: ${breakpoints.sm})`]: {
                        bottom: '0 !important',
                        height: '100vh',
                        left: '0 !important',
                        maxHeight: '100vh',
                        maxWidth: '100%',
                        position: 'fixed !important',
                        right: '0 !important',
                        transform: 'none !important',
                        zIndex: `${zIndices.tooltip} !important`,
                    },
                }),
            }),
        },
        title: {
            ...(shouldIncludeMediaQueries && {
                [`@media only screen and (max-width: ${breakpoints.sm})`]: {
                    display: 'flex',
                },
            }),
        },
        ...(themeHeight && {
            body: {
                height: themeHeight,
                maxHeight: themeHeight,
                ...(shouldIncludeMediaQueries && {
                    [`@media only screen and (max-width: ${breakpoints.sm})`]: {
                        height: MOBILE_HEIGHT,
                        maxHeight: MOBILE_HEIGHT,
                    },
                }),
            },
        }),
    };
}
const sizes = {
    full: getSize('100%'),
    xs: getSize('xs'),
    sm: getSize('sm'),
    xmd: getSize('xmd', 'xsm', true),
};
const baseStylePopper = {
    w: '100%',
    maxW: 'xs',
    zIndex: 'default',
};
const baseStyleContent = {
    bg: 'bg.base',
    border: '1px solid',
    borderColor: 'inherit',
    borderRadius: 'md',
    boxShadow: 'sm',
    zIndex: 'inherit',
    _focus: {
        outline: 0,
        boxShadow: 'outline',
    },
};
const baseStyleArrow = {
    bg: 'bg.base',
};
const baseStyleHeader = {
    px: 3,
    py: 2,
    borderBottomWidth: '1px',
};
const baseStyleBody = {
    px: 3,
    py: 2,
};
const baseStyleFooter = {
    px: 3,
    py: 2,
    borderTopWidth: '1px',
};
const baseStyleTitle = {
    alignItems: 'center',
    bg: 'bg.base',
    display: 'none',
    justifyContent: 'center',
    height: 16,
    marginBottom: 4,
    width: '100%',
};
const baseStyle = () => ({
    arrow: baseStyleArrow,
    body: baseStyleBody,
    content: baseStyleContent,
    footer: baseStyleFooter,
    header: baseStyleHeader,
    popper: baseStylePopper,
    title: baseStyleTitle,
});
const variants = {
    responsive: {
        popper: {
            maxWidth: 'unset',
            width: 'unset',
            zIndex: 'popover',
        },
    },
};
export default {
    baseStyle,
    parts,
    sizes,
    variants,
};
//# sourceMappingURL=Popover.style.js.map