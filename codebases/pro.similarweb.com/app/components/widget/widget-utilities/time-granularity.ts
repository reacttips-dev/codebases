import angular from "angular";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import dailyIntervalConfig from "components/Chart/src/configs/granularity/dailyIntervalConfig";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import weeklyIntervalConfig from "components/Chart/src/configs/granularity/weeklyIntervalConfig";

/**
 * Created by vlads on 18/1/2016.
 */
export type granularityItem = typeof toggleItems.Daily;

export const toggleItems = {
    Daily: {
        title: "timegranularity.day.symbol",
        value: "Daily",
        intervalConfig: dailyIntervalConfig,
        format: "DD MMM",
    },
    Weekly: {
        title: "timegranularity.week.symbol",
        value: "Weekly",
        intervalConfig: weeklyIntervalConfig,
        format: "DD MMM",
    },
    Monthly: {
        title: "timegranularity.month.symbol",
        value: "Monthly",
        intervalConfig: monthlyIntervalConfig,
        format: "MMM YY",
    },
};

export const timeGranularity = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
};

const widgetUtilityTimeGranularityComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-switcher react-key="ctrl.widget.activeTabIndex" items="ctrl.items" disable-width-calculation="true" chosen="ctrl.chosenItem" ng-if="!ctrl.utility.hideUtility" class="time-granularity-widget-utility" ng-class="{'no-a2d': !ctrl.widget.canAddToDashboard()}" tracking-name="ctrl.trackName" tracking-name-prop="'value'" tracking-category="ctrl.trackingCategory"></sw-switcher>`,
    controllerAs: "ctrl",
    controller: function ($scope) {
        let isMovingWindow = this.widget.apiParams.isWindow;
        this.trackName = this.widget._widgetConfig.properties.trackName + "/";
        Object.assign(
            {},
            swSettings.getCurrentModule().graphGranularities,
            this.widget.granularities,
            this.utility.properties,
        );
        this.initItems = () => {
            this.items = [];
            this.utility.properties.toggleOptions.map((option) => {
                let obj = toggleItems[option];

                // disable options based on config values
                // here intentionally used ==, cause it can be string when coming from components config
                obj.disabled =
                    this.utility.properties[option] === "false" ||
                    this.utility.properties[option] === false;
                // SIM-19327 removed the check if time granularity is available , currently all users get daily data
                // obj.disabled = false;
                // disable options based on state of the application
                if (isMovingWindow && option === timeGranularity.monthly) {
                    obj.disabled = true;
                }

                if (this.utility.properties.toggleTooltips) {
                    obj.tooltipText = this.utility.properties.toggleTooltips[option];
                }
                this.items.push(obj);
            });
            this.chosenItem =
                this.widget.apiParams.timeGranularity || this.utility.properties.default;
            //checking if current chosen item is available // SIM-19327 removed the check if time granularity is available , currently all users get daily data
            // if (this.utility.properties[this.widget.apiParams.timeGranularity]) {
            //     this.chosenItem = this.widget.apiParams.timeGranularity;
            // } else {
            //     this.chosenItem = _.findKey(this.utility.properties, (isGranularityAllowed) => isGranularityAllowed === true);
            // }
        };
        this.initItems();
        this.trackingCategory = "Time Frame Button";

        $scope.$watch("ctrl.chosenItem", (newVal, oldVal) => {
            if (newVal != oldVal) {
                this.widget.handleUtilityAction(this.utility, newVal);
            }
        });
        $scope.getTimeGranularityIndex = () => {
            const timeGranularity = this.widget.apiParams.timeGranularity;
            if (timeGranularity === "Daily") {
                return 0;
            }
            if (timeGranularity === "Weekly") {
                return 1;
            }
            return 2;
        };

        $scope.$watch("ctrl.utility.properties", (newVal, oldVal) => {
            if (!_.isEqual(newVal, oldVal)) {
                this.initItems();
            }
        });

        $scope.$watch("ctrl.widget.apiParams.timeGranularity", (newVal, oldVal) => {
            if (newVal !== oldVal) {
                this.chosenItem = newVal;
            }
        });
    },
};

angular
    .module("sw.common")
    .component("swWidgetUtilityTimeGranularity", widgetUtilityTimeGranularityComponent);
