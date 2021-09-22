import angular from "angular";
import { GooglePlayScreenTemplate } from "../GooglePlayWizardController";
import { GooglePlayStatusCode } from "./agoogle-play-form-interface";
import { IGooglePlayResponse } from "./agoogle-play-form-interface";
import { GooglePlayErrorScreen } from "./agoogle-play-form-interface";
import { GooglePlayVerificationCode } from "./agoogle-play-form-interface";
import { formComponents } from "./agoogle-play-form-interface";
import { ErrorLabelTextOption } from "./agoogle-play-form-interface";
/**
 * a base class for inheritance in each of IGooglePlayFormComponent implementations
 */
export class GooglePlayFormBase {
    protected _formName: string;

    public auth: any;
    public activeStatusCode: GooglePlayStatusCode;
    public loading: boolean = false;
    public errorText: string;
    public submitClickable: boolean = false;
    public triedSubmitting: boolean = false;
    public onPage: boolean;
    public questionText: string;
    public authRequestId: number;

    protected _authRequest: any;

    static $inject = ["$rootScope", "$scope", "$modal", "googlePlayService", "$timeout", "$q"];

    constructor(
        public _$rootScope: any,
        public _$scope: any,
        public _$modal: any,
        public _googlePlayService: any,
        public _$timeout: any,
        public _$q,
    ) {
        this.auth = this._googlePlayService.initAuthRequest();
        this.loading = false;
        this.registerFormComponentChangeEvent();
        this.registerFormResetEvent();
        this.registerModalClosing();
    }

    /**
     * initiate AJAX request if the form is valid
     * @returns {boolean}
     */
    init() {
        if (this.submitAllowed()) {
            if (this.questionText) {
                this._googlePlayService.track(this._formName, this.onPage, "click");
            } else {
                this._googlePlayService.track(
                    this._formName,
                    this.onPage,
                    "click",
                    this.questionText,
                );
            }

            let authRequestId = Math.random();
            this.authRequestId = authRequestId;
            this._authRequest = this.initAuthRequest();
            this._$q.when(this._authRequest).then((data: IGooglePlayResponse) => {
                if (this.authRequestId != authRequestId) {
                    return false;
                }
                if (data) {
                    this.resolveAuthRequest(data);
                    this.setSubmitText();
                    return true;
                }
                return false;
            });
        } else {
            return false;
        }
    }

    /**
     * checks whether the user can submit the form at the moment or not
     * @returns {boolean}
     */
    submitAllowed() {
        if (!this.formValidation()) return false;

        return true;
    }

    /**
     * sends first AJAX call to connect
     * @returns {angular.IPromise<T>}
     */
    initAuthRequest() {
        return this.auth.$save();
    }

    /**
     * sends the AJAX response to the relevant handler according to response type
     * @param data
     */
    resolveAuthRequest(data: IGooglePlayResponse) {
        this.loading = false;
        switch (data.statusCode) {
            case GooglePlayStatusCode.SUCCESS:
                this.setSuccessStatus(data.apps);
                this._googlePlayService.track(this._formName, this.onPage, "submit-ok", "");
                break;
            case GooglePlayStatusCode.WAITING:
                this.setVerificationMode(data.verificationTypeCode, data.status);
                this._googlePlayService.track("Initial details", this.onPage, "submit-ok", "");
                break;
            case GooglePlayStatusCode.INVALID:
                this.setErrorStatus(data.statusCode);
                this._googlePlayService.track(
                    "Errors",
                    this.onPage,
                    "submit-error-client",
                    this._formName + "/" + data.status,
                );
                break;
            case GooglePlayStatusCode.ERROR_CONNECTION:
                if (this._formName == "Digits" || this._formName == "Question") {
                    this.setErrorScreen(GooglePlayErrorScreen.ERROR_TIMEOUT);
                    this._googlePlayService.track(
                        "Errors",
                        this.onPage,
                        "submit-error-server",
                        data.status,
                    );
                    break;
                }
                this.setErrorScreen(GooglePlayErrorScreen.ERROR_CONNECTION);
                this._googlePlayService.track(
                    "Errors",
                    this.onPage,
                    "submit-error-server",
                    data.status,
                );
                break;
            case GooglePlayStatusCode.ERROR_PROMPT_CANCELLED:
                this.setErrorScreen(GooglePlayErrorScreen.ERROR_PROMPT_DECLINE);
                this._googlePlayService.track("Prompt", this.onPage, "cancel");
                break;
            case GooglePlayStatusCode.ERROR_NOT_DEVELOPER:
                this.setErrorScreen(GooglePlayErrorScreen.ERROR_NOT_DEVELOPER);
                this._googlePlayService.track(
                    "Errors",
                    this.onPage,
                    "submit-error-client",
                    data.status,
                );
                break;
        }
    }

