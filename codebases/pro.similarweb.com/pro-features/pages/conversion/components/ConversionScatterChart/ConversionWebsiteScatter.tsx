import autobind from "autobind-decorator";
import * as _ from "lodash";
import * as React from "react";
import { CHART_COLORS } from "../../../../../app/constants/ChartColors";
import { conversionVerticals } from "../benchmarkOvertime/benchmarkOvertime";
import WithAllContexts from "../WithAllContexts";
import { ConversionScatterChart, IScatterData, IScatterMetric } from "./ConversionScatterChart";

export interface IConversionWebsiteScatterProps {
    scatterXVertical: string;
    scatterYVertical: string;
    benchmarkEnabled: boolean;
    data: {
        Data: IScatterChannelItem[];
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

export interface IScatterChannelItem {
    Domain: string;
    Visits: number;
    ConvertedVisits: number;
    ConversionRate: number;
    Stickiness: number;
    Favicon: string;
}
export const ChannelProStates = {
    Social: {
        state: "websites-trafficSocial",
        params: { selectedTab: "overview", webSource: "Desktop", isWWW: "*" },
    },
    Paid: {
        state: "websites-trafficSearch-overview",
        params: { webSource: "Desktop", isWWW: "*" },
    },
    "Organic Search": {
        state: "websites-trafficSearch-overview",
        params: { webSource: "Desktop", isWWW: "*" },
    },
    "Paid Search": {
        state: "websites-trafficSearch-overview",
        params: { webSource: "Desktop", isWWW: "*" },
    },
    "Display Ads": {
        state: "websites-trafficDisplay-overview",
        params: { webSource: "Desktop", isWWW: "*" },
    },
    Mail: {
        state: "websites-trafficOverview",
        params: { isWWW: "*" },
    },
    Direct: {
        state: "websites-trafficOverview",
        params: { isWWW: "*" },
    },
    Referrals: {
        state: "websites-trafficReferrals",
        params: { isWWW: "*" },
    },
};
export class ConversionWebsiteScatter extends React.PureComponent<
    IConversionWebsiteScatterProps,
    any
> {
    private track: any;
    private translate: any;
    private linkFn: any;

    @autobind
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

    @autobind
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

    @autobind
    public scatterChartDataTransform(data: any): IScatterData[] {
        if (!data || !data.Data) {
            return undefined;
        }
        const res = _.map(data.Data, (dataItem: any) => {
            return {
                name: dataItem.Channel,
                color: CHART_COLORS.trafficSourcesColorsBySourceMMX[dataItem.Channel],
                data: [
                    {
                        x: dataItem[conversionVerticals[this.props.scatterXVertical].dataKey],
                        y: dataItem[conversionVerticals[this.props.scatterYVertical].dataKey],
                    },
                ],
                link: this.linkFn(ChannelProStates[dataItem.Channel].state, {
                    ...ChannelProStates[dataItem.Channel].params,
                    ...this.props.filters,
                    key: data.Domains[0],
                    duration: "6m",
                }),
            };
        });
        return res;
    }

    public render() {
        const { data, benchmarkEnabled } = this.props;
        return (
            <WithAllContexts>
                {({ track, linkFn, translate }) => {
                    this.track = track;
                    this.translate = translate;
                    this.linkFn = linkFn;
                    return (
                        <ConversionScatterChart
                            data={this.scatterChartDataTransform(data)}
                            metrics={this.scatterMetricsTransform(data)}
                            config={this.scatterCommonConfigTransform()}
                            options={{ efficiencyZones: benchmarkEnabled }}
                        />
                    );
                }}
            </WithAllContexts>
        );
    }
}
