import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { EInsightsTypes } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/typesAndConstants";

export const invokeInsightsTracking = (insightWithValue) => {
    TrackWithGuidService.trackWithGuid("search.overview.insights.amount", "table-results", {
        amount: insightWithValue.length,
    });
    const trackingAmounts = {
        organic: 0,
        paid: 0,
        branded: 0,
        engagement: 0,
    };

    const {
        ORGANIC_CHANNEL,
        PAID_CHANNEL,
        BRANDED_TRAFFIC,
        VISIT_DURATION_ORGANIC,
        VISIT_DURATION_PAID,
        PAGE_PER_VISIT_ORGANIC,
        PAGE_PER_VISIT_PAID,
        BOUNCE_RATE_ORGANIC,
        BOUNCE_RATE_PAID,
    } = EInsightsTypes;

    const engagementIdsArray = [
        BOUNCE_RATE_ORGANIC,
        BOUNCE_RATE_PAID,
        VISIT_DURATION_ORGANIC,
        VISIT_DURATION_PAID,
        PAGE_PER_VISIT_ORGANIC,
        PAGE_PER_VISIT_PAID,
    ];

    insightWithValue.map(({ id: idString }) => {
        const id = Number(idString);
        if (id === ORGANIC_CHANNEL) {
            trackingAmounts.organic += 1;
        }
        if (id === PAID_CHANNEL) {
            trackingAmounts.paid += 1;
        }
        if (id === BRANDED_TRAFFIC) {
            trackingAmounts.branded += 1;
        }

        if (engagementIdsArray.includes(id)) {
            trackingAmounts.engagement += 1;
        }
    });
    Object.keys(trackingAmounts).map((key) => {
        if (trackingAmounts[key]) {
            TrackWithGuidService.trackWithGuid(
                "search.overview.insights.content",
                "table-results",
                {
                    type: key,
                    amount: trackingAmounts[key],
                },
            );
        }
    });
};
