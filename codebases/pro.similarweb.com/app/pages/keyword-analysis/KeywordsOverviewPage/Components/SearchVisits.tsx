import {
    KeywordAnalysisTotalVisits,
    KeywordAnalysisTotalVisitsCalculator,
} from "components/React/KeywordAnalysisTotalVisits/KeywordAnalysisTotalVisits";
import {
    KeywordMetricsSubTitle,
    MetricTitle,
    NoData,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { LoadingSpinner } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import React, { useMemo, useState } from "react";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { OrganicDataRows } from "pages/keyword-analysis/OrganicSearchZeroClicks";
import { KeywordAnalysisTrendsBarContainer } from "pages/keyword-analysis/KeywordAnalysisTrendsBar";
import { TrendsBar } from "components/TrendsBar/src/TrendsBar";
import { colorsPalettes, mixins, colorsSets } from "@similarweb/styles";

const EndPoint =
    "widgetApi/KeywordAnalysisOverview/KeywordAnalysisTrafficShareOverTime/SingleMetric";
const SubTitleKey = "keywordanalysis.organic.searchvisits.subtitle";
const HeadLineKey = "keywordanalysis.organic.widgets.totalsearchvisits";
const KeywordTooltipKey = "keywordAnalysis.organic.widgets.totalsearchvisits.tooltip";
const KeywordsGroupTooltipKey =
    "keywordAnalysis.organic.widgets.totalsearchvisits.keywordgroup.tooltip";
const MaxMonths = 12;
const SearchVisitsDuration = "12m";

const SearchVisitsInner = (props) => {
    const { isKeywordsGroup, queryParams } = props;
    const [trafficTrend, setTrafficTrend] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { from, to, isWindow } = DurationService.getDurationData(SearchVisitsDuration).forAPI;
    const setData = () => {
        const fetchService = DefaultFetchService.getInstance();
        const getParams = { ...queryParams, from, to, isWindow };
        delete getParams.latest;
        const visitsDataPromise = fetchService.get(EndPoint, getParams);
        visitsDataPromise
            .then(({ Data }) => {
                setTrafficTrend(Data);
            })
            .finally(() => setIsLoading(false));
    };
    React.useEffect(setData, [queryParams]);
    const i18n = i18nFilter();
    const headLineTooltipKey = isKeywordsGroup ? KeywordsGroupTooltipKey : KeywordTooltipKey;
    const isZeroSum = (ta) =>
        ta.reduce((sum, { TotalVisits }: { TotalVisits: number }) => sum + TotalVisits, 0) === 0;
    const { trend, calculatedAvgVisits, calculatedAvgOrganic, calculatedAvgPaid } = useMemo<
        any
    >(() => {
        if (!trafficTrend) return {};
        const calculated = KeywordAnalysisTotalVisitsCalculator.calculateAverages(
            trafficTrend,
            MaxMonths,
        );
        if (props.onCalculateVisitsTrend) {
            props.onCalculateVisitsTrend(calculated);
        }
        return calculated;
    }, [trafficTrend]);
    const getRows = () => {
        const organicDataRowsItems = [
            {
                text: `Organic`,
                value: `${
                    calculatedAvgOrganic === 0 || calculatedAvgOrganic === 100
                        ? calculatedAvgOrganic
                        : calculatedAvgOrganic.toFixed(2)
                }%`,
                color: colorsSets.b1.toArray()[0],
            },
            {
                text: `Paid`,
                value: `${
                    calculatedAvgPaid === 0 || calculatedAvgPaid === 100
                        ? calculatedAvgPaid
                        : calculatedAvgPaid.toFixed(2)
                }%`,
                color: colorsSets.b1.toArray()[1],
            },
        ];
        return organicDataRowsItems;
    };
    return (
        <>
            <MetricTitle headline={i18n(HeadLineKey)} tooltip={i18n(headLineTooltipKey)} />
            {isLoading ? (
                <LoadingSpinner />
            ) : !trafficTrend ||
              Object.values(trafficTrend).length === 0 ||
              isZeroSum(Object.values(trafficTrend)) ? (
                <NoData />
            ) : (
                <div>
                    <KeywordMetricsSubTitle subtitle={i18n(SubTitleKey)} />
                    {/*<KeywordAnalysisTotalVisits
                        maxMonths={MaxMonths}
                        trafficTrend={trafficTrend}
                        columnDisplay={true}
                    />*/}
                    <OrganicDataRows items={getRows()} />
                    <KeywordAnalysisTrendsBarContainer
                        dataVolume={calculatedAvgVisits}
                        trendsBar={<TrendsBar values={trend} />}
                    />
                </div>
            )}
        </>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.queryParams?.keyword === nextProps.queryParams?.keyword;
export const SearchVisits = React.memo(SearchVisitsInner, propsAreEqual);
