import * as React from "react";
import * as _ from "lodash";
import { WaCellKeywordBase } from "../../React/Table/cells/WaCellKeywordBase";
import { TableWidget } from "./TableWidget";

export class KeywordsTableWidget extends TableWidget {
    static $inject = [];

    static getWidgetDashboardType() {
        return "KeywordsDashboardTable";
    }

    static getWidgetMetadataType() {
        return "KeywordsTable";
    }

    getMetricColumnsConfig() {
        const widgetConfig = this._widgetConfig;
        let columnsConfig = widgetConfig.properties.columns || super.getMetricColumnsConfig();

        if (!widgetConfig.properties.enableRowSelection) {
            columnsConfig = columnsConfig.filter((col) => _.camelCase(col.name) !== "rowSelection");
        }
        if (!widgetConfig.isKeywordMode()) {
            // Don't show the serp column in keyword group mode
            columnsConfig = columnsConfig.filter((col) => _.camelCase(col.name) !== "serp");
        }

        return columnsConfig.map((config) => {
            if (config.cellComponent === "keywordcell") {
                config.cellComponent = (props) => {
                    props = {
                        ...props,
                        allowLinking: true,
                        showGoogleSearch: false,
                        showAdSearch: false,
                        keyword: props.value,
                    };
                    return <WaCellKeywordBase {...props} />;
                };
            }
            return config;
        });
    }

    callbackOnGetData(response) {
        super.callbackOnGetData(response);

        const a = _.map(response.Filters.Source, (source) => ({
            text: _.capitalize(source.text),
            id: source.text,
            count: source.count,
        }));

        response.Filters = _.extend(response.Filters, {
            category: response.Filters.Category,
            family: _.uniqBy(a, (item) => item.id),
            Source: response.Filters.Type
                ? response.Filters.Type.map((type) => ({
                      text: _.capitalize(type.text),
                      id: type.id,
                      count: type.count,
                  }))
                : undefined,
        });
    }

    protected handleDataError(statusCode: number) {
        super.handleDataError(statusCode);
        this.clearAllSelectedRows(true);
    }

    setMetadata() {
        super.setMetadata();
        const config = this._widgetConfig;
        this.metadata.columns = this.metadata.columns.map((col) => ({
            ...col,
            get tooltip() {
                if (
                    typeof col.tooltip === "string" &&
                    !config.isKeywordMode() &&
                    !_.endsWith(col.tooltip, ".keywordgroup")
                ) {
                    return `${col.tooltip}.keywordgroup`;
                } else {
                    return col.tooltip;
                }
            },
        }));
    }

    getWidgetModel() {
        let _widgetModel = super.getWidgetModel();
        Object.assign(_widgetModel, { type: "KeywordsDashboardTable" });
        return _widgetModel;
    }

    getWidgetFilters() {
        return {
            filter: this.apiParams.filter,
            FuncFlag: this.apiParams.funcFlag,
        };
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table.html`;
    }
}

KeywordsTableWidget.register();
