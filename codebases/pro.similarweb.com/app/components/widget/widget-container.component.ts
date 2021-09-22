import angular from "angular";
import swLog from "@similarweb/sw-log";
import { swSettings } from "common/services/swSettings";
import { IAttributes } from "../../../node_modules/@types/angular/index";
import { i18nFilter } from "../../filters/ngFilters";
import { IPptExportRequest } from "services/PptExportService/PptExportServiceTypes";
import { PptExportService } from "services/PptExportService/PptExportService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { SwTrack } from "services/SwTrack";

/**
 * Created by vlads on 12/1/2016.
 */
export const widgetDialogs = {
    delete: {
        title: i18nFilter()("home.dashboards.widget.menu.confirmation"),
        confirm: i18nFilter()("home.dashboards.widget.menu.delete"),
        cancel: i18nFilter()("mediaBuy.sideNav.popup.cancel"),
    },
};

function hidePreloader($element) {
    setTimeout(() => {
        // show/hide
        $element.find(".widget-preloader-loader").css("visibility", "hidden");
        $element.find(".widgetContainerTemplate").css("visibility", "visible");
        setTimeout(() => {
            // remove the loader
            $element.find(".widget-preloader-loader").remove();
        }, 100);
    }, 100);
}

const widgetComponent: angular.IComponentOptions = {
    bindings: {
        widget: "=",
    },
    template: function ($element, $attrs: IAttributes) {
        if ($attrs.hasOwnProperty("usePreloader")) {
            return (
                "<div>" +
                '<div class="widget-preloader-loader swWidget swWidget--top swWidget--boxShadow">' +
                '<sw-widget-loader widget="ctrl.widget"></sw-widget-loader>' +
                "</div>" +
                '<div in-view="ctrl.showWidget($inview)" class="widgetContainerTemplate" ng-include="ctrl.widgetContainerTemplate"></div>' +
                "</div>"
            );
        } else {
            return '<div class="widgetContainerTemplate" ng-include="ctrl.widgetContainerTemplate"></div>';
        }
    },
    controllerAs: "ctrl",
    controller: function (
        $scope,
        $attrs,
        $element,
        $timeout,
        dashboardService,
        $injector,
        swProfiler,
    ) {
        const widgetModel = this.widget.getWidgetModel();
        this.pptService = new PptExportService();
        this.hasPptExportAccess = swSettings.user.hasPptExport;
        this.$onInit = () => {
            this.widget.nrInteraction = swProfiler.startInteraction(this.widget.type + " Widget", {
                Family: widgetModel.family,
                Metric: widgetModel.metric,
            });
        };

        this.widget.on = $scope.$on.bind($scope);
        this.widget.emit = $scope.$emit.bind($scope);
        this.widget.broadcast = $scope.$broadcast.bind($scope);

        // support custom containers
        if (this.widget.container) {
            this.widgetContainerTemplate = this.widget.container;
        } else {
            this.widgetContainerTemplate =
                "/app/components/widget/containers/widget-container.html";
        }

        this.getWidgetTitle = function () {
            return this.widget.dashboardId === "PREVIEW"
                ? i18nFilter()(this.widget._metricConfig.title)
                : this.widget.getViewData().title;
        };
        this.widgetTitle = this.getWidgetTitle();

        //set preloader functionality
        const hasPreloader = $attrs.hasOwnProperty("usePreloader");
        const preloaderHeight = this.widget.getProperties().preloaderHeight;
        if (hasPreloader) {
            if (!preloaderHeight) {
                swLog.warn("You must provide preloaderHeight in widgetConfig!");
            } else {
                $element
                    .find("> div")
                    .addClass("widget-preloader")
                    .css("height", this.widget.getProperties().preloaderHeight);
                $scope.$on("$includeContentLoaded", () => {
                    this.templateLoaded = true;
                });

                this.showWidget = ($inview) => {
                    if ($inview && !this.showed) {
                        this.showed = true;
                        if (this.templateLoaded) {
                            hidePreloader($element);
                        }
                    }
                };
            }
        }

        this.titleEditable = false;
        this.titleClickable = !(
            this.widget.readOnly &&
            this.widget.viewData?.proUrl?.indexOf(
                `*${encodeURI(this.widget.getWidgetModel().key[0].name)}`,
            ) > -1
        );
        this.editTitle = function ($event) {
            this.widgetTitle = this.getWidgetTitle();
            const el = $($event.target).prev();
            $($event.target).hide();
            el.css("width", el.val().length * 14);
            el.select();
            this.titleEditable = true;
            SwTrack.all.trackEvent("Edit", "click", "widget name");
        };
        this.cancelEditTitle = function () {
            this.widgetTitle = this.getWidgetTitle();
            this.titleEditable = false;
        };
        this.saveTitle = function () {
            const updatedWidget = this.widget._widgetConfig;
            // change title on config
            updatedWidget.properties.title = this.widgetTitle;
            // change title on widget instance
            this.widget.mergeViewData({ title: this.widgetTitle });
            // change template to 'custom'
            updatedWidget.properties.titleTemplate = "custom";
            dashboardService.editWidget(updatedWidget);
            SwTrack.all.trackEvent("Edit", "click", "widget name/" + this.widgetTitle);
        };
        this.onKeyDown = function ($event) {
            if ($event.keyCode == 27) {
                this.cancelEditTitle();
            }
            $timeout(function () {
                const el = $($event.target);
                el.css("width", el.val().length * 24);
            });
        };
        this.onExportClick = () => {
            TrackWithGuidService.trackWithGuid("dashboard.widget.export.ppt", "click");
            const request: IPptExportRequest = {
                name: this.getWidgetTitle(),
                metrics: [this.widget.getDataForPpt()],
                meta: {
                    userEmail: swSettings?.user?.username,
                },
            };
            this.pptService.exportPpt(request);
        };

        $scope.$on("widget.showDialog", (event, type) => {
            this.dialogOptions = widgetDialogs[type];
            this.dialogOnConfirm = () => {
                this.widget[type]();
                SwTrack.all.trackEvent("Drop Down", "click", "Widget Settings/delete/Yes");
            };
            this.dialogOnCancel = () => {
                this.showDialog = false;
                SwTrack.all.trackEvent("Drop Down", "click", "Widget Settings/delete/No");
            };
            this.showDialog = true;
        });

        $scope.$on("windowResize", () => {
            // refresh view data on resize
            this.widget.getViewData();
            // this.widget.onResize();
        });

        $scope.$on("clear-widget-filter", (e, options = {} as any) => {
            e.preventDefault();
            const { track = true } = options;
            if (track) {
                SwTrack.all.trackEvent("Button", "click", "Table/Clear all");
            }
            this.widget._params.filter = null;
            $scope.$broadcast("clear-utility-filter");
        });

        //If the website is not verified - the callback function should trigger the GA Connect popup.
        if (!swSettings.current.IsConnectedGoogleAnalyticsAccount) {
            this.tooltipButtonCallback = function () {
                return;
            };
            this.tooltipButtonCallbackType = "CONNECT";
        } else {
            //Redirect to connected accounts management panel.
            this.tooltipButtonCallback = function () {
                window.open("https://support.similarweb.com/hc/en-us/articles/208420125");
            };
            this.tooltipButtonCallbackType = "LEARN_MORE";
        }

        this.$postLink = () => {
            $injector.invoke(this.widget.onWidgetMount, this.widget, { $scope, $el: $element });
            $scope.$on("gridster-resized", function (sizes, gridster) {
                $timeout(function () {
                    $scope.$broadcast("highchartsng.reflow");
                }, 10);
            });
        };

        this.$onDestroy = () => {
            if (this.widget.cleanup) {
                this.widget.cleanup();
            }
        };
    },
};

angular.module("sw.common").component("widget", widgetComponent);
