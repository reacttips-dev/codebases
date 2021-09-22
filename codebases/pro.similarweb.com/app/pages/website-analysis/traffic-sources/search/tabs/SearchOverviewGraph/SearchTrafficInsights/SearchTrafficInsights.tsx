import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import { InsightsTitle } from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/Common";
import {
    HideButton,
    InsightsWrapperBase,
    StyledBoxTitleContainer,
    StyledRecommendationsIndicatorNumber,
} from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/StyledComponents";
import { useAvailableCategories } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Components/FiltersRow";
import { useSearchOverviewContext } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchOverviewGraph";
import { insightsMetaData } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/MD";
import {
    getInsights,
    sortByPriorityAndGranularityDesc,
} from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/utilities";
import React from "react";
import { timeGranularityList } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Helpers/SearchOverviewGraphConfig";
import { InsightsCarousel } from "./InsightsCarousel";
import { invokeInsightsTracking } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/tracking";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

export const SearchTrafficInsights = ({ graphTabs, setActiveTab, noInsightsReasonKey }) => {
    const {
        isMonthsToDateActive,
        selectedMetricTab,
        legendItemsState,
        granularity,
        webSource,
        category,
        actions,
        rawData,
        from,
        to,
    } = useSearchOverviewContext();
    const { setCategory, toggleLegendItem, setTimeGranularity } = actions;
    const [isContainerCollapsed, setIsContainerCollapsed] = React.useState(false);
    const [selectedInsightId, setSelectedInsightId] = React.useState<number>();
    const [visitedInsights, setVisitedInsights] = React.useState<Record<number, boolean>>({});
    const resetSelectedInsightId = () => setSelectedInsightId(undefined);
    React.useEffect(resetSelectedInsightId, [
        selectedMetricTab,
        category.id,
        legendItemsState,
        isMonthsToDateActive,
    ]);
    const timeGranularity = String(granularity);

    const setGranularity = (insightGranularity) =>
        insightGranularity !== timeGranularity && setTimeGranularity(insightGranularity);

    const setTab = (index) => setActiveTab(graphTabs.find(({ id }) => id === index));
    const availableCategories = useAvailableCategories();
    const setCategoryOnClick = (categoryId) => {
        const category = availableCategories.find(({ id }) => id === categoryId);
        setCategory(category);
    };

    const setLegends = (legendItem) => toggleLegendItem(legendItem);
    // apply the selected insight change last
    const setSelectedInsightIdAsync = (insightId) => {
        setTimeout(() => {
            setSelectedInsightId(insightId);
            setVisitedInsights((state) => ({ ...state, [insightId]: true }));
        }, 0);
    };

    const lastSupportedDate = isMonthsToDateActive
        ? swSettings.current.lastSupportedDailyDate
        : to.replace(/\|/g, "/");

    const filters = { granularity: timeGranularity, from, to, lastSupportedDate };
    const sortedInsightWithValue = React.useMemo(() => {
        if (noInsightsReasonKey) return [];
        const WEEKLY_TRAFFIC_THRESHOLD = 1500;
        const MONTHLY_TRAFFIC_THRESHOLD = 5000;
        const weeklyInsights = getInsights(insightsMetaData, rawData, {
            ...filters,
            trafficThreshold: WEEKLY_TRAFFIC_THRESHOLD,
            granularity: timeGranularityList.weekly.name,
        });
        const monthlyInsights = getInsights(insightsMetaData, rawData, {
            ...filters,
            trafficThreshold: MONTHLY_TRAFFIC_THRESHOLD,
            granularity: timeGranularityList.monthly.name,
        });
        const insights = [...weeklyInsights, ...monthlyInsights];
        const insightWithValue = insights.filter(
            ({ value, isNewChannel }) => value || isNewChannel,
        );
        invokeInsightsTracking(insightWithValue);
        return sortByPriorityAndGranularityDesc(insightWithValue);
    }, [rawData]);

    React.useEffect(() => {
        sortedInsightWithValue.length &&
            isContainerCollapsed &&
            setIsContainerCollapsed(!isContainerCollapsed);
    }, [sortedInsightWithValue.length]);
    const i18n = i18nFilter();
    const isInsights = sortedInsightWithValue.length > 0;
    !isContainerCollapsed && !isInsights && setIsContainerCollapsed(!isContainerCollapsed);
    return (
        <div style={{ marginBottom: webSource === devicesTypes.MOBILE && "16px" }}>
            <InsightsWrapperBase
                isCollapsed={isContainerCollapsed}
                borderRadius={"0px"}
                height={"261px"}
            >
                <StyledBoxTitleContainer
                    width={"auto"}
                    isCollapsed={isContainerCollapsed}
                    withUnderline={!isContainerCollapsed}
                >
                    <InsightsTitle
                        keys={{
                            title: "search.overview.insights.container.title",
                            titleTooltip: "search.overview.insights.container.title.tooltip",
                            noInsightsSubtitle:
                                noInsightsReasonKey ?? "search.overview.insights.no.insights",
                        }}
                        isExpandDisabled={!isInsights}
                    />
                    <HideButton
                        type="flat"
                        iconName={isContainerCollapsed ? "chev-down" : "chev-up"}
                        isDisabled={!isInsights}
                        onClick={() => setIsContainerCollapsed(!isContainerCollapsed)}
                    >
                        {isContainerCollapsed ? (
                            <>
                                {i18n("mmx.insights.show-insights.button")}
                                {sortedInsightWithValue.length > 0 && (
                                    <StyledRecommendationsIndicatorNumber>
                                        {sortedInsightWithValue.length}
                                    </StyledRecommendationsIndicatorNumber>
                                )}
                            </>
                        ) : (
                            i18n("mmx.insights.hide.button")
                        )}
                    </HideButton>
                </StyledBoxTitleContainer>
                {!isContainerCollapsed && (
                    <InsightsCarousel
                        selectedInsightId={selectedInsightId}
                        setCategoryOnClick={setCategoryOnClick}
                        setGranularity={setGranularity}
                        setLegends={setLegends}
                        setSelectedInsightIdAsync={setSelectedInsightIdAsync}
                        setTab={setTab}
                        visitedInsights={visitedInsights}
                        sortedInsightWithValue={sortedInsightWithValue}
                    />
                )}
            </InsightsWrapperBase>
        </div>
    );
};
