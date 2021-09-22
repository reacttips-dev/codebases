import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { NoData } from "components/NoData/src/NoData";
import {
    StyledAddToDashboardButton,
    StyledBox,
    StyledHeader,
    StyledTable,
} from "components/React/EngagementOverviewTable/StyledComponents";
import GAVerifiedContainer from "components/React/GAVerifiedIcon/GAVerifiedContainer";
import { DomainCell } from "components/React/Table/cells/DomainCell";
import { FullRowCell } from "components/React/Table/cells/FullRowCell";
import { MetricIconCell } from "components/React/Table/cells/MetricIconCell";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import {
    LoadingContainer,
    RowLoadingContainer,
} from "components/Workspace/MarketingMixTable/src/MarketingMixTableStyled";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import { useAddToDashboard } from "pages/website-analysis/traffic-sources/mmx/components/ChannelAnalysisChart/ChannelAnalysisChartContainerHooks";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import CountryService from "services/CountryService";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import { granularities } from "utils";
import { addBetaBranchParam } from "pages/website-analysis/TrafficAndEngagement/UtilityFunctionsAndConstants/UtilityFunctions";
import { BetaBranchLabel } from "pages/website-analysis/TrafficAndEngagement/BetaBranch/CommonComponents";

const fetchService = DefaultFetchService.getInstance();

interface IDataResponse {
    [key: string]: string | IMetricDataResponse;
}

interface IMetricDataResponse {
    Value: number;
    IsLeader: boolean;
}

interface IKeysDataVerification {
    [key: string]: boolean;
}

interface IGaPrivacy {
    [key: string]: boolean;
}

interface ITransformedData {
    [key: string]: IMetricMetaData | IMetricData;
}

interface IMetricMetaData {
    value: string;
    icon: string;
    tooltip: string;
    score: number;
    isBeta?: boolean;
}

interface IMetricData extends IMetricDataResponse {
    format: string;
    unlockHook?: object;
}

interface IProps {
    showGAApprovedData: boolean;
    showAddToDashboard?: boolean;
    showBetaBranchData?: boolean;
    routing: {
        params: {
            country: number;
            webSource: string;
            key: string;
            isWWW: string;
            duration: string;
        };
    };
}

enum metrics {
    BounceRate = "BounceRate",
    PagesPerVisit = "PagesPerVisit",
    AvgVisitDuration = "AvgVisitDuration",
    DedupUniqueUsers = "DedupUniqueUsers",
    AvgMonthVisits = "AvgMonthVisits",
    UniqueUsers = "UniqueUsers",
    VisitsPerUser = "VisitsPerUser",
}

const conditionalMetrics = [metrics.UniqueUsers, metrics.VisitsPerUser];
const constMetrics = [
    metrics.BounceRate,
    metrics.PagesPerVisit,
    metrics.AvgVisitDuration,
    metrics.DedupUniqueUsers,
    metrics.AvgMonthVisits,
];

export const lockedMetrics = [
    i18nFilter()("wa.ao.metric.dedup"),
    i18nFilter()("wa.ao.graph.dailymuv"),
    i18nFilter()("wa.ao.graph.monthlymuv"),
    i18nFilter()("wa.ao.graph.vpu"),
];

