import { TableWidget } from "../../../../components/widget/widget-types/TableWidget";
import columns from "./CategoryLeadersTableColumns";
import { getTableWidgetDomainUrl } from "./CategoryLeadersUtils";
const getWidgetConfig = (params) => {
    return {
        metric: "CategoryLeadersSearch",
        type: "LeaderBySourceTable",
        properties: {
            family: "Industry",
            ...params,
            metric: "CategoryLeadersSearch",
            apiController: "CategoryLeaders",
            type: "LeaderBySourceTable",
            height: "auto",
            width: "12",
            options: {
                cssClass: "widgetTable",
                showIndex: true,
                showTitle: false,
                showSubtitle: false,
                showLegend: false,
                showSettings: false,
                showTopLine: false,
                showFrame: false,
                loadingSize: 20,
                showCompanySidebar: true,
                overrideColumns: true,
            },
            columns: columns,
        },
        utilityGroups: [
            {
                properties: {
                    className: "tableTopRow",
                },
                utilities: [
                    {
                        id: "dropdown",
                        properties: {
                            param: "filter",
                            type: "number",
                            column: "OP",
                            operator: "==",
                            placeholder: "Paid And Organic",
                            trackingName: "Paid And Organic",
                            emptySelect: true,
                            values: [
                                {
                                    id: "0",
                                    text: "Organic",
                                },
                                {
                                    id: "1",
                                    text: "Paid",
                                },
                            ],
                        },
                    },
                ],
            },
            {
                properties: {
                    className: "tableBottomLeft",
                },
                utilities: [
                    {
                        id: "table-search",
                        properties: {},
                    },
                ],
            },
            {
                properties: {
                    className: "tableBottomRight",
                },
                utilities: [
                    {
                        id: "table-export",
                        properties: {},
                    },
                    {
                        id: "columns-toggle",
                        properties: {},
                    },
                ],
            },
            {
                properties: {
                    className: "tableBottom",
                },
                utilities: [
                    {
                        id: "table-pager",
                        properties: {},
                    },
                ],
            },
        ],
    };
};
const getMetricConfig = () => {
    const domainState = getTableWidgetDomainUrl();

    return {
        component: "CategoryLeaders",
        state: domainState,
        dashboard: "true",
        title: "dashboard.categoryLeaders.table.title.search",
        family: "Industry",
        apiController: "CategoryLeaders",
        disableDatepicker: true,
    };
};
const metricTypeConfig = {
    properties: {
        showMoreButtonItems: 10,
        apiParams: {
            tab: "CategoryLeadersSearch",
        },
        options: {
            sortedColumnAddedWidth: true,
            showLegend: false,
            dashboardSubtitleMarginBottom: 25,
            showFrame: true,
            showOverflow: true,
            desktopOnly: true,
        },
    },
    filters: {
        orderBy: [
            {
                value: "Share desc",
                title: "Traffic Share",
            },
        ],
    },
};

export class CategoryLeadersSearch extends TableWidget {
    static getWidgetMetadataType() {
        return "LeaderBySourceTable";
    }

    static getWidgetResourceType() {
        return "Table";
    }
    static getAllConfigs(params) {
        const widgetConfig = getWidgetConfig(params);
        const metricConfig = getMetricConfig();
        return {
            widgetConfig,
            metricConfig,
            metricTypeConfig,
            apiController: widgetConfig.properties.apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }

    canAddToDashboard() {
        return true;
    }

    getWidgetModel() {
        const model = super.getWidgetModel();
        model.type = "LeaderBySourceTable";
        return model;
    }
}
