/**
 * Created by olegg on 09-May-17.
 */
import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { DEFAULT_PAGE_LAYOUT_CLASS_NAME } from "UtilitiesAndConstants/Constants/css";
import { IS_BETA_BRANCH_ENABLED } from "pages/website-analysis/TrafficAndEngagement/BetaBranch/useBetaBranchPrefHook";

export class WebsiteAnalysisModuleCtrl {
    public w;
    public state: any;
    public navObj;
    tooltipText: string;
    config;
    upgrade;
    pageFrameContainer: string;
    pageLayoutClassName: string;
    subNavComponent: string;
    isShowBetaBanner: () => boolean;
    showBetaBannerFlag: boolean;

    constructor(swNavigator, $scope, $window) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const ctrl = this;
        ctrl.w = angular.element($window);
        ctrl.state = _.cloneDeep(swNavigator.current());
        const component = swSettings.current;
        ctrl.subNavComponent = "WebsiteAnalysisSubNav";
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
            ctrl.showBetaBannerFlag = ctrl.isShowBetaBanner();
            applyPageLayoutClassName();
        });
        ctrl.isShowBetaBanner = () => {
            const { state } = ctrl;
            const params = swNavigator.getParams();
            return (
                IS_BETA_BRANCH_ENABLED() &&
                (state.name === "companyresearch_website_trafficandengagement" ||
                    state.name === "websites-audienceOverview") &&
                !(params.duration === "28d" || params.comparedDuration)
            );
        };
        ctrl.showBetaBannerFlag = ctrl.isShowBetaBanner();
    }
}

angular
    .module("sw.common")
    .controller(
        "websiteAnalysisModuleCtrl",
        WebsiteAnalysisModuleCtrl as ng.Injectable<ng.IControllerConstructor>,
    );
