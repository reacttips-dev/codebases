import angular, { IController } from "angular";
/**
 * Created by Eyal.Albilia on 12/8/2016.
 */
class GooglePlayGlobalHookController implements IController {
    public globalHookTextCode = "googleplayconnect.globalhook.text";
    static $inject = ["googlePlayService"];

    constructor(private _googlePlayService: any) {}

    $onInit() {}

    openModal() {
        this._googlePlayService.openModal();
    }
}

const googlePlayGlobalHook: angular.IComponentOptions = {
    controller: GooglePlayGlobalHookController,
    controllerAs: "GoogleHookCtrl",
    template: `<div sw-tracker sw-tracker-category="Pop Up" sw-tracker-label="Hook Side Bar/Benchmark" class="sideNavNew-bottomButton" ng-click="GoogleHookCtrl.openModal()">
                        {{GoogleHookCtrl.globalHookTextCode |i18n }}
                        <div class="demoRibbon-wrapper">
                            <!--inline styles because it's a temporary ribbon-->
                            <div class="demoRibbon-ribbon" style="background-color: #4b8bce;"></div>
                            <div class="demoRibbon-text" style="bottom: 45px; left: 39px; font-size: 12px; letter-spacing: 1.5px;">Free</div>
                        </div>
                    </div>`,
};

angular.module("sw.common").component("googlePlayGlobalHook", googlePlayGlobalHook);
