import {
    KeywordMetricsSubTitle,
    MetricTitle,
    NoData,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { LoadingSpinner } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import { KeywordAnalysisTrendsBarContainer } from "pages/keyword-analysis/KeywordAnalysisTrendsBar";
import {
    getZeroClickRatio,
    OrganicSearchZeroClicks,
    OrganicSearchZeroClicksPlaceholder,
} from "pages/keyword-analysis/OrganicSearchZeroClicks";
import React, { useState } from "react";
import { DefaultFetchService } from "services/fetchService";

const EndPoint = "widgetApi/KeywordAnalysisOP/KeywordAnalysisVolumes/SingleMetric";
const SubTitleKey = "KeywordAnalysis.organic.searchVolume.subtitle";
const HeadLineKey = "keywordanalysis.organic.widgets.searches";
const KeywordsGroupTooltipKey = "KeywordAnalysis.organic.widgets.searches.keywordgroup.tooltip";
const KeywordTooltipKey = "KeywordAnalysis.organic.widgets.searches.tooltip";

export const SearchVolumeInner: React.FC<any> = ({
    isKeywordsGroup,
    queryParams,
    showZeroClick = true,
}) => {
    const [state, setState] = useState({ volumeData: undefined, zeroClickRatio: undefined });
    const [isLoading, setIsLoading] = useState(true);
    const { volumeData, zeroClickRatio } = state;
    const setData = () => {
        const fetchService = DefaultFetchService.getInstance();
        const volumeDataPromise = fetchService.get(EndPoint, queryParams);
        const zeroClicksDataPromise =
            showZeroClick && getZeroClickRatio({ ...queryParams, webSource: undefined });
        const promises = [volumeDataPromise];
        zeroClicksDataPromise && promises.push(zeroClicksDataPromise);
        Promise.all(promises)
            .then((dataItems: any) => {
                const [{ Data: volume }] = dataItems;
                setState({
                    volumeData: Object.values(volume)[0],
                    ...(dataItems.length > 1 && {
                        zeroClickRatio: Object.values(dataItems[1].Data)[0],
                    }),
                });
            })
            .finally(() => setIsLoading(false));
    };
    React.useEffect(setData, [queryParams]);
    const i18n = i18nFilter();
    const headLineTooltipKey = isKeywordsGroup ? KeywordsGroupTooltipKey : KeywordTooltipKey;
    return (
        <>
            <MetricTitle headline={i18n(HeadLineKey)} tooltip={i18n(headLineTooltipKey)} />
            {isLoading ? (
                <LoadingSpinner />
            ) : !volumeData || Object.values(volumeData).length === 0 ? (
                <NoData />
            ) : (
                <>
                    <KeywordMetricsSubTitle subtitle={i18n(SubTitleKey)} />
                    {showZeroClick ? (
                        <OrganicSearchZeroClicks
                            params={queryParams}
                            zeroClickRatio={zeroClickRatio}
                        />
                    ) : (
                        <OrganicSearchZeroClicksPlaceholder />
                    )}
                    <KeywordAnalysisTrendsBarContainer
                        dataVolume={volumeData?.Volume}
                        data={volumeData?.VolumesMonthly}
                        volumeThreshold={10}
                    />
                </>
            )}
        </>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.queryParams?.keyword === nextProps.queryParams?.keyword;
export const SearchVolume = React.memo(SearchVolumeInner, propsAreEqual);
