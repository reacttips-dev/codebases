export { getCurrentThemeId } from './selectors/getCurrentThemeId';
export { DEFAULT_OUTLOOK_THEME_COLOR } from './constants';
export { getHeaderImageData } from './selectors/getHeaderImageData';
export { getPalette } from './selectors/getPalette';
export { getPaletteAsRawColors } from './selectors/getPaletteAsRawColors';
export { getIsLightBaseTheme } from './selectors/getIsLightBaseTheme';
export { getIsDarkBaseTheme } from './selectors/getIsDarkBaseTheme';

export {
    DarkModeContext,
    isCssVariablesSupported,
    isUserPersonalizationAllowed,
    isTenantThemeDataAvailable,
    getCobrandingThemeResources,
} from 'owa-theme-common';
