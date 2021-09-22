import { Injector } from "common/ioc/Injector";
import {
    MetricTitle,
    NoData,
    SeeMore,
    TableLoader,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { getSeeMoreCount } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityFunctions";
import {
    CategoriesDomainContainer,
    CategoriesText,
    CategoriesShareContainer,
    CategoriesTableContainer,
    CoreCpcCellContainer,
    CoreKeywordCellContainer,
    CoreShareCellContainer,
    Text,
    TopCategoriesRightRow,
    TopCategoriesTableRowContainer,
    TrendingKeywordsContainer,
} from "../../pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import { minVisitsFilter } from "filters/ngFilters";
import React from "react";
import MediaQuery from "react-responsive";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

const ColumnHeaderSize = 12;
const filtersParams = {
    IncludeTrendingKeywords: true,
    includeBranded: false,
    includeNoneBranded: true,
};

export const KeywordAnalysisPageTopCategoriesTrending = (props) => {
    const { data, routingParams } = props;
    const i18n = i18nFilter();
    const InnerLinkPage = "findkeywords_byindustry_TopKeywords";
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, {
        ...routingParams,
        category: data?.Category,
        ...filtersParams,
    });
    const seeMoreCount = getSeeMoreCount(data?.CategoryTrendingKeywords?.TotalCount);
    return (
        <>
            <MetricTitle
                headline={i18n("keyword.analysis.overview.topCategories.right.title")}
                fontSize={16}
            />
            {props.isLoading ? (
                <TableLoader />
            ) : !data || Object.values(data).length === 0 ? (
                <NoData paddingTop={"50px"} paddingBottom={"72px"} />
            ) : (
                <TrendingKeywordsContainer>
                    <CategoriesTable categoriesData={data} routingParams={routingParams} />
                    <MediaQuery query="(min-width: 1323px)">
                        <SeeMore innerLink={innerLink} componentName={"TopCategoriesKeywords"}>
                            {i18n("keyword.analysis.overview.topCategories.right.seeMore", {
                                totalKeywords: seeMoreCount,
                            })}
                        </SeeMore>
                    </MediaQuery>
                    <MediaQuery query="(max-width: 1322px)">
                        <SeeMore innerLink={innerLink} componentName={"TopCategoriesKeywords"}>
                            {i18n("keyword.analysis.overview.topCategories.right.seeMore", {
                                totalKeywords: "",
                            })}
                        </SeeMore>
                    </MediaQuery>
                </TrendingKeywordsContainer>
            )}
        </>
    );
};

const CategoriesTable = (props) => {
    const i18n = i18nFilter();
    const { categoriesData, routingParams } = props;
    return (
        <>
            <CategoriesTableContainer>
                <TopCategoriesRightRow>
                    <CategoriesDomainContainer>
                        <Text fontSize={ColumnHeaderSize}>
                            {i18n("keyword.analysis.overview.topCategories.right.keyword.column")}
                        </Text>
                    </CategoriesDomainContainer>
                    <CategoriesShareContainer>
                        <Text fontSize={ColumnHeaderSize}>
                            {i18n("keyword.analysis.overview.topCategories.right.volume.column")}
                        </Text>
                    </CategoriesShareContainer>
                    <CoreCpcCellContainer paddingRight={"0"}>
                        <Text fontSize={ColumnHeaderSize}>
                            {i18n("keyword.analysis.overview.topCategories.right.cpc.column")}
                        </Text>
                    </CoreCpcCellContainer>
                </TopCategoriesRightRow>
            </CategoriesTableContainer>
            {categoriesData.CategoryTrendingKeywords.Keywords.map((row, index) =>
                TableRow(row, index, routingParams),
            )}
        </>
    );
};

const TableRow = (row, index, routingParams) => {
    const { Keyword: domain, Volume: volume, CPC: cpc } = row;
    const swNavigator = Injector.get<any>("swNavigator");
    const InnerLinkPage = "keywordAnalysis_overview";
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams, keyword: domain });
    const keywordClicked = () => {
        TrackWithGuidService.trackWithGuid(
            "keywords.overview.page.top.categories.inner.link",
            "click",
            { keyword: domain },
        );
    };
    return (
        <TopCategoriesTableRowContainer key={index}>
            <CoreKeywordCellContainer>
                <CategoriesText>
                    <a href={innerLink} onClick={keywordClicked} target="_self">
                        {domain}
                    </a>
                </CategoriesText>
            </CoreKeywordCellContainer>
            <CoreShareCellContainer>
                <Text>{minVisitsFilter()(volume)}</Text>
            </CoreShareCellContainer>
            <CoreCpcCellContainer paddingRight={"0"}>
                <Text>${cpc}</Text>
            </CoreCpcCellContainer>
        </TopCategoriesTableRowContainer>
    );
};
