import angular from "angular";
import { swSettings } from "common/services/swSettings";
import { GooglePlayFormBase } from "./GooglePlayFormBase";
import { GooglePlayStatusCode } from "./agoogle-play-form-interface";
/**
 * Created by Yoav_S on 14/11/2016.
 */

interface IGooglePlayCredentials {
    username: string;
    password: string;
}

class GooglePlayFormMainController extends GooglePlayFormBase {
    public submitText: string;
    public credentials: IGooglePlayCredentials;
    public userAgreement = false;
    public emailValid = true;
    public passwordValid = true;
    public termsOfUseText: string;
    public isConnectAllowed = false;

    static $inject = [
        "$rootScope",
        "$scope",
        "$modal",
        "googlePlayService",
        "$timeout",
        "$q",
        "i18nFilter",
    ];

    constructor(
        _$rootScope: any,
        _$scope: any,
        _$modal: any,
        _googlePlayService: any,
        _$timeout: any,
        _$q: any,
        _i18nFilter,
    ) {
        super(_$rootScope, _$scope, _$modal, _googlePlayService, _$timeout, _$q);
        this.isConnectAllowed = swSettings.components.Home.resources.GaMode != "Skip";
        this._formName = "Initial details";
        this.credentials = {
            username: "",
            password: "",
        };
        this.setSubmitText();
        this.registerResetFormEvent();
        this.termsOfUseText =
            _i18nFilter("googleplayconnect.forms.terms.prefix") +
            " <a href='https://www.similarweb.com/corp/legal/terms-ca' target='_blank'>" +
            _i18nFilter("googleplayconnect.forms.terms.link") +
            "</a>";
    }

    /**
     * initiate AJAX request if the form is valid
     * @returns {boolean}
     */
    submit() {
        if (!this.isConnectAllowed) {
            return;
        }
        this.triedSubmitting = true;
        if (this.submitAllowed()) {
            this.init();
        }
    }

    /**
     * checks whether the user can submit the form at the moment or not
     * @returns {boolean}
     */
    submitAllowed() {
        if (this.triedSubmitting) {
            if (!this.formValidation()) {
                this.submitClickable = false;
                return false;
            }
            if (this.loading) {
                this.submitClickable = false;
                return false;
            }
        }
        this.submitClickable = true;

        return true;
    }

    /**
     * sends first AJAX call to connect
     * @param username
     * @param password
     * @returns {angular.IPromise<T>}
     */
    initAuthRequest(username?: string, password?: string) {
        const _username = username || this.credentials.username;
        const _password = password || this.credentials.password;

        this.loading = true;
        this.clearErrorStatus();
        this.setSubmitText();

        this.auth.username = _username;
        this.auth.password = _password;
        this._googlePlayService.setCredentials(_username, _password);
        const _promise = this.auth.$save();
        this._googlePlayService.initStatusPollingRequest(_username);
        return _promise;
    }

    /**
     * checks username and password validation + user agreement checkbox
     * @param username
     * @param password
     * @returns {boolean}
     */
    formValidation(username?: string, password?: string) {
        this.activeStatusCode = GooglePlayStatusCode.NA;
        this.emailValid = true;
        this.passwordValid = true;
        const _username = username || this.credentials.username;
        const _password = password || this.credentials.password;
        if (this.credentials.username == "" || this.credentials.password == "") {
            return false;
        }
        if (!this.emailValidation(_username)) {
            this.emailValid = false;
            return false;
        }
        if (!this.passwordValidation(_password)) {
            this.passwordValid = false;
            return false;
        }
        // if(!this.userAgreement){
        //     return false;
        // }
        return true;
    }

    /**
     * checks if given string is a valid email pattern
     * @param email
     * @returns {boolean}
     */
    emailValidation(email: string) {
        const _email = email;
        // eslint-disable-next-line max-len
        const _emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return _emailPattern.test(_email) || this.credentials.username == "";
    }

    /**
     * checks if the given string is a valid password pattern
     * @param password
     * @returns {boolean}
     */
    passwordValidation(password: string) {
        const _password = password;
        return _password.length > 5 || this.credentials.password == "";
    }

    /**
     * checks whether or not to mark the user agreement checkbox error status
     * @returns {boolean}
     */
    userAgreementError() {
        if (
            this.emailValid &&
            this.passwordValid &&
            this.credentials.username != "" &&
            this.credentials.password != ""
        ) {
            return !this.userAgreement;
        }
        return false;
    }

    /**
     * Returns the relevant submit button text according to erro status and loading status
     * @returns {string}
     */
    setSubmitText() {
        if (this.showErrorLabel()) {
            this.submitText = "googleplayconnect.buttons.login.tryagain";
        } else if (this.loading) {
            this.submitText = "googleplayconnect.buttons.login.loading";
        } else {
            this.submitText = "googleplayconnect.buttons.login.initial";
        }
    }

    /**
     * catches the resetGooglePlayForm event and resent the form
     */
    registerResetFormEvent() {
        this._$scope.$on("resetGooglePlayForm", () => {
            this.resetForm();
        });
    }

    /**
     * resets all form elements and error labels to default
     */
    resetForm() {
        this.credentials.username = "";
        this.credentials.password = "";
        this.userAgreement = false;
        this.loading = false;
        this.emailValid = true;
        this.passwordValid = true;
        this.submitClickable = false;
        this.triedSubmitting = false;
        this.clearErrorStatus();
    }

    /**
     * triggers functionality for the user agreement checkbox click event
     */
    userAgreementClick() {
        this.submitAllowed();
        setTimeout(() => {
            this._googlePlayService.track(
                this._formName,
                this.onPage,
                this.userAgreement ? "checked" : "uncheck",
                "terms of use",
            );
        });
    }
}

class GooglePlayFormMainComponent implements angular.IComponentOptions {
    public bindings: any;
    public controller: any;
    public templateUrl: string;

    constructor() {
        this.bindings = {
            active: "<",
            onPage: "<",
        };
        this.templateUrl =
            "/app/components/google-play-wizard/google-play-form/google-play-form-main-template.html";
        this.controller = "googlePlayFormMainController";
    }
}

angular.module("sw.common").component("googlePlayFormMain", new GooglePlayFormMainComponent());
angular
    .module("sw.common")
    .controller(
        "googlePlayFormMainController",
        GooglePlayFormMainController as ng.Injectable<ng.IControllerConstructor>,
    );
