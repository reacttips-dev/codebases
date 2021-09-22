import * as _ from "lodash";
import { ConversionSegmentsUtils } from "pages/conversion/ConversionSegmentsUtils";
import * as React from "react";
import { ISegmentsData } from "../../../../../app/services/conversion/ConversionSegmentsService";
import { WithContext } from "../../../../components/Workspace/Wizard/src/WithContext";
import { conversionVerticals } from "../benchmarkOvertime/benchmarkOvertime";
import { ConversionScatterChart, IScatterData, IScatterMetric } from "./ConversionScatterChart";

export interface IConversionCategoryScatterProps {
    scatterXVertical: string;
    scatterYVertical: string;
    benchmarkEnabled: boolean;
    segmentsData: ISegmentsData;
    data: {
        Data: IScatterItem[];
        Interval?: {
            units: string;
            startyear: number;
            start: number;
            count: number;
            startdate: string;
            enddate: string;
        };
        Domains?: string[];
    };
    filters: any;
}

export interface IScatterItem {
    Domain: string;
    Visits: number;
    ConvertedVisits: number;
    ConversionRate: number;
    Stickiness: number;
    Favicon: string;
    SegmentId: string;
}

export class ConversionCategoryScatter extends React.PureComponent<
    IConversionCategoryScatterProps,
    any
> {
    private track: any;
    private translate: any;
    private linkFn: any;

    public scatterMetricsTransform(data: any): { x: IScatterMetric; y: IScatterMetric } {
        const scatterXVertical = conversionVerticals[this.props.scatterXVertical];
        const scatterYVertical = conversionVerticals[this.props.scatterYVertical];
        const scatterItems = _.get(data, "Data", []);
        const xMidValue = _.isFunction(scatterXVertical.midValueCalculator)
            ? scatterXVertical.midValueCalculator(scatterItems)
            : undefined;
        const yMidValue = _.isFunction(scatterYVertical.midValueCalculator)
            ? scatterYVertical.midValueCalculator(scatterItems)
            : undefined;

        return {
            x: {
                name: this.translate(scatterXVertical.title),
                valueFormat: (value) =>
                    scatterXVertical.filter[0]()(value, scatterXVertical.filter[1]),
                highLabel: this.translate("conversion.scatter.high"),
                lowLabel: this.translate("conversion.scatter.low"),
                midValue: xMidValue,
            },
            y: {
                name: this.translate(scatterYVertical.title),
                valueFormat: (value) =>
                    scatterYVertical.filter[0]()(value, scatterYVertical.filter[1]),
                highLabel: this.translate("conversion.scatter.high"),
                lowLabel: this.translate("conversion.scatter.low"),
                midValue: yMidValue,
            },
        };
    }

    public scatterCommonConfigTransform(): any {
        const props = this.props;
        return {
            xAxis: {
                title: {
                    text: `${this.translate(conversionVerticals[props.scatterXVertical].title)} (${
                        conversionVerticals[props.scatterXVertical].metricLabel
                    })`,
                },
                labels: {
                    formatter() {
                        return conversionVerticals[props.scatterXVertical].filter[0]()(
                            this.value,
                            conversionVerticals[props.scatterXVertical].filter[1],
                        );
                    },
                },
            },
            yAxis: {
                title: {
                    text: `${this.translate(conversionVerticals[props.scatterYVertical].title)} (${
                        conversionVerticals[props.scatterYVertical].metricLabel
                    })`,
                },
                labels: {
                    formatter() {
                        return conversionVerticals[props.scatterYVertical].filter[0]()(
                            this.value,
                            conversionVerticals[props.scatterYVertical].filter[1],
                        );
                    },
                },
            },
        };
    }

    public scatterChartDataTransform(data: any, filters: any): IScatterData[] {
        if (!data || !data.Data) {
            return undefined;
        }
        const { country, gid } = filters;
        const res = _.map(data.Data, (dataItem: any) => {
            const segmentData = ConversionSegmentsUtils.getSegmentById(
                this.props.segmentsData,
                dataItem.SegmentId,
            );
            return {
                name: dataItem.Domain,
                icon: dataItem.Favicon,
                singleLob: segmentData ? segmentData.isSingleLob : true,
                segmentName: segmentData ? segmentData.segmentName : undefined,
                link: this.linkFn("conversion-customsegement", {
                    country,
                    gid,
                    sid: dataItem.SegmentId,
                    duration: "6m",
                    comparedDuration: "12m",
                }),
                data: [
                    {
                        x: dataItem[conversionVerticals[this.props.scatterXVertical].dataKey],
                        y: dataItem[conversionVerticals[this.props.scatterYVertical].dataKey],
                    },
                ],
            };
        });
        return res;
    }

    public render() {
        const { data, benchmarkEnabled, filters } = this.props;
        return (
            <WithContext>
                {({ track, linkFn, translate }) => {
                    this.track = track;
                    this.translate = translate;
                    this.linkFn = linkFn;
                    return (
                        <ConversionScatterChart
                            data={this.scatterChartDataTransform(data, filters)}
                            metrics={this.scatterMetricsTransform(data)}
                            config={this.scatterCommonConfigTransform()}
                            options={{ efficiencyZones: benchmarkEnabled }}
                            translate={translate}
                        />
                    );
                }}
            </WithContext>
        );
    }
}
