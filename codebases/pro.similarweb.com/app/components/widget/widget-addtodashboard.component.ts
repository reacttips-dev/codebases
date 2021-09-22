import angular, { IController } from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import {
    IWidgetModelTypesWebSource,
    IWidgetModelTypesType,
    IWidget,
} from "components/widget/widget-types/Widget";
import LocationService from "../../../.pro-features/components/Modals/src/UnlockModal/LocationService";
import { openUnlockModal } from "../../services/ModalService";
import widgetSettings from "components/dashboard/WidgetSettings";
import { chosenItems } from "common/services/chosenItems";
import { SwTrack } from "services/SwTrack";

/**
 * @responsibility handle a2d button clicks and visibility(shown or not)
 */
class AddToDashboardController implements IController {
    public widget; //:IWidget<any>;
    public metric: string;
    public webSource: IWidgetModelTypesWebSource;
    public typeCompare: IWidgetModelTypesType;
    public typeSingle: IWidgetModelTypesType;
    public inlineStyle: string;
    public inlineStyleNext: string;
    public forPng: string;
    public selectedSite: boolean;

    private _visibility = false;
    private swSettings = swSettings;
    constructor(
        private $scope,
        private $modal,
        private widgetModelAdapterService,
        private swNavigator,
        private i18nFilter,
        private chosenSites,
    ) {}
    private isVisible() {
        // TODO: remove if dashbord functionality will be added to sales 2
        if (this.swNavigator.$location.$$path.startsWith("/sales/account-review/")) {
            return false;
        }
        const _metric = this.widget
            ? this.widget.getProperties().metric
            : this.widgetModelAdapterService.normalizeMetric(this.metric);
        const _family = this.widget
            ? this.widget.getProperties().family
            : widgetSettings.getMetricProperties(_metric).family;
        //No metric for "main domain only" filter
        //if (this.swNavigator.getParams().isWWW === "-") return false;
        //Can not work without family
        if (typeof _family === "undefined") return false;
        if (this.widget) {
            return this.widget.canAddToDashboard();
        } else {
            //next condition (== 'true') looks weird but it deals with "true" "false" as strings and undefined
            return widgetSettings.getMetricProperties(_metric).dashboard == "true";
        }
    }

    private setVisibility() {
        this._visibility = this.isVisible();
    }

    public getVisibility() {
        return this._visibility;
    }

    private getCustomModel(metric, type, webSource, family, selectedSite) {
        switch (family) {
            case "Website":
                return this.widgetModelAdapterService.fromWebsite(
                    metric,
                    type,
                    webSource,
                    selectedSite,
                );
            case "Mobile":
                return this.widgetModelAdapterService.fromMobile(metric, type, webSource);
            default:
                //todo: log to server, should not happen
                return {};
        }
    }

    private isCompare() {
        if (!_.isEmpty(chosenItems[0])) {
            return chosenItems.isCompare();
        } else {
            return this.chosenSites.isCompare();
        }
    }

    public openAddToDashboardWizard() {
        if (
            this.swSettings.components.Dashboard.resources.IsDisabled ||
            this.swSettings.components.Dashboard.resources.IsReadonly
        ) {
            const unlockHook = { modal: "CustomDashboards", slide: "CustomDashboards" };
            const metric = this.widgetModelAdapterService.normalizeMetric(this.metric);
            const metricProperties = widgetSettings.getMetricProperties(metric);
            const title = this.widget
                ? this.widget.viewData.title
                : this.i18nFilter(metricProperties.title);
            const location = `${LocationService.getCurrentLocation()}/Add to Dashboard/${title}`;
            openUnlockModal(unlockHook, location);
            return;
        }

        const _self: any = this;
        const _metric = this.widgetModelAdapterService.normalizeMetric(_self.metric);
        const _metricProperties = widgetSettings.getMetricProperties(_metric);
        const _family = _metricProperties.family;
        const _title = _self.widget
            ? _self.widget.viewData.title
            : this.i18nFilter(_metricProperties.title);
        let _customModel;
        const _type = this.isCompare() ? _self.typeCompare : _self.typeSingle;
        const _webSource = _self.webSource
            ? _self.webSource
            : this.swNavigator.getParams().webSource || "Desktop";
        const _selectedSite = this.selectedSite || false;

        if (!_self.widget) {
            _customModel = this.getCustomModel(_metric, _type, _webSource, _family, _selectedSite);
        } else {
            const _props = _self.widget.getProperties();
            //If widget config set addToDashboardMetric - this should count as the metric in dashboard.
            if (_self.widget._metricConfig.addToDashboardMetric) {
                _props.metric = _self.widget._metricConfig.addToDashboardMetric;
            }
            //currently mobile key is too big to fit in the database, replacing with generated key
            if (_props.family == "Mobile") {
                _props.key = this.widgetModelAdapterService._getKeysFromChosenItems();
            }
            if (_props.key[0].id.indexOf("*") > -1) {
                _self.widget._widgetConfig.properties.customAsset = _props.family;
            }
        }
        const _modalInstance = this.$modal.open({
            animation: true,
            controller: "widgetAddToDashboardController as ctrl",
            templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
            windowClass: "add-to-dashboard-modal",
            resolve: {
                widget: () => _self.widget,
                customModel: () => _customModel,
            },
            scope: this.$scope,
        });
        _modalInstance.opened.then(() => {
            SwTrack.all.trackEvent("Pop up", "open", "Add to my Dashboard/" + _title);
        });
        _modalInstance.result.then(
            () => {
                /*noop*/
            },
            (reason) => {
                if (reason == "close")
                    SwTrack.all.trackEvent("Pop up", "close", "Add to my Dashboard/" + _title);
            },
        );
    }

    $onInit() {
        this.setVisibility();
        if (this.widget) {
            this.widget.on("widgetUpdated", (event, data) => {
                this.setVisibility();
            });
        }
    }
}

class AddToDashboard implements ng.IComponentOptions {
    public bindings: any = {
        widget: "=?",
        metric: "@?",
        typeSingle: "@?",
        typeCompare: "@?",
        webSource: "@?",
        inlineStyle: "@?",
        inlineStyleNext: "@?",
        forPng: "@?",
        selectedSite: "=?",
    };
    public template = `<div ng-show="$ctrl.getVisibility()"
                        class="addToDashboard"
                        ng-class="[$ctrl.widget._widgetModel.metric, $ctrl.widget._widgetModel.type,
                                    $ctrl.widget.viewData.addToDashboardIconClass,
                                    {'addToDashboard-inline': $ctrl.inlineStyle == 'true',
                                    'addToDashboard-inline-next': $ctrl.inlineStyleNext == 'true',
                                    'addToDashboard-png-box': $ctrl.forPng == 'true'
                                  }]"
                        ng-click="$ctrl.openAddToDashboardWizard();$event.stopPropagation()">
                        <sw-react component="AddToDashboardButton" />
                        </div>`;

    public controller;

    constructor() {
        this.controller = AddToDashboardController;
    }
}

angular.module("sw.common").component("swWidgetAddToDashboard", new AddToDashboard());
