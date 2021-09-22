import { actionTypes } from '../../shared/constants/action-types';

export const manageTemplatesModal = (state = { visible: false }, action) => {
	if (action.type === actionTypes.OPEN_MANAGE_TEMPLATES_MODAL) {
		return action.data;
	}

	if (action.type === actionTypes.CLOSE_MANAGE_TEMPLATES_MODAL) {
		return action.data;
	}

	return state;
};

const initialTemplateModalState = {
	visible: false,
	fetching: false,
	isSaving: false,
	template: {
		name: '',
		shared_flag: 0,
		content: '',
		subject: ''
	},
	openManageTemplatesModalOnClose: false,
	errorCause: '',
	errorText: '',
	fromDraft: false
};

export const addOrEditTemplateModal = (state = initialTemplateModalState, action) => {
	switch (action.type) {
		case actionTypes.ADD_OR_EDIT_TEMPLATE_MODAL_GET_REQUEST:
			return {
				...state,
				template: { ...state.template },
				fetching: true
			};
		case actionTypes.ADD_OR_EDIT_TEMPLATE_MODAL_SUCCESS:
			return {
				...state,
				fetching: false,
				fromDraft: action.fromDraft,
				template: {
					...initialTemplateModalState.template,
					...action.template
				}
			};
		case actionTypes.OPEN_ADD_OR_EDIT_TEMPLATE_MODAL:
			return {
				...state,
				template: { ...state.template },
				visible: true
			};
		case actionTypes.CLOSE_ADD_OR_EDIT_TEMPLATE_MODAL:
			return {
				...state,
				fromDraft: false,
				template: { ...initialTemplateModalState.template },
				visible: false
			};
		case actionTypes.ADD_OR_EDIT_TEMPLATE_MODAL_FIELD_CHANGE:
			return {
				...state,
				template: {
					...state.template,
					[action.field]: action.value
				}
			};
		case actionTypes.SAVE_TEMPLATE_REQUEST:
			return {
				...state,
				template: { ...state.template },
				isSaving: true
			};
		case actionTypes.SAVE_TEMPLATE_REQUEST_SUCCESS:
			return {
				...state,
				template: { ...state.template },
				isSaving: false
			};
		case actionTypes.SAVE_TEMPLATE_REQUEST_ERROR:
			return {
				...state,
				template: { ...state.template },
				isSaving: false,
				errorCause: action.errorCause,
				errorText: action.errorText
			};
		case actionTypes.OPEN_MANAGE_TEMPLATES_MODAL_NEXT: {
			return {
				...state,
				template: { ...state.template },
				openManageTemplatesModalOnClose: action.data
			};
		}
		default:
			return state;
	}
};
