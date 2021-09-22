import { InsightType } from "services/competitiveTrackerInsights/types/apiTypes";

export const generateInsightTypeText = (insightType: InsightType) => {
    switch (insightType) {
        case "AvgVisitDuration":
            return "Avg. Visit Duration";
        case "BounceRate":
            return "Bounce Rate";
        case "CrossVisits":
            return "Cross-visitation";
        case "ExclusiveVisitors":
            return "Exclusive Visitors";
        case "NewVsReturning":
            return "New vs Returning";
        case "PagesPerVisit":
            return "Pages Per Visit";
        case "TrafficShare":
            return "Traffic Share";
        case "UniqueVisitors":
            return "Unique Visitors";
        case "Visits":
            return "Monthly Visits";
        default:
            return "";
    }
};
