import { timeGranularityList } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Helpers/SearchOverviewGraphConfig";
import { InsightSectionHeaderContainer } from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/StyledComponents";
import { i18nFilter } from "filters/ngFilters";

const MONTHLY_HEADER_KEY = "search.overview.insights.header.monthly";
const WEEKLY_HEADER_KEY = "search.overview.insights.header.weekly";

export const InsightSectionHeader = ({
    index,
    insight,
    insights,
    monthlyHeaderKey = MONTHLY_HEADER_KEY,
    weeklyHeaderKey = WEEKLY_HEADER_KEY,
}) => {
    const isFirstInsight = index === 0;
    const previousInsight = insights[isFirstInsight ? index : index - 1];
    const granularityHasChanged = insight.granularity !== previousInsight.granularity;
    const shouldDisplayHeader = isFirstInsight || granularityHasChanged;
    const headerKey =
        insight.granularity === timeGranularityList.monthly.name
            ? monthlyHeaderKey
            : weeklyHeaderKey;
    return (
        <InsightSectionHeaderContainer>
            {shouldDisplayHeader && i18nFilter()(headerKey)}
        </InsightSectionHeaderContainer>
    );
};
