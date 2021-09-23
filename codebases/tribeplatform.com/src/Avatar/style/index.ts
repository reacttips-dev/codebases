import { sizes as themeSizes } from '../../theme/foundations/sizes';
const parts = ['container', 'excessLabel', 'badge', 'label'];
const baseStyleBadge = {
    transform: 'translate(25%, 25%)',
    borderRadius: 'full',
    border: '0.2em solid',
    borderColor: 'label.primary',
};
const baseStyleExcessLabel = {
    bg: 'accent.base',
};
function baseStyleContainer() {
    return {
        display: 'flex',
        bg: 'label.secondary',
        color: 'label.button',
        borderColor: 'label.secondary',
        verticalAlign: 'top',
        borderWidth: undefined,
    };
}
const baseStyle = () => ({
    badge: baseStyleBadge,
    excessLabel: baseStyleExcessLabel,
    container: baseStyleContainer(),
});
function getSize(size) {
    const themeSize = themeSizes[size];
    return {
        container: {
            width: size,
            height: size,
            fontSize: `calc(${themeSize !== null && themeSize !== void 0 ? themeSize : size} / 2.5)`,
        },
        excessLabel: {
            width: size,
            height: size,
        },
        label: {
            fontSize: `calc(${themeSize !== null && themeSize !== void 0 ? themeSize : size} / 2.5)`,
            fontWeight: 'medium',
            lineHeight: size !== '100%' ? themeSize !== null && themeSize !== void 0 ? themeSize : size : undefined,
        },
    };
}
const sizes = {
    '3xs': getSize('3'),
    '2xs': getSize('4'),
    xs: getSize('5'),
    sm: getSize('6'),
    md: getSize('8'),
    lg: getSize('10'),
    xl: getSize('16'),
    '2xl': getSize('20'),
    '3xl': getSize('32'),
    full: getSize('100%'),
};
export const getSkeletonStyles = (size) => {
    var _a;
    return ({
        ...baseStyleContainer(),
        ...(_a = sizes[size]) === null || _a === void 0 ? void 0 : _a.container,
    });
};
const defaultProps = {
    size: 'md',
    variant: 'avatar',
};
const AvatarTheme = {
    parts,
    baseStyle,
    sizes,
    defaultProps,
    variants: {
        avatar: {
            bg: 'label.secondary',
        },
        logo: {
            bg: 'transparent',
            border: 'none',
            borderRadius: 'none',
            radius: 'none',
        },
    },
};
export default AvatarTheme;
//# sourceMappingURL=index.js.map