/**
 * Response codes to use for event callbacks. All present response codes should mirror the codes in osfweb ErrorCodeManager.ts.
 */
enum ApiEventResponseCode {
    SUCCESS = 0,
    API_CALL_NOT_SUPPORTED_BY_EXTENSIONPOINT = 9032,
    INTERNAL_ERROR = 5001,
    URL_NOT_IN_APP_DOMAINS = 12004,
    WEB_DIALOG_CLOSED = 12006,
    DIALOG_ALREADY_OPEN = 12007,
}

export default ApiEventResponseCode;
