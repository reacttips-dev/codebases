import {
    IDataForInsights,
    REQUIRED_POINTS,
} from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/data-parser";
import { IInsightProps } from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/InsightsContainer";
import { InsightType, isNew, isSpike, isTrend } from "insights-assistant/insights-types";
import dayjs from "dayjs";
import { changeFilter } from "filters/ngFilters";

const CHANNEL_THRESHOLD = 50000;

const ChannelsScore = {
    "Organic Search": 0,
    "Paid Search": 1,
    Referrals: 2,
    "Display Ads": 3,
    Social: 4,
    Direct: 5,
    Email: 6,
};
export const calcInsights = (
    data: IDataForInsights[],
    selectedGranularity: string,
    vwoShowTrendsFirst: boolean,
): IInsightProps[] => {
    const insights = [];
    data.forEach((channelData: IDataForInsights) => {
        let insight = isNew(channelData.data);
        if (insight.isInsight) {
            insights.push({
                channel: channelData.channel,
                domain: channelData?.domain,
                type: InsightType.NEW,
                period:
                    selectedGranularity === "Monthly"
                        ? dayjs.utc(insight.period).format("MMM")
                        : dayjs.utc(insight.period).format("MMM DD"),
            });
        } else {
            if (
                channelData.total > CHANNEL_THRESHOLD &&
                channelData.data.length >= REQUIRED_POINTS
            ) {
                insight = isTrend(channelData.data);
                if (insight.isInsight) {
                    insights.push({
                        channel: channelData.channel,
                        domain: channelData?.domain,
                        type: InsightType.TREND,
                        value: changeFilter()(insight.value, 0),
                        isDecrease: insight.isDecrease,
                    });
                } else {
                    insight = isSpike(channelData.data);
                    if (insight.isInsight) {
                        insights.push({
                            channel: channelData.channel,
                            domain: channelData?.domain,
                            period:
                                selectedGranularity === "Monthly"
                                    ? dayjs.utc(insight.period).format("MMM")
                                    : dayjs.utc(insight.period).format("MMM DD"),
                            type: InsightType.SPIKE,
                            value: changeFilter()(insight.value, 0),
                            isDecrease: insight.isDecrease,
                        });
                    }
                }
            }
        }
    });

    return vwoShowTrendsFirst ? sortInsightsTrendFirst(insights) : sortInsightsNewFirst(insights);
};

// 1 - New Channel
// 2 - Increase/Decrease
// 3 - Trend & Detrend
// *Show alerts by size of change (from high to low)
const sortInsightsTrendFirst = (insights: IInsightProps[]) => {
    return insights.sort((a: IInsightProps, b: IInsightProps) =>
        a.type > b.type
            ? 1
            : a.type === b.type
            ? ChannelsScore[a.channel] > ChannelsScore[b.channel]
                ? 1
                : ChannelsScore[a.channel] === ChannelsScore[b.channel]
                ? a.value < b.value
                    ? 1
                    : -1
                : -1
            : -1,
    );
};

const sortInsightsNewFirst = (insights: IInsightProps[]) => {
    return insights.sort((a: IInsightProps, b: IInsightProps) =>
        a.type < b.type
            ? 1
            : a.type === b.type
            ? ChannelsScore[a.channel] > ChannelsScore[b.channel]
                ? 1
                : ChannelsScore[a.channel] === ChannelsScore[b.channel]
                ? a.value < b.value
                    ? 1
                    : -1
                : -1
            : -1,
    );
};
