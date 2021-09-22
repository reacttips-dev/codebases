import AffiliateMarketingOptimization from "./templates/AffiliateMarketingOptimization";
import CompetitiveOverview from "./templates/CompetitiveOverview";
import WebsiteAudienceAnalysis from "./templates/WebsiteAudienceAnalysis";
import MarketAnalysisDashboard from "./templates/MarketAnalysisDashboard";
import BrandProtection from "./templates/BrandProtection";
import DailyCompetitiveOverview from "./templates/DailyCompetitiveOverview";
import OrganicKeywordOptimization from "./templates/OrganicKeywordOptimization";
import PaidKeywordOptimization from "./templates/PaidKeywordOptimization";
import SocialMediaTrafficMonitoring from "./templates/SocialMediaTrafficMonitoring";
import AppEngagement from "./templates/AppEngagement";
import Benchmark from "./templates/Benchmark";
import Evaluation from "./templates/Evaluation";
import SeoPerformance from "./templates/SeoPerformance";

const templates = [
    AppEngagement,
    DailyCompetitiveOverview,
    CompetitiveOverview,
    Benchmark,
    MarketAnalysisDashboard,
    WebsiteAudienceAnalysis,
    SeoPerformance,
    OrganicKeywordOptimization,
    PaidKeywordOptimization,
    AffiliateMarketingOptimization,
    SocialMediaTrafficMonitoring,
    BrandProtection,
    Evaluation,
];

export default {
    getDashboardTemplates: () => {
        return Promise.resolve(templates);
    },
};
