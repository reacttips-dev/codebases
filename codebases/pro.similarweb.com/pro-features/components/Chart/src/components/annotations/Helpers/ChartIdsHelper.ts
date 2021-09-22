/*
 *  Chart Id value make annotations unique for the chart in the database.
 *
 *  Important Notes:
 *
 *  - Changing a name will change the lookup in database and if you dont upgrade the db with new name,
 *  you will loose reference to your previous annotations.
 *
 *  - ChartIds must be unique so that your annotations are unique to your chart
 *
 *  - To make a annotations unique for a chart tab selection, you can append the selected tab to the chart name
 */
export const ChartIds = {
    ChannelTrafficAndEngagement: "ChannelTrafficAndEngagement",
    TrafficAndEngagementAvgVisitDuration: "TrafficAndEngagement_AvgVisitDuration",
    TrafficAndEngagementBounceRate: "TrafficAndEngagement_BounceRate",
    TrafficAndEngagementDeduplicatedAudience: "TrafficAndEngagement_DeduplicatedAudience",
    TrafficAndEngagementPagesPerVisit: "TrafficAndEngagement_PagesPerVisit",
    TrafficAndEngagementUniqueUsers: "TrafficAndEngagement_UniqueUsers",
    TrafficAndEngagementVisits: "TrafficAndEngagement_Visits",
    TrafficAndEngagementPages: "TrafficAndEngagement_Pages",
    WebsitePerformanceVisitsOverTime: "WebsitePerformance_VisitsOverTime",
};
