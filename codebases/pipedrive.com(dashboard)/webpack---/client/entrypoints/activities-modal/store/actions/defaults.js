import { getDefaultActivityType } from '../../../../utils/activity';

export function setActivityTypes(webappApi) {
	return {
		type: 'ACTIVITY_FORM_ACTIVITY_TYPES',
		activityTypes: webappApi.userSelf.attributes.activity_types.sort(
			(a, b) => a.order_nr - b.order_nr,
		),
	};
}

export function setDefaultActivityType(webappApi) {
	return {
		type: 'ACTIVITY_FORM_DEFAULT_ACTIVITY_TYPE',
		defaultActivityType: getDefaultActivityType(webappApi),
	};
}
