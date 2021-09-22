// import orchestrators
import './orchestrators/loadThemeOrchestrator';

export { default as getCurrentThemeId } from './selectors/getTheme';
export { default as getHeaderImageData } from './selectors/getHeaderImageData';
export { default as getPalette } from './selectors/getPalette';
export { default as getPaletteAsRawColors } from './selectors/getPaletteAsRawColors';
export {
    default as getSupportedThemeIds,
    isEdgeThemeEnabled,
    isThemeEdgeOnly,
    getEdgeThemeById,
} from './selectors/getAllThemeIds';
export { default as loadTheme } from './actions/loadTheme';
export { default as DarkModeContext } from './contexts/DarkModeContext';
export { loadInitialTheme } from './orchestrators/loadInitialTheme';
export { default as getEdgeThemeProps, getEmptyStateBingLogo } from './selectors/getEdgeThemeProps';
export { default as isThemeofDayIconVisible } from './utils/isThemeofDayIconVisible';
