import angular from "angular";
import * as _ from "lodash";
import { Widget } from "../widget-types/Widget";

/**
 * Created by vlads on 18/1/2016.
 */
const widgetUtilityDropdownComponent: angular.IComponentOptions = {
    bindings: {
        utility: "=",
        widget: "=",
    },
    template: `<sw-react ng-if="ctrl.asChipDown" component="DropdownReact" class="DropdownReact" props="{
onChange: ctrl.onChange, 
items: ctrl.options, 
selected: ctrl.selectedOption, 
className: ctrl.utility.properties.className,
swTrackName: ctrl.swTrackName,
maxWidth: '100%',
minWidth:  ctrl.utility.properties.minWidth || '200px',
width:  ctrl.utility.properties.width,
showSearch: ctrl.utility.properties.showSearch,
emptySelect: ctrl.utility.properties.emptySelect,
placeholder: ctrl.placeholder,
disabled: ctrl.utility.properties.disabled || (!ctrl.utility.properties.keepEnabled && ctrl.widget.widgetState!= 2),
renderItem: ctrl.utility.properties.renderItem,
isNew: ctrl.utility.properties.isNew
}"></sw-react>
<sw-react ng-if="ctrl.asBorderless" component="DropdownBorderless" class="DropdownBorderless" props="{
onChange: ctrl.onChange, 
items: ctrl.options, 
selected: ctrl.selectedOption, 
className: ctrl.utility.properties.className,
swTrackName: ctrl.swTrackName,
maxWidth: '100%',
minWidth:  ctrl.utility.properties.minWidth || '200px',
width:  ctrl.utility.properties.width,
emptySelect: ctrl.utility.properties.emptySelect,
placeholder: ctrl.placeholder,
disabled: ctrl.utility.properties.disabled || (!ctrl.utility.properties.keepEnabled && ctrl.widget.widgetState!= 2),
renderItem: ctrl.utility.properties.renderItem,
isNew: ctrl.utility.properties.isNew
}"></sw-react>
<sw-dropdown ng-if="!ctrl.asChipDown && !ctrl.asBorderless" items="ctrl.options"
                selected="ctrl.selectedOption"
                class="{{ ctrl.utility.properties.className }}"
                sw-track-name="Table/{{ctrl.utility.properties.trackingName}}"
                max-width="100%"
                min-width="{{ctrl.utility.properties.minWidth || '200px' }}"
                show-search="{{ ctrl.utility.properties.showSearch && true }}"
                empty-select="{{ ctrl.utility.properties.emptySelect && true }}"
                placeholder="{{ctrl.placeholder}}"
                disabled="ctrl.widget.widgetState!= 2"></sw-dropdown>`,
    controllerAs: "ctrl",
    controller: function ($scope, $timeout) {
        let ctrl = this;
        this.swTrackName = `Table/${ctrl.utility?.properties?.trackingName}`;
        this.asChipDown = ctrl.utility?.properties?.asChipDown;
        this.asBorderless = ctrl.utility?.properties?.asBorderless;
        let utilityProp = ctrl.utility.properties;
        ctrl.placeholder = utilityProp.placeholder;
        ctrl.options = [];
        let widget = ctrl.widget;
        // predefined dropdown items
        if (utilityProp.values) {
            ctrl.options = utilityProp.values;
        }
        // populate dropdown from data
        else {
            $scope.$watch("ctrl.widget.data.Filters", (val, oldVal) => {
                if (utilityProp.onFiltersWatch) {
                    return utilityProp.onFiltersWatch(val, oldVal, ctrl, $scope, $timeout);
                }
                if (val) {
                    ctrl.options = val[utilityProp.column];
                }
            });
        }

        // try to set initial the selected options
        let initialSelectedOptions = tryGetInitialOption(utilityProp, widget);
        if (initialSelectedOptions) {
            ctrl.selectedOption = initialSelectedOptions;
        }

        // when using react chipdown or react dropdown (borderless)
        ctrl.onChange = (item) => {
            const fn = () => {
                this.selectedOption = item ? item.id : null;
            };
            if ($scope.$$phase) {
                fn();
            } else {
                $scope.$apply(fn);
            }
        };

        $scope.$on("clear-utility-filter", () => {
            this.selectedOption = null;
        });

        $scope.$watch("ctrl.selectedOption", (newVal, oldVal) => {
            if (newVal != oldVal) {
                if (utilityProp.onChange) {
                    widget.apiParams.page = 1;
                    widget.page = 1;
                    return utilityProp.onChange(this, newVal, oldVal);
                }
                widget.apiParams.page = 1;
                widget.page = 1;

                widget.setFilterParam({
                    param: utilityProp.param,
                    name: utilityProp.column,
                    type: utilityProp.type,
                    operator: utilityProp.operator,
                    value: newVal,
                });
            }
        });

        $scope.$watch(
            () => {
                // watch for change only in the relevant dropdown filter
                let parsedFilter = Widget.filterParse(ctrl.widget.apiParams.filter);
                return _.result(parsedFilter, utilityProp.column + ".value");
            },
            (newVal, oldVal) => {
                if (newVal !== oldVal) {
                    if (utilityProp.type == "string") {
                        newVal = _.trim(newVal, '"');
                    }
                    // update the selected option
                    ctrl.selectedOption = newVal;
                }
            },
        );

        function tryGetInitialOption(utilityProp, widget) {
            if (utilityProp.chosen) {
                return utilityProp.chosen;
            } else {
                if (widget.apiParams[utilityProp.param]) {
                    let splittedWidgetFilter = widget.apiParams[utilityProp.param].split(";");
                    if (
                        splittedWidgetFilter[0] == utilityProp.column &&
                        splittedWidgetFilter[1] == utilityProp.operator
                    ) {
                        return splittedWidgetFilter[2];
                    }
                } else {
                    return false;
                }
            }
        }
    },
};

angular.module("sw.common").component("swWidgetUtilityDropdown", widgetUtilityDropdownComponent);
