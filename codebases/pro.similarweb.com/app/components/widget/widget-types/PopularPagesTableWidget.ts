import {
    popularPagesHideRequestMessage,
    popularPagesShowRequestMessage,
} from "actions/popularPagesActions";
import { Injector } from "common/ioc/Injector";
import { radioItems } from "components/React/PopularPagesFilters/popularPagesFilters.config";
import { PopularPagesTableWidgetFilters } from "components/widget/widget-filters/PopularPagesTableWidgetFilters";
import * as _ from "lodash";
import { TableWidget } from "./TableWidget";
import { getIsAutomationUser, getIsSwUser } from "../../../services/track/CustomUrlBuilderService";

export class PopularPagesTableWidget extends TableWidget {
    public static getWidgetMetadataType() {
        return "PopularPagesTable";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getWidgetDashboardType() {
        return "Table";
    }

    public static getFiltersComponent() {
        return PopularPagesTableWidgetFilters;
    }

    constructor() {
        super();
    }

    public onWidgetMount($el, $scope) {
        if (!this.dashboardId) {
            const $ngRedux = Injector.get<any>("$swNgRedux");
            $scope.$on(
                "widgetGetDataFail",
                _.debounce((e, data) => {
                    $ngRedux.dispatch(
                        popularPagesShowRequestMessage(
                            this.apiParams.keys,
                            data.headers("error-code") === "5001",
                        ),
                    );
                }, 100),
            );
            $scope.$on(
                "widgetGetDataSuccess",
                _.debounce((e, data) => {
                    $ngRedux.dispatch(popularPagesHideRequestMessage(this.apiParams.keys));
                }, 100),
            );
            $scope.$on(
                "widgetCleanup",
                _.debounce((e, data) => {
                    $ngRedux.dispatch(popularPagesHideRequestMessage(this.apiParams.keys));
                }, 100),
            );
        }
    }

    public getWidgetFilters() {
        const filterNames = radioItems.map((radioItem) => radioItem.value);
        filterNames.push("isUtm");
        filterNames.push("filter");
        const filters = {};
        Object.keys(this.apiParams).map((apiParamName) => {
            if (filterNames.indexOf(apiParamName) > -1) {
                filters[apiParamName] = this.apiParams[apiParamName];
            }
        });
        return filters;
    }

    protected getSearchKey() {
        return "Page";
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }
}

PopularPagesTableWidget.register();
