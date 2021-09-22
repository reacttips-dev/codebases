import angular from "angular";
import { formComponents } from "./agoogle-play-form-interface";
/**
 * Created by Yoav_S on 14/11/2016.
 */

class GooglePlayFormContainerController {
    public activeFormComponent: any;
    public status: string;
    public opPage: boolean;
    public hiddenMode: boolean;

    static $inject = ["$scope", "$element", "googlePlayService", "$timeout"];

    constructor(
        private _$scope: any,
        private _$element: any,
        private _googlePlayService: any,
        private _$timeout: any,
    ) {
        this.setFormComponent("MAIN", "");
        this.registerFormComponentChange();
        this.registerResetFormEvent();
        this.isOnPage();
        this.hiddenMode = false;
        this._$timeout(() => {
            this.hiddenMode = true;
        });
    }

    /**
     * sets the component and status parameters to bind into the active form component
     * @param component
     * @param status
     */
    setFormComponent(component, status) {
        this.activeFormComponent = formComponents[component];
        this._googlePlayService.setGoogleFormComponentState(component);
        this.status = status;
        if (this.activeFormComponent == formComponents.PROMPT) {
            this._$scope.$broadcast("googlePlayPromptPolling");
        }
    }

    /**
     * returns the current active component of the current form instance
     * @returns {any}
     */
    getFormComponent() {
        return this.activeFormComponent;
    }

    /**
     * catches the changeGooglePlayFormComponent event in order to set new form component to the current form instance
     */
    registerFormComponentChange() {
        this._$scope.$on(
            "changeGooglePlayFormComponent",
            (event, component: formComponents, status: string) => {
                this.setFormComponent(component, status);
            },
        );
    }

    /**
     * catches the resetGooglePlayForm event in order to return the form instance to the MAIN component
     */
    registerResetFormEvent() {
        this._$scope.$on("resetGooglePlayForm", () => {
            this.setFormComponent("MAIN", "");
        });
    }

    /**
     * checks whether the form instance is renders on page (true) or modal instance (false)
     * @returns {boolean}
     */
    isOnPage() {
        this.opPage = $(this._$element[0]).parents().find("on-page-google-play-form").length > 0;
    }
}

class GooglePlayFormContainerComponent implements angular.IComponentOptions {
    public bindings: any;
    public controller: any;
    public templateUrl: string;

    constructor() {
        this.bindings = {};
        this.controller = "googlePlayFormContainerController";
        this.templateUrl =
            "/app/components/google-play-wizard/google-play-form/google-play-form-container.html";
    }
}
angular
    .module("sw.common")
    .component("googlePlayFormContainer", new GooglePlayFormContainerComponent());
angular
    .module("sw.common")
    .controller(
        "googlePlayFormContainerController",
        GooglePlayFormContainerController as ng.Injectable<ng.IControllerConstructor>,
    );
