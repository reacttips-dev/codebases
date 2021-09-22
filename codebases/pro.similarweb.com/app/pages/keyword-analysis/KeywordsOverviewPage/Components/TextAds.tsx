import { Ads } from "pages/keyword-analysis/KeywordsOverviewPage/Components/Ads";
import React from "react";

export const TextAds = (props) => {
    const EndPoint = "widgetApi/KeywordAnalysisDisplayAds/ScrapedAdsByKeywords/Table";
    const HeadLineKey = "keyword.analysis.ads.page.title";
    const WebSource = "Desktop";
    const AdType = "text";
    const InnerLinkPage = "keywordAnalysis-ads";
    const SeeAllKey = "keyword.analysis.overview.ads.text.see.all";
    const ComponentName = "TextAds";
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
        if (isNoDataState !== noDataState.ads.text) {
            setNoDataState({
                ...noDataState,
                ads: { text: isNoDataState, pla: noDataState.ads.pla },
            });
        }
    };
    return <Ads {...props} constants={constants} noDataCallbackUpdate={noDataCallbackUpdate} />;
};