const getMetricsProps = (duration: string, showBetaBranchData: boolean): any => {
    const betaBranchNonValidMetrics = {
        [metrics.BounceRate]: {
            value: i18nFilter()("wa.ao.graph.bounce"),
            icon: "bounce-rate-2",
            format: "percentagesign:2",
            score: 7,
            tooltip: i18nFilter()("wa.ao.graph.bounce.tooltip"),
        },
        [metrics.PagesPerVisit]: {
            value: i18nFilter()("wa.ao.pagespervisit"),
            icon: "pages-per-visit",
            format: "number:2",
            score: 6,
            tooltip: i18nFilter()("wa.ao.graph.pages.tooltip"),
        },
        [metrics.AvgVisitDuration]: {
            value: i18nFilter()("wa.ao.graph.avgduration"),
            icon: "avg-visit-duration",
            format: "time",
            score: 5,
            tooltip: i18nFilter()("wa.ao.graph.avgduration.tooltip"),
        },
    };
    const betaBranchValidMetrics = {
        [metrics.DedupUniqueUsers]: {
            value: i18nFilter()("wa.ao.metric.dedup"),
            icon: "users",
            format: "minVisitsAbbr",
            score: 4,
            tooltip: i18nFilter()("wa.ao.metric.dedup.tooltip"),
            unlockHook: {
                modal: "DeduplicationVisits",
                slide: "DeduplicationVisits",
            },
        },
        [metrics.AvgMonthVisits]: {
            value:
                duration === "28d"
                    ? i18nFilter()("wa.ao.graph.dailyavgvisits")
                    : i18nFilter()("wa.ao.graph.monthlyavgvisits"),
            icon: "visits",
            format: "minVisitsAbbr",
            score: 1,
            tooltip: i18nFilter()("wa.ao.graph.avgvisits.tooltip"),
        },
        UniqueUsers: {
            value:
                duration === "28d"
                    ? i18nFilter()("wa.ao.graph.dailymuv")
                    : i18nFilter()("wa.ao.graph.monthlymuv"),
            icon: "monthly-unique-visitors",
            format: "minVisitsAbbr",
            score: 2,
            tooltip: i18nFilter()("wa.ao.graph.muv.tooltip"),
            unlockHook: {
                modal: "UniqueVisitors",
                slide: "UniqueVisitors",
            },
        },
        VisitsPerUser: {
            value: i18nFilter()("wa.ao.graph.vpu"),
            icon: "employees",
            format: "number:2",
            score: 3,
            tooltip: i18nFilter()("wa.ao.graph.vpu.tooltip"),
            unlockHook: {
                modal: "UniqueVisitors",
                slide: "UniqueVisitors",
            },
        },
    };
    return showBetaBranchData
        ? betaBranchValidMetrics
        : { ...betaBranchNonValidMetrics, ...betaBranchValidMetrics };
};

function engagementOverviewTableDataAdapter(
    data: IDataResponse[],
    insertConditionalMetrics: boolean,
    hideDedupMetric: boolean,
    canAccessDedupAudience: boolean,
    canAccessUniqueVisitors: boolean,
    duration: string,
    showBetaBranchData: boolean,
) {
    let transformedData: ITransformedData[] = [];
    const metricsProps: any = getMetricsProps(duration, showBetaBranchData);
    data.map((item: IDataResponse) => {
        for (const [key, value] of Object.entries(item)) {
            if (
                (key === metrics.DedupUniqueUsers && hideDedupMetric) ||
                (key === metrics.DedupUniqueUsers &&
                    duration === "28d" &&
                    !canAccessDedupAudience) ||
                metricsProps[key] === undefined
            ) {
                continue;
            }
            const transformedItem: ITransformedData = {};
            const itemIndex = transformedData.findIndex(
                (transformedItem: ITransformedData) =>
                    (transformedItem.metric as IMetricMetaData).value === metricsProps[key]?.value,
            );
            if (itemIndex === -1) {
                if (
                    constMetrics.includes(key as metrics) ||
                    (insertConditionalMetrics && conditionalMetrics.includes(key as metrics))
                ) {
                    transformedItem.metric = {
                        value: metricsProps[key].value,
                        icon: metricsProps[key].icon,
                        score: metricsProps[key].score,
                        tooltip: metricsProps[key].tooltip,
                        unlockHook: metricsProps[key].unlockHook,
                    };
                    if (key === metrics.DedupUniqueUsers) {
                        transformedItem.metric = {
                            ...transformedItem.metric,
                            isBeta: true,
                        };
                    }
                    transformedItem[item.Domain as string] = {
                        ...(value as IMetricDataResponse),
                        format: metricsProps[key].format,
                    };
                    transformedData.push(transformedItem);
                }
            } else {
                transformedData[itemIndex][item.Domain as string] = {
                    ...(value as IMetricDataResponse),
                    format: metricsProps[key].format,
                };
            }
        }
    });

    transformedData = transformedData.sort((a, b) => {
        return (a.metric as IMetricMetaData).score - (b.metric as IMetricMetaData).score;
    });

    if (!canAccessDedupAudience) {
        const index = transformedData.findIndex(
            (item: ITransformedData) =>
                (item.metric as IMetricMetaData).value === metricsProps.DedupUniqueUsers.value,
        );
        transformedData = transformedData.concat(transformedData.splice(index, 1));
    }

    if (!canAccessUniqueVisitors) {
        const indexUniqueUsers = transformedData.findIndex(
            (item: ITransformedData) =>
                (item.metric as IMetricMetaData).value === metricsProps.UniqueUsers.value,
        );
        const indexVisitsPerUser = transformedData.findIndex(
            (item: ITransformedData) =>
                (item.metric as IMetricMetaData).value === metricsProps.VisitsPerUser.value,
        );
        transformedData = transformedData.concat(
            transformedData.splice(indexVisitsPerUser, 1),
            transformedData.splice(indexUniqueUsers, 1),
        );
    }

    return transformedData;
}

