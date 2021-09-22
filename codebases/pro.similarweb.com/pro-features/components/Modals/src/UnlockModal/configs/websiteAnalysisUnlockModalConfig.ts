import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface IWebAnalysisUnlockModalTypes {
    WebsiteAnalysis:
        | "WebsitePerformance"
        | "WebsiteTechnologies"
        | "CompetitiveLandscape"
        | "TrafficAndEngagement"
        | "MarketingChannels"
        | "Geography"
        | "Keywords"
        | "Publishers"
        | "Pages";
    WebsitePerformance: "WebsitePerformance";
    CompetitiveLandscape: "CompetitiveLandscape";
    WebsiteTechnologies: "WebsiteTechnologies";
    TrafficAndEngagement: "TrafficAndEngagement";
    MarketingChannels: "MarketingChannels";
    AudienceGeography: "Geography";
    AudienceDemography: "Demography";
    AudienceOverlap: "AudienceOverlap";
    NewVsReturning: "NewVsReturning";
    AudienceInterest: "AudienceInterest";
    SearchOverview: "SearchOverview";
    SearchKeywords: "Keywords";
    SearchPhrases: "SearchPhrases";
    SearchAds: "SearchAds";
    SearchPLAs: "SearchPLAs";
    OrganicLandingPages: "OrganicLandingPages";
    SearchKwCompetitors: "KwCompetitors";
    ReferralsIncomingTraffic: "IncomingTraffic";
    ReferralsOutgoingTraffic: "OutgoingTraffic";
    DisplayTrafficOverview: "Overview";
    DisplayTrafficPublishers: "Publishers";
    DisplayTrafficUserAcquisition: "UserAcquisition";
    DisplayTrafficCreatives: "Creatives";
    DisplayTrafficVideos: "Videos";
    SocialTraffic: "SocialOverview";
    ContentSubdomains: "Subdomains";
    ContentFolders: "Folders";
    ContentPages: "Pages";
    AdMonetization: "Advertisers";
    AdNetwork: "AdNetwork";
    WebsiteMoreCountries: "MoreCountries";
    WebsiteMoreReferrals: "MoreReferrals";
    WebsiteMoreSearchTerms: "MoreSearchTerms";
    WebsiteMorePublishers: "MorePublishers";
    WebsiteMoreOutgoingLinks: "MoreOutgoingLinks";
    WebsiteMoreOutgoingAds: "MoreOutgoingAds";
}

