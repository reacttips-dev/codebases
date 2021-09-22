import angular from "angular";
import TrialService from "../../../app/services/TrialService";
import { swSettings } from "../services/swSettings";
import { SwTrack } from "../../../app/services/SwTrack";

angular.module("sw.common").directive("swChartExport", function ($document, $filter, $injector) {
    return {
        restrict: "E",
        template: '<div ng-include="templateUrl"></div>',
        replace: true,
        scope: {
            widget: "=",
            utility: "=",
            chartConfig: "=",
            trackName: "=",
        },
        link: function (scope, elem, attrs) {
            scope.hideExport = evaluateProperty("hide", false);
            scope.hidePNG = evaluateProperty("hidePNG", false);
            scope.hideExcel = evaluateProperty("hideExcel", !attrs.exportCsvUrl);
            scope.wkhtmltoimage = evaluateProperty("wkhtmltoimage", false);
            scope.exportOptions = evaluateProperty("exportOptions", {});
            scope.showExportPopup = false;
            scope.itemsDisabled = swSettings.current.isHaveBanner;
            scope.isTrial = new TrialService().isTrial();
            scope.showExcelDownload =
                scope.utility && scope.utility.properties.hideExcel ? false : attrs.exportCsvUrl;
            scope.$watch(
                () => evaluateProperty("hideExcel", !attrs.exportCsvUrl),
                (newVal, oldVal) => {
                    if (newVal !== oldVal) {
                        scope.hideExcel = newVal;
                    }
                },
            );
            scope.templateUrl = attrs.hasOwnProperty("widget")
                ? "/partials/directives/widget-chart-export.html"
                : "/partials/directives/chart-export.html";
            scope.export = function (type) {
                let exportObj, chartTitle, trackName, widget, utility, utilityData, pngExporter;

                if (scope.itemsDisabled) {
                    return;
                }

                widget = scope.widget;
                utility = scope.utility;
                exportObj = scope.chartConfig.export;
                chartTitle = exportObj ? $filter("i18n")(exportObj.title) : "";
                utilityData =
                    utility && utility.properties.utilitiesData
                        ? widget._utilitiesData[utility.properties.utilitiesData[0]]
                        : [];
                trackName = scope.trackName ? scope.trackName : chartTitle;

                switch (type) {
                    case "PNG":
                        SwTrack.all.trackEvent("Download", "submit-ok", trackName + "/PNG");
                        if (scope.wkhtmltoimage) {
                            pngExporter = $injector.instantiate(widget.getExporter(), {
                                widget: widget,
                                _$widgetElement: $(elem).closest(".swWidget-frame"),
                                exportOptions: scope.exportOptions,
                                utility: utility,
                            });
                            pngExporter.export();
                        } else {
                            scope.chartConfig.exportPng(chartTitle, utilityData);
                        }

                        break;
                    case "Excel":
                        SwTrack.all.trackEvent("Download", "submit-ok", trackName + "/Excel");
                        window.location = exportObj.csvUrl;
                        break;
                }
                SwTrack.intercom.trackEvent("Clicked_on_" + type + "_export");
            };

            scope.toggle = function (e) {
                e.stopPropagation();
                scope.showExportPopup = !scope.showExportPopup;
                if (scope.trackName && scope.showExportPopup) {
                    SwTrack.all.trackEvent("Drop Down", "open", scope.trackName + "/Download");
                }
            };

            const documentClickHandler = (e) => {
                if (!scope.showExportPopup) return;

                const button = elem.parent().find(".export-btn");
                if (e.target != button[0]) {
                    scope.$apply(function () {
                        scope.showExportPopup = false;
                    });
                }
            };
            // for closing the form when you click outside of the element
            $document.on("click", documentClickHandler);
            scope.$on("$destroy", () => {
                $document.off("click", documentClickHandler);
            });

            function evaluateProperty(property, returnFlag) {
                if (scope.utility && scope.utility.properties[property]) {
                    property = scope.utility.properties[property];
                    return typeof property === "function" ? $injector.invoke(property) : property;
                } else {
                    return returnFlag;
                }
            }
        },
    };
});