function getTableColumns(
    keys: string[],
    canAccessDedupAudience: boolean,
    canAccessUniqueVisitors: boolean,
    noDataDedup: boolean,
    showGAApprovedData: boolean,
    keysDataVerification: IKeysDataVerification,
    isPrivateGaList: IGaPrivacy,
) {
    return keys.map((column, index) => {
        if (column === "metric") {
            return {
                field: "metric",
                displayName: "Metric",
                headerComponent: DefaultCellHeader,
                visible: true,
                format: "None",
                cellComponent: MetricIconCell,
            };
        } else {
            return {
                field: column,
                headerComponent: DomainCell,
                inverted: true,
                cellComponent: FullRowCell,
                noDataDedup,
                colIndex: index,
                lockedMetric: !canAccessDedupAudience && !canAccessUniqueVisitors,
                GAVerifiedIcon:
                    showGAApprovedData && keysDataVerification[column] ? (
                        <GAVerifiedContainer
                            size={"SMALL"}
                            isActive={true}
                            isPrivate={isPrivateGaList[column]}
                            tooltipAvailable={true}
                            metric={""}
                            tooltipIsActive={false}
                        />
                    ) : null,
            };
        }
    });
}

const Loader = Array.from(Array(6)).map((item, index) => (
    <RowLoadingContainer key={`RowLoadingContainer-${index}`}>
        <PixelPlaceholderLoader width={175} height={17} />
        <PixelPlaceholderLoader width={175} height={17} />
        <PixelPlaceholderLoader width={175} height={17} />
        <PixelPlaceholderLoader width={175} height={17} />
    </RowLoadingContainer>
));

