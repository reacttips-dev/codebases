import angular from "angular";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import { allTrackers, intercomTracker } from "services/track/track";
import { Injector } from "common/ioc/Injector";

/**
 * Created by vlads on 18/1/2016.
 */
const widgetUtilityEllipsisComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-ellipsis widget="ctrl.widget" on-toggle="ctrl.onToggle" utility="ctrl.utility" on-click="ctrl.onClick" is-excel-allowed="ctrl.isExcelAllowed" is-have-banner="ctrl.isHaveBanner()"></sw-ellipsis>`,
    controllerAs: "ctrl",
    controller: function ($scope, $element, $window) {
        this.trackName = this.widget._widgetConfig.properties.trackName;
        this.isExcelAllowed = swSettings.current.resources.IsExcelAllowed;

        this.onToggle = (isOpen) => {
            const exportObj = this.widget.chartConfig.export;
            const chartTitle = exportObj ? i18nFilter()(exportObj.title) : "";
            const trackName = this.trackName;
            isOpen &&
                allTrackers.trackEvent(
                    "Drop down",
                    "open",
                    `${trackName ? trackName : chartTitle}/menu`,
                );
        };

        this.isHaveBanner = () => {
            return swSettings.current.isHaveBanner;
        };

        this.onClick = (item) => {
            let exportObj, chartTitle, trackName, utilityData, pngExporter;
            const widget = $scope.ctrl.widget;
            const utility = $scope.ctrl.utility;
            const wkhtmltoimage = utility.properties["wkhtmltoimage"];
            const exportOptions = utility.properties["exportOptions"];
            exportObj = widget.chartConfig.export;
            chartTitle = exportObj ? i18nFilter()(exportObj.title) : "";
            utilityData =
                utility && utility.properties.utilitiesData
                    ? widget._utilitiesData[utility.properties.utilitiesData[0]]
                    : [];
            trackName = $scope.ctrl.trackName ? $scope.ctrl.trackName : chartTitle;

            switch (item.id) {
                case "png":
                    if (this.isHaveBanner()) {
                        return;
                    }
                    allTrackers.trackEvent("Download", "submit-ok", trackName + "/PNG");
                    if (wkhtmltoimage) {
                        pngExporter = Injector.instantiate(widget.getExporter(), {
                            widget: widget,
                            _$widgetElement: $($element).closest(".swWidget-frame"),
                            exportOptions: exportOptions,
                            utility: utility,
                        });
                        pngExporter.export();
                    } else {
                        widget.chartConfig.exportPng(chartTitle, utilityData);
                    }

                    break;
                case "excel":
                    if (this.isHaveBanner()) {
                        return;
                    }
                    if ($scope.ctrl.isExcelAllowed) {
                        allTrackers.trackEvent("Download", "submit-ok", trackName + "/Excel");
                        // for automation purposes
                        window["similarweb"].utils.latestExcelHref = exportObj.csvUrl;
                        $window.location = exportObj.csvUrl;
                    }
                    break;

                case "dashboard":
                    $element.closest(".swWidget-frame").find(".addToDashboard").click();
                    break;
            }
            intercomTracker.trackEvent("Clicked_on_" + item.id + "_export", "", "");
        };
    },
};

angular.module("sw.common").component("swWidgetUtilityEllipsis", widgetUtilityEllipsisComponent);
