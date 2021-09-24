'use es6';

export var HEARTBEAT_INTERVAL = 1000;
export var CHECK_MASTER_INTERVAL = HEARTBEAT_INTERVAL * 2; // Even though the heartbeat is running every second, the difference between
// `now()` and the heartbeat timestamp is sometimes coming back as over 2 seconds,
// causing the the tab to be removed and a new master chosen. Extending the
// threshold to 3 seconds

export var CHECK_MASTER_THRESHOLD = HEARTBEAT_INTERVAL * 3;
export var STORAGE_HEARTBEAT = 'TABS_HEARTBEAT';
export var STORAGE_MESSAGE = 'TABS_MESSAGE';
export var STORAGE_TAB_LIST = 'TABS_LIST';
export var STORAGE_TAB_VISIBLE = 'TABS_VISIBLE';
export var EVENT_BECOME_MASTER = 'becomeMaster';
export var EVENT_SURRENDER_MASTER = 'surrenderMaster';
export var EVENT_ANY_MESSAGE = 'anyMessage';
export var EVENT_MESSAGE = 'message';
export var EVENT_REMOVED = 'removed';
export var ERROR = 'error';