export const WebsiteAnalysisUnlockModalConfig = (): {
    [D in keyof IWebAnalysisUnlockModalTypes]: IModalConfig<D>;
} => ({
    WebsiteAnalysis: {
        slides: {
            WebsitePerformance: {
                img: AssetsService.assetUrl("/images/unlock-modal/website-performance.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/website-performance-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.website_analysis.title")}/${i18nFilter()(
                    "hook_unlock.website_performance.title",
                )}`,
                title: i18nFilter()("hook_unlock.website_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.website_performance.title"),
                text: i18nFilter()("hook_unlock.website_performance.text"),
            },
            CompetitiveLandscape: {
                img: AssetsService.assetUrl("/images/unlock-modal/competitive-landscape.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/competitive-landscape-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.website_analysis.title")}/${i18nFilter()(
                    "hook_unlock.competitive_landscape.title",
                )}`,
                title: i18nFilter()("hook_unlock.website_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.competitive_landscape.title"),
                text: i18nFilter()("hook_unlock.competitive_landscape.text"),
            },
            WebsiteTechnologies: {
                img: AssetsService.assetUrl("/images/unlock-modal/website-technologies.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/website-technologies-2x.png"),
                title: i18nFilter()("hook_unlock.website_technologies.title"),
                trackId: `${i18nFilter()("hook_unlock.website_analysis.title")}/${i18nFilter()(
                    "hook_unlock.website_technologies.title",
                )}`,
                subtitle: i18nFilter()("hook_unlock.website_technologies.subtitle"),
                text: i18nFilter()("hook_unlock.website_technologies.text"),
            },
            TrafficAndEngagement: {
                img: AssetsService.assetUrl("/images/unlock-modal/traffic-engagement.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/traffic-engagement-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.website_analysis.title")}/${i18nFilter()(
                    "hook_unlock.traffic_engagement.title",
                )}`,
                title: i18nFilter()("hook_unlock.website_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.traffic_engagement.title"),
                text: i18nFilter()("hook_unlock.traffic_engagement.text"),
            },
            MarketingChannels: {
                img: AssetsService.assetUrl("/images/unlock-modal/marketing-channels.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/marketing-channels-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.website_analysis.title")}/${i18nFilter()(
                    "hook_unlock.marketing_channels.title",
                )}`,
                title: i18nFilter()("hook_unlock.website_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.marketing_channels.title"),
                text: i18nFilter()("hook_unlock.marketing_channels.text"),
            },
            Geography: {
                img: AssetsService.assetUrl("/images/unlock-modal/audience-geography.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/audience-geography-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.website_analysis.title")}/${i18nFilter()(
                    "hook_unlock.audience_geography.title",
                )}`,
                title: i18nFilter()("hook_unlock.website_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.audience_geography.title"),
                text: i18nFilter()("hook_unlock.audience_geography.text"),
            },
            Keywords: {
                img: AssetsService.assetUrl("/images/unlock-modal/keywords.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/keywords-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.website_analysis.title")}/${i18nFilter()(
                    "hook_unlock.keywords.title",
                )}`,
                title: i18nFilter()("hook_unlock.website_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.keywords.title"),
                text: i18nFilter()("hook_unlock.keywords.text"),
            },
            Publishers: {
                img: AssetsService.assetUrl("/images/unlock-modal/display-traffic-publishers.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/display-traffic-publishers-2x.jpg",
                ),
                trackId: `${i18nFilter()("hook_unlock.website_analysis.title")}/${i18nFilter()(
                    "hook_unlock.display_traffic.publishers.title1",
                )}`,
                title: i18nFilter()("hook_unlock.website_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.display_traffic.publishers.title1"),
                text: i18nFilter()("hook_unlock.display_traffic.publishers.text"),
            },
            Pages: {
                img: AssetsService.assetUrl("/images/unlock-modal/content-pages.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/content-pages-2x.jpg"),
                trackId: `${i18nFilter()("hook_unlock.website_analysis.title")}/${i18nFilter()(
                    "hook_unlock.website_analysis.title",
                )}`,
                title: i18nFilter()("hook_unlock.website_analysis.title"),
                subtitle: i18nFilter()("hook_unlock.content_pages.title"),
                text: i18nFilter()("hook_unlock.content_pages.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.website_analysis.cta_text"),
        label: "Website Analysis",
    },
    WebsitePerformance: {
        slides: {
            WebsitePerformance: {
                img: AssetsService.assetUrl("/images/unlock-modal/website-performance.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/website-performance-2x.jpg"),
                title: i18nFilter()("hook_unlock.website_performance.title"),
                subtitle: i18nFilter()("hook_unlock.website_performance.subtitle"),
                text: i18nFilter()("hook_unlock.website_performance.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.website_analysis.cta_text"),
        label: "Website Performance",
    },
    CompetitiveLandscape: {
        slides: {
            CompetitiveLandscape: {
                img: AssetsService.assetUrl("/images/unlock-modal/competitive-landscape.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/competitive-landscape-2x.jpg"),
                title: i18nFilter()("hook_unlock.competitive_landscape.title"),
                subtitle: i18nFilter()("hook_unlock.competitive_landscape.subtitle"),
                text: i18nFilter()("hook_unlock.competitive_landscape.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.website_analysis.cta_text"),
        label: "Competitive Landscape",
    },
    WebsiteTechnologies: {
        slides: {
            WebsiteTechnologies: {
                img: AssetsService.assetUrl("/images/unlock-modal/website-technologies.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/website-technologies-2x.png"),
                title: i18nFilter()("hook_unlock.website_technologies.title"),
                subtitle: i18nFilter()("hook_unlock.website_technologies.subtitle"),
                text: i18nFilter()("hook_unlock.website_technologies.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.website_technologies.cta_text"),
        label: "Website Technologies",
    },
    TrafficAndEngagement: {
        slides: {
            TrafficAndEngagement: {
                img: AssetsService.assetUrl("/images/unlock-modal/traffic-engagement.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/traffic-engagement-2x.jpg"),
                title: i18nFilter()("hook_unlock.traffic_engagement.title"),
                subtitle: i18nFilter()("hook_unlock.traffic_engagement.subtitle"),
                text: i18nFilter()("hook_unlock.traffic_engagement.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.traffic.cta_text"),
        label: "Traffic And Engagement",
    },
    MarketingChannels: {
        slides: {
            MarketingChannels: {
                img: AssetsService.assetUrl("/images/unlock-modal/marketing-channels.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/marketing-channels-2x.jpg"),
                title: i18nFilter()("hook_unlock.marketing_channels.title"),
                subtitle: i18nFilter()("hook_unlock.marketing_channels.subtitle"),
                text: i18nFilter()("hook_unlock.marketing_channels.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.traffic.cta_text"),
        label: "Marketing Channels",
    },
    AudienceGeography: {
        slides: {
            Geography: {
                img: AssetsService.assetUrl("/images/unlock-modal/audience-geography.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/audience-geography-2x.jpg"),
                title: i18nFilter()("hook_unlock.audience_geography.title"),
                subtitle: i18nFilter()("hook_unlock.audience_geography.subtitle"),
                text: i18nFilter()("hook_unlock.audience_geography.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.audience.cta_text"),
        label: "Audience/Geography",
    },
    AudienceDemography: {
        slides: {
            Demography: {
                img: AssetsService.assetUrl("/images/unlock-modal/audience-demographics.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/audience-demographics-2x.jpg"),
                title: i18nFilter()("hook_unlock.audience_demographics.title"),
                subtitle: i18nFilter()("hook_unlock.audience_demographics.subtitle"),
                text: i18nFilter()("hook_unlock.audience_demographics.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.audience.cta_text"),
        label: "Audience",
    },
    AudienceOverlap: {
        slides: {
            AudienceOverlap: {
                img: AssetsService.assetUrl("/images/unlock-modal/overlap-wa.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/overlap-wa@2x.png"),
                trackId: `${i18nFilter()("hook_unlock.website_analysis.title")}/${i18nFilter()(
                    "hook_unlock.website_audience_overlap.title",
                )}`,
                title: i18nFilter()("hook_unlock.website_audience_overlap.title"),
                subtitle: i18nFilter()("hook_unlock.website_audience_overlap.subtitle"),
                text: i18nFilter()("hook_unlock.website_audience_overlap.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.audience.cta_text"),
        label: "Audience",
    },
    NewVsReturning: {
        slides: {
            NewVsReturning: {
                img: AssetsService.assetUrl("/images/unlock-modal/new-vs-returning-wa.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/new-vs-returning-wa@2x.png"),
                trackId: `${i18nFilter()("hook_unlock.website_analysis.title")}/${i18nFilter()(
                    "hook_unlock.website_new_vs_returning.title",
                )}`,
                title: i18nFilter()("hook_unlock.website_new_vs_returning.title"),
                subtitle: i18nFilter()("hook_unlock.website_new_vs_returning.subtitle"),
                text: i18nFilter()("hook_unlock.website_new_vs_returning.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.audience.cta_text"),
        label: "New vs Returning",
    },
    AudienceInterest: {
        slides: {
            AudienceInterest: {
                img: AssetsService.assetUrl("/images/unlock-modal/audience-interests.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/audience-interests-2x.jpg"),
                title: i18nFilter()("hook_unlock.audience_interests.title"),
                subtitle: i18nFilter()("hook_unlock.audience_interests.subtitle"),
                text: i18nFilter()("hook_unlock.audience_interests.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.audience.cta_text"),
        label: "Audience Interest",
    },
    SearchOverview: {
        slides: {
            SearchOverview: {
                img: AssetsService.assetUrl("/images/unlock-modal/search-overview.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/search-overview-2x.png"),
                title: i18nFilter()("hook_unlock.search_overview.title"),
                subtitle: i18nFilter()("hook_unlock.search_overview.subtitle"),
                text: i18nFilter()("hook_unlock.search_overview.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.search_traffic.cta_text"),
        label: "Search Traffic/Overview",
    },
    SearchKeywords: {
        slides: {
            Keywords: {
                img: AssetsService.assetUrl("/images/unlock-modal/keywords.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/keywords-2x.jpg"),
                title: i18nFilter()("hook_unlock.keywords.title"),
                subtitle: i18nFilter()("hook_unlock.keywords.subtitle"),
                text: i18nFilter()("hook_unlock.keywords.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.search_traffic.cta_text"),
        label: "Search Traffic/Keywords",
    },
    SearchPhrases: {
        slides: {
            SearchPhrases: {
                img: AssetsService.assetUrl("/images/unlock-modal/search-phrases.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/search-phrases-2x.jpg"),
                title: i18nFilter()("hook_unlock.search_phrases.title"),
                subtitle: i18nFilter()("hook_unlock.search_phrases.subtitle"),
                text: i18nFilter()("hook_unlock.search_phrases.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.search_traffic.cta_text"),
        label: "Search Traffic/Phrases",
    },
    OrganicLandingPages: {
        slides: {
            OrganicLandingPages: {
                img: AssetsService.assetUrl("/images/unlock-modal/organic-landing-pages.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/organic-landing-pages-2x.png"),
                title: i18nFilter()("hook_unlock.organic_landing_pages.title"),
                subtitle: i18nFilter()("hook_unlock.organic_landing_pages.subtitle"),
                text: i18nFilter()("hook_unlock.organic_landing_pages.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.organic_landing_pages.cta_text"),
        label: "Organic Landing Pages",
    },
    SearchAds: {
        slides: {
            SearchAds: {
                img: AssetsService.assetUrl("/images/unlock-modal/search-ads.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/search-ads-2x.png"),
                title: i18nFilter()("hook_unlock.search_ads.title"),
                subtitle: i18nFilter()("hook_unlock.search_ads.subtitle"),
                text: i18nFilter()("hook_unlock.search_ads.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.search_traffic.cta_text"),
        label: "Search Traffic/Ads",
    },
    SearchPLAs: {
        slides: {
            SearchPLAs: {
                img: AssetsService.assetUrl("/images/unlock-modal/search-plas.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/search-plas-2x.png"),
                title: i18nFilter()("hook_unlock.search_plas.title"),
                subtitle: i18nFilter()("hook_unlock.search_plas.subtitle"),
                text: i18nFilter()("hook_unlock.search_plas.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.search_traffic.cta_text"),
        label: "Search Traffic/Product Ads",
    },
    SearchKwCompetitors: {
        slides: {
            KwCompetitors: {
                img: AssetsService.assetUrl("/images/unlock-modal/kw-competitors.png"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/kw-competitors-2x.png"),
                title: i18nFilter()("hook_unlock.kw_competitors.title"),
                subtitle: i18nFilter()("hook_unlock.kw_competitors.subtitle"),
                text: i18nFilter()("hook_unlock.kw_competitors.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.search_traffic.cta_text"),
        label: "Search Traffic/Kw Competitors",
    },
    ReferralsIncomingTraffic: {
        slides: {
            IncomingTraffic: {
                img: AssetsService.assetUrl("/images/unlock-modal/referral-incoming-traffic.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/referral-incoming-traffic-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.referral_incoming_traffic.title"),
                subtitle: i18nFilter()("hook_unlock.referral_incoming_traffic.subtitle"),
                text: i18nFilter()("hook_unlock.referral_incoming_traffic.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.referral_traffic.cta_text"),
        label: "Referrals/Incoming Traffic",
    },
    ReferralsOutgoingTraffic: {
        slides: {
            OutgoingTraffic: {
                img: AssetsService.assetUrl("/images/unlock-modal/referral-outgoing-traffic.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/referral-outgoing-traffic-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.referral_outgoing_traffic.title"),
                subtitle: i18nFilter()("hook_unlock.referral_outgoing_traffic.subtitle"),
                text: i18nFilter()("hook_unlock.referral_outgoing_traffic.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.referral_traffic.cta_text"),
        label: "Referrals/Outgoing Traffic",
    },
    DisplayTrafficOverview: {
        slides: {
            Overview: {
                img: AssetsService.assetUrl("/images/unlock-modal/display-overview.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/display-overview-2x.jpg"),
                title: i18nFilter()("hook_unlock.display_overview.title1"),
                subtitle: i18nFilter()("hook_unlock.display_traffic.overview.subtitle1"),
                text: i18nFilter()("hook_unlock.display_traffic.overview.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.display_traffic.cta_text"),
        label: "Display Traffic",
    },
    DisplayTrafficPublishers: {
        slides: {
            Publishers: {
                img: AssetsService.assetUrl("/images/unlock-modal/display-traffic-publishers.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/display-traffic-publishers-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.display_traffic_publishers.title1"),
                subtitle: i18nFilter()("hook_unlock.display_traffic.publishers.subtitle1"),
                text: i18nFilter()("hook_unlock.display_traffic.publishers.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.display_traffic.cta_text"),
        label: "Display Traffic",
    },
    DisplayTrafficUserAcquisition: {
        slides: {
            UserAcquisition: {
                img: AssetsService.assetUrl(
                    "/images/unlock-modal/display-traffic-user-acquisition.jpg",
                ),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/display-traffic-user-acquisition-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.display_traffic_user_acquisition.title1"),
                subtitle: i18nFilter()("hook_unlock.display_traffic.user_acquisition.subtitle1"),
                text: i18nFilter()("hook_unlock.display_traffic.user_acquisition.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.display_traffic.cta_text"),
        label: "Display Traffic",
    },
    DisplayTrafficCreatives: {
        slides: {
            Creatives: {
                img: AssetsService.assetUrl("/images/unlock-modal/display-traffic-creatives.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/display-traffic-creatives-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.display_traffic_creatives.title1"),
                subtitle: i18nFilter()("hook_unlock.display_traffic.creatives.subtitle1"),
                text: i18nFilter()("hook_unlock.display_traffic.creatives.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.display_traffic.cta_text"),
        label: "Display Traffic",
    },
    DisplayTrafficVideos: {
        slides: {
            Videos: {
                img: AssetsService.assetUrl("/images/unlock-modal/display-traffic-videos.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/display-traffic-videos-2x.jpg"),
                title: i18nFilter()("hook_unlock.display_traffic_videos.title1"),
                subtitle: i18nFilter()("hook_unlock.display_traffic.videos.subtitle1"),
                text: i18nFilter()("hook_unlock.display_traffic.videos.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.display_traffic.cta_text"),
        label: "Display Traffic",
    },
    SocialTraffic: {
        slides: {
            SocialOverview: {
                img: AssetsService.assetUrl("/images/unlock-modal/social-overview.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/social-overview-2x.jpg"),
                title: i18nFilter()("hook_unlock.social_overview.title"),
                subtitle: i18nFilter()("hook_unlock.social_overview.subtitle"),
                text: i18nFilter()("hook_unlock.social_overview.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.social_overview.cta_text"),
        label: "Social Traffic",
    },
    ContentSubdomains: {
        slides: {
            Subdomains: {
                img: AssetsService.assetUrl("/images/unlock-modal/content-subdomains.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/content-subdomains-2x.jpg"),
                title: i18nFilter()("hook_unlock.content_subdomains.title"),
                subtitle: i18nFilter()("hook_unlock.content_subdomains.subtitle"),
                text: i18nFilter()("hook_unlock.content_subdomains.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.content.cta_text"),
        label: "Content Subdomains",
    },
    ContentFolders: {
        slides: {
            Folders: {
                img: AssetsService.assetUrl("/images/unlock-modal/content-folders.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/content-folders-2x.jpg"),
                title: i18nFilter()("hook_unlock.content_folders.title"),
                subtitle: i18nFilter()("hook_unlock.content_folders.subtitle"),
                text: i18nFilter()("hook_unlock.content_folders.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.content.cta_text"),
        label: "Content Folders",
    },
    ContentPages: {
        slides: {
            Pages: {
                img: AssetsService.assetUrl("/images/unlock-modal/content-pages.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/content-pages-2x.jpg"),
                title: i18nFilter()("hook_unlock.content_pages.title"),
                subtitle: i18nFilter()("hook_unlock.content_pages.subtitle"),
                text: i18nFilter()("hook_unlock.content_pages.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.content.cta_text"),
        label: "Content Pages",
    },
    AdMonetization: {
        slides: {
            Advertisers: {
                img: AssetsService.assetUrl("/images/unlock-modal/advertisers.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/advertisers-2x.jpg"),
                title: i18nFilter()("hook_unlock.ads.advertisers.title"),
                subtitle: i18nFilter()("hook_unlock.ads.advertisers.subtitle"),
                text: i18nFilter()("hook_unlock.ads.advertisers.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.ads.cta_text"),
        label: "Ad Monetization",
    },
    AdNetwork: {
        slides: {
            AdNetwork: {
                img: AssetsService.assetUrl("/images/unlock-modal/ad-network.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/ad-network-2x.jpg"),
                title: i18nFilter()("hook_unlock.ads.ad_network.title"),
                subtitle: i18nFilter()("hook_unlock.ads.ad_network.subtitle"),
                text: i18nFilter()("hook_unlock.ads.ad_network.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.ads.cta_text"),
        label: "Ad Network",
    },
    WebsiteMoreCountries: {
        slides: {
            MoreCountries: {
                img: AssetsService.assetUrl("/images/unlock-modal/website-more-countries.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/website-more-countries-2x.jpg"),
                title: i18nFilter()("hook_unlock.website_performance.more_countries.title"),
                subtitle: i18nFilter()("hook_unlock.website_performance.more_countries.subtitle"),
                text: i18nFilter()("hook_unlock.website_performance.more_countries.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.website_performance.cta_text"),
        label: "Website Performance Hook/More Countries",
    },
    WebsiteMoreReferrals: {
        slides: {
            MoreReferrals: {
                img: AssetsService.assetUrl("/images/unlock-modal/website-more-referrals.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/website-more-referrals-2x.jpg"),
                title: i18nFilter()("hook_unlock.website_performance.more_referrals.title"),
                subtitle: i18nFilter()("hook_unlock.website_performance.more_referrals.subtitle"),
                text: i18nFilter()("hook_unlock.website_performance.more_referrals.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.website_performance.cta_text"),
        label: "Website Performance Hook/More Referrals",
    },
    WebsiteMoreSearchTerms: {
        slides: {
            MoreSearchTerms: {
                img: AssetsService.assetUrl("/images/unlock-modal/website-more-search-terms.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/website-more-search-terms-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.website_performance.more_search_terms.title"),
                subtitle: i18nFilter()(
                    "hook_unlock.website_performance.more_search_terms.subtitle",
                ),
                text: i18nFilter()("hook_unlock.website_performance.more_search_terms.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.website_performance.cta_text"),
        label: "Website Performance Hook/More Search Terms",
    },
    WebsiteMorePublishers: {
        slides: {
            MorePublishers: {
                img: AssetsService.assetUrl("/images/unlock-modal/website-more-publishers.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/website-more-publishers-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.website_performance.more_publishers.title"),
                subtitle: i18nFilter()("hook_unlock.website_performance.more_publishers.subtitle"),
                text: i18nFilter()("hook_unlock.website_performance.more_publishers.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.website_performance.cta_text"),
        label: "Website Performance Hook/More Publishers",
    },
    WebsiteMoreOutgoingLinks: {
        slides: {
            MoreOutgoingLinks: {
                img: AssetsService.assetUrl("/images/unlock-modal/website-more-outgoing-links.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/website-more-outgoing-links-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.website_performance.more_outgoing_links.title"),
                subtitle: i18nFilter()(
                    "hook_unlock.website_performance.more_outgoing_links.subtitle",
                ),
                text: i18nFilter()("hook_unlock.website_performance.more_outgoing_links.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.website_performance.cta_text"),
        label: "Website Performance Hook/More Outgoing Links",
    },
    WebsiteMoreOutgoingAds: {
        slides: {
            MoreOutgoingAds: {
                img: AssetsService.assetUrl("/images/unlock-modal/website-more-outgoing-ads.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/website-more-outgoing-ads.jpg"),
                title: i18nFilter()("hook_unlock.website_performance.more_outgoing_ads.title"),
                subtitle: i18nFilter()(
                    "hook_unlock.website_performance.more_outgoing_ads.subtitle",
                ),
                text: i18nFilter()("hook_unlock.website_performance.more_outgoing_ads.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.website_performance.cta_text"),
        label: "Website Performance Hook/More Outgong Ads",
    },
});
