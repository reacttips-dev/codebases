import { combineReducers } from 'redux';
import { SET_USER_EMAIL } from '../actions/user';
import route from '../../shared/reducers/route';
import translator from '../../shared/reducers/translator';
import userSelf from '../../shared/reducers/user-self';
import linkedLead from '../../shared/reducers/linked-lead';
import {
	fields,
	linkedDeal,
	organization,
	person,
	fieldRecents,
	fieldsSearchInputText
} from './field-picker';
import { addOrEditTemplateModal, manageTemplatesModal } from './modals';
import { attachments, deletingAttachmentsRequest, attachmentUploadProgress } from './attachments';
import { actionTypes } from '../../shared/constants/action-types';

const templates = (state = [], action) => {
	if (action.type === actionTypes.SET_TEMPLATES_DATA) {
		return action.data;
	}

	return state;
};

const configMode = (state = false, action) => {
	if (action.type === actionTypes.SET_CONFIG_MODE) {
		return action.data;
	}

	return state;
};

const hideDealFields = (state = false, action) => {
	if (action.type === actionTypes.SET_HIDE_DEAL_FIELDS_FLAG) {
		return action.data;
	}

	return state;
};

const hideLeadFields = (state = false, action) => {
	if (action.type === actionTypes.SET_HIDE_LEAD_FIELDS_FLAG) {
		return action.data;
	}

	return state;
};

const fetchingTemplates = (state = false, action) => {
	if (action.type === actionTypes.GET_TEMPLATES_REQUEST) {
		return true;
	}

	if (
		[actionTypes.GET_TEMPLATES_SUCCESS, actionTypes.GET_TEMPLATES_ERROR].includes(action.type)
	) {
		return false;
	}

	return state;
};

const deletingTemplatesInitialState = {
	pending: false,
	ids: [],
	errorText: '',
	errorCause: ''
};

const deletingTemplatesRequest = (state = deletingTemplatesInitialState, action) => {
	if (action.type === actionTypes.DELETE_TEMPLATES_REQUEST) {
		return {
			...deletingTemplatesInitialState,
			pending: true,
			ids: action.ids
		};
	}

	if (action.type === actionTypes.DELETE_TEMPLATES_SUCCESS) {
		return {
			...deletingTemplatesInitialState,
			pending: false,
			ids: [...state.ids]
		};
	}

	if (action.type === actionTypes.DELETE_TEMPLATES_ERROR) {
		return {
			pending: false,
			ids: [...state.ids],
			errorText: action.errorText,
			errorCause: action.errorCause
		};
	}

	return state;
};

const templatesSearchInputText = (state = '', action) => {
	if (action.type === actionTypes.TEMPLATES_SEARCH_INPUT_CHANGE) {
		return action.keyword;
	}

	return state;
};

const templatesOrder = (state = [], action) => {
	if (action.type === actionTypes.SET_TEMPLATES_ORDER) {
		return action.order;
	}

	return state;
};

const userEmail = (state = [], action) => {
	if (action.type === SET_USER_EMAIL) {
		return action.email;
	}

	return state;
};

const templatesOrderedByDateAsc = (state = true, action) => {
	if (action.type === actionTypes.TEMPLATES_ORDERED_BY_DATE_ASC) {
		return action.order;
	}

	return state;
};

const templatesOrderedByNameAsc = (state = true, action) => {
	if (action.type === actionTypes.TEMPLATES_ORDERED_BY_NAME_ASC) {
		return action.order;
	}

	return state;
};

export default combineReducers({
	route,
	translator,
	templates,
	linkedDeal,
	linkedLead,
	person,
	userEmail,
	organization,
	configMode,
	hideDealFields,
	hideLeadFields,
	fetchingTemplates,
	deletingTemplatesRequest,
	fields,
	fieldRecents,
	templatesSearchInputText,
	fieldsSearchInputText,
	userSelf,
	manageTemplatesModal,
	addOrEditTemplateModal,
	templatesOrder,
	attachments,
	deletingAttachmentsRequest,
	attachmentUploadProgress,
	templatesOrderedByDateAsc,
	templatesOrderedByNameAsc
});
