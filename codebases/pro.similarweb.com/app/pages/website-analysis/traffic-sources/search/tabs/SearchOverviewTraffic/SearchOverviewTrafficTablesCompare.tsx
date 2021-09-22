import { Injector } from "common/ioc/Injector";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { DropdownReact } from "components/dropdown/dropdown-react";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import {
    MetricTitle,
    NoData,
    TableLoader,
    SeeMore,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { Text } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { SearchOverviewTopKeywordTableComponentCompare } from "./SearchOverviewTopKeywordTableComponentCompare";
import { SearchOverviewTableComponentCompare } from "./SearchOverviewTableComponentCompare";
import { selectedTabTypes } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewTraffic/SearchOverviewTrafficTables";
import {
    ButtonContainer,
    DropdownWrapper,
    MetricTitleWithDropdownWrapper,
    SeeMoreContainer,
    TableContainer,
    TitleContainerCompare,
    TitleWithDropdownWrapper,
    RightSideOfTitle,
} from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewTraffic/StyledComponent";
import { AddToDashboard } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/AddToDashboard";
import React, { useState } from "react";
import { DefaultFetchService } from "services/fetchService";
import {
    transformDataForEngines,
    transformDataForTypes,
} from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewTraffic/utils";

const TableRowsAmount = 5;
const fontSize = 16;
const searchTrafficByItems = [
    {
        id: "SearchTrafficByChannel",
        text: "Search Traffic By Type",
        headTemp: "leader-default-header-cell",
    },
    {
        id: "SearchTrafficByEngines",
        text: "Search Traffic By Engines",
        headTemp: "leader-domain-header-cell",
    },
];

export const SearchOverviewTopOrganicKeywordsCompare = (props) => {
    const TopOrganicKeywordsroutingParams = { ...props.routingParams, IncludeOrganic: "true" };
    const queryParams = { ...props.queryParams, IncludeOrganic: "true", pageSize: TableRowsAmount };
    const HeadLineKey = "Top organic keywords";
    const SeeAllKey = `search.overview.topKeyword.organic.see.all`;
    const KeywordTooltipKey = "analysis.source.search.overview.topKeyword.organic.compare.tooltip";
    const SitesEndPoint = "widgetApi/SearchKeywords/NewSearchKeywords/Table";
    const InnerLinkPage = "websites-trafficSearch-keywords";
    const selectedTab = selectedTabTypes.organic;
    const ComponentName = "TopOrganicKeywords";
    const isTopKeywordComponent = true;
    const Constants = {
        SitesEndPoint,
        HeadLineKey,
        KeywordTooltipKey,
        SeeAllKey,
        InnerLinkPage,
        ComponentName,
        selectedTab,
        isTopKeywordComponent,
    };
    return (
        <SearchOverviewTrafficTablesCompare
            routingParams={TopOrganicKeywordsroutingParams}
            {...Constants}
            queryParams={queryParams}
        />
    );
};

export const SearchOverviewTopPaidKeywordsCompare = (props) => {
    const TopPaidKeywordsRoutingParams = { ...props.routingParams, limits: "competitive" };
    const queryParams = {
        ...props.queryParams,
        limits: "0.2-0.6;0.2-0.6",
        pageSize: TableRowsAmount,
    };
    const HeadLineKey = "search.overview.topKeyword.paid.head.line.key";
    const SeeAllKey = `search.overview.topKeyword.paid.see.all`;
    const KeywordTooltipKey =
        "analysis.source.search.overview.topKeyword.competitive.compare.tooltip";
    const SitesEndPoint = "widgetApi/SearchKeywords/NewSearchKeywords/Table";
    const InnerLinkPage = "websites-trafficSearch-keywords";
    const selectedTab = selectedTabTypes.paid;
    const ComponentName = "TopPaidKeywords";
    const isTopKeywordComponent = true;
    const Constants = {
        SitesEndPoint,
        HeadLineKey,
        KeywordTooltipKey,
        InnerLinkPage,
        ComponentName,
        SeeAllKey,
        selectedTab,
        isTopKeywordComponent,
    };
    return (
        <SearchOverviewTrafficTablesCompare
            routingParams={TopPaidKeywordsRoutingParams}
            {...Constants}
            queryParams={queryParams}
        />
    );
};

export const TrafficByCompare = (props) => {
    const HeadLineKey = "analysis.source.search.overview.compare.kwoverlap";
    const KeywordTooltipKey = "analysis.source.search.overview.kwoverlap.tooltip";
    const SitesEndPoint = `/widgetApi/TrafficSourcesSearch/${props.defaultApiCall}/Table`;
    const searchBy = props.defaultApiCall;
    const InnerLinkPage = "websites-trafficSearch";
    const selectedTab = "paid";
    const ComponentName = "TopPaidKeywords";
    const searchOverviewTrafficListParser = (searchOverviewTrafficList) => {
        // temporary solution please remove this scope as part of SIM-33850,
        // the meta-data should be placed in the response header!
        // Additionally, the data should be returned in such a way that the
        // transforms used here (transformDataFor...) should not be necessary.
        const searchEngineDefaultValue = { Value: Number(), Name: String() };
        const searchOverviewTrafficItemParserForEngines = ({
            Domain,
            Favicon,
            google = searchEngineDefaultValue,
            yandex = searchEngineDefaultValue,
            yahoo = searchEngineDefaultValue,
            bing = searchEngineDefaultValue,
            duckduckgo = searchEngineDefaultValue,
            syndicated = searchEngineDefaultValue,
            baidu = searchEngineDefaultValue,
            Others,
        }) => {
            return {
                Domain,
                Favicon,
                google: google.Name ? google : { ...google, Name: "Google" },
                yandex: yandex.Name ? yandex : { ...yandex, Name: "yandex" },
                yahoo: yahoo.Name ? yahoo : { ...yahoo, Name: "yahoo" },
                bing: bing.Name ? bing : { ...bing, Name: "bing" },
                duckduckgo: duckduckgo.Name ? duckduckgo : { ...duckduckgo, Name: "duckduckgo" },
                syndicated: {
                    ...syndicated,
                    Favicon: null,
                    Name: syndicated.Name || "syndicated",
                },
                baidu: baidu.Name ? baidu : { ...baidu, Name: "baidu" },
                Others: { ...Others, Name: "Other engines", Favicon: null },
            };
        };
        let parsedData;
        if (searchOverviewTrafficList[0].google) {
            const parsed = searchOverviewTrafficList.map(searchOverviewTrafficItemParserForEngines);
            parsedData = transformDataForEngines(parsed);
        } else {
            parsedData = transformDataForTypes(searchOverviewTrafficList);
        }
        return parsedData;
    };

    const Constants = {
        SitesEndPoint,
        HeadLineKey,
        KeywordTooltipKey,
        InnerLinkPage,
        ComponentName,
        selectedTab,
        searchBy,
    };
    return (
        <SearchOverviewTrafficTablesCompare
            {...Constants}
            {...props}
            searchOverviewTrafficListParser={searchOverviewTrafficListParser}
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
        isTopKeywordComponent,
        searchBy: searchByProp,
        defaultApiCall,
        searchOverviewTrafficListParser,
    } = props;
    const [searchOverviewTrafficData, setSearchOverviewTrafficData] = useState({
        searchOverviewTrafficList: {},
        searchName: "",
        TotalCount: 0,
    });
    const [selectedSearchBy, setSelectedSearchBy] = useState(
        isTopKeywordComponent
            ? ""
            : searchTrafficByItems.find((item) => item.id === defaultApiCall).id,
    );
    const { searchOverviewTrafficList } = searchOverviewTrafficData;
    const [isLoading, setIsLoading] = useState(true);

    const setData = async ({
        endPoint = SitesEndPoint,
        nameSearchBy = searchByProp,
        searchOverviewTrafficListParser,
    }) => {
        const searchBy = nameSearchBy;
        const apiParams = { ...queryParams };
        const fetchService = DefaultFetchService.getInstance();
        const SitesDataPromise = fetchService.get(endPoint, apiParams);
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
            searchOverviewTrafficList: searchOverviewTrafficListParser
                ? searchOverviewTrafficListParser(searchOverviewTrafficList)
                : searchOverviewTrafficList,
            searchName: searchBy,
            TotalCount: SitesData.TotalCount,
        });
        setIsLoading(false);
    };

    React.useEffect(() => {
        setData({ searchOverviewTrafficListParser });
    }, [queryParams]);
    const i18n = i18nFilter();
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams });
    const decodedLink = decodeURIComponent(innerLink);
    const headline = i18n(HeadLineKey);
    const totalCount = numberFilter()(searchOverviewTrafficData.TotalCount);
    const metricData = {
        endPoint: SitesEndPoint,
        chartType: "TableDynamicColumnsLeader",
        addToDashboardName: selectedSearchBy,
        webSource: "Desktop",
        filter: "",
    };

    const onDropdownChange = (item) => {
        setSelectedSearchBy(item.id);
        setData({
            endPoint: `/widgetApi/TrafficSourcesSearch/${item.id}/Table`,
            nameSearchBy: item.id,
            searchOverviewTrafficListParser,
        });
    };
    const MetricTitleWithDropdown = ({ tooltip, headline }) => {
        return (
            <MetricTitleWithDropdownWrapper>
                <RightSideOfTitle>
                    <TitleWithDropdownWrapper>
                        <Text fontSize={20} fontWeight={500}>
                            {headline}
                        </Text>
                    </TitleWithDropdownWrapper>
                    <DropdownWrapper>
                        <DropdownReact
                            selected={selectedSearchBy}
                            onChange={onDropdownChange}
                            items={searchTrafficByItems}
                        />
                    </DropdownWrapper>
                    <PlainTooltip placement="top" tooltipContent={tooltip}>
                        <span>
                            <InfoIcon iconName="info" />
                        </span>
                    </PlainTooltip>
                </RightSideOfTitle>
                <AddToDashboard metric={metricData} webSource={"Desktop"} filters={""} />
            </MetricTitleWithDropdownWrapper>
        );
    };
    return (
        <>
            <TitleContainerCompare>
                {isTopKeywordComponent ? (
                    <MetricTitle
                        headline={headline}
                        tooltip={i18n(KeywordTooltipKey)}
                        fontSize={fontSize}
                    />
                ) : (
                    <MetricTitleWithDropdown
                        headline={headline}
                        tooltip={i18n(KeywordTooltipKey)}
                    />
                )}
            </TitleContainerCompare>
            {isLoading ? (
                <TableLoader />
            ) : !searchOverviewTrafficList ||
              Object.values(searchOverviewTrafficList).length === 0 ? (
                <NoData
                    paddingTop={"50px"}
                    paddingBottom={"50px"}
                    noDataTitleKey={"search.overview.no.data.title"}
                    noDataSubTitleKey={"search.overview.no.data.sub.title"}
                />
            ) : (
                <>
                    <TableContainer withPaddedRows={isTopKeywordComponent}>
                        {isTopKeywordComponent ? (
                            <SearchOverviewTopKeywordTableComponentCompare
                                searchOverviewTrafficData={searchOverviewTrafficData}
                                routingParams={routingParams}
                                keys={queryParams.keys}
                            />
                        ) : (
                            <SearchOverviewTableComponentCompare
                                searchOverviewTrafficData={searchOverviewTrafficData}
                                routingParams={routingParams}
                            />
                        )}
                    </TableContainer>
                    {SeeAllKey && (
                        <ButtonContainer>
                            <SeeMoreContainer>
                                <SeeMore
                                    componentName={ComponentName}
                                    innerLink={decodedLink}
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
        </>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.queryParams?.key === nextProps.queryParams?.key;
const SearchOverviewTrafficTablesCompare = React.memo(
    SearchOverviewTrafficTablesInner,
    propsAreEqual,
);
