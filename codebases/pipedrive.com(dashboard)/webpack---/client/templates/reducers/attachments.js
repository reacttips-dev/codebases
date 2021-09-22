import { actionTypes } from '../../shared/constants/action-types';
import update from 'immutability-helper';

const initialAttachments = {
	files: [],
	fetching: false,
	error: {
		text: '',
		filename: ''
	},
	requests: []
};

export const attachments = (state = initialAttachments, action) => {
	switch (action.type) {
		case actionTypes.SET_ATTACHMENTS:
			return {
				...state,
				files: state.files.concat(action.data)
			};
		case actionTypes.UPLOAD_ATTACHMENTS_REQUESTS:
			return {
				...state,
				requests: action.requests
			};

		case actionTypes.EDIT_ATTACHMENT:
			return update(state, { files: { [action.index]: { $set: action.data } } });

		case actionTypes.UPLOAD_ATTACHMENT_REQUEST:
			return {
				...state,
				error: initialAttachments.error,
				fetching: true
			};

		case actionTypes.ATTACHMENT_REQUEST_SUCCESS:
			return {
				...state,
				error: { ...initialAttachments.error },
				files: action.data,
				fetching: false
			};

		case actionTypes.UPLOAD_ATTACHMENT_ERROR:
			return {
				...state,
				fetching: false,
				error: {
					filename: action.filename,
					text: action.text
				}
			};

		case actionTypes.DELETE_ATTACHMENT_SUCCESS:
			return update(state, { files: { $splice: [[action.index, 1]] } });

		case actionTypes.GET_ATTACHMENTS_ERROR:
			return {
				...state,
				fetching: false,
				error: action.error
			};

		case actionTypes.CLEAR_ATTACHMENTS:
			return initialAttachments;

		default:
			return state;
	}
};

const initialDeletingAttachmentsRequest = {
	ids: [],
	error: null
};

export const deletingAttachmentsRequest = (state = initialDeletingAttachmentsRequest, action) => {
	if (action.type === actionTypes.DELETE_ATTACHMENT_REQUEST) {
		return {
			...state,
			ids: update(state.ids, { $push: [action.id] })
		};
	}

	if (action.type === actionTypes.DELETE_ATTACHMENT_SUCCESS) {
		return update(state, { ids: { $splice: [[action.deleteIndex, 1]] } });
	}

	if (action.type === actionTypes.DELETE_ATTACHMENT_ERROR) {
		return state;
	}

	return state;
};

export const attachmentUploadProgress = (state = {}, action) => {
	if (action.type === actionTypes.SET_ATTACHMENT_UPLOAD_PERCENT) {
		return {
			...state,
			[action.id]: {
				percent: action.percent,
				xhr: action.xhr
			}
		};
	}

	if (action.type === actionTypes.CLEAR_ATTACHMENT_UPLOAD_PROGRESS) {
		return {};
	}

	return state;
};
