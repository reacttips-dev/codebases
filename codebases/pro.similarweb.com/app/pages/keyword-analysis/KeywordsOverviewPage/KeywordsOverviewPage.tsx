import { CPC } from "pages/keyword-analysis/KeywordsOverviewPage/Components/CPC";
import { PhraseMatch } from "pages/keyword-analysis/KeywordsOverviewPage/Components/PhraseMatch";
import { RelatedKeywords } from "pages/keyword-analysis/KeywordsOverviewPage/Components/RelatedKeywords";
import { SearchVisits } from "pages/keyword-analysis/KeywordsOverviewPage/Components/SearchVisits";
import { SearchVolume } from "pages/keyword-analysis/KeywordsOverviewPage/Components/SearchVolume";
import { PlaAds } from "pages/keyword-analysis/KeywordsOverviewPage/Components/PlaAds";
import { TextAds } from "pages/keyword-analysis/KeywordsOverviewPage/Components/TextAds";
import { TopCategories } from "pages/keyword-analysis/KeywordsOverviewPage/Components/TopCategories";
import { TopCountries } from "pages/keyword-analysis/KeywordsOverviewPage/Components/TopCountires";
import { groupFilter } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityFunctions";
import {
    MetricContainer,
    MetricsRow,
    MetricsRowContainer,
    MetricsRowHeader,
    MetricsSpace,
    MetricsSpaceCouple,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import {
    MobileCompetitors,
    OrganicCompetitors,
    PaidCompetitors,
} from "./Components/KeywordsCompetitors";
import { SERPFeatures } from "./Components/serp-features/SERPFeatures";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const CompetitorsTableHeight = "332px";
const CategoriesTableHeight = "315px";
const CompetitorsHeaderKey = "keyword.analysis.overview.page.competitors.title";
const CompetitorsHeaderGroupKey = "keyword.analysis.overview.page.competitors.group.title";
const KeyWordsIdeasHeaderKey = "keyword.analysis.overview.page.keywords.idea.title";
const KeywordsIdeasTableHeight = "315px";
const KeywordsAdsHeight = "537px";
const HalfCardWidth = "50%";
const DefaultRowsSpace = "24px";
const i18n = i18nFilter();

const MetricsNoDataInitialState = {
    ideas: { phrases: false, related: false },
    topCategories: false,
    ads: { pla: false, text: true },
    topCountries: false,
    serpFeatures: false,
};

export const KeywordsOverviewPage = (props) => {
    const { params } = props;
    const { showGAApprovedData, country, keyword, isWWW, duration } = params;
    if (!keyword) {
        return null;
    }
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const groupDisplayName = groupFilter(keyword);
    const groupHash = keywordsGroupsService.userGroups.find(
        (group) => group.Name === groupDisplayName,
    )?.GroupHash;
    const isKeywordsGroup = keyword?.startsWith("*");
    const queryParams = {
        ShouldGetVerifiedData: showGAApprovedData,
        country,
        from,
        includeSubDomains: isWWW === "*",
        isWindow,
        keys: isKeywordsGroup ? keyword.substring(1) : keyword,
        to,
        webSource: "Total",
        groupHash,
    };
    const [noDataState, setNoDataState] = React.useState(MetricsNoDataInitialState);
    const commonProps = { queryParams, isKeywordsGroup, noDataState, setNoDataState };
    const keyWordHeaderParams = { keyword: isKeywordsGroup ? groupDisplayName : keyword };
    const hideMobileCompetitors = duration === "28d";
    const competitorsTableProps: { height: string; width?: string } = {
        height: CompetitorsTableHeight,
    };
    if (hideMobileCompetitors) {
        competitorsTableProps.width = HalfCardWidth;
    }
    return (
        <>
            <MetricsRow>
                <MetricContainer>
                    <SearchVolume {...commonProps} />
                </MetricContainer>
                <MetricsSpace />
                <MetricContainer>
                    <SearchVisits {...commonProps} />
                </MetricContainer>
                <MetricsSpace />
                <MetricContainer>
                    <CPC {...commonProps} />
                </MetricContainer>
            </MetricsRow>
            <MetricsRowHeader>
                {i18n(
                    isKeywordsGroup ? CompetitorsHeaderGroupKey : CompetitorsHeaderKey,
                    keyWordHeaderParams,
                )}
            </MetricsRowHeader>
            <MetricsRow>
                <MetricContainer {...competitorsTableProps}>
                    <OrganicCompetitors {...commonProps} routingParams={params} />
                </MetricContainer>
                {hideMobileCompetitors ? <MetricsSpaceCouple /> : <MetricsSpace />}
                <MetricContainer {...competitorsTableProps}>
                    <PaidCompetitors {...commonProps} routingParams={params} />
                </MetricContainer>
                {!hideMobileCompetitors && (
                    <>
                        <MetricsSpace />
                        <MetricContainer {...competitorsTableProps}>
                            <MobileCompetitors {...commonProps} routingParams={params} />
                        </MetricContainer>
                    </>
                )}
            </MetricsRow>

            <MetricsRowContainer isPrintAndPdfHidden={noDataState.serpFeatures}>
                <MetricsRow marginTop={DefaultRowsSpace}>
                    <MetricContainer
                        height={"auto"}
                        minHeight={"136px"}
                        width={"100%"}
                        padding={"0"}
                        overflow={"unset"}
                    >
                        <SERPFeatures {...commonProps} routingParams={params} />
                    </MetricContainer>
                </MetricsRow>
            </MetricsRowContainer>

            <MetricsRowHeader>{i18n(KeyWordsIdeasHeaderKey)}</MetricsRowHeader>
            <MetricsRowContainer
                isPrintAndPdfHidden={
                    isKeywordsGroup || (noDataState.ideas.phrases && noDataState.ideas.related)
                }
            >
                <MetricsRow>
                    <MetricContainer height={KeywordsIdeasTableHeight} width={HalfCardWidth}>
                        <PhraseMatch {...commonProps} routingParams={params} />
                    </MetricContainer>
                    <MetricsSpaceCouple />
                    <MetricContainer height={KeywordsIdeasTableHeight} width={HalfCardWidth}>
                        <RelatedKeywords {...commonProps} routingParams={params} />
                    </MetricContainer>
                </MetricsRow>
            </MetricsRowContainer>
            <MetricsRowContainer isPrintAndPdfHidden={noDataState.topCategories}>
                <MetricsRow marginTop={DefaultRowsSpace}>
                    <MetricContainer height={CategoriesTableHeight} width={"69%"}>
                        <TopCategories
                            {...commonProps}
                            routingParams={params}
                            keyWordHeaderParams={keyWordHeaderParams}
                        />
                    </MetricContainer>
                    <MetricsSpaceCouple />
                    <MetricContainer height={CategoriesTableHeight} width={"31%"}>
                        <TopCountries {...commonProps} routingParams={params} />
                    </MetricContainer>
                </MetricsRow>
            </MetricsRowContainer>
            <MetricsRowContainer isPrintAndPdfHidden={noDataState.ads.pla && noDataState.ads.text}>
                <MetricsRow marginTop={DefaultRowsSpace}>
                    <MetricContainer height={KeywordsAdsHeight} width={HalfCardWidth}>
                        <TextAds {...commonProps} routingParams={params} />
                    </MetricContainer>
                    <MetricsSpaceCouple />
                    <MetricContainer height={KeywordsAdsHeight} width={HalfCardWidth}>
                        <PlaAds {...commonProps} routingParams={params} />
                    </MetricContainer>
                </MetricsRow>
            </MetricsRowContainer>
        </>
    );
};

const mapStateToProps = (props) => {
    const { routing, common } = props;
    const { params } = routing;
    const { showGAApprovedData } = common;
    return {
        params: {
            ...params,
            showGAApprovedData,
        },
    };
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.params.keyword === nextProps.params.keyword;
const Connected = connect(mapStateToProps)(React.memo(KeywordsOverviewPage, propsAreEqual));
SWReactRootComponent(Connected, "KeywordsOverviewPage");
