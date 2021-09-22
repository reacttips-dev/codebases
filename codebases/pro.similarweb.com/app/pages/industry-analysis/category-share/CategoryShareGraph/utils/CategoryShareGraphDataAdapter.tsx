import dayjs from "dayjs";
import {
    addPartialDataZones,
    isPartialDataPoint,
} from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import {
    DataGranularity,
    ICategoryShareServices,
    ICategoryShareTableSelection,
    WebSourceType,
} from "../../CategoryShareTypes";
import {
    DataTypeSwitcherEnum,
    ICategoryShareAdaptedGraphData,
    ICategoryShareGraphApiData,
    WebSourceToDataMapping,
} from "../CategoryShareGraphTypes";
import ChartMarkerService from "services/ChartMarkerService";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import _ from "lodash";
import { resolveLastSupportedDate, resolveWebSourceForGraphApi } from "./CategoryShareGraphUtils";
interface IDataAdaptProps {
    graphApiData: ICategoryShareGraphApiData;
    websource: WebSourceType;
    dataGranularity: DataGranularity;
    duration: string;
    selectedDataType: DataTypeSwitcherEnum;
    selectedTableRows: ICategoryShareTableSelection[];
    hiddenDomains: string[];
    services: ICategoryShareServices;
    shouldAddOthersRecord: boolean;
    isMonthToDateEnabled: boolean;
}

export const adaptGraphData = (props: IDataAdaptProps): ICategoryShareAdaptedGraphData[] => {
    const {
        graphApiData,
        selectedTableRows,
        websource,
        selectedDataType,
        hiddenDomains,
        dataGranularity,
        services,
        duration,
        shouldAddOthersRecord,
        isMonthToDateEnabled,
    } = props;

    const hasTableData = selectedTableRows && selectedTableRows.length > 0;
    const hasGraphData = graphApiData?.Data && Object.entries(graphApiData.Data).length > 0;
    if (!hasTableData || !hasGraphData) return [];

    const lastSupportedDate = resolveLastSupportedDate(duration, isMonthToDateEnabled, services);

    const data: ICategoryShareAdaptedGraphData[] = Object.entries(graphApiData.Data)
        .filter((domain) => {
            const [domainName] = domain;
            return isDomainSelectedOnTable(domainName, selectedTableRows);
        })
        .filter((domain) => {
            const [, domainData] = domain;
            return hasDomainData(domainData, websource);
        })
        .sort((thisDomain, otherDomain) => {
            const [thisDomainName] = thisDomain;
            const [otherDomainName] = otherDomain;
            return sortAccordingToTableRows(thisDomainName, otherDomainName, selectedTableRows);
        })
        .map((domain, index) => {
            const [domainName, domainData] = domain;

            const domainRowInTable = selectedTableRows.find((row) => row.Domain === domainName);
            const { selectionColor } = domainRowInTable;

            const domainDataPoints = adaptDataPointsForDomain(
                domainData,
                websource,
                dataGranularity,
                selectedDataType,
                lastSupportedDate,
                isMonthToDateEnabled,
            );

            return {
                name: domainName,
                seriesName: domainName,
                showInLegend: false,
                color: selectionColor,
                data: domainDataPoints,
                index: selectedTableRows.length - index,
                yAxis: 0,
                zIndex: 1,
                marker: {
                    symbol: ChartMarkerService.createMarkerStyle(selectionColor).background,
                },
                visible: !hiddenDomains.includes(domainName),
                zoneAxis: null,
                zones: null,
            };
        });

    if (shouldAddOthersRecord) {
        const othersRecord = createOthersRecord(
            data,
            dataGranularity,
            lastSupportedDate,
            hiddenDomains,
            isMonthToDateEnabled,
        );
        data.push(othersRecord);
    }

    const result = addPartialDataZones(data, {
        chartType: chartTypes.AREA,
    });

    return result;
};

const isDomainSelectedOnTable = (
    domainName: string,
    selectedTableRows: ICategoryShareTableSelection[],
) => {
    const isDomainSelected = selectedTableRows.find((row) => row.Domain === domainName);
    return isDomainSelected;
};