    /**
     * dispatch changeGooglePlayWizardScreen event to googlePlayWizardController in order to change screen to app selection and benchmark
     * @param status
     * @param apps
     */
    setSuccessStatus(apps) {
        if (apps.length > 0) {
            setTimeout(() => {
                this._$rootScope.$broadcast(
                    "changeGooglePlayWizardScreen",
                    GooglePlayScreenTemplate.BENCHMARK,
                    apps,
                );
            }, 1500);
        } else {
            this.setErrorScreen(GooglePlayErrorScreen.ERROR_NOAPPS);
        }
    }

    /**
     * dispatch changeGooglePlayFormComponent event to googlePlayFormContainerController in order to change the ath form component
     * @param mode
     */
    setVerificationMode(mode: GooglePlayVerificationCode, status: string) {
        let _component: formComponents;
        switch (mode) {
            case GooglePlayVerificationCode.PROMPT:
                _component = formComponents.PROMPT;
                break;
            case GooglePlayVerificationCode.QUESTION:
                _component = formComponents.QUESTION;
                break;
            case GooglePlayVerificationCode.DIGITS:
            case GooglePlayVerificationCode.VERIFICATION:
                _component = formComponents.DIGITS;
                break;
            case GooglePlayVerificationCode.COUNTRY_PHONE:
                _component = formComponents.COUNTRY_PHONE;
                break;
            case GooglePlayVerificationCode.CITY:
                _component = formComponents.CITY;
                break;
            case GooglePlayVerificationCode.NUMERIC_PROMPT:
                _component = formComponents.NUMERIC_PROMPT;
                break;
        }
        this._$rootScope.$broadcast(
            "changeGooglePlayFormComponent",
            formComponents[_component],
            status,
        );
    }

    /**
     * sets the error text message to appear in the red label for the relevant error types
     * @param status
     */
    setErrorStatus(status: GooglePlayStatusCode) {
        this.activeStatusCode = status;
        this.errorText = ErrorLabelTextOption.invalidCredentials;
    }

    /**
     * broadcasting changeGooglePlayWizardScreen in order to change the wizard screen according to server error
     * @param status
     */
    setErrorScreen(status: GooglePlayErrorScreen) {
        this._$rootScope.$broadcast("changeGooglePlayWizardScreen", status);
    }

    /**
     * catches the changeGooglePlayFormComponent event and sets the form component error value for red-label
     */
    registerFormComponentChangeEvent() {
        this._$scope.$on("changeGooglePlayFormComponent", (event, statusCode) => {
            this.setErrorStatus(statusCode);
        });
    }

    /**
     * to be implemented in each class be the validation requirements of the specific form
     * @returns {boolean}
     */
    formValidation() {
        return true;
    }

    /**
     * Returns the relevant submit button text according to erro status and loading status
     */
    setSubmitText() {
        return null;
    }

    /**
     * reset AJAX error code and stops submit button loading
     */
    clearErrorStatus() {
        this.activeStatusCode = GooglePlayStatusCode.NA;
    }

    /**
     * enables error label display if status code is invalid credentials or general server error
     * @returns {boolean}
     */
    showErrorLabel() {
        return this.activeStatusCode == GooglePlayStatusCode.INVALID;
    }

    /**
     * broadcasting resetGooglePlayForm in order to return the form instance to the MAIN component
     */
    resetFormComponent() {
        this._$rootScope.$broadcast("resetGooglePlayForm");
        this.authRequestId = undefined;
        this._googlePlayService.cancelStatusPollingRequest();
    }

    /**
     * Take actions when resetGooglePlayForm event is triggered
     */
    registerFormResetEvent() {
        this._$scope.$on("resetGooglePlayForm", () => {
            this.submitClickable = false;
            this.triedSubmitting = false;
            this.loading = false;
        });
    }

    /**
     * Take actions when $modalInstance is closed
     */
    registerModalClosing() {
        this._$scope.$on("modal.closing", () => {
            this.resetFormComponent();
        });
    }
}
