// Import orchestrators
import './orchestrators/onThemeChanged';
import './orchestrators/onLocaleChanged';
import './mutators/mutateDensity';

// Export selectors actions, and types
export { default as getExtendedTheme } from './selectors/getExtendedTheme';
export { default as getPalette } from './selectors/getPalette';
export { default as getIsDarkTheme } from './selectors/getIsDarkTheme';
export { default as getDensity } from './selectors/getDensity';
export { default as getDensityMode } from './selectors/getDensityMode';
export { default as getDensityModeString } from './selectors/getDensityModeString';

export { default as changeTheme } from './actions/changeTheme';
export { default as changeDensity } from './actions/changeDensity';

export type { ExtendedTheme } from './store/schema/ExtendedTheme';
export type { ExtendedPalette } from './store/schema/ExtendedTheme';
export type { DensityMode } from './store/schema/ExtendedTheme';

export { default as fabricTheme } from './store/store';
