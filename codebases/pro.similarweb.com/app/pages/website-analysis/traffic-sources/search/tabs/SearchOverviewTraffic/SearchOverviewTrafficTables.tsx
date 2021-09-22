import styled from "styled-components";
import { Injector } from "common/ioc/Injector";
import {
    MetricTitle,
    NoData,
    TableLoader,
    SeeMore,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import { AddToDashboard } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/AddToDashboard";
import React, { useState } from "react";
import { DefaultFetchService } from "services/fetchService";
import {
    SearchOverviewTrafficTableComponent,
    SearchOverviewTrafficTableForSearchEnginesComponent,
} from "./SearchOverviewTrafficTableComponent";
import {
    TableContainer,
    TitleContainer,
    ButtonContainer,
    SeeMoreContainer,
    AddToDashboardWrapper,
} from "../SearchOverviewTraffic/StyledComponent";
import {
    SearchOverviewTopKeywordTableComponentSingle,
    SearchOverviewOrganicCompetitors,
} from "./SearchOverviewTopKeywordTableComponentSingle";

const TableRowsAmount = 5;

const CardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export enum selectedTabTypes {
    organic = "organic",
    paid = "paid",
}

export const TrafficBySearchEngine = (props) => {
    const HeadLineKey = "analysis.source.search.overview.byengines";
    const KeywordTooltipKey = "analysis.source.search.overview.byengines.tooltip";
    const SitesEndPoint = "widgetApi/TrafficSourcesSearch/SearchTrafficByEngines/Table";
    const metricData = {
        endPoint: SitesEndPoint,
        chartType: "Table",
        addToDashboardName: "SearchTrafficByEngines",
        webSource: "Desktop",
        filter: "",
    };
    const Constants = { SitesEndPoint, HeadLineKey, KeywordTooltipKey, metricData };
    const renderTable = (props) => (
        <SearchOverviewTrafficTableForSearchEnginesComponent {...props} />
    );
    return <SearchOverviewTrafficTables {...props} {...Constants} renderTable={renderTable} />;
};

export const TrafficBySearchType = (props) => {
    const HeadLineKey = "analysis.source.search.overview.bychannels";
    const KeywordTooltipKey = "analysis.source.search.overview.bychannels.tooltip";
    const SitesEndPoint = "widgetApi/TrafficSourcesSearch/SearchTrafficByChannel/Table";
    const metricData = {
        endPoint: SitesEndPoint,
        chartType: "Table",
        addToDashboardName: "SearchTrafficByChannel",
        webSource: "Desktop",
        filter: "",
    };
    const Constants = { SitesEndPoint, HeadLineKey, KeywordTooltipKey, metricData };
    return <SearchOverviewTrafficTables {...props} {...Constants} />;
};

export const OrganicCompetitors = (props) => {
    const { from, to } = DurationService.getDurationData("3m").forAPI;
    const queryParams = { ...props.queryParams, from, to };
    const routingParams = { ...props.routingParams, duration: "3m" };
    const addToDashboardParams = { duration: "3m" };
    const HeadLineKey = "search.overview.top.organic.competitors";
    const SeeAllKey = "analysis.source.search.overview.kwoverlap.seeMore";
    const SitesEndPoint = "widgetApi/SearchCompetitors/SearchCompetitorsOrganic/Table";
    const InnerLinkPage = "websites-competitorsOrganicKeywords";
    const ComponentName = "CompetitiveOverlap";
    const noDataMessage = "search.overview.organic.competitors.no.data.sub.title";
    const metricData = {
        endPoint: SitesEndPoint,
        chartType: "Table",
        addToDashboardName: "SearchCompetitorsOrganic",
        webSource: "Desktop",
        filter: "",
    };
    const Constants = {
        SitesEndPoint,
        HeadLineKey,
        InnerLinkPage,
        ComponentName,
        SeeAllKey,
        metricData,
        noDataMessage,
        addToDashboardParams,
    };
    const renderTable = (props) => <SearchOverviewOrganicCompetitors {...props} />;
    return (
        <SearchOverviewTrafficTables
            queryParams={queryParams}
            routingParams={routingParams}
            {...Constants}
            renderTable={renderTable}
        />
    );
};

export const SearchOverviewTopOrganicKeywords = (props) => {
    const routingParams = {
        ...props.routingParams,
        selectedTab: "keywords",
        IncludeOrganic: true.toString(),
    };
    const queryParams = {
        ...props.queryParams,
        IncludeOrganic: true.toString(),
        pageSize: TableRowsAmount,
    };
    const HeadLineKey = "search.overview.topKeyword.organic.title";
    const SeeAllKey = `search.overview.topKeyword.organic.see.all`;
    const KeywordTooltipKey = "analysis.source.search.overview.topKeyword.organic.single.tooltip";
    const SitesEndPoint = "widgetApi/SearchKeywords/NewSearchKeywords/Table";
    const InnerLinkPage = "websites-trafficSearch-keywords";
    const selectedTab = selectedTabTypes.organic;
    const ComponentName = "TopOrganicKeywords";
    const Constants = {
        SitesEndPoint,
        HeadLineKey,
        KeywordTooltipKey,
        SeeAllKey,
        InnerLinkPage,
        ComponentName,
        selectedTab,
    };
    const renderTable = (props) => <SearchOverviewTopKeywordTableComponentSingle {...props} />;
    return (
        <SearchOverviewTrafficTables
            routingParams={routingParams}
            {...Constants}
            queryParams={queryParams}
            renderTable={renderTable}
        />
    );
};

export const SearchOverviewTopPaidKeywords = (props) => {
    const routingParams = {
        ...props.routingParams,
        selectedTab: "keywords",
        IncludePaid: true.toString(),
    };
    const queryParams = {
        ...props.queryParams,
        IncludePaid: true.toString(),
        pageSize: TableRowsAmount,
    };
    const HeadLineKey = "search.overview.topKeyword.paid.title";
    const SeeAllKey = `search.overview.topKeyword.paid.see.all`;
    const KeywordTooltipKey = "analysis.source.search.overview.topKeyword.paid.single.tooltip";
    const SitesEndPoint = "widgetApi/SearchKeywords/NewSearchKeywords/Table";
    const InnerLinkPage = "websites-trafficSearch-keywords";
    const selectedTab = selectedTabTypes.paid;
    const ComponentName = "TopPaidKeywords";
    const Constants = {
        SitesEndPoint,
        HeadLineKey,
        KeywordTooltipKey,
        InnerLinkPage,
        ComponentName,
        SeeAllKey,
        selectedTab,
    };
    const renderTable = (props) => <SearchOverviewTopKeywordTableComponentSingle {...props} />;
    return (
        <SearchOverviewTrafficTables
            routingParams={routingParams}
            {...Constants}
            queryParams={queryParams}
            renderTable={renderTable}
        />
    );
};

const SearchOverviewTrafficTablesInner = (props) => {
    const {
        queryParams,
        routingParams,
        SitesEndPoint,
        HeadLineKey,
        KeywordTooltipKey,
        SeeAllKey,
        InnerLinkPage,
        ComponentName,
        metricData,
        renderTable,
        noDataMessage = "search.overview.no.data.sub.title",
        addToDashboardParams,
    } = props;
    const [searchOverviewTrafficData, setSearchOverviewTrafficData] = useState({
        searchOverviewTrafficList: {},
        TotalCount: 0,
    });
    const { searchOverviewTrafficList } = searchOverviewTrafficData;
    const [isLoading, setIsLoading] = useState(true);

    const setData = async () => {
        const apiParams = { ...queryParams };
        const fetchService = DefaultFetchService.getInstance();
        const SitesDataPromise = fetchService.get(SitesEndPoint, apiParams);
        let SitesData;
        try {
            SitesData = await SitesDataPromise;
        } catch {
            setIsLoading(false);
        }
        const searchOverviewTrafficList = SitesData
            ? SitesData["Data"]?.slice(0, TableRowsAmount)
            : [];
        if (searchOverviewTrafficList.length === 0) {
            setIsLoading(false);
            return;
        }
        setSearchOverviewTrafficData({
            searchOverviewTrafficList: searchOverviewTrafficList.map((site) => {
                return { ...site };
            }),
            TotalCount: SitesData.TotalCount,
        });
        setIsLoading(false);
    };
    React.useEffect(() => {
        setData();
    }, [queryParams]);
    const i18n = i18nFilter();
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams });
    const headline = i18n(HeadLineKey);
    const totalCount = numberFilter()(searchOverviewTrafficData.TotalCount);
    return (
        <CardWrapper>
            <TitleContainer>
                <MetricTitle headline={headline} tooltip={i18n(KeywordTooltipKey)} fontSize={16} />
                {metricData && (
                    <AddToDashboardWrapper>
                        <AddToDashboard
                            metric={metricData}
                            webSource={"Desktop"}
                            filters={""}
                            overrideParams={addToDashboardParams}
                        />
                    </AddToDashboardWrapper>
                )}
            </TitleContainer>
            {isLoading ? (
                <TableLoader />
            ) : !searchOverviewTrafficList ||
              Object.values(searchOverviewTrafficList).length === 0 ? (
                <NoData
                    paddingTop={"50px"}
                    noDataTitleKey={"search.overview.no.data.title"}
                    noDataSubTitleKey={noDataMessage}
                />
            ) : (
                <>
                    <TableContainer>
                        {renderTable ? (
                            renderTable({ searchOverviewTrafficData, routingParams })
                        ) : (
                            <SearchOverviewTrafficTableComponent
                                searchOverviewTrafficData={searchOverviewTrafficData}
                                routingParams={routingParams}
                            />
                        )}
                    </TableContainer>
                    {InnerLinkPage && (
                        <ButtonContainer>
                            <SeeMoreContainer>
                                <SeeMore
                                    componentName={ComponentName}
                                    innerLink={innerLink}
                                    guidName={"search.overview.page.kwoverlap.see.more"}
                                    textAlign={"end"}
                                >
                                    {i18n(SeeAllKey, { totalCount })}
                                </SeeMore>
                            </SeeMoreContainer>
                        </ButtonContainer>
                    )}
                </>
            )}
        </CardWrapper>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.queryParams?.key === nextProps.queryParams?.key;
const SearchOverviewTrafficTables = React.memo(SearchOverviewTrafficTablesInner, propsAreEqual);
