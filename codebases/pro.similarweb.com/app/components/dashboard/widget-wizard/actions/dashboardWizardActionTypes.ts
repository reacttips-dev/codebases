// To inform that a the user clicked in the "Add Metric" button - means we're going to reset the state.
export const DASHBOARD_WIZARD_WIDGET_NEW = "DASHBOARD_WIZARD_WIDGET_NEW";

// To inform that the wizard's family and metric have been changed.
export const DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED = "DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED";

// To inform that the wizard's key (selected websites \ apps \ industry \ keyword) has been changed.
export const DASHBOARD_WIZARD_KEY_CHANGED = "DASHBOARD_WIZARD_KEY_CHANGED";

// To inform that another key item (website \ app \ industry \ keyword) has been added to the key list.
export const DASHBOARD_WIZARD_KEY_APPEND = "DASHBOARD_WIZARD_KEY_APPEND";

// To inform that a key item (website \ app \ industry \ keyword) has been removed from the key list.
export const DASHBOARD_WIZARD_KEY_REMOVE = "DASHBOARD_WIZARD_KEY_REMOVE";

// To inform that the selected traffic source (Total \ Desktop \ MobileWeb) has been changed.
export const DASHBOARD_WIZARD_WEBSOURCE_CHANGED = "DASHBOARD_WIZARD_WEBSOURCE_CHANGED";

// To inform that the selected date range has been changed.
export const DASHBOARD_WIZARD_DURATION_CHANGED = "DASHBOARD_WIZARD_DURATION_CHANGED";

// To inform that the selected compared duration (period over period) has been changed.
export const DASHBOARD_WIZARD_COMPARED_DURATION_CHANGED =
    "DASHBOARD_WIZARD_COMPARED_DURATION_CHANGED";

// To inform that the selected country has been changed.
export const DASHBOARD_WIZARD_COUNTRY_CHANGED = "DASHBOARD_WIZARD_COUNTRY_CHANGED";

// To inform that the selected widget type (visualization [pie, graph...]) has been changed.
export const DASHBOARD_WIZARD_WIDGET_TYPE_CHANGED = "DASHBOARD_WIZARD_WIDGET_TYPE_CHANGED";

// To inform that a dynamic filter that is defined in the metric config (e.g. grnularity, order by...) has been changed.
export const DASHBOARD_WIZARD_FILTER_CHANGED = "DASHBOARD_WIZARD_FILTER_CHANGED";

export const DASHBOARD_WIZARD_DATAMODE_CHANGED = "DASHBOARD_WIZARD_DATAMODE_CHANGED";

// To inform that a server request to recieve metric meta data (for apps only) is triggered.
export const DASHBOARD_WIZARD_REQUEST_METRIC_META_DATA =
    "DASHBOARD_WIZARD_REQUEST_METRIC_META_DATA";

// To inform that a server request to recieve metric meta data (for apps only) returned with status success.
export const DASHBOARD_WIZARD_RECEIVE_METRIC_META_DATA_SUCCESS =
    "DASHBOARD_WIZARD_RECEIVE_METRIC_META_DATA_SUCCESS";

// To inform that a server request to recieve metric meta data (for apps only) returned with status error.
export const DASHBOARD_WIZARD_RECEIVE_METRIC_META_DATA_ERROR =
    "DASHBOARD_WIZARD_RECEIVE_METRIC_META_DATA_ERROR";

// To inform that the customDashboard.widget store path is updated.
// We use this action when the user edit a widget to update the customDashboard.widget store path with
// the current widget props.
export const DASHBOARD_WIZARD_WIDGET_CHANGED = "DASHBOARD_WIZARD_WIDGET_CHANGED";

// To inform that a channel selection has been made. This is releveant for MMX metrics in compare mode.
export const DASHBOARD_WIZARD_SELECTED_CHANNEL_CHANGED =
    "DASHBOARD_WIZARD_SELECTED_CHANNEL_CHANGED";

// To inform that a server request to indicate if the current metric and keys supports GA data returned with status success.
export const DASHBOARD_WIZARD_RECEIVE_GA_VERIFIED_SUCCESS =
    "DASHBOARD_WIZARD_RECEIVE_GA_VERIFIED_SUCCESS";

export const DASHBOARD_WIZARD_NO_KEYS = "DASHBOARD_WIZARD_NO_KEYS";
