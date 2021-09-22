import type CharmsInfoSchema from './schema/CharmsInfoSchema';
import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "CharmsCatalog"*/ './lazyIndex')
);
export interface GetCalendarCharmsInfo {
    charmStore: CharmsInfoSchema;
}

export let lazyLoadCharmsCatalog = new LazyAction(lazyModule, m => m.loadCharmsCatalog);
export let lazyLoadCharmSvgTextInMap = new LazyAction(lazyModule, m => m.loadCharmSvgTextInMap);

// Export synchronous utils
export { default as areDefaultCharmsAvailable } from './actions/areDefaultCharmsAvailable';
export { default as getAllCharmKeywords } from './actions/getAllCharmKeywords';
export { default as getCharmForIdFromStore } from './actions/getCharmForIdFromStore';
export { default as getDefaultCharms } from './actions/getDefaultCharms';
export { default as getKeywordInfo } from './actions/getKeywordInfo';
export { default as getCharmForId } from './utils/getCharmForId';
export { default as getCharmForIdOrUnsetCharm } from './utils/getCharmForIdOrUnsetCharm';
export { default as getCharmForKeyword } from './utils/getCharmForKeyword';
export { default as getNoCharmInfoObject } from './utils/getNoCharmInfoObject';
export { default as getEffectiveCharm } from './utils/getEffectiveCharm';

export {
    CHARMS_USAGE_SELECTION_TYPE,
    CHARMS_USAGE_GETDEFAULTSET,
    CHARMS_USAGE_SUGGESTIONS_SHOWN,
    CHARMS_USAGE_AUTOSELECT_OVERRIDE_MANUAL,
    CHARMS_USAGE_SOURCE_QUICKCOMPOSE,
    CHARMS_USAGE_SOURCE_CALENDARPICKERCONTEXTMENU,
    CHARMS_USAGE_SOURCE_READINGPANECALENDARCHARM,
    CHARMS_USAGE_SOURCE_CALENDARITEMCONTEXTMENUITEMS,
    CHARMS_USAGE_SOURCE_CHARMPICKERANCHORBUTTON,
} from './datapoints';
export { default as charmsDatapoints } from './datapoints';
export type { default as CharmInfo } from './schema/CharmInfo';
