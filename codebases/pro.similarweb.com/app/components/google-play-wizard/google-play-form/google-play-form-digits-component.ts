import angular from "angular";

import { GooglePlayFormBase } from "./GooglePlayFormBase";
import { GooglePlayStatusCode } from "./agoogle-play-form-interface";
import { ErrorLabelTextOption } from "./agoogle-play-form-interface";
/**
 * Created by Yoav_S on 14/11/2016.
 */

class GooglePlayFormDigitsController extends GooglePlayFormBase {
    public submitText: string;
    public verificationCode: string;
    public verificationCodeValid: boolean = true;

    static $inject = ["$rootScope", "$scope", "$modal", "googlePlayService", "$timeout", "$q"];

    constructor(
        _$rootScope: any,
        _$scope: any,
        _$modal: any,
        _googlePlayService: any,
        _$timeout: any,
        _$q: any,
    ) {
        super(_$rootScope, _$scope, _$modal, _googlePlayService, _$timeout, _$q);
        this._formName = "Digits";
        this.verificationCode = "";
        this.setSubmitText();
    }

    /**
     * initiate AJAX request if the form is valid
     * @returns {boolean}
     */
    submit() {
        this.init();
    }

    /**
     * checks whether the user can submit the form at the moment or not
     * @returns {boolean}
     */
    submitAllowed() {
        if (!this.formValidation()) return false;
        if (this.loading) {
            return false;
        }
        return true;
    }

    /**
     * sends first AJAX call to connect
     * @param token
     * @returns {angular.IPromise<T>}
     */
    initAuthRequest(token?: string) {
        let _promise;
        let _token = token || this.verificationCode;
        let _credentials = this._googlePlayService.getCredentials();

        this.loading = true;
        this.clearErrorStatus();
        this.setSubmitText();

        this.auth.username = _credentials.username;
        this.auth.password = _credentials.password;
        this.auth.verificationCode = _token;
        _promise = this.auth.$save();
        this._googlePlayService.initStatusPollingRequest(_credentials.username);
        return _promise;
    }

    /**
     * sets the relevant error text in the form red-label according to the error status from server
     * @param status
     */
    setErrorStatus(status: GooglePlayStatusCode) {
        this.activeStatusCode = status;
        this.errorText = ErrorLabelTextOption.invalidVerificationCode;
    }

    /**
     * validates verificationCode contains only number and is 6 digits length
     * @param verificationCode
     * @returns {boolean}
     */
    formValidation(verificationCode?: string) {
        this.verificationCodeValid = true;
        let _verificationCode = verificationCode || this.verificationCode;
        let _numericPattern: RegExp = /^\d+$/;
        if (_verificationCode.length != 6 || !_numericPattern.test(_verificationCode)) {
            this.verificationCodeValid = false;
            return false;
        }
        return true;
    }

    /**
     * Returns the relevant submit button text according to error status and loading status
     * @returns {string}
     */
    setSubmitText() {
        if (this.showErrorLabel()) {
            this.submitText = "googleplayconnect.buttons.2fa.tryagain";
        } else if (this.loading) {
            this.submitText = "googleplayconnect.buttons.2fa.loading";
        } else {
            this.submitText = "googleplayconnect.buttons.2fa.initial";
        }
    }

    /**
     * Take actions when resetGooglePlayForm event is triggered
     */
    registerFormResetEvent() {
        this._$scope.$on("resetGooglePlayForm", () => {
            this.loading = false;
            this.setSubmitText();
            this.verificationCode = "";
        });
    }
}

class GooglePlayFormDigitsComponent implements angular.IComponentOptions {
    public bindings: any;
    public controller: any;
    public templateUrl: string;

    constructor() {
        this.bindings = {
            active: "<",
            onPage: "<",
        };
        this.templateUrl =
            "/app/components/google-play-wizard/google-play-form/google-play-form-digits-template.html";
        this.controller = "googlePlayFormDigitsController";
    }
}
angular.module("sw.common").component("googlePlayFormDigits", new GooglePlayFormDigitsComponent());
angular
    .module("sw.common")
    .controller(
        "googlePlayFormDigitsController",
        GooglePlayFormDigitsController as ng.Injectable<ng.IControllerConstructor>,
    );
