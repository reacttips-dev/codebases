import { getCookieValue } from '@pipedrive/fetch';
import { getUid } from 'utils/helpers';
import { apiPostFile, apiDeleteFile } from 'api';
import { InlineImagesPlugin } from '@pipedrive/pd-wysiwyg';

const MAX_UPLOAD_SIZE_BYTES = 52427800;

export const addFiles = (files, inlineFlag = false, callback) => (dispatch) => {
	if (!files.length) {
		return;
	}

	const filesToBeUploaded = files
		.filter((file) => file.size <= MAX_UPLOAD_SIZE_BYTES)
		.map((file) => {
			file.inline_flag = inlineFlag;

			return {
				file,
				loadingPercent: 0,
				isLoading: true,
				localId: getUid()
			};
		});

	dispatch({
		type: 'ATTACHMENTS_POST_INIT',
		attachments: filesToBeUploaded
	});

	const tooBigFiles = files
		.filter((file) => file.size > MAX_UPLOAD_SIZE_BYTES)
		.map((file) => ({ localId: getUid(), name: file.name }));

	if (tooBigFiles.length) {
		dispatch({
			type: 'SHOW_FILE_SIZE_ALERT',
			tooBigFiles
		});
	}

	filesToBeUploaded.forEach(({ file, isLoading, loadingPercent, localId }) => {
		const requestOptions = { is_mail_attachment: true };

		if (inlineFlag) {
			requestOptions.inline_flag = true;
		}

		apiPostFile(file, requestOptions, (ev, xhr) => {
			if (ev.lengthComputable) {
				loadingPercent = parseInt((ev.loaded / ev.total) * 100, 10);
			}

			dispatch({
				type: 'ATTACHMENTS_POST_ONPROGRESS',
				attachment: {
					file,
					loadingPercent,
					localId,
					xhr,
					isLoading
				}
			});
		})
			.then((uploadedFile) => {
				dispatch({
					type: 'ATTACHMENTS_POST_SUCCESS',
					attachment: {
						file: uploadedFile,
						loadingPercent: 100,
						localId,
						isLoading: false
					}
				});

				if (callback) {
					return callback(uploadedFile);
				}
			})
			.catch((error) => {
				dispatch({
					type: 'ATTACHMENTS_POST_FAILURE',
					attachment: {
						file,
						loadingPercent: 100,
						localId,
						isLoading: false,
						error
					}
				});
			});
	});
};

export const deleteFile = (localId) => (dispatch, state) => {
	const attachment = state.attachments.files.find((attachment) => attachment.localId === localId);
	const {
		file: { mail_template_id: templateId, id: attachmentId }
	} = attachment;
	const isTemplateAttachment = !!templateId;

	dispatch({ type: 'DELETE_ATTACHMENT', localId });

	// do not delete attachments in case they came via template
	if (isTemplateAttachment) {
		return;
	}

	if (attachmentId) {
		apiDeleteFile(attachmentId);
	} else {
		// cancel upload request
		if (attachment.xhr && typeof attachment.xhr.abort === 'function') {
			attachment.xhr.abort();
		}
	}
};

const sessionToken = `session_token=${getCookieValue('pipe-session-token')}`;

export const inlineImageDrop = (image, onSuccess) => (dispatch) => {
	dispatch(
		addFiles([image], true, (uploadedFile) => {
			const url = `${uploadedFile.url}?${sessionToken}`;

			onSuccess(url, uploadedFile.cid);
		})
	);
};

export const inlineImageRemove = (wysiwyg) => (dispatch, state) => {
	const {
		attachments: { files }
	} = state;
	const attachmentsToBeRemoved = files
		.filter((attachment) => attachment.file.inline_flag)
		.map((inlineAttachment) => inlineAttachment.file);

	const removedCids = wysiwyg.current
		.callPluginMethod(InlineImagesPlugin.name, 'getMissingInlineImagesCids', [
			attachmentsToBeRemoved
		])
		// getMissingInlineImagesCids can return array containing undefined..
		.filter((x) => !!x);

	files.forEach((attachment) => {
		if (removedCids.includes(attachment.file.cid)) {
			dispatch(deleteFile(attachment.localId));
		}
	});
};

export const replaceTemplateAttachments = (attachments) => (dispatch) => {
	dispatch({
		type: 'REPLACE_TEMPLATE_ATTACHMENTS',
		attachments: attachments || []
	});
};
