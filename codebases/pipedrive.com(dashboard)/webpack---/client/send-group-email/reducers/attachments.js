import { combineReducers } from 'redux';
import { getUid } from 'utils/helpers';

const replaceTemplateAttachments = (state, action) => {
	const manuallyAddedAttachments = state.filter(
		({ file: { mail_template_id: templateId } }) => !templateId
	);
	const newTemplateAttachments = action.attachments.map((file) => ({
		file,
		loadingPercent: 100,
		isLoading: false,
		localId: getUid()
	}));

	return [...newTemplateAttachments, ...manuallyAddedAttachments];
};

const mapNewFileToState = (state, action) => {
	const attachments = state.map((attachment) => {
		if (attachment.localId === action.attachment.localId) {
			return action.attachment;
		} else {
			return attachment;
		}
	});

	return attachments;
};

const deleteAttachment = (state, action) => {
	const attachments = state.filter(({ localId }) => {
		return localId !== action.localId;
	});

	return attachments;
};

const files = (state = [], action) => {
	switch (action.type) {
		case 'RESET':
			return [];
		case 'ATTACHMENTS_POST_INIT':
			return [...state, ...action.attachments];
		case 'ATTACHMENTS_POST_ONPROGRESS':
			return mapNewFileToState(state, action);
		case 'ATTACHMENTS_POST_SUCCESS':
			return mapNewFileToState(state, action);
		case 'ATTACHMENTS_POST_FAILURE':
			return mapNewFileToState(state, action);
		case 'REPLACE_TEMPLATE_ATTACHMENTS':
			return replaceTemplateAttachments(state, action);
		case 'DELETE_ATTACHMENT':
			return deleteAttachment(state, action);
		default:
			return state;
	}
};

const tooBigFiles = (state = [], action) => {
	switch (action.type) {
		case 'RESET':
			return [];
		case 'SHOW_FILE_SIZE_ALERT':
			return [...action.tooBigFiles];
		default:
			return state;
	}
};

export default combineReducers({
	files,
	tooBigFiles
});
