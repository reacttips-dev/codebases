import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface IAppAnalysisUnlockModalConfigTypes {
    AppAnalysis: "AppPerformance" | "Ranking" | "Engagement" | "Retention" | "UsagePatterns";
    AppAnalysisPerformance: "AppPerformance";
    AppAnalysisRanking: "Ranking";
    AppAnalysisEngagement: "Engagement";
    AppAnalysisRetention: "Retention";
    AppAnalysisUsagePatterns: "UsagePatterns";
    AppAnalysisDemographics: "Demographics";
    AppAnalysisInterests: "Interests";
    ExternalTrafficChannels: "ExternalTrafficChannels";
    ExternalSearchKeywords: "ExternalSearchKeywords";
    StoreTrafficChannels: "StoreTrafficChannels";
    StoreSearchKeywords: "StoreSearchKeywords";
}

export const AppAnalysisUnlockModalConfig = (): {
    [D in keyof IAppAnalysisUnlockModalConfigTypes]: IModalConfig<D>;
} => ({
    AppAnalysis: {
        slides: {
            AppPerformance: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-appperformace.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/appanalysis-appperformace-2x.jpg",
                ),
                trackId: `${i18nFilter()("hook_unlock.app_analysis.title")}/${i18nFilter()(
                    "hook_unlock.appanalysis_overview.appperformance.title",
                )}`,
                title: i18nFilter()("hook_unlock.app_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_overview.appperformance.title"),
                text: i18nFilter()("hook_unlock.appanalysis_overview.appperformance.text"),
            },
            Ranking: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-ranking.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/appanalysis-ranking-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.app_analysis.title")}/${i18nFilter()(
                    "hook_unlock.appanalysis_overview.ranking.title",
                )}`,
                title: i18nFilter()("hook_unlock.app_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_overview.ranking.title"),
                text: i18nFilter()("hook_unlock.appanalysis_overview.ranking.text"),
            },
            Engagement: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-engagement.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/appanalysis-engagement-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.app_analysis.title")}/${i18nFilter()(
                    "hook_unlock.appanalysis_usage.engagement.title",
                )}`,
                title: i18nFilter()("hook_unlock.app_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_usage.engagement.title"),
                text: i18nFilter()("hook_unlock.appanalysis_usage.engagement.text"),
            },
            Retention: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-retention.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/appanalysis-retention-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.app_analysis.title")}/${i18nFilter()(
                    "hook_unlock.appanalysis_usage.retention.title",
                )}`,
                title: i18nFilter()("hook_unlock.app_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_usage.retention.title"),
                text: i18nFilter()("hook_unlock.appanalysis_usage.retention.text"),
            },
            UsagePatterns: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-usage-patterns.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/appanalysis-usage-patterns-2x.jpg",
                ),
                trackId: `${i18nFilter()("hook_unlock.app_analysis.title")}/${i18nFilter()(
                    "hook_unlock.appanalysis_usage.usage_patterns.title",
                )}`,
                title: i18nFilter()("hook_unlock.app_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_usage.usage_patterns.title"),
                text: i18nFilter()("hook_unlock.appanalysis_usage.usage_patterns.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.app_analysis.cta_text"),
        label: "App Analysis",
    },
    AppAnalysisPerformance: {
        slides: {
            AppPerformance: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-appperformace.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/appanalysis-appperformace-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.appanalysis_overview.appperformance.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_overview.appperformance.subtitle"),
                text: i18nFilter()("hook_unlock.appanalysis_overview.appperformance.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.appanalysis_usage.cta_text"),
        label: "App Analysis Performance",
    },
    AppAnalysisRanking: {
        slides: {
            Ranking: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-ranking.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/appanalysis-ranking-2x.jpg"),
                title: i18nFilter()("hook_unlock.appanalysis_overview.ranking.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_overview.ranking.subtitle"),
                text: i18nFilter()("hook_unlock.appanalysis_overview.ranking.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.appanalysis_usage.cta_text"),
        label: "App Analysis Ranking",
    },
    AppAnalysisEngagement: {
        slides: {
            Engagement: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-engagement.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/appanalysis-engagement-2x.jpg"),
                title: i18nFilter()("hook_unlock.appanalysis_usage.engagement.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_usage.engagement.subtitle"),
                text: i18nFilter()("hook_unlock.appanalysis_usage.engagement.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.appanalysis_usage.cta_text"),
        label: "App Analysis Engagement",
    },
    AppAnalysisRetention: {
        slides: {
            Retention: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-retention.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/appanalysis-retention-2x.jpg"),
                title: i18nFilter()("hook_unlock.appanalysis_usage.retention.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_usage.retention.subtitle"),
                text: i18nFilter()("hook_unlock.appanalysis_usage.retention.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.appanalysis_usage.cta_text"),
        label: "App Analysis Retention",
    },
    AppAnalysisUsagePatterns: {
        slides: {
            UsagePatterns: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-usage-patterns.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/appanalysis-usage-patterns-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.appanalysis_usage.usage_patterns.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_usage.usage_patterns.subtitle"),
                text: i18nFilter()("hook_unlock.appanalysis_usage.usage_patterns.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.appanalysis_usage.cta_text"),
        label: "App Analysis Usage Patterns",
    },
    AppAnalysisDemographics: {
        slides: {
            Demographics: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-demographics.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/appanalysis-demographics-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.appanalysis_audience.demographics.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_audience.demographics.subtitle"),
                text: i18nFilter()("hook_unlock.appanalysis_audience.demographics.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.appanalysis_audience.cta_text"),
        label: "App Analysis Audience",
    },
    AppAnalysisInterests: {
        slides: {
            Interests: {
                img: AssetsService.assetUrl("/images/unlock-modal/appanalysis-interests.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/appanalysis-interests-2x.jpg"),
                title: i18nFilter()("hook_unlock.appanalysis_audience.interests.title"),
                subtitle: i18nFilter()("hook_unlock.appanalysis_audience.interests.subtitle"),
                text: i18nFilter()("hook_unlock.appanalysis_audience.interests.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.appanalysis_audience.cta_text"),
        label: "App Analysis Audience",
    },
    ExternalTrafficChannels: {
        slides: {
            ExternalTrafficChannels: {
                img: AssetsService.assetUrl("/images/unlock-modal/external-traffic-channels.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/external-traffic-channels-2x.jpg",
                ),
                title: i18nFilter()(
                    "hook_unlock.appanalysis_store.external_traffic_channels.title",
                ),
                subtitle: i18nFilter()(
                    "hook_unlock.appanalysis_store.external_traffic_channels.subtitle",
                ),
                text: i18nFilter()("hook_unlock.appanalysis_store.external_traffic_channels.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.appanalysis_store.cta_text"),
        label: "App Analysis Store/External Traffic Channels",
    },
    ExternalSearchKeywords: {
        slides: {
            ExternalSearchKeywords: {
                img: AssetsService.assetUrl("/images/unlock-modal/external-search-keywords.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/external-search-keywords-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.appanalysis_store.external_search_keywords.title"),
                subtitle: i18nFilter()(
                    "hook_unlock.appanalysis_store.external_search_keywords.subtitle",
                ),
                text: i18nFilter()("hook_unlock.appanalysis_store.external_search_keywords.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.appanalysis_store.cta_text"),
        label: "App Analysis Store/External Search Keywords",
    },
    StoreTrafficChannels: {
        slides: {
            StoreTrafficChannels: {
                img: AssetsService.assetUrl("/images/unlock-modal/store-traffic-channels.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/store-traffic-channels-2x.jpg"),
                title: i18nFilter()("hook_unlock.appanalysis_store.store_traffic_channels.title"),
                subtitle: i18nFilter()(
                    "hook_unlock.appanalysis_store.store_traffic_channels.subtitle",
                ),
                text: i18nFilter()("hook_unlock.appanalysis_store.store_traffic_channels.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.appanalysis_store.cta_text"),
        label: "App Analysis Store/Store Traffic Channels",
    },
    StoreSearchKeywords: {
        slides: {
            StoreSearchKeywords: {
                img: AssetsService.assetUrl("/images/unlock-modal/store-search-keywords.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/store-search-keywords-2x.jpg"),
                title: i18nFilter()("hook_unlock.appanalysis_store.store_search_keywords.title"),
                subtitle: i18nFilter()(
                    "hook_unlock.appanalysis_store.store_search_keywords.subtitle",
                ),
                text: i18nFilter()("hook_unlock.appanalysis_store.store_search_keywords.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.appanalysis_store.cta_text"),
        label: "App Analysis Store/Store Search Keywords",
    },
});
