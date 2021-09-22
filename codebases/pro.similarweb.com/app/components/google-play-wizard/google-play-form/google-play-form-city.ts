import angular from "angular";

import { GooglePlayFormBase } from "./GooglePlayFormBase";
import { GooglePlayStatusCode } from "./agoogle-play-form-interface";
import { ErrorLabelTextOption } from "./agoogle-play-form-interface";
/**
 * Created by Yoav_S on 16/03/2017.
 */

class GooglePlayFormCityController extends GooglePlayFormBase {
    public submitText: string;
    public verificationCode: string;

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
        this._formName = "City";
        this.verificationCode = "";
        this.questionText = "googleplayconnect.forms.placeholder.cityquestion";
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
        return true;
    }

    /**
     * Returns the relevant submit button text according to erro status and loading status
     * @returns {string}
     */
    setSubmitText() {
        if (this.showErrorLabel()) {
            this.submitText = "googleplayconnect.buttons.question.tryagain";
        } else if (this.loading) {
            this.submitText = "googleplayconnect.buttons.question.loading";
        } else {
            this.submitText = "googleplayconnect.buttons.question.initial";
        }

        /**
         * Take actions when resetGooglePlayForm event is triggered
         */
    }
    registerFormResetEvent() {
        this._$scope.$on("resetGooglePlayForm", () => {
            this.loading = false;
            this.setSubmitText();
            this.verificationCode = "";
        });
    }
}

class GooglePlayFormCityComponent implements angular.IComponentOptions {
    public bindings: any;
    public controller: any;
    public templateUrl: string;

    constructor() {
        this.bindings = {
            active: "<",
            onPage: "<",
        };
        this.templateUrl =
            "/app/components/google-play-wizard/google-play-form/google-play-form-city-template.html";
        this.controller = "googlePlayFormCityController";
    }
}
angular.module("sw.common").component("googlePlayFormCity", new GooglePlayFormCityComponent());
angular
    .module("sw.common")
    .controller(
        "googlePlayFormCityController",
        GooglePlayFormCityController as ng.Injectable<ng.IControllerConstructor>,
    );
