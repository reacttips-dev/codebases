import { usePrevious } from "Arena/components/ArenaVisits/ArenaVisitsContainer";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { StyledSwitcherGranularityContainer } from "pages/segments/analysis/StyledComponents";
import { SegmentsGroupAnalysisOverview } from "pages/segments/SegmentsGroupAnalysisOverview";
import { NoDataSegments } from "pages/website-analysis/website-content/leading-folders/components/NoDataSegments";
import * as React from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { AssetsService } from "services/AssetsService";
import DurationService from "services/DurationService";
import SegmentsApiService, {
    ICustomSegment,
    ICustomSegmentGroupWebsite,
    ICustomSegmentsGroup,
    ICustomSegmentsGroupAnalysisParams,
    SEGMENT_TYPES,
} from "services/segments/segmentsApiService";
import { ICustomSegmentMember, SegmentsUtils } from "services/segments/SegmentsUtils";
import { granularities } from "utils";
import SegmentsGroupAnalysisTableContainer from "./segmentsGroupsAnalysisTableContainer/SegmentsGroupsAnalysisTableContainer";
import { checkDurationIsValid } from "pages/segments/config/segmentsConfigHelpers";
import styled from "styled-components";

const EmptyStateContainer = styled.div`
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background-color: #ffffff;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    width: 85%;
    max-width: 1368px;
    height: 386px;
    margin: 40px auto;
`;

export interface ISegmentsGroupAnalysisOverviewContainerProps {
    customSegmentsData?: ICustomSegment[];
    selectedRows?: any;
    groups?: ICustomSegmentsGroup[];
}

const manipulateDataSettings = {
    // non-default settings for manipulating data
    defaults: {
        valueProp: "Average",
        winnerLeaderMax: true,
        winnerCompareFn: (a, b) => (a > b ? 1 : a < b ? -1 : 0),
    },
    columns: {
        Visits: {
            valueProp: "Total",
        },
        PagesViews: {
            valueProp: "Total",
        },
        BounceRate: {
            winnerLeaderMax: false,
        },
    },
};

const makeTableSegmentData = (segmentObj: ICustomSegmentMember, segmentType: SEGMENT_TYPES) => {
    let baseSegmentData: any = {
        SegmentType: segmentType,
        SegmentId: segmentObj.id,
    };
    switch (segmentType) {
        case SEGMENT_TYPES.SEGMENT:
            const actualSegmentObj = segmentObj as ICustomSegment;
            baseSegmentData = {
                ...baseSegmentData,
                SegmentName: actualSegmentObj.segmentName,
                SegmentDomain: actualSegmentObj.domain,
                SegmentLastUpdated: actualSegmentObj.lastUpdated,
                SegmentFavicon: actualSegmentObj.favicon,
            };
            break;
        case SEGMENT_TYPES.WEBSITE:
            const actualWebsiteObj = segmentObj as ICustomSegmentGroupWebsite;
            baseSegmentData = {
                ...baseSegmentData,
                SegmentDomain: actualWebsiteObj.domain,
                SegmentFavicon: actualWebsiteObj.favicon,
            };
    }
    return baseSegmentData;
};

