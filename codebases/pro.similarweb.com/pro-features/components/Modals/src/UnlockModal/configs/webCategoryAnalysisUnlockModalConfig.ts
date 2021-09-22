import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface IWCAUnlockModalTypes {
    WebCategoryAnalysis:
        | "CategoryPerformance"
        | "CategoryShare"
        | "TrafficChannels"
        | "OutboundTraffic"
        | "TopWebsites"
        | "TopKeywords";
    CustomCategories: "NewCategory";
    CategoryPerformance: "CategoryPerformance";
    CategoryShare: "CategoryShare";
    CategoryTrafficChannels: "TrafficChannels";
    CategoryOutboundTraffic: "OutboundTraffic";
    CategoryTopWebsites: "TopWebsites";
    CategoryGeo: "Geo";
    CategoryDemographics: "Demographics";
    CategoryLoyalty: "Loyalty";
    CategoryRankings: "Rankings";
    CategorySearchLeaders: "SearchLeaders";
    CategorySocialLeaders: "SocialLeaders";
    CategoryDisplayLeaders: "DisplayLeaders";
    CategoryReferralLeaders: "ReferralLeaders";
    CategoryDirectLeaders: "DirectLeaders";
    CategoryEmailLeaders: "EmailLeaders";

    IASearch: "TopKeywords";
}
export const WebCategoryAnalysisUnlockModalConfig = (): {
    [D in keyof IWCAUnlockModalTypes]: IModalConfig<D>;
} => ({
    WebCategoryAnalysis: {
        slides: {
            CategoryPerformance: {
                img: AssetsService.assetUrl("/images/unlock-modal/category-performance.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/category-performance-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.web_category_analysis.title")}/${i18nFilter()(
                    "hook_unlock.iaoverview.category_performance.title",
                )}`,
                title: i18nFilter()("hook_unlock.web_category_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.iaoverview.category_performance.title"),
                text: i18nFilter()("hook_unlock.iaoverview.category_performance.text"),
            },
            CategoryShare: {
                img: AssetsService.assetUrl("/images/unlock-modal/category-share.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/category-share-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.web_category_analysis.title")}/${i18nFilter()(
                    "hook_unlock.iaoverview.category_share.title",
                )}`,
                title: i18nFilter()("hook_unlock.web_category_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.iaoverview.category_share.title"),
                text: i18nFilter()("hook_unlock.iaoverview.category_share.text"),
            },
            TrafficChannels: {
                img: AssetsService.assetUrl("/images/unlock-modal/traffic-channels.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/traffic-channels-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.web_category_analysis.title")}/${i18nFilter()(
                    "hook_unlock.iaoverview.traffic_channels.title",
                )}`,
                title: i18nFilter()("hook_unlock.web_category_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.iaoverview.traffic_channels.title"),
                text: i18nFilter()("hook_unlock.iaoverview.traffic_channels.text"),
            },
            OutboundTraffic: {
                img: AssetsService.assetUrl("/images/unlock-modal/outbound-traffic.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/outbound-traffic-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.web_category_analysis.title")}/${i18nFilter()(
                    "hook_unlock.iaoverview.outbound_traffic.title",
                )}`,
                title: i18nFilter()("hook_unlock.web_category_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.iaoverview.outbound_traffic.title"),
                text: i18nFilter()("hook_unlock.iaoverview.outbound_traffic.text"),
            },
            TopWebsites: {
                img: AssetsService.assetUrl("/images/unlock-modal/top-websites.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/top-websites-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.web_category_analysis.title")}/${i18nFilter()(
                    "hook_unlock.iasearch.top-websites.title",
                )}`,
                title: i18nFilter()("hook_unlock.web_category_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.iasearch.top_websites.title"),
                text: i18nFilter()("hook_unlock.iasearch.top_websites.text"),
            },
            TopKeywords: {
                img: AssetsService.assetUrl("/images/unlock-modal/top-keywords.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/top-keywords-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.web_category_analysis.title")}/${i18nFilter()(
                    "hook_unlock.iasearch.top_keywords.title",
                )}`,
                title: i18nFilter()("hook_unlock.web_category_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.iasearch.top_keywords.title"),
                text: i18nFilter()("hook_unlock.iasearch.top_keywords.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.web_category_analysis.cta_text"),
        label: "Category Analysis",
    },
    CustomCategories: {
        slides: {
            NewCategory: {
                img: AssetsService.assetUrl("/images/unlock-modal/custom-categories.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/custom-categories-2x.jpg"),
                title: i18nFilter()("hook_unlock.custom_categories.title"),
                subtitle: i18nFilter()("hook_unlock.custom_categories.subtitle"),
                text: i18nFilter()("hook_unlock.custom_categories.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.custom_categories.cta_text"),
        label: "Custom Categories",
    },
    CategoryPerformance: {
        slides: {
            CategoryPerformance: {
                img: AssetsService.assetUrl("/images/unlock-modal/category-performance.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/category-performance-2x.jpg"),
                title: i18nFilter()("hook_unlock.iaoverview.category_performance.title"),
                subtitle: i18nFilter()("hook_unlock.iaoverview.category_performance.subtitle"),
                text: i18nFilter()("hook_unlock.iaoverview.category_performance.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaoverview.cta_text"),
        label: "Web Category Performance",
    },
    CategoryShare: {
        slides: {
            CategoryShare: {
                img: AssetsService.assetUrl("/images/unlock-modal/category-share.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/category-share-2x.jpg"),
                title: i18nFilter()("hook_unlock.iaoverview.category_share.title"),
                subtitle: i18nFilter()("hook_unlock.iaoverview.category_share.subtitle"),
                text: i18nFilter()("hook_unlock.iaoverview.category_share.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaoverview.cta_text"),
        label: "Web Category Share",
    },
    CategoryTrafficChannels: {
        slides: {
            TrafficChannels: {
                img: AssetsService.assetUrl("/images/unlock-modal/traffic-channels.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/traffic-channels-2x.jpg"),
                title: i18nFilter()("hook_unlock.iaoverview.traffic_channels.title"),
                subtitle: i18nFilter()("hook_unlock.iaoverview.traffic_channels.subtitle"),
                text: i18nFilter()("hook_unlock.iaoverview.traffic_channels.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaoverview.cta_text"),
        label: "Web Category Traffic Channels",
    },
    CategoryLoyalty: {
        slides: {
            Loyalty: {
                img: AssetsService.assetUrl("/images/unlock-modal/cat-loyalty.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/cat-loyalty-2x.png"),
                title: i18nFilter()("hook_unlock.iaoverview.loyalty.title"),
                subtitle: i18nFilter()("hook_unlock.iaoverview.loyalty.subtitle"),
                text: i18nFilter()("hook_unlock.iaoverview.loyalty.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaoverview.cta_text"),
        label: "Web Category loyalty",
    },
    CategoryGeo: {
        slides: {
            Geo: {
                img: AssetsService.assetUrl("/images/IACategoryGeo.jpg"),
                img2x: AssetsService.assetUrl("/images/IACategoryGeo.jpg"),
                title: i18nFilter()("hook_unlock.iaoverview.geo.title"),
                subtitle: i18nFilter()("hook_unlock.iaoverview.geo.subtitle"),
                text: i18nFilter()("hook_unlock.iaoverview.geo.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaoverview.cta_text"),
        label: "Web Category Geography",
    },
    CategoryDemographics: {
        slides: {
            Demographics: {
                img: AssetsService.assetUrl("/images/unlock-modal/cat-demographics.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/cat-demographics-2x.png"),
                title: i18nFilter()("hook_unlock.iaoverview.demographics.title"),
                subtitle: i18nFilter()("hook_unlock.iaoverview.demographics.subtitle"),
                text: i18nFilter()("hook_unlock.iaoverview.demographics.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaoverview.cta_text"),
        label: "Web Category Demographics",
    },
    CategoryOutboundTraffic: {
        slides: {
            OutboundTraffic: {
                img: AssetsService.assetUrl("/images/unlock-modal/outbound-traffic.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/outbound-traffic-2x.jpg"),
                title: i18nFilter()("hook_unlock.iaoverview.outbound_traffic.title"),
                subtitle: i18nFilter()("hook_unlock.iaoverview.outbound_traffic.subtitle"),
                text: i18nFilter()("hook_unlock.iaoverview.outbound_traffic.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaoverview.cta_text"),
        label: "Web Category Outbound Traffic",
    },
    CategoryTopWebsites: {
        slides: {
            TopWebsites: {
                img: AssetsService.assetUrl("/images/unlock-modal/top-websites.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/top-websites-2x.jpg"),
                title: i18nFilter()("hook_unlock.iasearch.top_websites.title"),
                subtitle: i18nFilter()("hook_unlock.iasearch.top_websites.subtitle"),
                text: i18nFilter()("hook_unlock.iasearch.top_websites.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaoverview.cta_text"),
        label: "Web Category Top Websites",
    },
    CategoryRankings: {
        slides: {
            Rankings: {
                img: AssetsService.assetUrl("/images/unlock-modal/see-more-results.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/see-more-results-2x.jpg"),
                title: i18nFilter()("hook_unlock.rankings.title"),
                subtitle: i18nFilter()("hook_unlock.rankings.subtitle"),
                text: i18nFilter()("hook_unlock.rankings.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.rankings.cta_text"),
        label: "Web Category Rankings",
    },
    CategorySearchLeaders: {
        slides: {
            SearchLeaders: {
                img: AssetsService.assetUrl("/images/unlock-modal/search-leaders.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/search-leaders-2x.jpg"),
                title: i18nFilter()("hook_unlock.iaranking.search_leaders.title"),
                subtitle: i18nFilter()("hook_unlock.iaranking.search_leaders.subtitle"),
                text: i18nFilter()("hook_unlock.iaranking.search_leaders.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaranking.cta_text"),
        label: "Web Category Search Leaders",
    },
    CategorySocialLeaders: {
        slides: {
            SocialLeaders: {
                img: AssetsService.assetUrl("/images/unlock-modal/social-leaders.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/social-leaders-2x.jpg"),
                title: i18nFilter()("hook_unlock.iaranking.social_leaders.title"),
                subtitle: i18nFilter()("hook_unlock.iaranking.social_leaders.subtitle"),
                text: i18nFilter()("hook_unlock.iaranking.social_leaders.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaranking.cta_text"),
        label: "Web Category Social Leaders",
    },
    CategoryDisplayLeaders: {
        slides: {
            DisplayLeaders: {
                img: AssetsService.assetUrl("/images/unlock-modal/display-leaders.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/display-leaders-2x.jpg"),
                title: i18nFilter()("hook_unlock.iaranking.display_leaders.title"),
                subtitle: i18nFilter()("hook_unlock.iaranking.display_leaders.subtitle"),
                text: i18nFilter()("hook_unlock.iaranking.display_leaders.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaranking.cta_text"),
        label: "Web Category Display Leaders",
    },
    CategoryReferralLeaders: {
        slides: {
            ReferralLeaders: {
                img: AssetsService.assetUrl("/images/unlock-modal/referral-leaders.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/referral-leaders-2x.jpg"),
                title: i18nFilter()("hook_unlock.iaranking.referral_leaders.title"),
                subtitle: i18nFilter()("hook_unlock.iaranking.referral_leaders.subtitle"),
                text: i18nFilter()("hook_unlock.iaranking.referral_leaders.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaranking.cta_text"),
        label: "Web Category Referral Leaders",
    },
    CategoryDirectLeaders: {
        slides: {
            DirectLeaders: {
                img: AssetsService.assetUrl("/images/unlock-modal/direct-leaders.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/direct-leaders-2x.jpg"),
                title: i18nFilter()("hook_unlock.iaranking.direct_leaders.title"),
                subtitle: i18nFilter()("hook_unlock.iaranking.direct_leaders.subtitle"),
                text: i18nFilter()("hook_unlock.iaranking.direct_leaders.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaranking.cta_text"),
        label: "Web Category Direct Leaders",
    },
    CategoryEmailLeaders: {
        slides: {
            EmailLeaders: {
                img: AssetsService.assetUrl("/images/unlock-modal/email-leaders.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/email-leaders-2x.jpg"),
                title: i18nFilter()("hook_unlock.iaranking.email_leaders.title"),
                subtitle: i18nFilter()("hook_unlock.iaranking.email_leaders.subtitle"),
                text: i18nFilter()("hook_unlock.iaranking.email_leaders.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iaranking.cta_text"),
        label: "Web Category Email Leaders",
    },
    IASearch: {
        slides: {
            TopKeywords: {
                img: AssetsService.assetUrl("/images/unlock-modal/top-keywords.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/top-keywords-2x.jpg"),
                title: i18nFilter()("hook_unlock.iasearch.top_keywords.title"),
                subtitle: i18nFilter()("hook_unlock.iasearch.top_keywords.subtitle"),
                text: i18nFilter()("hook_unlock.iasearch.top_keywords.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.iasearch.cta_text"),
        label: "Web Category Search",
    },
});
