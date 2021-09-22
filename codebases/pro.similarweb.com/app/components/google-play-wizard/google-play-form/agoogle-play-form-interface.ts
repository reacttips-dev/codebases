import angular from "angular";
export interface IGooglePlayResponse {
    status: string;
    statusCode: GooglePlayStatusCode;
    verificationTypeCode: GooglePlayVerificationCode;
    apps?: any;
}
export enum GooglePlayStatusCode {
    SUCCESS = 0,
    WAITING = 1,
    INVALID = 2,
    ERROR_CONNECTION = 3,
    ERROR_PROMPT_CANCELLED = 4,
    ERROR_NOT_DEVELOPER = 7,
    NA = 999,
}
export enum GooglePlayErrorScreen {
    SUCCESS = 0,
    WAITING = 1,
    INVALID = 2,
    ERROR_CONNECTION = 3,
    ERROR_NOAPPS = 4,
    ERROR_TIMEOUT = 5,
    ERROR_CONFIGURATION = 6,
    ERROR_NOT_DEVELOPER = 7,
    ERROR_PROMPT_DECLINE = 8,
}
export enum GooglePlayVerificationCode {
    PROMPT = 0,
    CITY = 1,
    DIGITS = 2,
    QUESTION = 3,
    VERIFICATION = 4,
    COUNTRY_PHONE = 5,
    NUMERIC_PROMPT = 6,
}
export const ErrorLabelTextOption = {
    invalidCredentials: "googleplayconnect.forms.error.label.credentials",
    invalidVerificationCode: "googleplayconnect.forms.error.verification.code",
    invalidPhoneNumber: "googleplayconnect.forms.error.verification.phone",
    notDeveloper: "googleplayconnect.forms.error.not.developer",
    timeOut: "googleplayconnect.forms.error.timeout",
};
export enum formComponents {
    "MAIN" = 0,
    "PROMPT" = 1,
    "CITY" = 2,
    "DIGITS" = 3,
    "QUESTION" = 4,
    "VERIFICATION" = 5,
    "COUNTRY_PHONE" = 6,
    "NUMERIC_PROMPT" = 7,
}
export interface IGooglePlayFormComponent {
    init(): () => boolean;
    submitAllowed(): () => boolean;
    initAuthRequest(): (username?: string, password?: string, token?: any) => angular.IPromise<any>;
    resolveAuthRequest(): (data: IGooglePlayResponse) => void;
    setSuccessStatus(): (apps: any) => void;
    setVerificationMode(): (mode: GooglePlayVerificationCode) => void;
    setErrorStatus(): (status: GooglePlayStatusCode) => void;
    setErrorScreen(): (status: GooglePlayErrorScreen) => void;
    registerFormComponentChangeEvent(): () => void;
    formValidation(): () => boolean;
    setSubmitText(): () => any;
    clearErrorStatus(): () => void;
    showErrorLabel(): () => void;
}
