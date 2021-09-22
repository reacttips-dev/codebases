import _t from 'i18n!nls/ondemand';

export const getErrorMessagesMap = () => ({
  UNSUPPORTED_FILETYPE: _t(
    'The uploaded file type is not supported. We support the following file formats : pdf, .doc, .ppt, .pps, .xls, .docx, .pptx, .ppsx, .xlsx, .xls, .ps, .rtf, .htm, .html, .wpd, .odt, .txt'
  ),
  PROCESSING_ERROR: _t('An unspecified error occurred while processing the submissions. Please try again.'),
  TOO_LITTLE_TEXT: _t(
    'The submission does not have enough text to generate a Similarity Report (a submission must contain at least 20 words).'
  ),
  TOO_MUCH_TEXT: _t('The submission is too large (over 2MB of text) to generate a Similarity Report.'),
  CANNOT_EXTRACT_TEXT: _t('The submission does not contain any text.'),
  TOO_MANY_PAGES: _t(
    'The submission has too many pages to generate a Similarity Report. A submission cannot contain more than 800 pages.'
  ),
  FILE_LOCKED: _t(
    'The uploaded file requires a password in order to be opened. Please contact the submitter for the password.'
  ),
  CORRUPT_FILE: _t('The uploaded file appears to be corrupt and cannot generate a Similarity Report.'),
});
