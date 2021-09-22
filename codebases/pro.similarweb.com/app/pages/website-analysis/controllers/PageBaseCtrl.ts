import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { i18nFilter } from "filters/ngFilters";
import CountryService from "services/CountryService";

export abstract class PageBaseCtrl {
    public title: string;
    public config;
    public hasMobileWebData: boolean;
    public mobileWebEnabled: boolean;
    public chosenDevice;
    public tooltipText: string;
    public showTooltip: boolean;
    public trackerName: string;
    public upgrade;
    public widgets;
    public isCompare: boolean;

    constructor($scope, $rootScope, chosenSites, swNavigator, widgetFactoryService) {
        let ctrl = this;
        let params = swNavigator.getParams();
        let state = swNavigator.current();
        let key = params.key.split(",");
        ctrl.isCompare = key.length > 1;

        let devices = this.getDevices();

        ctrl.config = {
            isPagePermitted: swSettings.components.PopularPages.isAllowed,
            notPermittedConfig: {
                image: state.notPermittedConfig.image,
                description: i18nFilter()(state.notPermittedConfig.description),
            },
        };

        // Handling of the mobile web toggle
        ctrl.hasMobileWebData =
            swSettings.allowedDuration(params.duration, "MobileWeb") &&
            swSettings.allowedCountry(params.country, "MobileWeb");
        ctrl.mobileWebEnabled = !!swSettings.components.WebAnalysis.resources
            .HasPopularPagesMobileWeb;

        if (!ctrl.mobileWebEnabled) {
            swNavigator.updateParams({ webSource: devices.desktop });
        }

        ctrl.chosenDevice = params.webSource ? params.webSource : devices.desktop;
        if (!_.includes(_.values(devices), ctrl.chosenDevice)) {
            ctrl.chosenDevice = devices.desktop;
            swNavigator.updateParams({ webSource: ctrl.chosenDevice });
        }

        // Set webSources toggle to 'Desktop' preset if no MobileWeb data exists for selected duration or country
        if (!ctrl.hasMobileWebData && ctrl.chosenDevice !== devices.desktop) {
            ctrl.chosenDevice = devices.desktop;
            ctrl.tooltipText = i18nFilter()("wa.overview.websource.tooltip");
            ctrl.showTooltip = true;
            swNavigator.updateParams({ webSource: ctrl.chosenDevice });
            $rootScope.$emit("explicitWebsourceChange", ctrl.chosenDevice);
        }

        initWidgets();

        function initWidgets() {
            let params = swNavigator.getParams();
            let widgetsConfig = ctrl.getWidgetsConfig(swSettings);
            angular.forEach(widgetsConfig, function (widget) {
                angular.extend(widget.properties, params);
                widget.properties.key = key.map(function (website) {
                    return {
                        id: website,
                        name: website,
                        image: chosenSites.getInfo(website).icon,
                        smallIcon: true,
                    };
                });
            });
            $scope.$applyAsync(function () {
                ctrl.widgets = [widgetFactoryService.create(widgetsConfig[0], state.name)];
            });
        }

        $scope.$watch("ctrl.chosenDevice", function (newVal, oldVal) {
            if (newVal !== oldVal) {
                swNavigator.updateParams({ webSource: newVal });
                initWidgets();
            }
        });

        $scope.$on("widgetKeyChanged", function (event, domain) {
            ctrl.widgets.forEach((widget) => (widget.apiParams = { keys: domain }));
        });
    }

    abstract getDevices();

    abstract getWidgetsConfig(SwSettings);
}
