import angular from "angular";
import { swSettings } from "common/services/swSettings";
import { HomeListType } from "components/home/config/home.config";
/**
 * Created by Yoav_S on 23/06/2016.
 */

angular
    .module("sw.home")
    .controller("newHomeCtrl", function (
        i18nFilter,
        $window,
        swNavigator,
        navigationScrollService,
        $scope,
        $timeout,
    ) {
        var $ctrl = this;
        $ctrl.isRestrictedUser = swSettings.components.Home.resources.IsRestrictedUser;
        $ctrl.title = i18nFilter("homeold.page.title", {
            user: decodeURIComponent(swSettings.user.firstname + " " + swSettings.user.lastname),
        });

        //Recent configuration
        $ctrl.recentType = "recents" as HomeListType;

        $ctrl._getNavObj = function () {
            return {};
        };

        //Layout controller support
        /* API */
        const ctrl = this;
        const w = angular.element($window);
        ctrl.state = getCurrentState();
        ctrl.navObj = _getNavObj(swNavigator.current());
        ctrl.slideStageRight = false;
        ctrl.toggleSideNav = toggleSideNav;
        ctrl.fixHeight = false;
        ctrl.isHomePage = true;

        /* PRIVATE */
        function _getNavObj(state) {
            return {};
        }

        function _toggleHideClass() {
            ctrl.hideSideNav = w.width() <= 1200;
        }

        function toggleSideNav() {
            ctrl.slideStageRight = !ctrl.slideStageRight;
        }

        function getCurrentState() {
            return angular.copy(swNavigator.current());
        }

        /* EVENTS */
        w.bind("resize", function () {
            $timeout(function () {
                _toggleHideClass();
            });
        });

        $scope.$on("slideScreen", function () {
            //temporary fix - we need to rebuild slide and layout
            toggleSideNav();
        });
        $scope.$on("navChangeComplete", function () {
            //temporary fix - we need to rebuild slide and layout
            ctrl.state = getCurrentState();
        });
        /* START */
        _toggleHideClass();
    });
