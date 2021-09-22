import { InsertOption, ContentPosition } from 'roosterjs-editor-types';

// Inline image CID fix
export const CID_PREFIX = 'cid:';

// The context used for inline image upload
export const CONTEXT_UPLOAD = 'Upload';

export const INSERT_INLINEIMAGE_CHANGE_SOURCE = 'InsertInlineImageFinished';
export const INSERT_PLACEHOLDER_CHANGE_SOURCE = 'InsertInlineImagePlaceholder';
export const PLACEHOLDER_LOAD_PENDING_ATTRIBUTE_NAME = 'data-loadPending';

export const PASTED_IMAGE_NAME_PREFIX = 'pastedImage';
export const PASTED_IMAGE_NAME_SUFFIX = '.png';

// File type
export const FILETYPE_ATTACHMENT = 'Attachment';

// Error
export const ERROR_NULL_ATTACHMENT_URL = 'NullAttachmentUrl';

export const INSERT_OPTION: InsertOption = {
    position: ContentPosition.SelectionStart,
    updateCursor: true,
    replaceSelection: true,
    insertOnNewLine: false,
};
