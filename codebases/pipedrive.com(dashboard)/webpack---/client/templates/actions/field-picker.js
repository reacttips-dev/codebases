import update from 'immutability-helper';
import { apiGetLinkedDeal, apiGetPerson, apiGetOrganization } from '../../api';
import {
	getPreparedDealData,
	getCustomFieldsValues,
	getPreparedPersonData
} from '../helpers/field-picker';

import {
	getPersonFields,
	getOrgFields,
	getDealFields,
	getLeadFields,
	getOtherFields
} from '../helpers/fields';

import { actionTypes } from '../../shared/constants/action-types';

export const setRecents = (userSettings, hideLeadFields = false) => (dispatch) => {
	const fieldPickerRecents = userSettings.get('field_picker_recents') || [];

	const fieldPickerRecentsWithoutLeads = fieldPickerRecents.filter(
		(field) => !field.startsWith('lead')
	);

	dispatch({
		type: actionTypes.SET_FIELD_PICKER_RECENTS,
		data: hideLeadFields ? fieldPickerRecentsWithoutLeads : fieldPickerRecents
	});
};

export const updateRecents = (userSettings, field) => (dispatch, getState) => {
	const fieldPickerRecents = getState().fieldRecents || [];
	const recentString = `${field.type}_${field.fieldKey}`;
	const existingIndex = fieldPickerRecents.indexOf(recentString);

	let newRecents = update(fieldPickerRecents, { $set: fieldPickerRecents });

	if (existingIndex > -1) {
		newRecents = update(newRecents, { $splice: [[existingIndex, 1]] });
	} else {
		if (fieldPickerRecents.length >= 10) {
			newRecents = update(fieldPickerRecents, { $splice: [[-1, 1]] });
		}
	}

	newRecents = update(newRecents, { $unshift: [recentString] });

	if (userSettings) {
		userSettings.save(
			{ field_picker_recents: newRecents },
			{
				success: () => {
					dispatch({
						type: actionTypes.SET_FIELD_PICKER_RECENTS,
						data: newRecents
					});
				}
			}
		);
	}
};

export const setFields = (translator, userSelf, hideLeadFields = false) => (dispatch) => {
	const personFields = getPersonFields(translator, userSelf);
	const dealFields = getDealFields(translator, userSelf);
	const leadFields = hideLeadFields ? [] : getLeadFields(userSelf);
	const orgFields = getOrgFields(translator, userSelf);
	const otherFields = getOtherFields(translator);
	const data = personFields.concat(dealFields, leadFields, orgFields, otherFields);

	dispatch({
		type: actionTypes.SET_FIELDS,
		data
	});
};

export const clearDealData = () => (dispatch) => {
	dispatch({ type: actionTypes.CLEAR_DEAL_DATA });
};

export const setConfigMode = (mode) => (dispatch) => {
	dispatch({
		type: actionTypes.SET_CONFIG_MODE,
		data: mode
	});
};

export const setHideDealFieldsFlag = (flag) => (dispatch) => {
	dispatch({
		type: actionTypes.SET_HIDE_DEAL_FIELDS_FLAG,
		data: flag
	});
};

export const setHideLeadFieldsFlag = (flag) => (dispatch) => {
	dispatch({
		type: actionTypes.SET_HIDE_LEAD_FIELDS_FLAG,
		data: flag
	});
};

export const clearPersonData = () => (dispatch) => {
	dispatch({ type: actionTypes.CLEAR_PERSON_DATA });
};

export const fieldsSearchInputChange = (keyword) => (dispatch) => {
	dispatch({
		type: actionTypes.FIELDS_SEARCH_INPUT_CHANGE,
		keyword
	});
};

export const getLinkedDeal = (id, callback) => (dispatch, getState) => {
	dispatch({ type: actionTypes.GET_LINKED_DEAL_REQUEST });

	apiGetLinkedDeal(id, {
		success: (data, relatedObjects) => {
			data = getPreparedDealData(data, relatedObjects, getState().userSelf);

			dispatch({
				type: actionTypes.GET_LINKED_DEAL_SUCCESS,
				data
			});

			callback(data);
		},
		error: () => {
			dispatch({ type: actionTypes.GET_LINKED_DEAL_ERROR });
		}
	});
};

export const getPerson = (id, callback) => (dispatch, getState) => {
	dispatch({ type: actionTypes.GET_PERSON_REQUEST });

	apiGetPerson(id, {
		success: (data, relatedObjects) => {
			data = getPreparedPersonData(data, relatedObjects, getState().userSelf);

			dispatch({
				type: actionTypes.GET_PERSON_SUCCESS,
				data
			});
			callback(data);
		},
		error: () => {
			dispatch({ type: actionTypes.GET_PERSON_ERROR });
		}
	});
};

export const getOrganization = (id, callback) => (dispatch, getState) => {
	dispatch({ type: actionTypes.GET_ORGANIZATION_REQUEST });

	apiGetOrganization(id, {
		success: (data, relatedObjects) => {
			data = getCustomFieldsValues(data, relatedObjects, 'organization', getState().userSelf);
			dispatch({
				type: actionTypes.GET_ORGANIZATION_SUCCESS,
				data
			});
			callback(data);
		},
		error: () => {
			dispatch({ type: actionTypes.GET_ORGANIZATION_ERROR });
		}
	});
};
