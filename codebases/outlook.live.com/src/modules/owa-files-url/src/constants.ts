export const OWA_ROOT_PREFIX: string = '/owa/';
export const ATTACHMENT_DOWNLOAD_RELATIVE_URL_TEMPLATE: string =
    'service.svc/s/GetFileAttachment?id={0}';
export const REFERENCE_ATTACHMENT_DOWNLOAD_RELATIVE_URL_TEMPLATE: string =
    'service.svc/s/GetReferenceAttachment?attachmentId={0}&location={1}';
export const ATTACHMENT_PREVIEW_RELATIVE_URL_TEMPLATE: string =
    'service.svc/s/GetAttachmentThumbnail?id={0}&thumbnailType=2';
export const REFERENCE_ATTACHMENT_PREVIEW_RELATIVE_URL_TEMPLATE: string =
    'service.svc/s/GetReferenceAttachment?attachmentId={0}&location={1}&isImagePreview=True';
export const ATTACHMENT_THUMBNAIL_RELATIVE_URL_TEMPLATE: string =
    'service.svc/s/GetAttachmentThumbnail?id={0}';
export const ATTACHMENT_PRINT_RELATIVE_URL_TEMPLATE: string = 'pdfprint.aspx?id={0}';
export const REFERENCE_ATTACHMENT_PRINT_RELATIVE_URL_TEMPLATE: string =
    'pdfprint.aspx?id={0}&location={1}';