const manipulateData = (response, { customSegmentsData, availableSegmentWebsites = [] }) => {
    const aggregatedData = Object.keys(response).reduce(
        (acc, segId) => {
            const segData = response[segId];
            if (!segData) {
                return acc;
            }
            const aggregateWinnerValue = (period, key, val) => {
                const curMaxValue = _.get(acc.maxValues, [period, key]);
                const winnerCompareFn =
                    manipulateDataSettings.columns[key]?.winnerCompareFn ??
                    manipulateDataSettings.defaults.winnerCompareFn;
                const winnerLeaderMax =
                    manipulateDataSettings.columns[key]?.winnerLeaderMax ??
                    manipulateDataSettings.defaults.winnerLeaderMax;
                if (
                    curMaxValue === undefined ||
                    winnerCompareFn(val, curMaxValue) === (winnerLeaderMax ? 1 : -1)
                ) {
                    _.set(acc.maxValues, [period, key], val);
                }
            };
            const aggregateSumTotal = (period, key, val) => {
                _.set(acc.sumValues, [period, key], _.get(acc.sumValues, [period, key], 0) + val);
            };
            Object.keys(segData).forEach((tabId) => {
                const segDataTab = segData?.[tabId] || {};
                Object.keys(segDataTab).forEach((periodId) => {
                    const valueProp =
                        manipulateDataSettings.columns[tabId]?.valueProp ??
                        manipulateDataSettings.defaults.valueProp;
                    const { [valueProp]: sectValue } = segDataTab[periodId];
                    if (acc && !acc.segmentsAnalyzed.has(segId)) {
                        // aggregate data for segment meta
                        acc.segmentsAnalyzed.add(segId);
                        aggregateWinnerValue(periodId, "TrafficShare", segData?.Meta?.TrafficShare);
                    }
                    if (sectValue > 0) {
                        // aggregate data for all non empty values
                        aggregateWinnerValue(periodId, tabId, sectValue);
                        if (["Visits"].includes(tabId)) {
                            aggregateSumTotal(periodId, tabId, sectValue);
                        }
                    }
                });
            });
            return acc;
        },
        { maxValues: {}, sumValues: {}, segmentsAnalyzed: new Set() },
    );

    const manipulatedDataRes = Object.keys(response).reduce(
        (acc, segId) => {
            const segData = response[segId];
            const [segmentObj, segmentType] = SegmentsUtils.getSegmentObjectByKey(segId, {
                segments: customSegmentsData,
                websites: availableSegmentWebsites,
            });
            if (!segmentObj) {
                acc.missingData.push(segId);
                return acc;
            }
            const addWinner = (period, key, val) => {
                const maxValue = _.get(aggregatedData?.maxValues, [period, key]);
                if (maxValue !== undefined && val === maxValue) {
                    _.get(acc.table, [period, segId, "winnersList"], []).push(key);
                }
            };
            Object.keys(segData).forEach((tabId) => {
                const segDataTab = segData[tabId];
                Object.keys(segDataTab).forEach((periodId) => {
                    if (acc && tabId !== "Meta" && !_.has(acc.table, [periodId, segId])) {
                        // add initial data for segment
                        const segTrafficShare = segData?.Meta?.TrafficShare;
                        const segmentData: any = {
                            ...makeTableSegmentData(segmentObj, segmentType),
                            TrafficShare: segTrafficShare,
                            winnersList: [],
                        };
                        _.set(acc.table, [periodId, segId], segmentData);
                        addWinner(periodId, "TrafficShare", segTrafficShare);
                    }

                    const valueProp =
                        manipulateDataSettings.columns[tabId]?.valueProp ??
                        manipulateDataSettings.defaults.valueProp;
                    const {
                        Graph: graphSect,
                        [valueProp]: sectValue,
                        Confidence: avgConfidence,
                    } = segDataTab[periodId];
                    if (graphSect) {
                        _.set(acc.graph, [periodId, tabId, segId], graphSect);
                    }
                    if (sectValue > 0) {
                        // only consider non empty values
                        _.set(acc.table, [periodId, segId, tabId], sectValue);
                        _.set(acc.table, [periodId, segId, "Confidence"], avgConfidence);

                        // check if leader
                        addWinner(periodId, tabId, sectValue);

                        // set relative group share
                        if (tabId === "Visits") {
                            const totalVisits = _.get(
                                aggregatedData?.sumValues,
                                [periodId, tabId],
                                0,
                            );
                            _.set(
                                acc.table,
                                [periodId, segId, "GroupVisitsShare"],
                                sectValue / totalVisits,
                            );
                        }
                    }
                });
            });
            return acc;
        },
        { graph: {}, table: {}, missingData: [] },
    );

    return manipulatedDataRes;
};

