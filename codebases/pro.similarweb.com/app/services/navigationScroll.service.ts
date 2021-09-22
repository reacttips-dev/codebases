import angular from "angular";
import * as _ from "lodash";
import layoutConfiguration from "../components/layout/layoutConfiguration";
/**
 * Created by olegg on 06-Jun-16.
 */

const pageScrollerClassName = `.${layoutConfiguration.pageScroller}`;
interface INavigationScrollService {
    startLayoutScrollEvents: () => void;
    finishLayoutScrollEvents: () => void;
}

angular
    .module("sw.common")
    .factory("navigationScrollService", function ($document): INavigationScrollService {
        var layoutIsScrolled: boolean = false;

        function startLayoutScrollEvents() {
            setTimeout(() => {
                angular.element(pageScrollerClassName).on("scroll", checkLayoutScroll);
            }, 10);
        }

        function checkLayoutScroll() {
            var scrollTop: number = this.pageYOffset || angular.element(this).scrollTop();
            layoutIsScrolled = scrollTop > 40;
            if (!_.isEmpty($document.find(".dashboard-header"))) {
                $document
                    .find(".dashboard-header")
                    .toggleClass("layout-is-scrolled", layoutIsScrolled);
            }
        }

        function finishLayoutScrollEvents() {
            angular.element(pageScrollerClassName).off("scroll", checkLayoutScroll);
        }

        return {
            startLayoutScrollEvents: startLayoutScrollEvents,
            finishLayoutScrollEvents: finishLayoutScrollEvents,
        };
    });
