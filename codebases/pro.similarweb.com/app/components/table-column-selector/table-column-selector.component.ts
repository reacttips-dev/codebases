import angular from "angular";
import UIComponentStateService from "services/UIComponentStateService";
import swLog from "@similarweb/sw-log";
import { SwTrack } from "services/SwTrack";
/**
 * Created by vlads on 12/1/2016.
 */
class tableColumnSelectorController {
    private options: any;
    private columns: any;
    private key: string | boolean;
    private visibleCount: number;
    private fixedCount: number;
    private uiComponentState: any;
    // use this field to create new reference to the columns array - For react to re render the columns in the picker
    private columnsForPickerUI: any[];

    constructor(private $window, private $scope) {
        this.uiComponentState = UIComponentStateService;
        this.key =
            this.options && this.options.metric
                ? `${this.options.metric}_Table_columnsToggles`
                : false;
        this.visibleCount = this.columns.length;
        this.fixedCount = 0;
        if (!this.key) {
            swLog.warn(
                "Column toggle saving is DISABLED, must supply a 'metric' parameter on options object",
            );
        } else {
            const toggles = this.uiComponentState.getItem(this.key, "sessionStorage") || {};
            if (this.columns && toggles) {
                this.columns.forEach((item) => {
                    if (item.fixed) {
                        this.fixedCount++;
                    }
                    if (toggles[item.field] === false) {
                        item.visible = false;
                        this.visibleCount--;
                    }
                });
            }
        }
        this.setColumnsForPicker();
    }
    setColumnsForPicker = () => {
        this.columnsForPickerUI = this.columns.map(
            ({ field, fixed, key, displayName, visible }) => {
                return {
                    field,
                    fixed,
                    key,
                    displayName,
                    visible,
                };
            },
        );
    };
    toggleColumn = ({ displayName }) => {
        const column = this.columns.find((col) => col.displayName === displayName);
        this.$scope.$apply(() => {
            const trackingAction: string = column.visible ? "remove" : "add";
            SwTrack.all.trackEvent(
                "Drop Down",
                trackingAction,
                `Table Columns/${column.displayName}`,
            );
            column.visible = !column.visible;
            this.visibleCount =
                column.visible === true ? this.visibleCount + 1 : this.visibleCount - 1;
            if (this.key) {
                const toggles = this.uiComponentState.getItem(this.key, "sessionStorage") || {};
                toggles[column.field] = column.visible;
                this.uiComponentState.setItem(this.key, "sessionStorage", toggles);
                this.setColumnsForPicker();
            } else {
                swLog.warn(
                    "Column toggle saving is DISABLED, must supply a 'metric' parameter on options object",
                );
            }
            setTimeout(function () {
                angular.element(this.$window).trigger("resize");
            }, 0);
        });
    };
}
class tableColumnSelectorComponent implements ng.IComponentOptions {
    public bindings: any;
    public controller: any;
    public template: string;
    constructor() {
        this.bindings = {
            options: "=",
            columns: "=",
        };
        this.controller = "tableColumnSelectorController";
        this.template = `
                <sw-react component="ColumnSelectorDropDown" props="{
                    column: $ctrl.columnsForPickerUI,
                    key: $ctrl.key,
                    toggleColumn: $ctrl.toggleColumn,
                    tableOptions: $ctrl.options}"></sw-react>
            `;
    }
}
angular.module("sw.common").component("swTableColumnSelector", new tableColumnSelectorComponent());
angular
    .module("sw.common")
    .controller(
        "tableColumnSelectorController",
        tableColumnSelectorController as ng.Injectable<ng.IControllerConstructor>,
    );
