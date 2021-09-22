import { merge } from 'lodash';

import {
	dependentFields,
	extractActivityDataToFields,
	fetchActivityRelatedObjects,
	fetchDependentFields,
} from './utils/activity';
import {
	prepareNewActivityFields,
	wrapRelatedParticipants,
	wrapRelatedOrganization,
	wrapRelatedDeal,
} from './utils/form';
import { startLoadingActivity, stopLoadingActivity } from './request-state';

export function updateField(field, value, source = 'form') {
	const fieldUpdate = {
		type: 'FIELD_UPDATE',
		field,
		value,
		source,
	};

	// It is important to dispatch updates that user type without awaiting for promise,
	// otherwise multi-keystroke insertions do not work.
	if (!(field in dependentFields)) {
		return fieldUpdate;
	}

	return async (dispatch, getState, { translator }) => {
		const fields = await fetchDependentFields(field, value, getState().toJS(), translator);

		if (!fields) {
			return dispatch(fieldUpdate);
		}

		return dispatch(updateMultipleFields(fields, source));
	};
}

export function updateMultipleFields(fields, source = 'form') {
	return {
		type: 'UPDATE_MULTIPLE_FIELDS',
		fields,
		source,
	};
}

function savePreviousShape(fields) {
	return {
		type: 'SET_PREVIOUS_ACTIVITY_SHAPE',
		fields,
	};
}

export function setError(field, hasError) {
	return {
		type: 'SET_FIELD_ERROR',
		field,
		hasError,
	};
}

export function clearAllErrors() {
	return { type: 'CLEAR_FIELD_ERRORS' };
}

export function clearActivityDateErrors() {
	return {
		type: 'CLEAR_SPECIFIC_FIELD_ERRORS',
		fields: ['startDate', 'startTime', 'endDate', 'endTime'],
	};
}

export function clearAll() {
	return { type: 'CLEAR_ALL' };
}

function activityToAddLoaded(fields) {
	return (dispatch) => {
		dispatch(updateMultipleFields(fields));
		dispatch({
			type: 'ACTIVITY_FORM_ADD_LOADED',
			fields,
		});
	};
}

export function setNewActivityRelatedModel({
	participants: relatedParticipants,
	organization: relatedOrganization,
	deal: relatedDeal,
}) {
	return (dispatch, _, { webappApi, translator }) => {
		dispatch(clearAll());
		dispatch(startLoadingActivity(null));

		const itemHiddenText = translator.gettext('hidden');
		const participants = wrapRelatedParticipants(relatedParticipants, itemHiddenText);
		const organization = wrapRelatedOrganization(relatedOrganization, itemHiddenText);
		const deal = wrapRelatedDeal(relatedDeal, itemHiddenText);

		dispatch(
			activityToAddLoaded({
				...(participants ? { participants } : {}),
				...(organization ? { organization } : {}),
				...(deal ? { deal } : {}),
				...prepareNewActivityFields(webappApi),
			}),
		);

		return dispatch(stopLoadingActivity());
	};
}

function setFollowUpActivity(isFollowUp) {
	return {
		type: 'ACTIVITY_IS_FOLLOW_UP',
		isFollowUp,
	};
}

export function prepopulateActivityFromParams({
	next,
	dealId,
	lead,
	project,
	personId,
	orgId,
	...data
}) {
	return async (dispatch, _, { translator, webappApi }) => {
		dispatch(clearAll());
		dispatch(startLoadingActivity(null));
		dispatch(setFollowUpActivity(!!next));

		const relatedObjects = await fetchActivityRelatedObjects(
			{ dealId, lead, project, personId, orgId },
			translator,
		);
		const activityDetails = extractActivityDataToFields({ data }, translator);

		dispatch(
			activityToAddLoaded(
				merge(prepareNewActivityFields(webappApi), relatedObjects, activityDetails),
			),
		);

		return dispatch(stopLoadingActivity());
	};
}

export function activityToEditLoaded(fields, response) {
	return (dispatch) => {
		dispatch(updateMultipleFields(fields));
		dispatch(savePreviousShape(fields));
		dispatch({
			type: 'ACTIVITY_FORM_EDIT_LOADED',
			response,
		});
	};
}
