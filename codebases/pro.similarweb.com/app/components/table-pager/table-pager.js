import angular from "angular";
import * as _ from "lodash";
import { SwTrack } from "../../services/SwTrack";

angular.module("sw.common").directive("swTablePager", function () {
    return {
        scope: {},
        bindToController: {
            page: "=",
            pages: "=",
            disabled: "=",
            onPagination: "&",
        },
        restrict: "E",
        replace: true,
        templateUrl: "/app/components/table-pager/table-pager.html",
        controllerAs: "ctrl",
        controller: function () {
            const ctrl = this;
            ctrl.prevPage = ctrl.page;
            ctrl.goToPage = function (add) {
                ctrl.page = parseInt(ctrl.page);
                if (!ctrl.page || ctrl.page > ctrl.pages) {
                    ctrl.page = 1;
                }
                let newPage = add ? ctrl.page + add : ctrl.page,
                    trackingSubName;

                ctrl.onPagination({ page: newPage });
                // next/prev
                if (add) {
                    if (add > 0) {
                        trackingSubName = "next";
                    } else {
                        trackingSubName = "prev";
                    }
                    SwTrack.all.trackEvent(
                        "Pagination",
                        "click",
                        "Table/" + trackingSubName + "/" + ctrl.page,
                    );
                }
                // manual entered page number
                else {
                    SwTrack.all.trackEvent(
                        "Pagination",
                        "click",
                        "Table/manual/" + ctrl.prevPage + "-" + ctrl.page,
                    );
                }

                ctrl.prevPage = newPage;
            };
        },
    };
});
