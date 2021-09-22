import { Injector } from "common/ioc/Injector";
import { CompetitorsTable } from "pages/keyword-analysis/KeywordsOverviewPage/Components/CompetitorsTable";
import {
    MetricTitle,
    NoData,
    SeeMore,
    TableLoader,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { getSeeMoreCount } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityFunctions";
import {
    KeywordsCompetitorsContainer,
    SeeMoreWithCount,
    SeeMoreWithoutCount,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { abbrNumberFilter, i18nFilter } from "filters/ngFilters";
import React, { useState } from "react";
import { DefaultFetchService } from "services/fetchService";

const TableRowsAmount = 5;

export const OrganicCompetitors = (props) => {
    const HeadLineKey = "keyword.analysis.overview.competitors.organic.headline";
    const SeeAllKey = `keyword.analysis.overview.competitors.organic.see.all`;
    const KeywordTooltipKey = "keyword.analysis.overview.competitors.organic.headline.tooltip";
    const KeywordsGroupTooltipKey =
        "keyword.analysis.overview.competitors.organic.headline.group.tooltip";
    const SitesEndPoint = "widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Table";
    const TrafficShareOvertimeEndPoint = "widgetApi/KeywordAnalysisOP/KeywordAnalysisOrganic/Graph";
    const InnerLinkPage = "keywordAnalysis-organic";
    const webSource = "Desktop";
    const ComponentName = "OrganicCompetitors";
    const Constants = {
        SitesEndPoint,
        TrafficShareOvertimeEndPoint,
        HeadLineKey,
        KeywordTooltipKey,
        SeeAllKey,
        KeywordsGroupTooltipKey,
        InnerLinkPage,
        webSource,
        ComponentName,
    };
    return <CommonKeywordsCompetitors {...props} {...Constants} />;
};

export const PaidCompetitors = (props) => {
    const HeadLineKey = "keyword.analysis.overview.competitors.paid.headline";
    const SeeAllKey = `keyword.analysis.overview.competitors.paid.see.all`;
    const KeywordTooltipKey = "keyword.analysis.overview.competitors.paid.headline.tooltip";
    const KeywordsGroupTooltipKey =
        "keyword.analysis.overview.competitors.paid.headline.group.tooltip";
    const SitesEndPoint = "widgetApi/KeywordAnalysisOP/KeywordAnalysisPaid/Table";
    const TrafficShareOvertimeEndPoint = "widgetApi/KeywordAnalysisOP/KeywordAnalysisPaid/Graph";
    const InnerLinkPage = "keywordAnalysis-paid";
    const webSource = "Desktop";
    const ComponentName = "PaidCompetitors";
    const Constants = {
        SitesEndPoint,
        TrafficShareOvertimeEndPoint,
        HeadLineKey,
        KeywordTooltipKey,
        SeeAllKey,
        KeywordsGroupTooltipKey,
        InnerLinkPage,
        webSource,
        ComponentName,
    };
    return <CommonKeywordsCompetitors {...props} {...Constants} />;
};

export const MobileCompetitors = (props) => {
    const HeadLineKey = "keyword.analysis.overview.competitors.mobile.headline";
    const SeeAllKey = `keyword.analysis.overview.competitors.mobile.see.all`;
    const KeywordTooltipKey = "keyword.analysis.overview.competitors.mobile.headline.tooltip";
    const KeywordsGroupTooltipKey =
        "keyword.analysis.overview.competitors.mobile.headline.group.tooltip";
    const SitesEndPoint = "widgetApi/KeywordAnalysisMobileWeb/KeywordAnalysisOrganic/Table";
    const TrafficShareOvertimeEndPoint =
        "widgetApi/KeywordAnalysisMobileWeb/KeywordAnalysisOrganic/Graph";
    const InnerLinkPage = "keywordAnalysis-mobileweb";
    const webSource = "MobileWeb";
    const ComponentName = "MobileCompetitors";
    const Constants = {
        SitesEndPoint,
        TrafficShareOvertimeEndPoint,
        HeadLineKey,
        KeywordTooltipKey,
        SeeAllKey,
        KeywordsGroupTooltipKey,
        InnerLinkPage,
        webSource,
        ComponentName,
    };
    return <CommonKeywordsCompetitors {...props} {...Constants} />;
};

const CommonKeywordsCompetitorsInner = (props) => {
    const {
        isKeywordsGroup,
        queryParams,
        routingParams,
        SitesEndPoint,
        TrafficShareOvertimeEndPoint,
        HeadLineKey,
        KeywordTooltipKey,
        SeeAllKey,
        KeywordsGroupTooltipKey,
        InnerLinkPage,
        webSource,
        ComponentName,
    } = props;
    const [competitorsData, setCompetitorsData] = useState({
        competitorsList: {},
        totalCount: undefined,
    });
    const { competitorsList, totalCount } = competitorsData;
    const [isLoading, setIsLoading] = useState(true);
    const createSubDomains = (site) => {
        return `${site.Domain},` + site.Children?.map(({ Domain }) => `${Domain},`);
    };
    const setData = async () => {
        const apiParams = { ...queryParams, webSource };
        const fetchService = DefaultFetchService.getInstance();
        const SitesDataPromise = fetchService.get(SitesEndPoint, apiParams);
        let SitesData;
        try {
            SitesData = await SitesDataPromise;
        } catch {
            setIsLoading(false);
        }
        const competitorsList = SitesData ? SitesData["Data"]?.slice(0, TableRowsAmount) : [];
        if (competitorsList.length === 0) {
            setIsLoading(false);
            return;
        }
        competitorsList.map(createSubDomains);
        const sites = competitorsList.map(createSubDomains).join();
        const TrafficShareOvertimePromise = fetchService.get(TrafficShareOvertimeEndPoint, {
            ...apiParams,
            sites,
        });
        try {
            const TrafficShareOvertime = await TrafficShareOvertimePromise;
            setCompetitorsData({
                competitorsList: competitorsList.map((site) => {
                    return {
                        ...site,
                        trafficShareOvertime: TrafficShareOvertime["Data"][site.Domain][webSource],
                    };
                }),
                totalCount: SitesData["TotalCount"],
            });
        } finally {
            setIsLoading(false);
        }
    };
    React.useEffect(() => {
        setData();
    }, [queryParams]);
    const i18n = i18nFilter();
    const headLineTooltipKey = isKeywordsGroup ? KeywordsGroupTooltipKey : KeywordTooltipKey;
    const basicFilteredTotalCount = abbrNumberFilter()(totalCount);
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams });
    const amountHeadlineTooltipParams = { totalCount: basicFilteredTotalCount };
    const seeMoreCount = getSeeMoreCount(totalCount);
    const amountSeeMoreTooltipParams = { totalCount: seeMoreCount };
    const amountSeeMoreTooltipParamsWithoutCount = { totalCount: undefined };
    const headline = i18n(HeadLineKey, amountHeadlineTooltipParams);
    return (
        <>
            <MetricTitle headline={headline} tooltip={i18n(headLineTooltipKey)} fontSize={16} />
            {isLoading ? (
                <TableLoader />
            ) : !competitorsList || Object.values(competitorsList).length === 0 ? (
                <NoData paddingTop={"50px"} />
            ) : (
                <KeywordsCompetitorsContainer>
                    <CompetitorsTable competitorsData={competitorsData.competitorsList} />
                    {/*
                            In order for the big screens to display "SEE ALL 831 ORGANIC COMPETITORS"
                            and for smaller screens "SEE ALL ORGANIC COMPETITORS"
                            I created two "SeeMore" buttons that switch according to media queries
                        */}
                    <SeeMoreWithCount>
                        <SeeMore componentName={ComponentName} innerLink={innerLink}>
                            {i18n(SeeAllKey, amountSeeMoreTooltipParams)}
                        </SeeMore>
                    </SeeMoreWithCount>
                    <SeeMoreWithoutCount>
                        <SeeMore componentName={ComponentName} innerLink={innerLink}>
                            {i18n(SeeAllKey, amountSeeMoreTooltipParamsWithoutCount)}
                        </SeeMore>
                    </SeeMoreWithoutCount>
                </KeywordsCompetitorsContainer>
            )}
        </>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.queryParams?.keyword === nextProps.queryParams?.keyword;
const CommonKeywordsCompetitors = React.memo(CommonKeywordsCompetitorsInner, propsAreEqual);
