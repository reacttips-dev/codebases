import angular, { IController, IRootElementService } from "angular";
import { GooglePlayScreenTemplate } from "./GooglePlayWizardController";

class GooglePlayOnPageController implements IController {
    static $inject = ["$scope", "googlePlayService", "$timeout", "$element"];
    private stateTrackingLabel;

    constructor(
        private _$scope: any,
        private _googlePlayService: any,
        private _$timeout: any,
        private _$element: IRootElementService,
    ) {
        this.stateTrackingLabel = _googlePlayService.getGoogleFormTrackingLabel();
    }

    $postLink() {
        this._$timeout(() => {
            this._$element.addClass("visible");
        }, 500);

        this._$scope.$on("changeGooglePlayFormComponent", () => {
            this._$timeout(() => {
                this.stateTrackingLabel = this._googlePlayService.getGoogleFormTrackingLabel();
            });
        });

        this._$scope.$on(
            "changeGooglePlayWizardScreen",
            (event, changeGooglePlayWizardScreen: GooglePlayScreenTemplate, apps) => {
                if (changeGooglePlayWizardScreen != GooglePlayScreenTemplate.LOGIN) {
                    this._googlePlayService.openModal(changeGooglePlayWizardScreen, apps);
                    this._$scope.$broadcast("resetGooglePlayForm");
                    this.stateTrackingLabel = "";
                }
            },
        );
    }
}

const onPageGooglePlayFormComponent: angular.IComponentOptions = {
    controller: GooglePlayOnPageController,
    controllerAs: "onPageCtrl",
    templateUrl: "/app/components/google-play-wizard/templates/on-page-google-play-component.html",
};

angular.module("sw.common").component("onPageGooglePlayForm", onPageGooglePlayFormComponent);
