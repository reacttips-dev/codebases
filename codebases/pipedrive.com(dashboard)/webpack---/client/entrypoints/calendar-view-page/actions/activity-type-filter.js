import * as Immutable from 'immutable';
import { updateUserSetting } from '../../../webapp-api';

const EXCLUDED_ACTIVITY_TYPES_SETTING = 'calendar_quickfilter_excluded_types';

function setItems(items) {
	return {
		type: 'ITEMS',
		items,
	};
}

function toggleActivityTypeExcluded(keyString) {
	return {
		type: 'TOGGLE_EXCLUDED',
		keyString,
	};
}

function toggleAllExcluded(isSelected) {
	return {
		type: 'TOGGLE_ALL_EXCLUDED',
		isSelected,
	};
}

export function initActivityTypeFilter(webappApi) {
	return async (dispatch) => {
		const activityTypes = Immutable.fromJS(webappApi.userSelf.get('activity_types'));
		const userSetting = webappApi.userSelf.settings.get(EXCLUDED_ACTIVITY_TYPES_SETTING);
		const excludedTypes = `${userSetting}`.split(',');

		const items = activityTypes.reduce((result, activityType) => {
			const keyString = activityType.get('key_string');
			const excluded = excludedTypes.includes(keyString);
			const entry = activityType.set('excluded', excluded);

			return result.setIn([keyString], entry);
		}, Immutable.Map());

		dispatch(setItems(items));
	};
}

export function updateExcludedTypesSetting(webappApi) {
	return (dispatch, getState) => {
		const state = getState();
		const excludedActivityTypes = state
			.getIn(['activityTypeFilter', 'items'])
			.filter((item) => item.get('excluded'))
			.map((item) => item.get('key_string'))
			.join(',');

		return updateUserSetting(webappApi, EXCLUDED_ACTIVITY_TYPES_SETTING, excludedActivityTypes);
	};
}

export function toggleAllActivityTypes(webappApi, isSelected) {
	return (dispatch) => {
		dispatch(toggleAllExcluded(isSelected));
		dispatch(updateExcludedTypesSetting(webappApi));
	};
}

export function toggleExcludedActivityType(webappApi, keyString) {
	return (dispatch) => {
		dispatch(toggleActivityTypeExcluded(keyString));
		dispatch(updateExcludedTypesSetting(webappApi));
	};
}
