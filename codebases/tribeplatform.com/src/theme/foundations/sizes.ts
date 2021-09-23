import { spacing } from './spacing';
export const largeSizes = {
    max: 'max-content',
    min: 'min-content',
    full: '100%',
    '4xs': '8rem',
    '3xs': '14rem',
    '2xs': '16rem',
    xs: '20rem',
    xsm: '22.5rem',
    sm: '24rem',
    xmd: '26.25rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    '8xl': '90rem',
};
const container = {
    sm: '600px',
    md: '720px',
    lg: '800px',
    xl: '924px',
    '2xl': '1160px',
    '3xl': '1440px',
};
export const sizes = {
    ...spacing,
    ...largeSizes,
    container,
};
//# sourceMappingURL=sizes.js.map