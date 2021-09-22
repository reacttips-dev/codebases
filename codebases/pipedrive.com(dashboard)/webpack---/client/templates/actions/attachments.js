import { apiPostFile, apiDeleteFile, apiPutFile } from '../../api/index';
import { actionTypes } from '../../shared/constants/action-types';
import { getUid } from '../../utils/helpers';
import { isFunction, cloneDeep } from 'lodash';

// this should be coming from API.userSelf.additional_data, but additional_data is not attached there...
const MAX_UPLOAD_SIZE_BYTES = 52427800;

export const uploadAttachment = (file, isInline, cb, templateId) => (dispatch, getState) => {
	const requestOpts = {};

	if (isInline) {
		requestOpts.inline_flag = true;
	}

	if (templateId) {
		requestOpts.mail_template_id = templateId;
	} else {
		// flag to allow incoming file without template/message id
		requestOpts.is_mail_attachment = true;
	}

	/**
	 * We are uploading the file before template has been created
	 * which means later when we have created the template we should attach template_id to the uploaded file.
	 * `needToStoreAsTemplate` will be used to make the PUT request
	 * */
	file.needToStoreAsTemplate = true;
	file.uploadingRequest = true;

	const fileUploadRequest = apiPostFile(file, requestOpts, (ev, xhr) => {
		if (ev.lengthComputable) {
			const percent = parseInt((ev.loaded / ev.total) * 100, 10);

			dispatch({
				type: actionTypes.SET_ATTACHMENT_UPLOAD_PERCENT,
				id: file._localId,
				xhr,
				percent
			});
		}
	})
		.then((uploadedFile) => {
			// store local id in case we need to attach templateId to file later on
			uploadedFile._localId = file._localId;

			if (!uploadedFile.mail_template_id) {
				uploadedFile.needToStoreAsTemplate = true;
			}

			dispatch({
				type: actionTypes.SET_ATTACHMENT_UPLOAD_PERCENT,
				id: file._localId,
				percent: 100
			});

			dispatch({
				type: actionTypes.EDIT_ATTACHMENT,
				data: uploadedFile,
				index: getState().attachments.files.findIndex((f) => f._localId === file._localId)
			});

			if (isFunction(cb)) {
				return cb(uploadedFile);
			}
		})
		.catch(() => {
			file.error = true;

			dispatch({
				type: actionTypes.SET_ATTACHMENT_UPLOAD_PERCENT,
				id: file._localId,
				percent: 100
			});

			return file.name;
		});

	return fileUploadRequest;
};

/**
 * Creates requests to store template_id for files which were uploaded before template was created
 * @param {Number} templateId
 * @returns {Promise} - promise of PUT requests
 */
export const storeAttachmentsTemplateId = (templateId) => (dispatch, getState) => {
	const storeAttachmentsRequests = getState()
		.attachments.files.filter(
			(file) => file.needToStoreAsTemplate && file.id && !file.toBeRemoved
		)
		.map((file) => apiPutFile(file.id, { mail_template_id: templateId }));

	return Promise.all(storeAttachmentsRequests);
};

export const uploadAttachments = (isInline, cb, templateId) => async (dispatch, getState) => {
	const attachmentsRequests = Promise.all(
		getState()
			.attachments.files.filter(
				(file) => file.needUpload && !file.error && !file.uploadingRequest
			)
			.map((file) => dispatch(uploadAttachment(file, isInline, cb, templateId)))
	);

	dispatch({
		type: actionTypes.UPLOAD_ATTACHMENTS_REQUESTS,
		requests: attachmentsRequests
	});

	return attachmentsRequests;
};

export const addAttachments = (files, isInline = false, cb, templateId) => (dispatch, getState) => {
	const filesizeAlerts = [];

	files = Array.from(files);
	files.forEach((file) => {
		// needed for state. this will be reset in uploadAttachment by response data
		file.needUpload = true;
		// set local id for easier handling if file is not uploaded
		file._localId = getUid();

		file.inline_flag = isInline;

		// filesize is too large
		if (file.size > MAX_UPLOAD_SIZE_BYTES) {
			file.error = true;
			filesizeAlerts.push(file.name);
		}
	});

	dispatch({
		type: actionTypes.SET_ATTACHMENTS,
		data: files
	});

	const filesizeAlertsCount = filesizeAlerts.length;

	if (filesizeAlertsCount) {
		const tooBigFilenames = `${filesizeAlerts.join(',\n')}`;
		const alertMessage = getState().translator.ngettext(
			'The uploaded file is too big. Maximum file size is 50MB.',
			'The uploaded files are too big. Maximum file size is 50MB.',
			filesizeAlertsCount
		);

		window.alert(`${alertMessage}\n${tooBigFilenames}`);
	}

	dispatch(uploadAttachments(isInline, cb, templateId));
};

export const markAttachmentToBeRemoved = (fileId) => (dispatch, getState) => {
	const file = cloneDeep(getState().attachments.files.find((f) => f.id === fileId));

	if (!file) {
		return;
	}

	file.toBeRemoved = true;

	dispatch({
		type: actionTypes.EDIT_ATTACHMENT,
		data: file,
		index: getState().attachments.files.findIndex((f) => f.id === file.id)
	});
};

export const removeAttachment = (fileId, localId, copiedFromDraft) => async (
	dispatch,
	getState
) => {
	if (copiedFromDraft) {
		return dispatch({
			type: actionTypes.DELETE_ATTACHMENT_SUCCESS,
			index: getState().attachments.files.findIndex((file) => file.id === fileId)
		});
	}

	if (fileId) {
		dispatch({
			type: actionTypes.DELETE_ATTACHMENT_REQUEST,
			id: fileId
		});

		dispatch({
			type: actionTypes.DELETE_ATTACHMENT_SUCCESS,
			index: getState().attachments.files.findIndex((file) => file.id === fileId)
		});

		try {
			await apiDeleteFile(fileId);
		} catch (err) {
			dispatch({
				type: actionTypes.DELETE_ATTACHMENT_ERROR,
				error: err,
				id: fileId
			});
		}
	} else {
		dispatch({
			type: actionTypes.DELETE_ATTACHMENT_SUCCESS,
			index: getState().attachments.files.findIndex((file) => file._localId === localId),
			deleteIndex: getState().deletingAttachmentsRequest.ids.findIndex(
				(dId) => dId === fileId
			)
		});

		// cancel upload request
		const removedAttachment = getState().attachmentUploadProgress[localId] || {};

		if (removedAttachment.xhr && isFunction(removedAttachment.xhr.abort)) {
			removedAttachment.xhr.abort();
		}
	}
};
