export const sourceSansPro = 'Source Sans Pro, Arial, sans-serif';

// Rebrand values from https://www.figma.com/file/voYd9ccfRGvpAdvwDyP6JS/LOHP---Phase-1
export const rebrandD1 = {
  lineHeight: '92px',
  fontSize: '84px',
  fontFamily: sourceSansPro,
  letterSpacing: '-0.2px',
};

export const rebrandD2 = {
  lineHeight: '52px',
  fontSize: '44px',
  fontFamily: sourceSansPro,
  letterSpacing: '-0.1px',
};

export const rebrandD2Tablet = {
  lineHeight: '48px',
  fontSize: '36px',
  fontFamily: sourceSansPro,
  letterSpacing: '-0.1px',
};

export const rebrandD2Mobile = {
  lineHeight: '40px',
  fontSize: '32px',
  fontFamily: sourceSansPro,
  letterSpacing: '-0.1px',
};

export const rebrandH1 = {
  lineHeight: '36px',
  fontSize: '28px',
  fontFamily: sourceSansPro,
  letterSpacing: '-0.1px',
};

export const rebrandH2 = {
  lineHeight: '28px',
  fontSize: '20px',
  fontFamily: sourceSansPro,
  letterSpacing: '-0.1px',
};

export const rebrandH2Mobile = {
  lineHeight: '20px',
  fontSize: '14px',
  fontFamily: sourceSansPro,
  letterSpacing: '-0.1px',
};

export const rebrandH3 = {
  lineHeight: '24px',
  fontSize: '16px',
  fontFamily: sourceSansPro,
};

export const body1 = rebrandH3;

export const rebrandFontAndLineHeight = {
  desktopD1: {
    lineHeight: '92px',
    fontSize: '84px',
    fontFamily: sourceSansPro,
  },
  desktopD2: {
    lineHeight: '52px',
    fontSize: '44px',
    fontFamily: sourceSansPro,
  },
  mobileD2: {
    lineHeight: '48px',
    fontSize: '36px',
    fontFamily: sourceSansPro,
  },
  mobileH1: {
    fontSize: '24px',
    lineHeight: '32px',
    fontFamily: sourceSansPro,
  },
  h1: {
    lineHeight: '36px',
    fontSize: '28px',
    fontFamily: sourceSansPro,
  },
  h2: {
    lineHeight: '28px',
    fontSize: '20px',
    fontFamily: sourceSansPro,
  },
  h3: rebrandH3,
  body1,
  body2: {
    lineHeight: '20px',
    fontSize: '14px',
  },
};

// from static/bundles/styleguide/learnerApp/deviceDimensionVariables.styl
// Values are in pixels
const screenXs = 480;
const screenSm = 768;
const screenMd = 992;
const screenLg = 1200;

const screenXsMax = screenXs - 1;
const screenSmMax = screenMd - 1;
const screenMdMax = screenLg - 1;

const smallerThanPhone = `@media (max-width: ${screenXs - 1}px)`;
const smallerThanTablet = `@media (max-width: ${screenSm - 1}px)`;
const smallerThanDesktop = `@media (max-width: ${screenMd - 1}px)`;

const phoneOrSmaller = `@media (max-width: ${screenXsMax}px)`;
const tabletOrSmaller = `@media (max-width: ${screenSmMax}px)`;
const desktopOrSmaller = `@media (max-width: ${screenMdMax}px)`;

const phoneOrBigger = `@media (min-width: ${screenXs}px)`;
const tabletOrBigger = `@media (min-width: ${screenSm}px)`;
const desktopOrBigger = `@media (min-width: ${screenMd}px)`;

const phone = `@media (min-width: ${screenXs}px) and (max-width: ${screenXsMax}px)`;
const tablet = `@media (min-width: ${screenSm}px) and (max-width: ${screenSmMax}px)`;
const desktop = `@media (min-width: ${screenMd}px) and (max-width: ${screenMdMax}px)`;
const largeDesktop = `@media (min-width: ${screenLg}px)`;

export const stylusBreakpoints = {
  smallerThanPhone,
  smallerThanTablet,
  smallerThanDesktop,
  phoneOrSmaller,
  tabletOrSmaller,
  desktopOrSmaller,
  phoneOrBigger,
  tabletOrBigger,
  desktopOrBigger,
  phone,
  tablet,
  desktop,
  largeDesktop,
};
