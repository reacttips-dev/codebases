import type RegionalOptionsViewState from './schema/RegionalOptionsViewState';
import { createStore } from 'satcheljs';

export default createStore<RegionalOptionsViewState>('generalOptions', {
    supportedCultures: [],
    supportedShortDateFormats: [],
    supportedShortTimeFormats: [],
    supportedTimeZones: [],
    selectedLocale: null,
    shouldRenameDefaultFolders: true,
    selectedDateFormat: null,
    selectedTimeFormat: null,
    selectedTimeZone: null,
    hasUserChangedLanguage: false,
    roamingTimeZoneNotificationIsDisabled: undefined,
});
