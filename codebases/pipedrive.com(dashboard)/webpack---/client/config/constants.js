const constants = {
	CALENDAR_HEADER_HEIGHT: 40,

	HOURS_IN_DAY: 24,
	MINUTES_IN_DAY: 1440,

	HEIGHT_OF_HOUR: 48,
	HEIGHT_OF_ALLDAY_ACTIVITY: 24,
	SPACE_BETWEEN_ALLDAY_ACTIVITIES: 2,

	ALLDAY_OFFSET: {
		TOP: 8,
		BOTTOM: 8,
		LEFT: 56,
	},

	GRID_OFFSET: {
		get TOP() {
			return 0.5 * constants.HEIGHT_OF_HOUR;
		},
		BOTTOM: 0,
	},

	UTC_DATE_FORMAT: 'YYYY-MM-DD',
	UTC_DATETIME_FORMAT: 'YYYY-MM-DD HH:mm',
	FORMAT_12H: 'h A',
	FORMAT_12H_FULL: 'h:mm A',
	FORMAT_24H: 'HH:mm',
	TIME_FORMATS: ['hh:mm', 'h:mm A', 'h A', 'h:mmA', 'hA'],
	DATE_FORMATS: [
		'MM/DD/YYYY',
		'MMM DD YYYY',
		'DD MMMM YYYY',
		'YYYY MMMM DD',
		'YYYY DD MMMM',
		'MMM D, YYYY',
	],

	DEFAULT_LOCALE: 'en-GB',

	DURATIONS: {
		ALLDAY_DEFAULT_DURATION: 24 * 60 * 60 * 1000,
		GRID_DEFAULT_DURATION: 60 * 60 * 1000,
		GRID_MIN_DURATION: 30 * 60 * 1000,
	},

	ITEM_CONTEXT: {
		GRID: 'grid',
		ALLDAY: 'allday',
	},

	ITEM_TYPE: {
		ACTIVITY: 'activity',
		TIMESLOT: 'timeslot',
		COLLAPSIBLE: 'collapsible',
	},

	TYPE_SELECT_VISIBLE_ITEMS: 7,

	ESC_KEY: 27,

	SAVE_RESULT_SUCCESS: 'success',
	SAVE_RESULT_ERROR: 'error',
	DELETE_RESULT_SUCCESS: 'delete_success',

	ZOOM_MARKETPLACE_LINK:
		'https://www.pipedrive.com/en/marketplace/app/zoom-meetings/871b8bc88d3a1202',
	CONNECT_ERROR: 'connect_error',
	RETRY_ERROR: 'retry_error',

	JOIN_MEETING: 'join_meeting',
	COPY_LINK: 'copy_link',
	DELETE_LINK: 'delete_link',

	GUESTS: 'guests',
	LOCATION: 'location',
	DESCRIPTION: 'description',
	VIDEO_CALL: 'video_call',
};

module.exports = constants;
