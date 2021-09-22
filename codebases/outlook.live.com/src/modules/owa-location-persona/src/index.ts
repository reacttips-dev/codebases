import { WebUrlLocationProps, WebUrlLocationPlaceholder } from 'owa-location-placeholder';
export { createLocationPersonaFromStringLocation } from './utils/createLocationPersonaFromStringLocation';
export { createLocationPersonaFromPersonaType } from './utils/createLocationPersonaFromPersonaType';
export { createLocationPersonaFromEnhancedLocation } from './utils/createLocationPersonaFromEnhancedLocation';
export type { LocationPersonaControlViewState } from './data/schema/LocationPersonaControlViewState';
export { LocationPersonaControl } from './components/LocationPersonaControl';
export { default as getBingUrl } from './utils/getBingUrl';
export { default as getLocationPhoto } from './utils/getLocationPhoto';
export { default as isEnhancedLocation } from './utils/isEnhancedLocation';
export { default as isRoom } from './utils/isRoom';
import { LazyImport, LazyModule, createLazyComponent, LazyModuleType } from 'owa-bundling';
export type { LocationRelevanceData } from './data/schema/LocationRelevanceData';
export { createEnhancedLocationFromRoomInfo } from './utils/createEnhancedLocationFromRoomInfo';
export {
    containsLocation,
    containsLocationWithId,
    containsRoomWithEmail,
} from './utils/areEnhancedLocationsEqual';
export { getRoomEmailFromLocation } from './utils/getRoomEmailFromLocation';
export { createEnhancedLocationFromStringLocation } from './utils/createEnhancedLocationFromStringLocation';
export { default as createEnhancedLocationFromTxpData } from './utils/createEnhancedLocationFromTxpData';
export {
    containsWebUrlLocation,
    openWebLocation,
    getWebUrlsFromString,
} from './utils/webLocationUtils';

const lazyModule = new LazyModule(() => import('./lazyIndex'));

export let lazyCreateTxpPostalAddressFromLocationPersona = new LazyImport(
    lazyModule,
    m => m.createTxpPostalAddressFromLocationPersona
);

export const WebUrlLocation = createLazyComponent<
    WebUrlLocationProps,
    LazyModuleType<typeof lazyModule>,
    {}
>(lazyModule, m => m.WebUrlLocation, WebUrlLocationPlaceholder);

export { default as createEnhancedLocationsFromPersonaControlViewState } from './utils/createEnhancedLocationsFromPersonaControlViewState';