const hasDomainData = (domainData: WebSourceToDataMapping, websource: WebSourceType) => {
    const adaptedWebSource = resolveWebSourceForGraphApi(websource);
    const domainDataPoints = domainData?.[adaptedWebSource] ?? [];
    const hasData = domainDataPoints.length > 0;
    return hasData;
};

const sortAccordingToTableRows = (
    thisDomainName: string,
    otherDomainName: string,
    selectedTableRows: ICategoryShareTableSelection[],
) => {
    const thisDomainRowInTable =
        selectedTableRows?.find((row) => row.Domain === thisDomainName)?.index ?? -1;

    const otherDomainRowInTable =
        selectedTableRows?.find((row) => row.Domain === otherDomainName)?.index ?? -1;

    return thisDomainRowInTable > otherDomainRowInTable ? 1 : -1;
};

const adaptDataPointsForDomain = (
    domainData: WebSourceToDataMapping,
    websource: WebSourceType,
    dataGranularity: DataGranularity,
    selectedDataType: DataTypeSwitcherEnum,
    lastSupportedDate: string,
    isMonthToDateEnabled: boolean,
): Array<{ x: number; y: number; isPartial: boolean }> => {
    const adaptedWebSource = resolveWebSourceForGraphApi(websource);
    const domainDataPoints = domainData[adaptedWebSource].map((point, pointIndex, domainPoints) => {
        const pointDate = dayjs.utc(point.Key).valueOf();
        const pointValue =
            selectedDataType === DataTypeSwitcherEnum.PERCENT
                ? point.Value.Share
                : point.Value.Absolute;

        return {
            x: pointDate,
            y: pointValue,
            isPartial: isMonthToDateEnabled
                ? isPartialDataPoint(
                      pointIndex,
                      domainPoints,
                      point,
                      dataGranularity,
                      lastSupportedDate,
                  )
                : false,
        };
    });
    return domainDataPoints;
};

const createOthersRecord = (
    graphData: ICategoryShareAdaptedGraphData[],
    dataGranularity: DataGranularity,
    lastSupportedDate: string,
    hiddenDomains: string[],
    isMonthToDateEnabled: boolean,
): ICategoryShareAdaptedGraphData => {
    const dateToValueSumMapping = createDateToValueSumMapping(graphData);
    const othersRecord: ICategoryShareAdaptedGraphData = {
        name: "Others",
        showInLegend: false,
        color: "#E6E6E6",
        seriesName: "Others",
        data: graphData[0].data.map((point, index, allPoints) => ({
            x: point.x,
            y: 1 - dateToValueSumMapping[point.x],
            isPartial: isMonthToDateEnabled
                ? isPartialDataPoint(index, allPoints, point, dataGranularity, lastSupportedDate)
                : false,
        })),
        index: 0,
        yAxis: 0,
        zIndex: 1,
        marker: {
            symbol: ChartMarkerService.createMarkerStyle("#E6E6E6").background,
        },
        visible: !hiddenDomains.includes("Others"),
        zones: null,
        zoneAxis: null,
    };

    return othersRecord;
};

const createDateToValueSumMapping = (graphData: ICategoryShareAdaptedGraphData[]) => {
    const flattenedGraphData = flattenGraphDataPoints(graphData);

    const dateToValueMapping: Record<number, number> = flattenedGraphData.reduce(
        (mapResult, graphPoint) => {
            mapResult.hasOwnProperty(graphPoint.date)
                ? (mapResult[graphPoint.date] += graphPoint.value)
                : (mapResult[graphPoint.date] = graphPoint.value);
            return mapResult;
        },
        {},
    );

    return dateToValueMapping;
};

const flattenGraphDataPoints = (graphData: ICategoryShareAdaptedGraphData[]) => {
    const graphDataPoints = graphData
        .filter((domain) => domain.visible)
        .reduce((res, domain) => {
            const domainDataPoints = domain.data.map((point) => {
                return {
                    date: point.x,
                    value: point.y,
                };
            });

            return [...res, ...domainDataPoints];
        }, [] as Array<{ date: number; value: number }>);

    return graphDataPoints;
};
