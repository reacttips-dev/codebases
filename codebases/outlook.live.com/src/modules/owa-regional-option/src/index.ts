import loadRegionalOptions from './orchestration/loadRegionalOptions';
import './orchestrators/languageChangedOrchestrator';

// Load initial state needed for options
loadRegionalOptions();

// Export option itself
export { default as RegionalOption } from './RegionalOption';

export { default as getSupportedCultures } from './utils/getSupportedCultures';

export { default as getRegionalOptions } from './data/store/store';
