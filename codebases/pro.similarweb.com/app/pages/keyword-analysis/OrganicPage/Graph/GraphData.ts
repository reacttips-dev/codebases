import dayjs from "dayjs";
import { ChartMarkerService } from "services/ChartMarkerService";
import { isPartialDataPoint } from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";

export const OTHERS_DOMAIN_NAME = "Others";

export enum EGraphType {
    TRAFFIC_TREND,
    MARKET_SHARE,
}

export enum EGraphGranularities {
    DAILY,
    WEEKLY,
    MONTHLY,
}

export const graphGranularityToString = {
    [EGraphGranularities.DAILY]: "Daily",
    [EGraphGranularities.WEEKLY]: "Weekly",
    [EGraphGranularities.MONTHLY]: "Monthly",
};

interface IGetGraphDataProps {
    graphData: any;
    sites: Array<{ Domain: string; selectionColor: string }>;
    hiddenSites: Array<string>;
    graphGranularity: EGraphGranularities;
    graphType: EGraphType;
    webSource: string;
    lastSupportedDate: string;
    isPieChart: boolean;
}

export const getGraphData = ({
    graphData,
    sites = [],
    graphGranularity = EGraphGranularities.MONTHLY,
    hiddenSites = [],
    graphType,
    webSource,
    lastSupportedDate,
    isPieChart,
}: IGetGraphDataProps) => {
    const dataGranularity =
        graphGranularity === EGraphGranularities.MONTHLY
            ? 0
            : graphGranularity === EGraphGranularities.WEEKLY
            ? "Weekly"
            : "Daily";
    const dateToSumMapper = {};
    const data = sites
        .map(({ Domain, selectionColor }, index) => {
            if (graphData[Domain] && graphData[Domain][webSource][dataGranularity]) {
                const isVisible = !hiddenSites.includes(Domain);
                return {
                    name: Domain,
                    showInLegend: false,
                    color: selectionColor,
                    seriesName: Domain,
                    data: graphData[Domain][webSource][dataGranularity].map(
                        (dataPointItem, dataPointIndex, dataPoints) => {
                            const { Key, Value: value } = dataPointItem;
                            const { Share: share, RelativeShare: relativeShare } = value;
                            const currentDate = dayjs.utc(Key).valueOf();
                            if (isVisible) {
                                dateToSumMapper.hasOwnProperty(currentDate)
                                    ? (dateToSumMapper[currentDate] += share)
                                    : (dateToSumMapper[currentDate] = share);
                            }
                            return {
                                x: dayjs.utc(Key).valueOf(),
                                y: graphType === EGraphType.TRAFFIC_TREND ? relativeShare : share,
                                isPartial: isPartialDataPoint(
                                    dataPointIndex,
                                    dataPoints,
                                    dataPointItem,
                                    dataGranularity,
                                    lastSupportedDate,
                                ),
                            };
                        },
                    ),
                    index: sites.length - index,
                    yAxis: 0,
                    zIndex: 1,
                    marker: {
                        symbol: ChartMarkerService.createMarkerStyle(selectionColor).background,
                    },
                    visible: isVisible,
                };
            }
        })
        .filter((x) => x);
    const isOthers = data.length > 0 && (isPieChart || graphType === EGraphType.MARKET_SHARE);
    if (isOthers) {
        data.push({
            name: OTHERS_DOMAIN_NAME,
            showInLegend: false,
            color: "#E6E6E6",
            seriesName: "Domain",
            data: data[0].data.map((dataPointItem, dataPointIndex, dataPoints) => ({
                x: dataPointItem.x,
                y: 1 - dateToSumMapper[dataPointItem.x],
                isPartial: isPartialDataPoint(
                    dataPointIndex,
                    dataPoints,
                    dataPointItem,
                    dataGranularity,
                    lastSupportedDate,
                ),
            })),
            index: 0,
            yAxis: 0,
            zIndex: 1,
            marker: {
                symbol:
                    // eslint-disable-next-line max-len
                    "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNSAyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+c3ZnLW1hcmtlcjwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8ZmlsdGVyIHg9Ii01MCUiIHk9Ii01MCUiIHdpZHRoPSIyMDAlIiBoZWlnaHQ9IjIwMCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImEiPgogICAgICAgICAgICA8ZmVPZmZzZXQgZHk9IjIiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiLz4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIi8+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4zNSAwIiBpbj0ic2hhZG93Qmx1ck91dGVyMSIgcmVzdWx0PSJzaGFkb3dNYXRyaXhPdXRlcjEiLz4KICAgICAgICAgICAgPGZlTWVyZ2U+CiAgICAgICAgICAgICAgICA8ZmVNZXJnZU5vZGUgaW49InNoYWRvd01hdHJpeE91dGVyMSIvPgogICAgICAgICAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJTb3VyY2VHcmFwaGljIi8+CiAgICAgICAgICAgIDwvZmVNZXJnZT4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZGVmcz4KICAgIDxjaXJjbGUgY3g9IjEyLjAiIGN5PSIxMi4wIiByPSI1LjUiIHN0cm9rZT0iI0ZGRiIgZmlsdGVyPSJ1cmwoI2EpIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiM5MTJhYTIiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=)",
            },
            visible: !hiddenSites.includes("Others"),
        });
    }
    return data;
};
