/* eslint-disable @typescript-eslint/no-this-alias */
import * as _ from "lodash";
import { Widget } from "./Widget";
import {
    IPptSlideExportRequest,
    IPptSingleMetricRequest,
    IPptSingleMetricRecordData,
} from "services/PptExportService/PptExportServiceTypes";
import { getWidgetSubtitle, getWidgetTitle } from "../widget-utilities/widgetPpt/PptWidgetUtils";
import { adaptSingleMetricChart } from "components/widget/widget-utilities/widgetPpt/PptSingleMetricWidgetUtils";
import {
    adaptSingleMetricRecords,
    resolveSingleMetricType,
} from "components/widget/widget-utilities/widgetPpt/PptSingleMetricWidgetUtils";
export class SingleMetricWidget extends Widget {
    protected _singleMetricService;
    static $inject = ["singleMetricService"];

    public isPptSupported = () => {
        const singleMetricType = resolveSingleMetricType(this);
        return !!singleMetricType && !!this?.data;
    };

    public getDataForPpt = (): IPptSlideExportRequest => {
        const singleMetricType = resolveSingleMetricType(this);

        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this, { showEntities: true }),
            type: "single",
            details: {
                type: singleMetricType,
                data: adaptSingleMetricRecords(this.data, this.metadata.rows),
                chart: adaptSingleMetricChart(singleMetricType, this),
            } as IPptSingleMetricRequest,
        };
    };

    static getWidgetMetadataType() {
        return "SingleMetric";
    }

    static getWidgetResourceType() {
        return "SingleMetric";
    }

    constructor() {
        super();
    }

    protected setMetadata() {
        const rows: Record<string, any>[] = [];
        _.forEach(this._metricTypeConfig.objects, (object: Record<string, any>) => {
            rows.push(
                this._singleMetricService.row({
                    field: object.name,
                    displayName: object.title,
                    cellTemplate: object.cellTemp,
                    headerTemplate: object.headTemp || this._metricTypeConfig.properties.headTemp,
                    format: object.format,
                    titleFormat: object.titleFormat,
                    rowClass: object.rowClass,
                    isBeta: object.isBeta,
                    ppt: object.ppt,
                }),
            );
        });
        this.metadata = { rows };
    }

    private static validateField(name: string, data: any): boolean {
        if (name === "Trend" && _.isArray(data)) {
            const trendOk = _.some(data, (val) => val !== -1);
            return trendOk;
        }
        return _.isNumber(data) || _.isString(data) || _.isObject(data);
    }

    protected validateData(response: any) {
        const that = this;
        if (_.isFunction(that._widgetConfig.properties.validateData)) {
            return that._widgetConfig.properties.validateData(response);
        } else {
            let dataObjects = _.head(_.values(response));
            if (_.isObject(dataObjects) && !_.isArray(dataObjects)) {
                dataObjects = [dataObjects];
            }
            return _.every(dataObjects, (dataObj) => {
                // validate fields
                const hasData = _.some<any>(this.metadata.rows, (row) =>
                    SingleMetricWidget.validateField(row.field, dataObj[row.field]),
                );
                return hasData;
            });
        }
    }

    callbackOnGetData(response: any) {
        this.runProfiling();
        // should be implemented on each of the extending classes
        this.data = response.Data[this._params.keys];
        //Merge response.Data with response.KeysDataVerification for isGAVerified flag per property.
        this.mergeGAVerifiedFlag(response);
    }

    onResize() {
        return;
    }
}

SingleMetricWidget.register();
