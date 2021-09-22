import angular from "angular";
import { swSettings } from "common/services/swSettings";
/**
 * Created by yoavs on 18/8/2016.
 */

export enum GooglePlayScreenTemplate {
    LOGIN = 0,
    BENCHMARK = 1,
    LOADING = 2,
    ERROR = 3,
}
export const GooglePlayScreenTemplatePath = [
    "/app/components/google-play-wizard/templates/login-screen.html",
    "/app/components/google-play-wizard/templates/benchmark-screen.html",
    "/app/components/google-play-wizard/templates/google-play-wait-screen.html",
    "/app/components/google-play-wizard/templates/google-play-connection-error.html",
    "/app/components/google-play-wizard/templates/google-play-no-apps-error.html",
    "/app/components/google-play-wizard/templates/google-play-verification-timeout-error.html",
    "/app/components/google-play-wizard/templates/google-play-configuration-error.html",
    "/app/components/google-play-wizard/templates/google-play-no-dev-error.html",
    "/app/components/google-play-wizard/templates/google-play-prompt-decline.html",
];

class GooglePlayWizardController {
    private _modalElement: any;
    private _activeScreenTemplate: GooglePlayScreenTemplate;
    public apps: any;
    public screenTemplates: any[];
    private stateTrackingLabel;

    static $inject = [
        "$scope",
        "$modal",
        "googlePlayService",
        "$timeout",
        "$modalStack",
        "$modalInstance",
        "wizardScreen",
        "googlePlayWizardAppsArray",
        "swNavigator",
        "$window",
    ];

    /**
     * loads available screen template, register new event listener for template change, init _modalElement with current modal instance element
     * @param _$scope
     * @param _$modal
     * @param _googlePlayService
     * @param _$timeout
     * @param _modalStack
     */
    constructor(
        private _$scope: any,
        private _$modal: any,
        private _googlePlayService: any,
        private _$timeout: any,
        private _modalStack: any,
        private _modalInstance: any,
        private _wizardScreen: any,
        private _apps: any,
        private _swNavigator: any,
        private _$window: any,
    ) {
        this.screenTemplates = GooglePlayScreenTemplatePath;
        this.registerScreenTemplateChangeEvent();
        this.registerModalSuccessConnectAccountEvent();
        setTimeout(() => {
            this._modalElement = this.getModalElement();
        });
        this._activeScreenTemplate = _wizardScreen || GooglePlayScreenTemplate.LOGIN;
        this.setScreenClass(_wizardScreen);
        if (_apps) {
            this.apps = _apps;
        }
        this.stateTrackingLabel = _googlePlayService.getGoogleFormTrackingLabel();
        this._$scope.$on("changeGooglePlayFormComponent", () => {
            this._$timeout(() => {
                this.stateTrackingLabel = this._googlePlayService.getGoogleFormTrackingLabel();
            });
        });
    }

    /**
     * returns active screen template
     * @returns {any}
     */
    public getScreenTemplate() {
        return this.screenTemplates[this._activeScreenTemplate];
    }

    /**
     * close modal if on app engagement overview page. Otherwise set popup to initial login screen.
     */
    public dismissErrorScreen() {
        if (this._swNavigator.isAppEngagementOverview()) {
            this.dismissModal();
        } else {
            this.setScreenTemplate(0);
        }
    }

    public setScreenTemplate(screen) {
        if (
            screen == GooglePlayScreenTemplate.LOADING &&
            this._activeScreenTemplate != GooglePlayScreenTemplate.LOGIN
        ) {
            return;
        }
        this._$timeout(() => {
            this._activeScreenTemplate = screen;
            this.setScreenClass(screen);
        });
    }

    /**
     * return the modal element (for add\remove css classes)
     * @returns {any}
     */
    getModalElement() {
        return this._modalStack.getTop().value.modalDomEl[0];
    }

    /**
     * adds given class to modal window
     * @param className
     */
    addModalClass(className) {
        setTimeout(() => {
            $(this._modalElement).addClass(className);
        });
    }

    /**
     * removes given class from modal window
     * @param className
     */
    removeModalClass(className) {
        setTimeout(() => {
            $(this._modalElement).removeClass(className);
        });
    }

    /**
     * register listener to the changeGooglePlayWizardScreen event in order to change screen template and modal class accordingly
     */
    registerScreenTemplateChangeEvent() {
        this._$scope.$on(
            "changeGooglePlayWizardScreen",
            (event, screen: GooglePlayScreenTemplate, apps) => {
                this.setScreenTemplate(screen);
                this.apps = apps;
            },
        );
    }

    /**
     * register listener to the dismissGooglePlayWizard in order to trigger modal close
     */
    registerModalCloseEvent() {
        this._$scope.$on("dismissGooglePlayWizard", () => {
            this.dismissModal();
        });
    }

    /**
     * register listener to the successConnectGooglePlayAccount in order to trigger modal close and redirect
     */
    registerModalSuccessConnectAccountEvent() {
        this._$scope.$on(
            "successConnectGooglePlayAccount",
            (event, selectedApps: { benchmarkedApp: string; competitorsAppList: string }) => {
                this._googlePlayService.addBenchmarkAppsOverviewPageToFavorites(selectedApps);
                swSettings.refresh().then(() => {
                    this._googlePlayService.connectedUserRedirect(selectedApps);
                    setTimeout(() => {
                        this.dismissModal();
                    });
                });
            },
        );
    }

    /**
     * close modal
     */
    dismissModal() {
        this._googlePlayService.closeModal();
    }

    /**
     * sets the relevant wizard screen class according to the relevent template
     */
    setScreenClass(screen?) {
        let _screen = screen || GooglePlayScreenTemplate.LOGIN;
        if (_screen == GooglePlayScreenTemplate.LOGIN) {
            this.removeModalClass("narrow");
        } else {
            this.addModalClass("narrow");
        }
    }

    loginEmailAction() {
        //TODO: implement email click action
    }

    loginLearnMoreAction() {
        //TODO: learn more action
    }
}

angular
    .module("sw.common")
    .controller(
        "googlePlayWizardController",
        GooglePlayWizardController as ng.Injectable<ng.IControllerConstructor>,
    );
