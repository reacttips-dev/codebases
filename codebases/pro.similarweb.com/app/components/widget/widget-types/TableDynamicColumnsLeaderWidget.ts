import * as _ from "lodash";
import { TableWidget } from "./TableWidget";
export class TableDynamicColumnsLeaderWidget extends TableWidget {
    static $inject = [];

    chartConfig: any = {};

    constructor() {
        super();
    }

    static getWidgetMetadataType() {
        return "TableDynamicColumnsLeader";
    }
    static getWidgetResourceType() {
        return "Table";
    }

    static getWidgetDashboardType() {
        return "Table";
    }

    columnTemplate(name) {
        const headTemp =
            this._widgetConfig.properties.options.headTemp ||
            this._metricTypeConfig.properties.options.headTemp;
        return {
            name: name,
            title: name,
            type: "double",
            format: "percentagesign:2",
            sortable: "False",
            isSorted: "False",
            sortDirection: "asc",
            groupable: "False",
            cellTemp: "leader-search-cell",
            headTemp: headTemp,
            headerCellIcon: name.toLowerCase().replace(" ", "-") + "-search",
            totalCount: "False",
            tooltip: "",
            width: "",
            ppt: {
                // Highlight a row's cell in case "IsLeader" property evaluates to true
                highlightCellWhenPropsTrue: ["IsLeader"],
                // Do not render Domain, Favicon, IsLeader and Name properties value into the ppt table
                ignoreCellProps: ["Domain", "Favicon", "IsLeader", "Name"],
            },
        };
    }

    getColumnsConfig() {
        if (_.get(this, "data.Records")) {
            const _columnNames = [];
            _.forOwn(this.data.Records[0], (item, key) => {
                if (["Domain", "Favicon", "url", "Children"].indexOf(key) === -1)
                    _columnNames.push(key);
            });
            return [
                {
                    name: "Domain",
                    title: "wa.ao.engagement.domain",
                    type: "string",
                    format: "None",
                    sortable: "False",
                    isSorted: "False",
                    sortDirection: "desc",
                    groupable: "True",
                    cellTemp: "website-tooltip-top-cell",
                    headTemp: "",
                    totalCount: "False",
                    tooltip: "",
                    width: "",
                    ppt: {
                        // Highlight a row's cell in case "IsLeader" property evaluates to true
                        highlightCellWhenPropsTrue: ["IsLeader"],
                        // Do not render Domain, Favicon, IsLeader and Name properties value into the ppt table
                        ignoreCellProps: ["Domain", "Favicon", "IsLeader", "Name"],
                    },
                },
                ..._columnNames.map((name) => this.columnTemplate(name)),
            ];
        }
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }
}

TableDynamicColumnsLeaderWidget.register();
