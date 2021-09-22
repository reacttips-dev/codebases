import {
    leadingFolderDataReady,
    leadingFolderFetchData,
} from "../../../pages/website-analysis/website-content/leading-folders/LeadingFoldersActions";
import { LeadingFoldersDashboardTableWidgetFilters } from "../widget-filters/LeadingFoldersDashboardTableWidgetFilters";
import { TableWidget } from "./TableWidget";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import * as _ from "lodash";
import {
    popularPagesHideRequestMessage,
    popularPagesShowRequestMessage,
} from "../../../actions/popularPagesActions";
import { getIsAutomationUser, getIsSwUser } from "../../../services/track/CustomUrlBuilderService";
export class LeadingFoldersTableWidget extends TableWidget {
    public static getWidgetDashboardType() {
        return "Table";
    }

    public static getWidgetMetadataType() {
        return "LeadingFoldersTable";
    }

    public static getWidgetResourceType() {
        return "Table";
    }

    public static getFiltersComponent() {
        return LeadingFoldersDashboardTableWidgetFilters;
    }

    constructor() {
        super();
    }

    protected getSearchKey() {
        return "Folder";
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
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

    public callbackOnGetData(response) {
        super.callbackOnGetData(response);
        //SIM-21587
        if (!this.dashboardId) {
            this._$ngRedux.dispatch(leadingFolderDataReady(response));
        }
    }

    public getData() {
        super.getData();
        //SIM-21587
        if (!this.dashboardId) {
            this._$ngRedux.dispatch(leadingFolderFetchData());
        }
    }
}
LeadingFoldersTableWidget.register();
