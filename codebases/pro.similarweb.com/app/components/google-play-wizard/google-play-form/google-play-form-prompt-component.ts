import angular from "angular";
import { GooglePlayFormBase } from "./GooglePlayFormBase";
import { GooglePlayStatusCode } from "./agoogle-play-form-interface";
/**
 * Created by Yoav_S on 14/11/2016.
 */

class GooglePlayFormPromptController extends GooglePlayFormBase {
    public verificationCode: string;

    private _authActive: boolean = true;

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
        this._formName = "Prompt";
        this.verificationCode = "";
        this.registerPromptPollingRequest();
        this.registerModalClosing();
        setTimeout(this.showLoadingIcon.bind(this), 5000);
    }

    /**
     * register listener for googlePlayPromptPolling event in order to keep polling the server until the user accept the connection.
     */
    registerPromptPollingRequest() {
        this._$scope.$on("googlePlayPromptPolling", () => {
            this.init();
        });
    }

    /**
     * polling the auth endpoint until user response to prompt screen
     * @param token
     */
    initAuthRequest() {
        if (this._authActive) {
            let _promise;
            let _credentials = this._googlePlayService.getCredentials();

            this.auth.username = _credentials.username;
            this.auth.password = _credentials.password;

            let authRequestId = Math.random();
            this.authRequestId = authRequestId;

            _promise = this.auth.$save();
            _promise.then((data) => {
                if (this.authRequestId != authRequestId) {
                    return false;
                }
                if (data.statusCode == GooglePlayStatusCode.WAITING) {
                    setTimeout(() => {
                        this.initAuthRequest();
                    }, 2000);
                } else {
                    this.resolveAuthRequest(data);
                }
            });
        }
    }

    /**
     * changes the loading flag to true in order to show the loading icon
     */
    showLoadingIcon() {
        this.loading = true;
    }

    /**
     * broadcasting resetGooglePlayForm in order to return the form instance to the MAIN component
     */
    resetFormComponent() {
        this._$rootScope.$broadcast("resetGooglePlayForm");
        this.authRequestId = undefined;
        this._authActive = false;
        this._googlePlayService.cancelStatusPollingRequest();
        setTimeout(() => {
            this._authActive = true;
        }, 3000);
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

class GooglePlayFormPromptComponent implements angular.IComponentOptions {
    public bindings: any;
    public controller: any;
    public templateUrl: string;

    constructor() {
        this.bindings = {
            active: "<",
            onPage: "<",
        };
        this.templateUrl =
            "/app/components/google-play-wizard/google-play-form/google-play-form-prompt-template.html";
        this.controller = "googlePlayFormPromptController";
    }
}
angular.module("sw.common").component("googlePlayFormPrompt", new GooglePlayFormPromptComponent());
angular
    .module("sw.common")
    .controller(
        "googlePlayFormPromptController",
        GooglePlayFormPromptController as ng.Injectable<ng.IControllerConstructor>,
    );
