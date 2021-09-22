import { isEmpty } from 'lodash';

const isLocationGeoCoded = (locationGeocoded, locationLat) => !!locationGeocoded || !!locationLat;

export const initialState = {
	previous: null,
	current: null,
	meta: {
		is_location_geocoded: null,
		send_activity_notifications: null,
		is_date_time_set_from_calendar: null,
		follow_up: null,
	},
	externalMeta: {},
	trackDismissed: true,
};

const extractMeta = (fields, source) => {
	const meta = {};

	if ('location' in fields) {
		meta.is_location_geocoded = isLocationGeoCoded(fields.locationGeocoded, fields.locationLat);
	}

	if ('sendActivityNotifications' in fields) {
		meta.send_activity_notifications = !!fields.sendActivityNotifications;
	}

	if (['dueDate', 'dueTime', 'duration'].find((field) => field in fields)) {
		meta.is_date_time_set_from_calendar = source === 'agenda';
	}

	return {
		hasMeta: !isEmpty(meta),
		meta,
	};
};

const removeDismissTracking = (state) => ({ ...state, trackDismissed: false });
const storeSaveResults = (state, action) => ({ ...state, current: action.response });
const storeExtractedMeta = (state, { meta, hasMeta }) => {
	return hasMeta ? { ...state, meta: { ...state.meta, ...meta } } : state;
};

// eslint-disable-next-line complexity
export default (state = initialState, action = { type: 'INIT' }) => {
	switch (action.type) {
		case 'ACTIVITY_FORM_EDIT_LOADED':
			return {
				...state,
				previous: action.response,
			};
		case 'ACTIVITY_SAVE_START':
		case 'ACTIVITY_REMOVE_START':
			return removeDismissTracking(state);
		case 'ACTIVITY_SAVE_RESULT':
		case 'ACTIVITY_REMOVE_RESULT':
			return storeSaveResults(state, action);
		case 'FIELD_UPDATE': {
			const fields = { [action.field]: action.value };

			return storeExtractedMeta(state, extractMeta(fields, action.source));
		}
		case 'UPDATE_MULTIPLE_FIELDS':
			return storeExtractedMeta(state, extractMeta(action.fields, action.source));
		case 'ACTIVITY_IS_FOLLOW_UP':
			return {
				...state,
				meta: {
					...state.meta,
					follow_up: action.isFollowUp,
				},
			};
		case 'SET_EXTERNAL_META':
			return { ...state, externalMeta: action.meta };
		case 'CLEAR_ALL':
			return { ...initialState, externalMeta: state.externalMeta };
		default:
			return state;
	}
};
