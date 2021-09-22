import angular from "angular";
import * as _ from "lodash";

angular.module("sw.common").component("swTableNoData", {
    bindings: {
        config: "<?",
        minHeight: "<?",
    },
    controllerAs: "ctrl",
    controller: function ($filter) {
        let ctrl = this;
        let defaultDataError = {
            messageTitle: $filter("i18n")("home.dashboards.widget.table.error1"),
            icon: "no-data",
        };
        this.$onChanges = function () {
            ctrl.config = Object.assign({}, defaultDataError, ctrl.config);
            ctrl.minHeight = ctrl.minHeight || "200px";
        };
    },
    templateUrl: "/app/components/table-no-data/table-no-data.html",
});
