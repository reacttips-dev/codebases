import { SignalSubFilter } from "./types";

export const SIGNAL_NAME_PREFIX = "workspace.sales.signals";
export const SIGNALS_GROUP_TITLE_PREFIX = `${SIGNAL_NAME_PREFIX}.title`;
export const SIGNALS_MAIN_DROPDOWN_PREFIX = `${SIGNAL_NAME_PREFIX}.drop_down_main`;
// Tabs
export const SIGNALS_TABS_PREFIX = `${SIGNAL_NAME_PREFIX}.tabs`;
export const SIGNALS_ALL_COUNTRIES_TAB = `${SIGNALS_TABS_PREFIX}.all_countries`;
export const SIGNALS_OTHER_COUNTRIES_TAB = `${SIGNALS_TABS_PREFIX}.other_countries`;
export const SIGNALS_CURRENT_COUNTRY_TAB = `${SIGNALS_TABS_PREFIX}.current_country`;
// Filter dropdown
export const SIGNALS_DROPDOWN_TITLE = `${SIGNALS_MAIN_DROPDOWN_PREFIX}.title`;
export const SIGNALS_DROPDOWN_TOOLTIP = `${SIGNALS_MAIN_DROPDOWN_PREFIX}.tooltip`;
export const SIGNALS_DROPDOWN_PLACEHOLDER = `${SIGNALS_MAIN_DROPDOWN_PREFIX}.placeholder`;
export const SIGNALS_DROPDOWN_WIDTH = 287;
// Sub-filter dropdown
export const SIGNALS_CHANGE_DROPDOWN_TITLE = `${SIGNAL_NAME_PREFIX}.drop_down_change.title`;
export const SIGNALS_CHANGE_DROPDOWN_TITLE_PREFIX = `${SIGNAL_NAME_PREFIX}.drop_down_change`;
export const SIGNALS_CHANGE_DROPDOWN_DROP_TITLE = `${SIGNAL_NAME_PREFIX}.drop_down_change.drop`;
export const SIGNALS_CHANGE_DROPDOWN_SPIKE_TITLE = `${SIGNAL_NAME_PREFIX}.drop_down_change.spike`;
export const SIGNALS_CHANGE_DROPDOWN_DEFAULT_ITEM_CODE = "title";
export const SIGNALS_CHANGE_DROPDOWN_DEFAULT_ITEM: SignalSubFilter = {
    code: SIGNALS_CHANGE_DROPDOWN_DEFAULT_ITEM_CODE,
    count: Number.POSITIVE_INFINITY,
};
// Most used
export const SIGNALS_USER_DATA_STORE_KEY = "salesSignalsUse";
export const SIGNALS_MOST_USED_COUNT = 3;

export const AD_NETWORKS_FILTER_ID = "ad_networks";