export const EngagementOverviewTable: FunctionComponent<any> = (props: IProps) => {
    const sitesResource = Injector.get<any>("sitesResource");
    const {
        showAddToDashboard = true,
        showGAApprovedData: ShouldGetVerifiedData,
        showBetaBranchData = false,
    } = props;
    const { country, webSource, key, isWWW, duration } = props.routing.params;
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const timeGran = isWindow ? granularities[0] : granularities[2];
    const uniqueVisitorsStartDate = {
        Desktop: swSettings.components.UniqueVisitors.resources.FirstAvailableSnapshot,
        MobileWeb: swSettings.components.UniqueVisitorsMobileWeb.resources.FirstAvailableSnapshot,
        Total: swSettings.components.WebAnalysis.startDate,
    };
    const fromObject = dayjs.utc(
        DurationService.getDurationData(duration).forAPI.from,
        "YYYY|MM|DD",
    );
    const insertConditionalMetrics = !(
        fromObject.isBefore(dayjs.utc(uniqueVisitorsStartDate[webSource])) && duration === "28d"
    );
    const subtitleFilters = [
        {
            filter: "date",
            value: {
                from,
                to,
            },
        },
        {
            filter: "country",
            countryCode: country,
            value: CountryService.getCountryById(country).text,
        },
        {
            filter: "webSource",
            value: webSource || "Desktop",
        },
    ];
    const hideDedupMetric = webSource !== "Total" || ShouldGetVerifiedData;
    const noDataDedup = duration === "28d" && webSource === "Total";
    const canAccessDedupAudience = !swSettings.components.WebDedup.IsDisabled;
    const canAccessUniqueVisitors = !swSettings.components.UniqueVisitors.IsDisabled;

    const [data, setData] = useState<ITransformedData[]>();
    const [columns, setColumns] = useState<any>();

    const { addToDashboard } = useAddToDashboard();
    const getDashboardModel = useCallback(() => {
        const baseModel = Injector.get<any>("widgetModelAdapterService").fromWebsite(
            "EngagementOverview",
            "Table",
            webSource,
        );
        return baseModel;
    }, [webSource, timeGran]);

    const onAddToDash = useCallback(() => {
        addToDashboard(() => getDashboardModel());
    }, [addToDashboard, getDashboardModel]);

    function getGaPrivacy(key) {
        return new Promise<{}>((resolve) => {
            return sitesResource.getSiteInfo({ keys: key }, (res) => {
                resolve(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    Object.entries(res).reduce((retVal, [domain, { privacyStatus }]) => {
                        return { ...retVal, [domain]: privacyStatus === "Private" };
                    }, {}),
                );
            });
        });
    }

    useEffect(() => {
        async function fetchData() {
            setData(null);
            const response = await fetchService.get<{
                Data: IDataResponse[];
                KeysDataVerification: IKeysDataVerification;
            }>(
                country == 999 && duration === "1m"
                    ? "/widgetApi/WorldwideOverview/EngagementOverview/Table"
                    : "/widgetApi/WebsiteOverview/EngagementOverview/Table",
                addBetaBranchParam(
                    {
                        ShouldGetVerifiedData,
                        country,
                        from,
                        includeLeaders: true,
                        includeSubDomains: isWWW === "*",
                        isWindow,
                        keys: key.split(","),
                        timeGranularity: timeGran,
                        to,
                        webSource,
                    },
                    showBetaBranchData,
                    false,
                ),
            );
            const transformedData = engagementOverviewTableDataAdapter(
                response.Data,
                insertConditionalMetrics,
                hideDedupMetric,
                canAccessDedupAudience,
                canAccessUniqueVisitors,
                duration,
                showBetaBranchData,
            );

            const isPrivateGaList = await getGaPrivacy(key);

            if (transformedData.length > 0) {
                setColumns(
                    getTableColumns(
                        Object.keys(transformedData[0]),
                        canAccessDedupAudience,
                        canAccessUniqueVisitors,
                        noDataDedup,
                        ShouldGetVerifiedData,
                        response.KeysDataVerification,
                        isPrivateGaList,
                    ),
                );
            }
            setData(transformedData);
        }

        fetchData();
    }, [
        from,
        to,
        isWindow,
        timeGran,
        country,
        webSource,
        isWWW,
        key,
        ShouldGetVerifiedData,
        duration,
        showBetaBranchData,
    ]);

    function getComponent() {
        if (data && columns) {
            return (
                <StyledTable
                    colsCount={columns.length}
                    className="MiniFlexTable"
                    data={data}
                    columns={columns}
                />
            );
        } else if (data && data.length === 0) {
            return (
                <div style={{ padding: "50px" }}>
                    <NoData title={"apps.engagementoverview.nodata"} />
                </div>
            );
        } else {
            return <LoadingContainer>{Loader}</LoadingContainer>;
        }
    }
    return (
        <StyledBox>
            <StyledHeader>
                <div>
                    <StyledPrimaryTitle>
                        <BoxTitle tooltip={i18nFilter()("wa.ao.engagement.tooltip")}>
                            {i18nFilter()("wa.ao.engagement")}
                        </BoxTitle>
                    </StyledPrimaryTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                </div>
                {showAddToDashboard && !showBetaBranchData && (
                    <StyledAddToDashboardButton onClick={onAddToDash} />
                )}
                {showBetaBranchData && (
                    <div>
                        <BetaBranchLabel />
                    </div>
                )}
            </StyledHeader>
            {getComponent()}
        </StyledBox>
    );
};

const mapStateToProps = ({ routing, common: { showGAApprovedData } }) => {
    return {
        routing,
        showGAApprovedData,
    };
};

export default SWReactRootComponent(
    connect(mapStateToProps)(EngagementOverviewTable),
    "EngagementOverviewTable",
);

EngagementOverviewTable.defaultProps = {
    showAddToDashboard: true,
};
