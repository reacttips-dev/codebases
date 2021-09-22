import React, { FC, useEffect, useState } from "react";
import { i18nFilter } from "filters/ngFilters";
import {
    MetricTitle,
    NoData,
    SeeMore,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import { DefaultFetchService } from "services/fetchService";
import { LoadingSpinner } from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { buildKeywordListItems, buildSingleKeywordItems } from "../UtilityFunctions";

import {
    MetricSection,
    MetricSectionInner,
    TitleSection,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/serp-features/StyledComponents";
import DurationService from "services/DurationService";
import { Injector } from "common/ioc/Injector";

const i18n = i18nFilter();

const serpEndPoint = "widgetApi/KeywordAnalysisSerp/KeywordAnalysisSerp/SingleMetric";
const trafficShareEndpoint = "widgetApi/KeywordAnalysisOP/KeywordAnalysisGroupTotal/Table";
const HeadLineKey = "keyword.analysis.widgets.serp.features.title";
const getHeadLineTooltipKey = (isKeywordsGroup) =>
    isKeywordsGroup
        ? "keyword.analysis.widgets.serp.features.title.tooltip.group"
        : "keyword.analysis.widgets.serp.features.title.tooltip";

const ComponentName = "Serp";
const InnerLinkPage = "keywordAnalysis_serpSnapshot";

export const SERPFeatures: FC<any> = ({
    queryParams,
    isKeywordsGroup,
    noDataState,
    setNoDataState,
    routingParams,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [renderItems, setRenderItems] = useState([]);
    const fetchService = DefaultFetchService.getInstance();
    const swNavigator = Injector.get<any>("swNavigator");
    const innerLink = swNavigator.href(InnerLinkPage, { ...routingParams });

    useEffect(() => {
        const getSerpData = async () => {
            setIsLoading(true);
            let itemsToRender;
            const rawSerpDataPromise = fetchService.get(serpEndPoint, queryParams);
            const isUnsupportedDurationForTrafficShare = routingParams.duration === "28d";
            if (isUnsupportedDurationForTrafficShare) {
                const { to, from } = DurationService.getDurationData("1m").forAPI;
                delete queryParams.latest;
                queryParams.isWindow = false;
                queryParams.from = from;
                queryParams.to = to;
            }
            const rawTrafficShareDataPromise =
                isKeywordsGroup &&
                fetchService.get(trafficShareEndpoint, {
                    ...queryParams,
                    sort: "share",
                    pageSize: 5000,
                });
            try {
                const rawSerpData: any = await rawSerpDataPromise;
                const haveSerpData = rawSerpData && Object.keys(rawSerpData?.Data)?.length;
                if (haveSerpData) {
                    if (isKeywordsGroup) {
                        const rawTrafficShareData = await rawTrafficShareDataPromise;
                        itemsToRender = buildKeywordListItems(rawSerpData, rawTrafficShareData);
                    } else {
                        itemsToRender = buildSingleKeywordItems(rawSerpData);
                    }
                    setRenderItems(itemsToRender);
                } else {
                    setRenderItems(undefined);
                }
            } catch (e) {
                setRenderItems(undefined);
            } finally {
                setIsLoading(false);
            }
        };
        getSerpData();
    }, [queryParams.keys]);

    const isNoDataState = !renderItems;

    React.useEffect(() => {
        if (isNoDataState !== noDataState.serpFeatures) {
            setNoDataState({
                ...noDataState,
                serpFeatures: isNoDataState,
            });
        }
    }, [isLoading]);

    return (
        <>
            <TitleSection justifyContent="center">
                <MetricTitle
                    headline={i18n(HeadLineKey)}
                    tooltip={i18n(getHeadLineTooltipKey(isKeywordsGroup))}
                />
            </TitleSection>

            {isLoading ? (
                <LoadingSpinner top="8px" />
            ) : isNoDataState ? (
                <NoData paddingTop="60px" />
            ) : (
                <div>
                    <MetricSectionInner>{renderItems}</MetricSectionInner>
                    <SeeMore componentName={ComponentName} innerLink={innerLink}>
                        {i18n("serp.overview.Keywords.see.more")}
                    </SeeMore>
                </div>
            )}
        </>
    );
};
