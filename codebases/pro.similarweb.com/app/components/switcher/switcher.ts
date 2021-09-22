import angular, { IComponentOptions } from "angular";
import * as _ from "lodash";
import { ISWSwitcherTemplateGenerator } from "./SWSwitcherTemplateGenerator";
import { SwTrack } from "services/SwTrack";

/**
 * if 'persist-id' attr is defined, gets the selected from session storage, then from "selected" attr, the from '0'
 */

declare let similarweb;

const LS_KEY_PREFIX = "switcher";
const Switcher: IComponentOptions = {
    templateUrl: "/app/components/switcher/switcher.html",
    bindings: {
        items: "=",
        isBeta: "=?",
        selectedIndex: "@selected",
        chosen: "=?",
        valueProp: "@value",
        persistId: "@",
        disableWidthCalculation: "@",
        recalculateOnUpdate: "@",
        trackingCategory: "=?",
        trackingNameProp: "=?",
        trackingName: "=?",
        trackingAction: "=?",
        trackingMuted: "=?",
        onUpdate: "&",
        minWidth: "@",
        widthMargin: "@",
        legacy: "=?",
        reactKey: "=?",
    },
    controller: function (
        $scope: any,
        $window: angular.IWindowService,
        $timeout: angular.ITimeoutService,
        swNavigator: any,
        $modal: any,
        $attrs: any,
        $filter: any,
        switcherTemplateGenerator: any,
    ) {
        let localStorageKey: string;
        let storage: Storage;
        const $ctrl = this;
        this.reactKey = _.isNil(this.reactKey) ? "noreactkey" : this.reactKey;

        // check if tracker object exists.
        // use in markup: tracker="{category:'DashBoards',action:'click',name:'Add or Edit Widget/Website or App'}"
        $ctrl.enableTransition = false;
        $ctrl.swTrackerAction = $attrs.trackingAction || "switch";
        $ctrl.swTrackerCategory = $attrs.trackingCategory || "";
        $ctrl.swTrackerLabel = $attrs.trackingLabel || "";

        $ctrl.guid = "sw-switcher-" + (Math.random() + "").substr(3);
        $ctrl.recalculateTabsWidth = function (): void {
            //Assuming that 'disableWidthCalculation' property created for disabling calculation at all.
            if (!!$ctrl.disableWidthCalculation === true) return;
            let longestTabWidth = -1;
            let tabWidth: number;
            const minWidth: number = parseInt($ctrl.minWidth) || 0;
            const widthMargin: number = parseInt($ctrl.widthMargin) || 0;

            if (_.isArray($ctrl.items) && _.isUndefined($ctrl.disableWidthCalculation)) {
                const _length: number = $ctrl.items.length;
                let longestTitle = "";
                for (let i = 0, itemTitle = ""; i <= _length; i++) {
                    itemTitle = _.result($ctrl.items[i], "title", "");
                    if (itemTitle.indexOf(".") > 0) itemTitle = $filter("i18n")(itemTitle); // SIM-12640, check if its i18n string
                    longestTitle =
                        itemTitle.length > longestTitle.length ? itemTitle : longestTitle;
                }
                if (longestTitle.length > 0)
                    longestTabWidth = similarweb.utils.getTextWidth(
                        longestTitle,
                        "normal 16px Roboto",
                    );

                tabWidth =
                    longestTabWidth > 0
                        ? (
                              longestTabWidth +
                              40.0 +
                              similarweb.utils.getTextWidth("\f1db", "normal 1em swicons") +
                              7.0 +
                              1.5 +
                              widthMargin
                          ).toFixed(0)
                        : false;
            }

            if (!$ctrl.generator) {
                $ctrl.generator = <ISWSwitcherTemplateGenerator>(
                    switcherTemplateGenerator($ctrl.guid, tabWidth || minWidth)
                );
            } else if (tabWidth) {
                $ctrl.generator.updateWidth(tabWidth || minWidth);
            }
        };

        if ($ctrl.persistId) {
            localStorageKey = [LS_KEY_PREFIX, swNavigator.current().name, $ctrl.persistId].join(
                ".",
            );
            storage = $window.sessionStorage;
        }

        $ctrl.category = $ctrl.trackingCategory || "Capsule Button";
        $ctrl.prop = $ctrl.trackingNameProp || "title";

        $ctrl.onChange = function (data: { index?: number }, silent) {
            const index: any = _.isObject(data) ? data.index : data;
            let indexOfChosen: number;

            if (!!$ctrl.chosen) {
                // work with binding
                if (!$ctrl.selectedIndex && _.isUndefined(index)) {
                    indexOfChosen = _.findIndex($ctrl.items, function (item: any): boolean {
                        return item.value == $ctrl.chosen;
                    });
                } else {
                    indexOfChosen = index;
                }
                if (indexOfChosen === -1) {
                    if (_.isObject($ctrl.chosen)) {
                        indexOfChosen = _.findIndex($ctrl.items, $ctrl.chosen);
                    }
                    return;
                }
            } else {
                // work with simple index notation
                if (_.isObject($ctrl.chosen)) {
                    indexOfChosen = _.findIndex($ctrl.items, function (item: any): boolean {
                        return item.value == _.result($ctrl.chosen, "value", "");
                    });
                } else if (!$ctrl.items || !(index in $ctrl.items)) {
                    return;
                }
                indexOfChosen = index;
            }

            const newValue: any = $ctrl.items[indexOfChosen];

            if ($ctrl.selectedIndex != indexOfChosen) $ctrl.selectedIndex = indexOfChosen;

            if (
                !_.isUndefined($ctrl.chosen) &&
                !_.isNull($ctrl.chosen) &&
                newValue &&
                _.isEqual($ctrl.chosen, newValue.value)
            )
                return;

            $ctrl.selectedItem = <any>newValue;

            if ($ctrl.valueProp && newValue) {
                $scope.$parent[$ctrl.valueProp] = newValue.value;
            }

            if (!!$ctrl.chosen) $ctrl.chosen = newValue.value;

            if ($ctrl.persistId) {
                storage.setItem(localStorageKey, indexOfChosen.toString());
            }

            if (!silent && !$ctrl.valueProp && !$ctrl.trackingMuted) {
                SwTrack.all.trackEvent(
                    $ctrl.category,
                    $ctrl.swTrackerAction,
                    ($ctrl.trackingName || "") + $ctrl.items[indexOfChosen][$ctrl.prop],
                );
            }

            if (!silent)
                $timeout(function () {
                    $ctrl.onUpdate({ value: $ctrl.chosen || newValue.value });
                });
        };

        let lsValue: any = null;

        if ($ctrl.persistId) {
            lsValue = parseInt(storage.getItem(localStorageKey));
        }

        // try getting selected from local storage, but not if the value is disabled, then from "selected" attr, the from '0'
        if (
            !_.isNull(lsValue) &&
            $ctrl.items &&
            lsValue in <any>$ctrl.items &&
            $ctrl.items[lsValue] &&
            $ctrl.items[lsValue].disabled !== true
        ) {
            $ctrl.selectedIndex = lsValue;
            $ctrl.chosen = _.result($ctrl.items[lsValue], "value");
            $scope.$parent[$ctrl.valueProp] = $ctrl.chosen;
        } else {
            if ($ctrl.items && !($ctrl.selectedIndex in $ctrl.items) && localStorageKey)
                $ctrl.selectedIndex = 0;
        }

        $ctrl.getTrackerLabel = (value) =>
            ($ctrl.swTrackerLabel && $ctrl.swTrackerLabel + "/" + value) || value;

        $ctrl.recalculateTabsWidth();

        if ($ctrl.recalculateOnUpdate)
            $scope.$watch("$ctrl.items", () => {
                $ctrl.enableTransition = false;
                $ctrl.recalculateTabsWidth();
                $ctrl.enableTransition = true;
            });

        $ctrl.onChange($ctrl.selectedIndex, true);

        $timeout(
            _.once(function () {
                $ctrl.enableTransition = true;
            }),
            150,
        );
        $scope.$watch("$ctrl.chosen", (newVal, oldVal) => {
            if (newVal !== oldVal) {
                const indexOfChosen = _.findIndex(
                    $ctrl.items,
                    (item: any) => item.value === newVal,
                );
                if (indexOfChosen > -1 && indexOfChosen !== $ctrl.selectedIndex) {
                    $ctrl.selectedIndex = indexOfChosen;
                }
            }
        });
    },
};

angular.module("sw.common").component("swSwitcher", Switcher);
