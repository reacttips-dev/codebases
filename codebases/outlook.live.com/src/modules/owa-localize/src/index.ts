import { loc } from './loc';

export default loc;
export { setLocale, onLocaleChanged } from './actions/setLocale';
export { format } from './utilities/format';
export { formatToArray } from './utilities/formatToArray';
export { isStringNullOrWhiteSpace } from './utilities/isStringNullOrWhiteSpace';
export { addLocstringsToStore } from './actions/addLocstringsToStore';

export { getCurrentCulture } from './selectors/getCurrentCulture';
export { getCurrentLanguage } from './selectors/getCurrentLanguage';
export { isCurrentCultureRightToLeft } from './selectors/isCurrentCultureRightToLeft';

export { getLocalizedStringStore } from './store/store';
