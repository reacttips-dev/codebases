import { Injector } from "common/ioc/Injector";
import {
    KeywordMetricsSubTitle,
    MetricTitle,
    NoData,
    SeeMore,
    TableLoader,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { getSeeMoreCount } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityFunctions";
import { PhraseMatchContainer } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { abbrNumberFilter, i18nFilter } from "filters/ngFilters";
import React, { useState } from "react";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";

const KeywordIdeasUnavailableDurations = ["24m", "18m"];
const DefaultDuration = "3m";

export const KeywordsIdeasInner = (props) => {
    const {
        queryParams,
        routingParams,
        constants,
        keywordsIdeasTable,
        noDataCallbackUpdate,
    } = props;
    const {
        SortArguments,
        EndPoint,
        TableRowsAmount,
        InnerLinkPage,
        WebSource,
        SelectedTableTab,
        HeadLineKey,
        headLineTooltipKey,
        SubTitleKey,
        SeeAllKey,
        ComponentName,
    } = constants;
    const [phrasesMatchValue, setPhrasesMatchValue] = useState({
        totalRecords: undefined,
        records: undefined,
        totalVisits: undefined,
        maxScore: undefined,
    });
    const [isLoading, setIsLoading] = useState(true);
    const setData = () => {
        const { duration } = routingParams;
        const durationForApi = KeywordIdeasUnavailableDurations.includes(duration)
            ? DefaultDuration
            : duration;
        const { from, to, isWindow } = DurationService.getDurationData(durationForApi).forAPI;
        const { keys, country } = queryParams;
        const apiParams = {
            ...SortArguments,
            keyword: keys,
            country,
            from,
            to,
            isWindow,
            websource: WebSource,
        };
        const fetchService = DefaultFetchService.getInstance();
        const cpcDataPromise = fetchService.get(EndPoint, apiParams);
        cpcDataPromise
            .then(({ records, totalRecords, totalVisits, maxScore }) =>
                setPhrasesMatchValue({
                    records: records.slice(0, TableRowsAmount),
                    totalRecords,
                    totalVisits,
                    maxScore,
                }),
            )
            .finally(() => setIsLoading(false));
    };
    React.useEffect(setData, [queryParams]);
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, {
        ...routingParams,
        webSource: WebSource,
        selectedWidgetTab: SelectedTableTab,
    });
    const i18n = i18nFilter();
    const abbrNumber = abbrNumberFilter();
    const { totalRecords, totalVisits, maxScore, records } = phrasesMatchValue;
    const seeMoreCount = getSeeMoreCount(totalRecords);
    const amountSeeMoreTooltipParams = { totalCount: seeMoreCount };
    const subTitleTooltipParams = {
        totalRecords: abbrNumber(totalRecords),
        totalVisits: abbrNumber(totalVisits),
    };
    const isNoDataState = !records || records?.length === 0;
    React.useEffect(() => {
        noDataCallbackUpdate && noDataCallbackUpdate(isNoDataState);
    }, [isLoading]);
    return (
        <>
            <MetricTitle headline={i18n(HeadLineKey)} tooltip={i18n(headLineTooltipKey)} />
            {isLoading ? (
                <TableLoader />
            ) : isNoDataState ? (
                <NoData paddingTop="60px" />
            ) : (
                <PhraseMatchContainer>
                    <div>
                        <KeywordMetricsSubTitle
                            subtitle={i18n(SubTitleKey, subTitleTooltipParams)}
                            webSource={WebSource}
                        />
                        {keywordsIdeasTable(records, routingParams, maxScore)}
                    </div>
                    <SeeMore componentName={ComponentName} innerLink={innerLink}>
                        {i18n(SeeAllKey, amountSeeMoreTooltipParams)}
                    </SeeMore>
                </PhraseMatchContainer>
            )}
        </>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.queryParams?.keyword === nextProps.queryParams?.keyword;
export const KeywordsIdeas = React.memo(KeywordsIdeasInner, propsAreEqual);
