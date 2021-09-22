import angular from "angular";
import { SwTrack } from "services/SwTrack";
/**
 * Created by vlads on 12/1/2016.
 */
const widgetActions = [
    { id: "edit", text: "home.dashboards.widget.menu.edit" },
    { id: "duplicate", text: "home.dashboards.widget.menu.duplicate" },
    {
        id: "delete",
        text: "home.dashboards.widget.menu.delete",
        cssClass: "swDropdownMenu-topDivider",
    },
];

const widgetMenuComponent: angular.IComponentOptions = {
    bindings: {
        widget: "=",
    },
    template: `
            <div dropdown class="swWidgetCog gridster-no-drag">
                <div dropdown-toggle
                     sw-tracker sw-tracker-category="Drop down" sw-tracker-action="open" sw-tracker-label="Widget Settings">
                     <sw-react component="ReactIconButton" props="{iconName: 'settings'}"></sw-react>
                </div>
                <div dropdown-menu class="swWidgetCog swWidgetCog-popup dropdown-menu-right">
                    <ul class="swWidgetCog-results">
                        <li ng-repeat="item in $ctrl.menuItems track by item.id">
                            <a class="swWidgetCog-popupItem {{item.cssClass}}" ng-click="$ctrl.triggerAction(item.id)">
                                {{ item.text | i18n }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        `,
    controller: function ($scope, $attrs, dashboardService) {
        //dashboardService.setInstance(this.widget.dashboardId);
        const dashboard = dashboardService.dashboard;
        this.menuItems = widgetActions;

        this.triggerAction = (action) => {
            SwTrack.all.trackEvent("Drop Down", "click", "Widget Settings" + "/" + action);
            switch (action) {
                case "duplicate":
                    dashboardService.addWidget({
                        properties: this.widget.getProperties(),
                        pos: { sizeX: this.widget.pos.sizeX, sizeY: this.widget.pos.sizeY },
                        dashboardId: this.widget.dashboardId,
                    });
                    break;
                case "delete":
                    this.widget.delete = () => {
                        dashboardService.deleteWidget(this.widget);
                    };
                    $scope.$emit("widget.showDialog", "delete");
                    break;
                case "edit":
                    $scope.$emit("dashboard.openWizard", this.widget);
                    break;
            }
        };
    },
};

angular.module("sw.common").component("swWidgetMenu", widgetMenuComponent);
