import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { DEFAULT_PAGE_LAYOUT_CLASS_NAME } from "UtilitiesAndConstants/Constants/css";

export class SalesWebsiteAnalysisModuleCtrl {
    public w;
    public state: any;
    public navObj;
    tooltipText: string;
    config;
    upgrade;
    pageFrameContainer: string;
    pageLayoutClassName: string;
    subNavComponent: string;

    constructor(swNavigator, $scope, $window) {
        let ctrl = this;
        ctrl.w = angular.element($window);
        ctrl.state = _.cloneDeep(swNavigator.current());
        const component = swSettings.current;
        ctrl.subNavComponent = "SalesWebsiteAnalysisSubNav";
        ctrl.pageFrameContainer =
            "/app/pages/website-analysis/templates/website-analysis-page-frame.html";
        const applyPageLayoutClassName = () => {
            ctrl.pageLayoutClassName =
                ctrl.state.pageLayoutClassName ?? DEFAULT_PAGE_LAYOUT_CLASS_NAME;
        };
        applyPageLayoutClassName();
        ctrl.config = {
            pagePermitted: component.isAllowed,
        };

        $scope.$on("navChangeComplete", function () {
            ctrl.state = _.cloneDeep(swNavigator.current());
            ctrl.config.pagePermitted = swSettings.current.isAllowed;
            applyPageLayoutClassName();
        });
    }
}

angular
    .module("sw.common")
    .controller(
        "salesWebsiteAnalysisModuleCtrl",
        SalesWebsiteAnalysisModuleCtrl as ng.Injectable<ng.IControllerConstructor>,
    );
