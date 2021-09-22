import { Ads } from "pages/keyword-analysis/KeywordsOverviewPage/Components/Ads";
import React from "react";

export const PlaAds = (props) => {
    const EndPoint = "widgetApi/KeywordAnalysisDisplayAds/ScrapedAdsByKeywords/Table";
    const HeadLineKey = "keyword.analysis.pla.research.widget.title";
    const WebSource = "Desktop";
    const AdType = "shopping";
    const InnerLinkPage = "keywordAnalysis-plaResearch";
    const SeeAllKey = "keyword.analysis.overview.ads.shop.see.all";
    const ComponentName = "PlaAds";
    const constants = {
        EndPoint,
        InnerLinkPage,
        WebSource,
        HeadLineKey,
        SeeAllKey,
        AdType,
        ComponentName,
    };
    const { noDataState, setNoDataState } = props;
    const noDataCallbackUpdate = (isNoDataState) => {
        if (isNoDataState !== noDataState.ads.pla) {
            setNoDataState({
                ...noDataState,
                ads: { text: noDataState.ads.text, pla: isNoDataState },
            });
        }
    };
    return <Ads {...props} constants={constants} noDataCallbackUpdate={noDataCallbackUpdate} />;
};
