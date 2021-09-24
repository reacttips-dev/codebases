'use es6';

import PortalIdParser from 'PortalIdParser';

var _portalId = PortalIdParser.get();

export var TIMEZONE_SELECTION = 'sales-modal:timezone-selection';
export var SELECT_TABLE_SORT = 'sales-modal:select-table-sort';
export var SELECT_TABLE_VIEW_FILTER = _portalId + "-sales-modal:select-table-view-filter";
export var REAGAN_LIGHT_DEBUG = 'sales-modal:REAGAN_LIGHT_DEBUG';
export var SELECTED_SENDER_ADDRESS_ALIAS = 'sales-modal:selected-sender-alias-address';
export var BULK_ENROLL_SHEPHERD_DISMISSED = 'sequencesui.bulkEnrollShepherdDismissed';