import {
    IUnlockModalConfigTypes,
    UnlockModalConfigType,
} from "../../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";

export const HOOKS_V2_MODAL_ID = "FeaturePresentation" as const;

export interface IFeaturePresentationHookInfo {
    modal: typeof HOOKS_V2_MODAL_ID;
    slide: string;
}

interface IHookInfo {
    modal: UnlockModalConfigType;
    slide?: IUnlockModalConfigTypes[UnlockModalConfigType];
}

export interface IWsConfig {
    unlockHook: IHookInfo | IFeaturePresentationHookInfo;
    wsComponent: string;
}

export const getWsConfigFromState = (state, params): IWsConfig => {
    switch (state.name) {
        /* -- hooks 2.0 start -- */
        case "companyresearch_website_audienceInterests":
            return {
                wsComponent: "WsWebAudienceInterests",
                unlockHook: {
                    modal: HOOKS_V2_MODAL_ID,
                    slide: "WebAudienceInterestsFeature", // TODO: maybe the other way around (AudienceLoyaltyFeature)
                },
            };
        case "marketresearch_webmarketanalysis_loyalty":
            return {
                wsComponent: "IndustryAnalysisAudienceLoyalty",
                unlockHook: {
                    modal: HOOKS_V2_MODAL_ID,
                    slide: "AudienceLoyaltyFeature", // TODO: maybe the other way around (WebAudienceInterestsFeature)
                },
            };
        case "companyresearch_app_appinterests":
            return {
                wsComponent: "WsAppInterests",
                unlockHook: {
                    modal: HOOKS_V2_MODAL_ID,
                    slide: "AppInterestsFeature",
                },
            };
        case "competitiveanalysis_website_overview_marketingchannels":
        case "companyresearch_website_marketingchannels":
            return {
                wsComponent: "WsWebTrafficChannels",
                unlockHook: {
                    modal: HOOKS_V2_MODAL_ID,
                    slide: "WebTrafficChannelsFeature",
                },
            };
        case "keywordAnalysis_total":
            return {
                wsComponent: "KeywordAnalysisTotal",
                unlockHook: {
                    modal: HOOKS_V2_MODAL_ID,
                    slide: "TopicMarketAnalysisHomepage",
                },
            };
        case "keywordAnalysis-overview":
            return {
                wsComponent: "KeywordAnalysisOP",
                unlockHook: {
                    modal: HOOKS_V2_MODAL_ID,
                    slide: "KeywordAnalysis",
                },
            };
        case "companyresearch_website_folders":
            return {
                wsComponent: "WsWebContentFolders",
                unlockHook: {
                    modal: HOOKS_V2_MODAL_ID,
                    slide: "WebContentFoldersFeature",
                },
            };
        case "marketresearch_keywordmarketanalysis_home":
            return {
                wsComponent: "TopicMarketAnalysisHome",
                unlockHook: {
                    modal: "SearchKeywordAnalysis",
                    slide: "Organic",
                },
            };
        /* -- hooks 2.0 end -- */
        case "companyresearch_website_audienceOverlap":
            return {
                wsComponent: "WebAudienceOverlap",
                unlockHook: {
                    modal: "AudienceOverlap",
                    slide: "AudienceOverlap",
                },
            };
        case "websites-audienceOverlap":
            return {
                wsComponent: "WebAudienceOverlap",
                unlockHook: {
                    modal: "AudienceOverlap",
                    slide: "AudienceOverlap",
                },
            };
        // Web Analysis
        case "competitiveanalysis_website_overview_websiteperformance":
        case "proModules":
        case "websites_root-home":
        case "websites-worldwideOverview":
        case "affiliateanalysis_performanceoverview":
        case "analyzepublishers_performanceoverview":
        case "marketresearch-home":
        case "companyresearch_website_websiteperformance":
        case "accountreview_website_overview_websiteperformance":
            return {
                wsComponent: "WsWebOverview",
                unlockHook: {
                    modal: "WebsitePerformance",
                    slide: "WebsitePerformance",
                },
            };
        case "websites-similarsites":
        case "companyresearch_website_competitivelandscape":
        case "accountreview_website_competitivelandscape":
            return {
                wsComponent: "WsWebCompetitors",
                unlockHook: {
                    modal: "CompetitiveLandscape",
                    slide: "CompetitiveLandscape",
                },
            };
        case "websites-technographicsOverview":
        case "competitiveanalysis_websites_technographicsOverview":
        case "accountreview_website_technologies":
            return {
                wsComponent: "WsWebTechnographics",
                unlockHook: {
                    modal: "WebsiteTechnologies",
                    slide: "WebsiteTechnologies",
                },
            };
        case "websites-audienceOverview":
        case "companyresearch_website_trafficandengagement":
        case "accountreview_website_trafficandengagement":
            return {
                wsComponent: "WsWebTrafficAndEngagement",
                unlockHook: {
                    modal: "TrafficAndEngagement",
                    slide: "TrafficAndEngagement",
                },
            };
        case "companyresearch_website_new_vs_returning":
            return {
                wsComponent: "WebNewVsReturning",
                unlockHook: {
                    modal: "NewVsReturning",
                    slide: "NewVsReturning",
                },
            };
        case "websites-newVsReturning":
            return {
                wsComponent: "WebNewVsReturning",
                unlockHook: {
                    modal: "NewVsReturning",
                    slide: "NewVsReturning",
                },
            };
        case "websites-trafficOverview":
        case "accountreview_website_marketingchannels":
            return {
                wsComponent: "WsWebTrafficChannels",
                unlockHook: {
                    modal: "MarketingChannels",
                    slide: "MarketingChannels",
                },
            };
        case "websites-audienceGeography":
        case "companyresearch_website_geography":
        case "accountreview_website_audience_geography":
            return {
                wsComponent: "WsWebGeography",
                unlockHook: {
                    modal: "AudienceGeography",
                    slide: "Geography",
                },
            };
        case "websites-audienceDemographics":
        case "companyresearch_website_demographics":
        case "accountreview_website_audience_demographics":
            return {
                wsComponent: "WsWebDemographics",
                unlockHook: {
                    modal: "AudienceDemography",
                    slide: "Demography",
                },
            };
        case "websites-audienceInterests":
        case "accountreview_website_audience_interests":
            return {
                wsComponent: "WsWebAudienceInterests",
                unlockHook: {
                    modal: "AudienceInterest",
                    slide: "AudienceInterest",
                },
            };
        case "websites-trafficSearch-keywords":
        case "competitiveanalysis_website_search_keyword":
        case "accountreview_website_search_keyword":
            return {
                wsComponent: "WsWebSearchKeywords",
                unlockHook: {
                    modal: "SearchKeywords",
                    slide: "Keywords",
                },
            };
        case "websites-trafficSearch-phrases":
        case "competitiveanalysis_website_search_phrases":
        case "accountreview_website_search_phrases":
            return {
                wsComponent: "WsWebSearchPhrases",
                unlockHook: {
                    modal: "SearchPhrases",
                    slide: "SearchPhrases",
                },
            };
        case "websites-trafficSearch-ads":
        case "competitiveanalysis_website_search_ads":
        case "accountreview_website_search_ads":
            return {
                wsComponent: "WsWebSearchAds",
                unlockHook: {
                    modal: "SearchAds",
                    slide: "SearchAds",
                },
            };
        case "websites-trafficSearch-plaResearch":
        case "competitiveanalysis_website_search_plaresearch":
        case "accountreview_website_search_plaResearch":
            return {
                wsComponent: "WsWebSearchAds",
                unlockHook: {
                    modal: "SearchPLAs",
                    slide: "SearchPLAs",
                },
            };
        case "findkeywords_bycompetition":
            return {
                wsComponent: "WsWebSearchKeywords",
                unlockHook: {
                    modal: "SearchKeywords",
                    slide: "Keywords",
                },
            };
        case "websites-trafficSearch":
        case "websites-trafficSearch-overview":
        case "competitiveanalysis_website_search":
        case "accountreview_website_search_overview":
            return {
                wsComponent: "WsWebSearchOverview",
                unlockHook: {
                    modal: "SearchOverview",
                    slide: "SearchOverview",
                },
            };
        case "findSearchTextAds_bycompetitor":
            return {
                wsComponent: "WsWebSearchAds",
                unlockHook: {
                    modal: "SearchAds",
                    slide: "SearchAds",
                },
            };
        case "findProductListingAds_bycompetitor":
            return {
                wsComponent: "WsWebSearchAds",
                unlockHook: {
                    modal: "SearchPLAs",
                    slide: "SearchPLAs",
                },
            };
        case "findkeywords_bycompetition":
            return {
                wsComponent: "WsWebSearchKeywords",
                unlockHook: {
                    modal: "SearchKeywords",
                    slide: "Keywords",
                },
            };
        case "websites-trafficSearch":
            switch (getTabName(params).toLowerCase()) {
                case "keywords":
                    return {
                        wsComponent: "WsWebSearchKeywords",
                        unlockHook: {
                            modal: "SearchKeywords",
                            slide: "Keywords",
                        },
                    };
                case "phrases":
                    return {
                        wsComponent: "WsWebSearchPhrases",
                        unlockHook: {
                            modal: "SearchPhrases",
                            slide: "SearchPhrases",
                        },
                    };
                case "ads":
                    return {
                        wsComponent: "WsWebSearchAds",
                        unlockHook: {
                            modal: "SearchAds",
                            slide: "SearchAds",
                        },
                    };
                case "plaresearch":
                    return {
                        wsComponent: "WsWebSearchAds",
                        unlockHook: {
                            modal: "SearchPLAs",
                            slide: "SearchPLAs",
                        },
                    };
                default:
                    return {
                        wsComponent: "WsWebSearchOverview",
                        unlockHook: {
                            modal: "SearchOverview",
                            slide: "SearchOverview",
                        },
                    };
            }

        case "websites-organicLandingPages":
        case "competitiveanalysis_website_organiclandingpages":
            return {
                wsComponent: "WebsiteOrganicLandingPages",
                unlockHook: {
                    modal: "OrganicLandingPages",
                    slide: "OrganicLandingPages",
                },
            };
        case "websites-competitorsOrganicKeywords":
        case "competitiveanalysis_website_search_organic_competitors":
        case "accountreview_website_search_organic_competitors":
            return {
                wsComponent: "WsWebOrganicSearchCompetitors",
                unlockHook: {
                    modal: "SearchKwCompetitors",
                    slide: "KwCompetitors",
                },
            };
        case "websites-competitorsPaidKeywords":
        case "competitiveanalysis_website_search_paid_competitors":
        case "accountreview_website_search_paid_competitors":
            return {
                wsComponent: "WsWebPaidSearchCompetitors",
                unlockHook: {
                    modal: "SearchKwCompetitors",
                    slide: "KwCompetitors",
                },
            };
        case "websites-trafficReferrals":
        case "competitiveanalysis_website_referrals_incomingtraffic":
        case "findaffiliates_bycompetition":
        case "accountreview_website_referrals_incomingtraffic":
            return {
                wsComponent: "WsWebReferralIncomingTraffic",
                unlockHook: {
                    modal: "ReferralsIncomingTraffic",
                    slide: "IncomingTraffic",
                },
            };
        case "websites-outgoing":
        case "affiliateanalysis_outgoinglinks":
        case "analyzepublishers_outgoinglinks":
        case "accountreview_website_outgoingtraffic":
            return {
                wsComponent: "WsWebReferralOutgoingTraffic",
                unlockHook: {
                    modal: "ReferralsOutgoingTraffic",
                    slide: "OutgoingTraffic",
                },
            };
        case "websites-trafficDisplay":
        case "findpublishers_bycompetition":
            switch (getTabName(params).toLowerCase()) {
                case "publishers":
                    return {
                        wsComponent: "WsWebDisplayTrafficPublishers",
                        unlockHook: {
                            modal: "DisplayTrafficPublishers",
                            slide: "Publishers",
                        },
                    };
                default:
                    return {
                        wsComponent: "WsWebDisplayTrafficOverview",
                        unlockHook: {
                            modal: "DisplayTrafficOverview",
                            slide: "Overview",
                        },
                    };
            }
        case "findDisplayAds_bycompetitor":
        case "websites-trafficDisplay-overview":
            return {
                wsComponent: "WsWebDisplayTrafficOverview",
                unlockHook: {
                    modal: "DisplayTrafficOverview",
                    slide: "Overview",
                },
            };
        case "websites.trafficDisplay.creatives":
            return {
                wsComponent: "WsWebDisplayTrafficAdCreatives",
                unlockHook: {
                    modal: "DisplayTrafficCreatives",
                    slide: "Creatives",
                },
            };
        case "findVideoAds_bycompetitor":
        case "websites-trafficDisplay-videos":
            return {
                wsComponent: "WsWebDisplayTrafficVideos",
                unlockHook: {
                    modal: "DisplayTrafficVideos",
                    slide: "Videos",
                },
            };
        case "findadnetworks_bycompetition":
        case "websites-trafficDisplay-adNetworks":
            return {
                wsComponent: "WsWebDisplayTrafficAdNetworks",
                unlockHook: {
                    modal: "DisplayTrafficUserAcquisition",
                    slide: "UserAcquisition",
                },
            };
        case "websites-trafficSocial":
        case "competitiveanalysis_website_social_overview":
            return {
                wsComponent: "WsWebSocialTrafficOverview",
                unlockHook: {
                    modal: "SocialTraffic",
                    slide: "SocialOverview",
                },
            };
        case "websites-subdomains":
        case "companyresearch_website_subdomains":
        case "accountreview_website_subdomains":
            return {
                wsComponent: "WsWebContentSubdomains",
                unlockHook: {
                    modal: "ContentSubdomains",
                    slide: "Subdomains",
                },
            };
        case "websites-folders":
            return {
                wsComponent: "WsWebContentFolders",
                unlockHook: {
                    modal: "ContentFolders",
                    slide: "Folders",
                },
            };
        case "websites-popular":
        case "companyresearch_website_popular":
            return {
                wsComponent: "WsWebContentPages",
                unlockHook: {
                    modal: "ContentPages",
                    slide: "Pages",
                },
            };
        case "websites-paidoutgoing":
        case "analyzepublishers_monitizationnetworks":
        case "analyzepublishers_advertisers":
        case "accountreview_website_paidoutgoing":
            switch (getTabName(params).toLowerCase()) {
                case "adnetworks":
                    return {
                        wsComponent: "WsWebMonetizationNetworks",
                        unlockHook: {
                            modal: "AdNetwork",
                            slide: "AdNetwork",
                        },
                    };
                default:
                    return {
                        wsComponent: "WsWebMonetizationAdvertisers",
                        unlockHook: {
                            modal: "AdMonetization",
                            slide: "Advertisers",
                        },
                    };
            }
        // Web Categories Analysis
        case "industryAnalysis-overview":
        case "industryAnalysis-root-homeDuplicate":
        case "marketresearch_webmarketanalysis_overview":
            return {
                wsComponent: "WsWebCategoryPerformance",
                unlockHook: {
                    modal: "CategoryPerformance",
                    slide: "CategoryPerformance",
                },
            };
        case "industryAnalysis-categoryShare":
        case "marketresearch_webmarketanalysis_trends":
            return {
                wsComponent: "WsWebCategoryShare",
                unlockHook: {
                    modal: "CategoryShare",
                    slide: "CategoryShare",
                },
            };
        case "industryAnalysis-trafficSources":
        case "findaffiliates_byindustry":
        case "findpublishers_byindustry":
        case "findadnetworks_byindustry":
            return {
                wsComponent: "WsWebCategoryTrafficChannels",
                unlockHook: {
                    modal: "CategoryTrafficChannels",
                    slide: "TrafficChannels",
                },
            };
        case "industryAnalysis-geo":
        case "marketresearch_webmarketanalysis_geography":
            return {
                wsComponent: "WsWebCategoryGeo",
                unlockHook: {
                    modal: "CategoryGeo",
                    slide: "Geo",
                },
            };
        case "industryAnalysis-loyalty":
            return {
                wsComponent: "IndustryAnalysisAudienceLoyalty",
                unlockHook: {
                    modal: "CategoryLoyalty",
                    slide: "Loyalty",
                },
            };
        case "industryAnalysis-demographics":
        case "marketresearch_webmarketanalysis_demographics":
            return {
                wsComponent: "WsCategoryDemographics",
                unlockHook: {
                    modal: "CategoryDemographics",
                    slide: "Demographics",
                },
            };
        case "industryAnalysis-outgoingLinks":
            return {
                wsComponent: "WsWebCategoryOutboundTraffic",
                unlockHook: {
                    modal: "CategoryOutboundTraffic",
                    slide: "OutboundTraffic",
                },
            };
        case "industryAnalysis-topSites":
        case "marketresearch_webmarketanalysis_mapping":
            return {
                wsComponent: "WsWebCategoryTopSites",
                unlockHook: {
                    modal: "CategoryTopWebsites",
                    slide: "TopWebsites",
                },
            };
        case "industryAnalysis-categoryLeaders":
        case "marketresearch_webmarketanalysis_rankings":
            switch (getTabName(params)) {
                case "CategoryLeadersSocial":
                    return {
                        wsComponent: "WsWebCategorySocialLeaders",
                        unlockHook: {
                            modal: "CategorySocialLeaders",
                            slide: "SocialLeaders",
                        },
                    };
                case "CategoryLeadersAds":
                    return {
                        wsComponent: "WsWebCategoryDisplayLeaders",
                        unlockHook: {
                            modal: "CategoryDisplayLeaders",
                            slide: "DisplayLeaders",
                        },
                    };
                case "CategoryLeadersReferrals":
                    return {
                        wsComponent: "WsWebCategoryReferralLeaders",
                        unlockHook: {
                            modal: "CategoryReferralLeaders",
                            slide: "ReferralLeaders",
                        },
                    };
                case "CategoryLeadersDirect":
                    return {
                        wsComponent: "WsWebCategoryDirectLeaders",
                        unlockHook: {
                            modal: "CategoryDirectLeaders",
                            slide: "DirectLeaders",
                        },
                    };
                case "CategoryLeadersMail":
                    return {
                        wsComponent: "WsWebCategoryEmailLeaders",
                        unlockHook: {
                            modal: "CategoryEmailLeaders",
                            slide: "EmailLeaders",
                        },
                    };
                default:
                    return {
                        wsComponent: "WsWebCategorySearchLeaders",
                        unlockHook: {
                            modal: "CategorySearchLeaders",
                            slide: "SearchLeaders",
                        },
                    };
            }
        case "industryAnalysis-topKeywords":
        case "findkeywords_byindustry":
            return {
                wsComponent: "WsTopKeywords",
                unlockHook: {
                    modal: "IASearch",
                    slide: "TopKeywords",
                },
            };
        // Web Keywords Analysis
        case "keywordAnalysis-home":
        case "keywordAnalysis-unauthorized":
        case "keywordAnalysis-organic":
        case "keywordAnalysis_organic":
            return {
                wsComponent: "WsOrganicKeywords",
                unlockHook: {
                    modal: "WebKeywordsOrganic",
                    slide: "Organic",
                },
            };
        case "keywordAnalysis-paid":
        case "keywordAnalysis_paid":
            return {
                wsComponent: "WsPaidKeywords",
                unlockHook: {
                    modal: "WebKeywordsPaid",
                    slide: "Paid",
                },
            };
        case "keywordAnalysis-generator":
        case "findkeywords_keywordGeneratorTool":
        case "monitorkeywords":
            return {
                wsComponent: "KeywordsGenerator",
                unlockHook: {
                    modal: "KeywordsGenerator",
                    slide: "KeywordsGenerator",
                },
            };
        case "keywordAnalysis-ads":
        case "keywordAnalysis_ads":
        case "keywordAnalysis_plaResearch":
            return {
                wsComponent: "KeywordsAds",
                unlockHook: {
                    modal: "KeywordsAds",
                    slide: "KeywordsAds",
                },
            };
        case "findProductListingAds_bykeyword":
        case "keywordAnalysis-plaResearch":
            return {
                wsComponent: "KeywordsAds",
                unlockHook: {
                    modal: "KeywordsPLAs",
                    slide: "KeywordsPLAs",
                },
            };
        case "keywordAnalysis-geo":
        case "keywordAnalysis_geography":
            return {
                wsComponent: "WsKeywordsByGeo",
                unlockHook: {
                    modal: "KeywordsGeo",
                    slide: "KeywordsGeo",
                },
            };
        case "keywordAnalysis-unauthorizedMobile":
        case "keywordAnalysis-mobileweb":
        case "keywordAnalysis_mobileweb":
            return {
                wsComponent: "WsMobileKeywords",
                unlockHook: {
                    modal: "WebKeywordsMobile",
                    slide: "Mobile",
                },
            };
        // App Analysis
        case "apps-home":
        case "apps-performance":
        case "companyresearch_app_appperformance":
        case "salesIntelligence-apps-performance":
            return {
                wsComponent: "WsAppPerformance",
                unlockHook: {
                    modal: "AppAnalysisPerformance",
                    slide: "AppPerformance",
                },
            };
        case "apps-ranking":
        case "companyresearch_app_appranking":
        case "salesIntelligence-apps-ranking":
            return {
                wsComponent: "WsAppRanking",
                unlockHook: {
                    modal: "AppAnalysisRanking",
                    slide: "Ranking",
                },
            };
        case "apps-engagementoverview":
        case "companyresearch_app_appengagementoverview":
        case "salesIntelligence-apps-engagementoverview":
            return {
                wsComponent: "WsAppEngagement",
                unlockHook: {
                    modal: "AppAnalysisEngagement",
                    slide: "Engagement",
                },
            };
        case "apps-engagementretention":
        case "companyresearch_app_appretention":
            return {
                wsComponent: "WsAppRetention",
                unlockHook: {
                    modal: "AppAnalysisRetention",
                    slide: "Retention",
                },
            };
        case "apps-engagementusage":
        case "companyresearch_app_appusagepatterns":
            return {
                wsComponent: "WsAppUsagePatterns",
                unlockHook: {
                    modal: "AppAnalysisUsagePatterns",
                    slide: "UsagePatterns",
                },
            };
        case "apps-demographics":
        case "companyresearch_app_appdmg":
        case "salesIntelligence-apps-demographics":
            return {
                wsComponent: "WsAppDemographics",
                unlockHook: {
                    modal: "AppAnalysisDemographics",
                    slide: "Demographics",
                },
            };
        case "apps-appaudienceinterests":
        case "salesIntelligence-apps-appaudienceinterests":
            return {
                wsComponent: "WsAppInterests",
                unlockHook: {
                    modal: "AppAnalysisInterests",
                    slide: "Interests",
                },
            };
        case "apps.externaltraffic":
            return {
                wsComponent: "WsAppExternalTrafficChannels",
                unlockHook: {
                    modal: "ExternalTrafficChannels",
                    slide: "ExternalTrafficChannels",
                },
            };
        case "apps.websearch":
            return {
                wsComponent: "WsAppExternalSearchKeywords",
                unlockHook: {
                    modal: "ExternalSearchKeywords",
                    slide: "ExternalSearchKeywords",
                },
            };
        case "apps.instoretraffic":
            return {
                wsComponent: "WsAppStoreTrafficChannels",
                unlockHook: {
                    modal: "StoreTrafficChannels",
                    slide: "StoreTrafficChannels",
                },
            };
        case "apps.instoresearch":
            return {
                wsComponent: "WsAppStoreSearchKeywords",
                unlockHook: {
                    modal: "StoreSearchKeywords",
                    slide: "StoreSearchKeywords",
                },
            };
        // App Categories Analysis
        case "appcategory-leaderboard":
        case "marketresearch_appmarketanalysis_top":
            return {
                wsComponent: "WsTopApps",
                unlockHook: {
                    modal: "TopApps",
                    slide: "TopApps",
                },
            };
        case "appcategory-trends":
        case "marketresearch_appmarketanalysis_trending":
            return {
                wsComponent: "WsTrendingApps",
                unlockHook: {
                    modal: "TrendingApps",
                    slide: "TrendingApps",
                },
            };
        case "appcategory.topkeywords":
            return {
                wsComponent: "WsStoreTopKeywords",
                unlockHook: {
                    modal: "Store",
                    slide: "TopKeywords",
                },
            };
        // App Keywords Analysis
        case "keywords-home":
        case "keywords-analysis":
            return {
                wsComponent: "WsGooglePlayKeywords",
                unlockHook: {
                    modal: "AppKeywordsCompetitors",
                    slide: "Organic",
                },
            };
        // Dashboards
        case "dashboard":
        case "dashboard-new":
        case "dashboard-gallery":
            return {
                wsComponent: null,
                unlockHook: {
                    modal: "CustomDashboards",
                    slide: "CustomDashboards",
                },
            };
        // News Feed
        case "eventFeed":
            return {
                wsComponent: null,
                unlockHook: {
                    modal: "NewsFeed",
                    slide: "NewsFeed",
                },
            };
        // Lead Generator
        case "leadGenerator":
            return {
                wsComponent: null,
                unlockHook: {
                    modal: "LeadGenerator",
                    slide: "1",
                },
            };
        // Report Generator
        case "cig":
            return {
                wsComponent: null,
                unlockHook: {
                    modal: "CIG",
                    slide: "CIG",
                },
            };
        // Conversion module
        case "conversion":
            return {
                wsComponent: "Conversion",
                unlockHook: {
                    modal: "ConversionModule",
                    slide: "ConversionModule",
                },
            };
        case "conversion.home":
            return {
                wsComponent: "Conversion",
                unlockHook: {
                    modal: "ConversionModule",
                    slide: "ConversionModule",
                },
            };
        case "conversion-customgroup":
            return {
                wsComponent: "Conversion",
                unlockHook: {
                    modal: "ConversionCategoryOverview",
                    slide: "ConversionCategoryOverview",
                },
            };
        case "conversion.websiteoverview":
            return {
                wsComponent: "Conversion",
                unlockHook: {
                    modal: "ConversionWebsiteOverview",
                    slide: "ConversionWebsiteOverview",
                },
            };
        case "segments":
        case "segments-homepage":
        case "segments-analysis":
        case "segments-wizard":
        case "companyresearch_segments":
        case "companyresearch_segments-analysis":
        case "companyresearch_segments-wizard":
        case "companyresearch_segments-homepage":
            return {
                wsComponent: "CustomSegments",
                unlockHook: {
                    modal: "segments",
                    slide: "CustomSegmentsCommon",
                },
            };
        case "marketresearch_webmarketanalysis_home":
            return {
                wsComponent: "WebMarketAnalysisOverviewHome",
                unlockHook: {
                    modal: "WebCategoryAnalysis",
                    slide: "CategoryPerformance",
                },
            };
        case "marketresearch_appmarketanalysis_home":
            return {
                wsComponent: "AppMarketAnalysisHomepage",
                unlockHook: {
                    modal: "AppCategoryAnalysis",
                    slide: "TopApps",
                },
            };
        case "companyresearch_websiteanalysis_home":
            return {
                wsComponent: "WebCompanyAnalysisOverviewHome",
                unlockHook: {
                    modal: "WebsiteAnalysis",
                    slide: "WebsitePerformance",
                },
            };
        case "companyresearch_appanalysis_home":
        case "salesIntelligence-apps-home":
            return {
                wsComponent: "Solutions2AppAnalysisHome",
                unlockHook: {
                    modal: "AppAnalysis",
                    slide: "AppPerformance",
                },
            };
        default:
            return {
                wsComponent: null,
                unlockHook: null,
            };
    }
};

function getTabName({ selectedTab = "", tab = "" }) {
    return selectedTab || tab;
}

export const isHooksV2UnlockHook = (
    unlockHook: IWsConfig["unlockHook"],
): unlockHook is IFeaturePresentationHookInfo => unlockHook.modal === HOOKS_V2_MODAL_ID;
