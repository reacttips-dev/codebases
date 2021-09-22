import BoxTitle from "components/BoxTitle/src/BoxTitle";
import ColorStack from "components/colorsStack/ColorStack";
import { BulletLegends } from "components/React/Legends/BulletLegends";
import { MiniFlexTable } from "components/React/Table/FlexTable/Mini/MiniFlexTable";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import { WidgetSubtitle } from "components/React/Widgets/WidgetsSubtitle";
import { TitleContainer } from "components/React/Widgets/WidgetsTop";
import { CHART_COLORS } from "constants/ChartColors";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { WidgetFooter } from "components/widget/WidgetFooter";
import {
    NoData,
    TableLoader,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import React, { useState } from "react";
import { DefaultFetchService } from "services/fetchService";
import styled from "styled-components";

const TopKeywordsContainer = styled.div`
    padding: 24px 24px 0 24px;
`;

const LegendsWrapper = styled.div`
    margin: 16px 0;
`;

const TopKeywordsTable = styled.div`
    padding-top: 8px;
`;

const EndPoint = "widgetApi/SearchKeywords/NewSearchKeywords/Table";
const MonthlyTimeGranularity = "Monthly";
const TableRowsAmount = 5;
const buttonText = "WWO.SearchTraffic.Organic.topKeywords.cta.button";

const TableCompareColumns = [
    {
        field: "SearchTerm",
        displayName: "Search Term",
        cellTemplate: "/app/components/table/templates/cell-keyword-dashboard.html",
        headerCellTemplate: "/app/components/table/templates/default-cell-header.html",
        disableHeaderCellHover: false,
        sortable: false,
        sortDirection: "desc",
        isSorted: false,
        width: 220,
        groupable: false,
        tooltip: false,
        progressBarTooltip: "",
        showTotalCount: false,
        format: "None",
        visible: true,
        toggleable: true,
    },
    {
        field: "TotalShare",
        displayName: "Traffic Share",
        cellTemplate: "/app/components/table/templates/default-cell.html",
        headerCellTemplate: "/app/components/table/templates/default-cell-header.html",
        disableHeaderCellHover: false,
        sortable: false,
        sortDirection: "desc",
        isSorted: false,
        width: "115px",
        groupable: false,
        tooltip: false,
        progressBarTooltip: "",
        showTotalCount: false,
        format: "smallNumbersPercentage:2",
        visible: true,
        toggleable: true,
    },
    {
        field: "SiteOrigins",
        displayName: "Group Share Split",
        cellTemplate: "/app/components/table/templates/group-traffic-share-dashboard.html",
        headerCellTemplate: "/app/components/table/templates/default-cell-header.html",
        disableHeaderCellHover: false,
        sortable: false,
        sortDirection: "desc",
        isSorted: false,
        minWidth: 250,
        groupable: false,
        tooltip: false,
        progressBarTooltip: "",
        showTotalCount: false,
        format: "percentagesign",
        visible: true,
        toggleable: true,
    },
    {
        field: "KwVolume",
        displayName: "Volume",
        cellTemplate: "/app/components/table/templates/default-cell.html",
        headerCellTemplate: "/app/components/table/templates/default-cell-header.html",
        disableHeaderCellHover: false,
        sortable: false,
        sortDirection: "desc",
        isSorted: false,
        width: 85,
        groupable: false,
        tooltip: false,
        progressBarTooltip: "",
        showTotalCount: false,
        format: "swPosition",
        visible: true,
        toggleable: true,
    },
    {
        field: "CPC",
        displayName: "CPC",
        cellTemplate: "/app/components/table/templates/default-cell.html",
        headerCellTemplate: "/app/components/table/templates/default-cell-header.html",
        disableHeaderCellHover: false,
        sortable: false,
        sortDirection: "desc",
        isSorted: false,
        width: 85,
        groupable: false,
        tooltip: false,
        progressBarTooltip: "",
        showTotalCount: false,
        format: "CPC",
        visible: true,
        toggleable: true,
    },
];

const TableColumns = [
    {
        field: "SearchTerm",
        displayName: "Search Term",
        cellTemplate: "/app/components/table/templates/wwo-keyword-cell.html",
        headerCellTemplate: "/app/components/table/templates/default-cell-header.html",
        disableHeaderCellHover: false,
        sortable: true,
        sortDirection: "desc",
        isSorted: false,
        minWidth: 130,
        maxWidth: 220,
        groupable: false,
        tooltip: false,
        progressBarTooltip: "",
        showTotalCount: false,
        format: "None",
        visible: true,
        toggleable: true,
    },
    {
        field: "TotalShare",
        displayName: "Traffic Share",
        cellTemplate: "/app/components/table/templates/traffic-share.html",
        headerCellTemplate: "/app/components/table/templates/default-cell-header.html",
        disableHeaderCellHover: false,
        sortable: false,
        sortDirection: "desc",
        isSorted: false,
        minWidth: 130,
        groupable: false,
        tooltip: false,
        progressBarTooltip: "",
        showTotalCount: false,
        format: "percentagesign",
        visible: true,
        toggleable: true,
    },
    {
        field: "Change",
        displayName: "Change",
        cellTemplate: "/app/components/table/templates/change-percentage.html",
        headerCellTemplate: "/app/components/table/templates/default-cell-header.html",
        headerComponent: DefaultCellHeader,
        disableHeaderCellHover: false,
        sortable: false,
        sortDirection: "desc",
        isSorted: false,
        width: 85,
        groupable: false,
        tooltip: "widget.table.tooltip.newsearchkeywordswebsiteoverview.change",
        progressBarTooltip: "",
        showTotalCount: false,
        format: "percentagesign",
        visible: true,
        toggleable: true,
    },
];

const CompareOptions = {
    downloadUrl: false,
    showLoadMore: false,
    filterField: false,
    tableType: "swTable--simple",
    loadingSize: 5,
    dataErrorMessageTop: "appstorekeywords.topkeywords.nodata",
    dataErrorMessageBottom: "",
    hideHeader: false,
    colorSource: "main",
    hideBorders: false,
    hideRowsBorders: true,
    trackName: "Marketing Mix/Top Search Terms",
    stickyHeader: false,
    scrollableTable: false,
    showCompanySidebar: false,
    sortedColumnAddedWidth: false,
    onSort: false,
    enableRowSelection: false,
    numberOfFixedColumns: 1,
    tableSelectionTrackingParam: "",
    metric: "NewSearchKeywordsWebsiteOverview",
};

const Options = {
    showTitle: true,
    showTitleTooltip: false,
    titleType: "text",
    showSubtitle: true,
    desktopOnly: true,
    showLegend: false,
    titlePaddingBottom: "19px",
    showSettings: false,
    showTopLine: false,
    showFrame: true,
    hideHeader: true,
    hideBorders: true,
    ctaButton: "wwo.search.terms.button",
    tableType: "swTable--simple",
};

export const OrganicTopKeywords = (props) => {
    const { noDataState, setNoDataState, queryParams, routingParams } = props;
    const OrganicQueryParams = {
        ...props.queryParams,
        IncludeOrganic: true.toString(),
        pageSize: TableRowsAmount,
    };
    const IncludeOrganic = true;
    const IncludePaid = false;
    const Title = "WWO.SearchTraffic.Organic.topKeywords.Title";
    const ToolTipKey = "WWO.SearchTraffic.Organic.topKeywords.Title.Tooltip";
    const DataState = "topKeywordsOrganic";
    const trackingLabel = "wwo search traffic/top keywords/organic";
    const Constants = {
        IncludeOrganic,
        IncludePaid,
        Title,
        ToolTipKey,
        DataState,
        queryParams,
        trackingLabel,
    };
    return (
        <TopKeywords
            {...Constants}
            noDataState={noDataState}
            setNoDataState={setNoDataState}
            routingParams={routingParams}
            queryParams={OrganicQueryParams}
        />
    );
};

export const PaidTopKeywords = (props) => {
    const { noDataState, setNoDataState, queryParams, routingParams } = props;
    const PaidQueryParams = {
        ...queryParams,
        IncludePaid: true.toString(),
        pageSize: TableRowsAmount,
    };
    const IncludeOrganic = false;
    const IncludePaid = true;
    const Title = "WWO.SearchTraffic.Paid.topKeywords.Title";
    const ToolTipKey = "WWO.SearchTraffic.Paid.topKeywords.Title.Tooltip";
    const DataState = "topKeywordsPaid";
    const trackingLabel = "wwo search traffic/top keywords/paid";
    const Constants = {
        IncludeOrganic,
        IncludePaid,
        Title,
        ToolTipKey,
        DataState,
        queryParams,
        trackingLabel,
    };
    return (
        <TopKeywords
            {...Constants}
            noDataState={noDataState}
            setNoDataState={setNoDataState}
            routingParams={routingParams}
            queryParams={PaidQueryParams}
        />
    );
};

export const OrganicTopKeywordsCompare = (props) => {
    const { noDataState, setNoDataState, queryParams, routingParams } = props;
    const isCompare = true;
    const chartMainColors = new ColorStack(CHART_COLORS.chartMainColors);
    const OrganicQueryParams = {
        ...props.queryParams,
        IncludeOrganic: true.toString(),
        pageSize: TableRowsAmount,
    };
    const IncludeOrganic = true;
    const IncludePaid = false;
    const Title = "wwo.searchTraffic.organic.topKeywords.compare.title";
    const ToolTipKey = "wwo.searchTraffic.organic.topKeywords.compare.title.tooltip";
    const DataState = "topKeywordsOrganic";
    const trackingLabel = "wwo search traffic/top keywords compare/ organic";
    chartMainColors.reset();
    const items = queryParams.keys.split(",").map((item) => {
        return {
            name: item,
            color: chartMainColors.acquire(),
        };
    });
    const Constants = {
        IncludeOrganic,
        IncludePaid,
        Title,
        ToolTipKey,
        DataState,
        queryParams,
        trackingLabel,
        items,
        isCompare,
    };
    return (
        <TopKeywords
            {...Constants}
            noDataState={noDataState}
            setNoDataState={setNoDataState}
            routingParams={routingParams}
            queryParams={OrganicQueryParams}
        />
    );
};

export const PaidTopKeywordsCompare = (props) => {
    const { noDataState, setNoDataState, queryParams, routingParams } = props;
    const chartMainColors = new ColorStack(CHART_COLORS.chartMainColors);
    const isCompare = true;
    const PaidQueryParams = {
        ...queryParams,
        IncludePaid: true.toString(),
        pageSize: TableRowsAmount,
    };
    const IncludeOrganic = false;
    const IncludePaid = true;
    const Title = "wwo.searchTraffic.paid.topKeywords.compare.title";
    const ToolTipKey = "wwo.searchTraffic.paid.topKeywords.compare.title.tooltip";
    const trackingLabel = "wwo search traffic/top keywords compare/ paid";
    const DataState = "topKeywordsPaid";
    chartMainColors.reset();
    const items = queryParams.keys.split(",").map((item) => {
        return {
            name: item,
            color: chartMainColors.acquire(),
        };
    });
    const Constants = {
        IncludeOrganic,
        IncludePaid,
        Title,
        ToolTipKey,
        DataState,
        queryParams,
        trackingLabel,
        items,
        isCompare,
    };
    return (
        <TopKeywords
            {...Constants}
            noDataState={noDataState}
            setNoDataState={setNoDataState}
            routingParams={routingParams}
            queryParams={PaidQueryParams}
        />
    );
};

const TopKeywordsInner = (props) => {
    const {
        queryParams,
        noDataState,
        setNoDataState,
        routingParams,
        IncludeOrganic,
        IncludePaid,
        Title,
        ToolTipKey,
        DataState,
        trackingLabel,
        items,
        isCompare,
    } = props;
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const setData = () => {
        const fetchService = DefaultFetchService.getInstance();
        const getParams = { ...queryParams, timeGranularity: MonthlyTimeGranularity };
        const visitsDataPromise = fetchService.get(EndPoint, getParams);
        visitsDataPromise.then((Data) => parseResult(Data)).finally(() => setIsLoading(false));
    };
    React.useEffect(setData, [queryParams]);

    const parseResult = (result) => {
        const data = { ...result, Records: result.Data };
        delete data.Data;

        if (isCompare) {
            data.Records = data.Records.map((item) => {
                return {
                    ...item,
                    url: Injector.get<SwNavigator>("swNavigator").href("keywordAnalysis-overview", {
                        ...routingParams,
                        keyword: item.keyword,
                    }),
                };
            });
        }
        setResponse(data);
    };

    const isNoDataState =
        !response || Object.values(response).length === 0 || !response.Records.length;
    const href = Injector.get<SwNavigator>("swNavigator").href("websites-trafficSearch-keywords", {
        ...routingParams,
        IncludeOrganic,
        IncludePaid,
    });

    React.useEffect(() => {
        if (isNoDataState !== noDataState[DataState]) {
            setNoDataState({
                ...noDataState,
                topKeywords: isNoDataState,
            });
        }
    }, [isLoading]);
    return (
        <div>
            <TopKeywordsContainer>
                <TitleContainer>
                    <BoxTitle tooltip={i18nFilter()(ToolTipKey)}>{i18nFilter()(Title)}</BoxTitle>
                </TitleContainer>
                {isLoading ? (
                    <TableLoader />
                ) : isNoDataState ? (
                    <NoData paddingTop={"66px"} />
                ) : (
                    <div>
                        <WidgetSubtitle webSource={"Desktop"} />
                        {items && (
                            <LegendsWrapper>
                                <BulletLegends legendItems={items} />
                            </LegendsWrapper>
                        )}
                        <TopKeywordsTable>
                            <MiniFlexTable
                                tableData={response}
                                tableColumns={isCompare ? TableCompareColumns : TableColumns}
                                tableOptions={isCompare ? CompareOptions : Options}
                            />
                        </TopKeywordsTable>
                        <WidgetFooter href={href} trackingLabel={trackingLabel} text={buttonText} />
                    </div>
                )}
            </TopKeywordsContainer>
        </div>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.queryParams?.keys === nextProps.queryParams?.keys;
const TopKeywords = React.memo(TopKeywordsInner, propsAreEqual);