const SegmentsGroupAnalysisOverviewContainer: React.FunctionComponent<ISegmentsGroupAnalysisOverviewContainerProps> = (
    props,
) => {
    if (!checkDurationIsValid()) {
        return null;
    }

    const swNavigator = React.useMemo(() => Injector.get<any>("swNavigator"), []);
    const pageFilters = swNavigator.getApiParams();
    const { duration } = swNavigator.getParams();
    const segmentsApiService = React.useMemo(() => new SegmentsApiService(), []);
    const [isLoading, setIsLoading] = React.useState(false);
    const durationRaw = DurationService.getDurationData(duration).raw;
    const monthDiff = durationRaw.to.diff(durationRaw.from, "month");
    const [graphGranularity, setGraphGranularity] = useState(
        pageFilters.isWindow || monthDiff < 1 ? granularities[1] : granularities[2],
    );
    const [graphAvailableGran, setGraphAvailableGran] = useState([
        { title: "D", disabled: false },
        { title: "W", disabled: false },
        { title: "M", disabled: pageFilters.isWindow || monthDiff < 1 },
    ]);
    const [data, setData] = React.useState<any>(null);
    const [response, setResponse] = React.useState<any>(null);

    const { id, country, from, to, webSource = "Desktop", isWindow } = pageFilters;
    const group = props.groups?.find((grp) => grp.id === id);

    const previous: any = usePrevious({ pageFilters, graphGranularity });
    useEffect(() => {
        const durationRaw = DurationService.getDurationData(duration).raw;
        const monthDiff = durationRaw.to.diff(durationRaw.from, "month");
        if (response && graphGranularity !== previous.graphGranularity) {
            const manipulatedData = manipulateData(response, {
                customSegmentsData: props.customSegmentsData,
                availableSegmentWebsites: group?.websites,
            });
            setData({
                graphData: { Data: manipulatedData.graph[graphGranularity] },
                tableData: { Data: manipulatedData.table[granularities[2]] },
                missingData: manipulatedData.missingData,
            });
        }
        if (monthDiff < 1 && graphGranularity !== granularities[1]) {
            if (graphGranularity === granularities[2]) {
                setGraphGranularity(granularities[1]);
            }
            setGraphAvailableGran([
                { title: "D", disabled: false },
                { title: "W", disabled: false },
                { title: "M", disabled: true },
            ]);
        }
    }, [duration, graphGranularity, group?.websites]);
    React.useEffect(() => {
        (async () => {
            // get api params with defaults:
            const apiParams = {
                webSource: "Desktop",
                isWindow,
                timeGranularity: isWindow ? granularities[0] : granularities[2],
                ...pageFilters,
            };
            setIsLoading(true);
            try {
                const response = await segmentsApiService.getCustomSegmentsGroupAnalysis({
                    segmentGroupId: apiParams.id,
                    country: apiParams.country,
                    from: apiParams.from,
                    to: apiParams.to,
                    webSource: apiParams.webSource,
                    isWindow: apiParams.isWindow,
                    includeSubDomains: true,
                    timeGranularity: apiParams.timeGranularity,
                } as ICustomSegmentsGroupAnalysisParams);

                const manipulatedData = manipulateData(response, {
                    customSegmentsData: props.customSegmentsData,
                    availableSegmentWebsites: group?.websites,
                });

                setData({
                    graphData: { Data: manipulatedData.graph[graphGranularity] },
                    tableData: { Data: manipulatedData.table[granularities[2]] },
                    missingData: manipulatedData.missingData,
                });
                setResponse(response);
            } catch {
                setData({
                    graphData: { Data: {} },
                    tableData: { Data: {} },
                    missingData: [],
                });
            } finally {
                setIsLoading(false);
            }
        })();
    }, []); // initialize effect, since page is recreated on route params change

    // get which advanced segments are omitted from response
    const omittedAdvancedSegments = React.useMemo(() => {
        if (!response) {
            return [];
        }
        const responseSegmentsIds = Object.keys(response);
        const omittedSegmentsKeys = group.members.filter(
            (member) => !responseSegmentsIds.includes(member),
        );
        const omittedSegmentsObjs = SegmentsUtils.getSegmentObjectsByKeys(omittedSegmentsKeys, {
            segments: props.customSegmentsData,
            websites: group?.websites,
        });
        return omittedSegmentsObjs
            .filter(
                ([segObj, segType]) =>
                    segType === SEGMENT_TYPES.SEGMENT &&
                    SegmentsUtils.isSegmentAdvanced(segObj as ICustomSegment),
            )
            .map(([segObj, segType]) => makeTableSegmentData(segObj, segType));
    }, [response]);

    const GraphSwitcherComponent = () => {
        return (
            <StyledSwitcherGranularityContainer
                itemList={graphAvailableGran}
                selectedIndex={granularities.indexOf(graphGranularity)}
                onItemClick={onTimeGranularityClick}
                className={"gran-switch"}
            />
        );
    };

    const renderEmpty = React.useMemo(() => {
        let hasDataSegment = false;
        if (data?.tableData) {
            hasDataSegment = Object.values(data.tableData.Data).some(
                (seg) =>
                    seg["TrafficShare"] > 0 ||
                    (seg["SegmentType"] === "WEBSITE" && seg["Visits"] > 0),
            );
        }
        return !hasDataSegment;
    }, [data]);

    const pageProps = {
        loading: isLoading,
        components: { SegmentsGroupAnalysisTableContainer, GraphSwitcherComponent },
        responseMissingData: data?.missingData,
        omittedAdvancedSegments,
        pageFilters,
        timeGranularity: graphGranularity,
        availableMembers: {
            segments: props.customSegmentsData,
            websites: group?.websites,
        },
        selectedRows: props.selectedRows,
        graphData: data?.graphData,
        onGraphDDClick: (obj) => console.log("downloading graph " + obj.id),
        tableExcelLink: segmentsApiService.getCategoryConversionExcel({
            segmentGroupId: id,
            country,
            from,
            to,
            webSource,
            timeGranularity: graphGranularity,
            isWindow,
            includeSubDomains: true,
            fileName: `SegmentsComparison-(${group?.name})-(${country})-(${from})-(${to})`,
        }),
        tableData: data?.tableData,
        getAssetsUrl: AssetsService.assetUrl.bind(AssetsService),
        tableDataOmitted: omittedAdvancedSegments,
    };

    const onTimeGranularityClick = (index) => {
        const timeGranularity = granularities[index];
        if (graphGranularity !== timeGranularity) {
            setGraphGranularity(timeGranularity);
        }
    };

    return renderEmpty && !isLoading ? (
        <EmptyStateContainer>
            <NoDataSegments
                messageBottomHeader={i18nFilter()("segments.nodata.notavilable")}
                messageBottomText={i18nFilter()("segments.nodata.notavilable.subtitle")}
            />
        </EmptyStateContainer>
    ) : (
        <SegmentsGroupAnalysisOverview {...pageProps} />
    );
};

function mapStateToProps({
    tableSelection: { SegmentsGroupAnalysisTable },
    segmentsModule: { customSegmentsMeta },
}) {
    return {
        selectedRows: SegmentsGroupAnalysisTable,
        customSegmentsData: customSegmentsMeta?.AccountSegments,
        groups: customSegmentsMeta?.SegmentGroups,
    };
}

export default connect(mapStateToProps, null)(SegmentsGroupAnalysisOverviewContainer);
