import { swSettings } from "common/services/swSettings";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { SecondaryBarGroupItem } from "components/SecondaryBar/Components/SecondaryBarGroupItem";
import { i18nFilter } from "filters/ngFilters";
import { isHidden, isLocked } from "../../../../../scripts/common/services/pageClaims";
import { applyNavItemPermissions } from "../../../workspace/common/workspacesUtils";
import { SecondaryBarSectionItem } from "components/SecondaryBar/Components/SecondaryBarSectionItem";

const translate = i18nFilter();
const ignoreSearchKeywordsParams = {
    IncludeOrganic: null,
    IncludePaid: null,
    IncludeBranded: null,
    IncludeNoneBranded: null,
    IncludeNewKeywords: null,
    IncludeTrendingKeywords: null,
    IncludeQuestions: null,
    limits: null,
    BooleanSearchTerms: null,
};

const overviewGroup = {
    title: "analysis.overview.title",
    name: "overview",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "accountreview_overview",
        text: translate("analysis.overview.title"), // TODO: change all i18n keys if/as needed
        isInitiallyOpened: true,
        "data-automation-group": "accountreview.overview",
    },
    subItems: [
        {
            title: "analysis.overview.performance.title",
            name: "worldwideOverview",
            state: "accountreview_website_overview_websiteperformance",
            menuItemComponentProps: {
                "data-automation-item": "analysis.overview.performance.title",
            },
            options: {
                isUSStatesSupported: true,
                isVirtualSupported: false,
            },
            lockIcon: isLocked(swSettings.components.WsWebOverview),
            hidden: isHidden(swSettings.components.WsWebOverview),
        },
        {
            title: "analysis.overview.technographics.title",
            name: "websitetechnologies",
            state: "accountreview_website_technologies",
            menuItemComponentProps: {
                "data-automation-item": "analysis.overview.technographics.title",
            },
            lockIcon: isLocked(swSettings.components.WsWebTechnographics),
            hidden: isHidden(swSettings.components.WsWebTechnographics),
        },
        {
            title: "analysis.overview.competitive.landscape.title",
            name: "competitiveLandscape",
            state: "accountreview_website_competitivelandscape",
            menuItemComponentProps: {
                "data-automation-item": "analysis.overview.competitive.landscape.title",
            },
            options: {
                isVirtualSupported: false,
                isUSStatesSupported: true,
            },
            lockIcon: isLocked(swSettings.components.WsWebCompetitors),
            hidden: isHidden(swSettings.components.WsWebCompetitors),
        },
        {
            title: "analysis.traffic.engagement.title",
            name: "traffic-traffic&engagement",
            state: "accountreview_website_trafficandengagement",
            menuItemComponentProps: {
                "data-automation-item": "analysis.traffic.engagement.title",
            },
            options: {
                isUSStatesSupported: true,
                isVirtualSupported: false,
            },
            lockIcon: isLocked(swSettings.components.WsWebTrafficAndEngagement),
            hidden: isHidden(swSettings.components.WsWebTrafficAndEngagement),
        },
        {
            title: "analysis.traffic.marketing.channels.title",
            name: "overview",
            menuItemComponentProps: {
                "data-automation-item": "analysis.traffic.marketing.channels.title",
            },
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            state: "accountreview_website_marketingchannels",
            lockIcon: isLocked(swSettings.components.WsWebTrafficChannels),
            hidden: isHidden(swSettings.components.WsWebTrafficChannels),
        },
        {
            title: "analysis.audience.geo.title",
            name: "geography",
            menuItemComponentProps: {
                "data-automation-item": "analysis.audience.geo.title",
            },
            options: {
                isUSStatesSupported: false,
                isVirtualSupported: true,
            },
            state: "accountreview_website_audience_geography",
            lockIcon: isLocked(swSettings.components.WsWebGeography),
            hidden: isHidden(swSettings.components.WsWebGeography),
        },
        {
            title: "analysis.audience.demo.title",
            name: "demographics",
            menuItemComponentProps: {
                "data-automation-item": "analysis.audience.demo.title",
            },
            options: {
                isUSStatesSupported: false,
                isVirtualSupported: true,
            },
            state: "accountreview_website_audience_demographics",
            lockIcon: isLocked(swSettings.components.WsWebDemographics),
            hidden: isHidden(swSettings.components.WsWebDemographics),
        },
        {
            title: "analysis.audience.interests.title",
            name: "audience",
            menuItemComponentProps: {
                "data-automation-item": "analysis.audience.interests.title",
            },
            options: {
                isVirtualSupported: false,
                isUSStatesSupported: true,
            },
            state: "accountreview_website_audience_interests",
            lockIcon: isLocked(swSettings.components.WsWebAudienceInterests),
            hidden: isHidden(swSettings.components.WsWebAudienceInterests),
        },
    ],
};

const searchGroup = {
    title: "Search",
    name: "search",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "accountreview_search_group",
        text: "Search",
        isInitiallyOpened: false,
        "data-automation-group": "accountreview.search",
    },
    subItems: [
        {
            id: "accountreview_search_overview",
            title: "analysis.search.overview.title",
            name: "searchOverview",
            state: "accountreview_website_search_overview",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            defaultQueryParams: {
                ...ignoreSearchKeywordsParams,
            },
            lockIcon: isLocked(swSettings.components.WsWebSearchOverview),
            hidden: isHidden(swSettings.components.WsWebSearchOverview),
        },
        {
            id: "accountreview_search_keywords",
            title: "analysis.search.keywords.title",
            name: "searchKeywords",
            state: "accountreview_website_search_keyword",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            lockIcon: isLocked(swSettings.components.WsWebSearchKeywords),
            hidden: isHidden(swSettings.components.WsWebSearchKeywords),
        },
        {
            id: "accountreview_search_phrases",
            title: "analysis.search.phrases.title",
            name: "searchPhrases",
            state: "accountreview_website_search_phrases",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            defaultQueryParams: {
                ...ignoreSearchKeywordsParams,
            },
            lockIcon: isLocked(swSettings.components.WsWebSearchPhrases),
            hidden: isHidden(swSettings.components.WsWebSearchPhrases),
        },
        {
            title: "analysis.search.organic.competitors.title",
            state: "accountreview_website_search_organic_competitors",
            name: "competitorsOrganicKeywords",
            options: {
                isVirtualSupported: false,
                isUSStatesSupported: true,
            },
            lockIcon: isLocked(swSettings.components.WsWebOrganicSearchCompetitors),
            hidden: isHidden(swSettings.components.WsWebOrganicSearchCompetitors),
            overrideParams: {
                duration: "3m",
                category: null,
            },
        },
        {
            title: "analysis.search.paid.competitors.title",
            state: "accountreview_website_search_paid_competitors",
            name: "competitorsPaidKeywords",
            options: {
                isVirtualSupported: false,
                isUSStatesSupported: true,
            },
            lockIcon: isLocked(swSettings.components.WsWebPaidSearchCompetitors),
            hidden: isHidden(swSettings.components.WsWebPaidSearchCompetitors),
            overrideParams: {
                duration: "3m",
                category: null,
            },
        },
        {
            id: "accountreview_search_ads",
            title: "analysis.search.ads.title",
            name: "searchAds",
            state: "accountreview_website_search_ads",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            defaultQueryParams: {
                ...ignoreSearchKeywordsParams,
            },
            lockIcon: isLocked(swSettings.components.WsWebSearchAds),
            hidden: isHidden(swSettings.components.WsWebSearchAds),
        },
        {
            id: "accountreview_search_plaResearch",
            title: "analysis.search.plaresearch.title",
            name: "plaResearch",
            state: "accountreview_website_search_plaResearch",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            defaultQueryParams: {
                ...ignoreSearchKeywordsParams,
            },
            lockIcon: isLocked(swSettings.components.WsWebSearchAds),
            hidden: isHidden(swSettings.components.WsWebSearchAds),
        },
    ].filter((item) => item),
};

const referralGroup = {
    title: "analysis.referrals.title",
    name: "websites",
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "accountreview_referral_group",
        text: "Referral",
        isInitiallyOpened: false,
        "data-automation-group": "accountreview.search",
    },
    subItems: [
        {
            title: "analysis.referrals.incoming.title",
            name: "referrals",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            state: "accountreview_website_referrals_incomingtraffic",
            lockIcon: isLocked(swSettings.components.WsWebReferralIncomingTraffic),
            hidden: isHidden(swSettings.components.WsWebReferralIncomingTraffic),
            defaultQueryParams: {
                limits: null,
            },
        },
        {
            title: "analysis.referrals.outgoing.title",
            name: "outgoing",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            state: "accountreview_website_outgoingtraffic",
            lockIcon: isLocked(swSettings.components.WsWebReferralOutgoingTraffic),
            hidden: isHidden(swSettings.components.WsWebReferralOutgoingTraffic),
        },
    ],
};

const displayGroup = {
    title: "Display",
    name: "display",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "accountreview_display_group",
        text: "Display",
        isInitiallyOpened: false,
        "data-automation-group": "accountreview.display.title",
    },
    subItems: [
        {
            title: "analysis.display.overview.title",
            name: "displayOverview",
            id: "accountreview_display_overview",
            state: "accountreview_website_display_overview",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            lockIcon: isLocked(swSettings.components.WsWebDisplayTrafficOverview),
            hidden: isHidden(swSettings.components.WsWebDisplayTrafficOverview),
        },
        {
            title: "analysis.display.publishers.title",
            name: "Publishers",
            state: "accountreview_website_display",
            tab: "publishers",
            id: "accountreview_display_publishers",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            defaultQueryParams: {
                selectedTab: "publishers",
            },
            lockIcon: isLocked(swSettings.components.WsWebDisplayTrafficPublishers),
            hidden: isHidden(swSettings.components.WsWebDisplayTrafficPublishers),
        },
        {
            title: "analysis.display.mediators.title",
            name: "adNetworks",
            state: "accountreview_website_display_ad_networks",
            id: "accountreview_display_mediators",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            lockIcon: isLocked(swSettings.components.WsWebDisplayTrafficAdNetworks),
            hidden: isHidden(swSettings.components.WsWebDisplayTrafficAdNetworks),
        },
        {
            title: "analysis.display.creatives.title",
            name: "creatives",
            state: "accountreview_website_display_creatives",
            options: {
                isVirtualSupported: true,
            },
            lockIcon: isLocked(swSettings.components.WsWebDisplayTrafficAdCreatives),
            hidden: isHidden(swSettings.components.WsWebDisplayTrafficAdCreatives),
        },
        {
            title: "analysis.display.videos.title",
            name: "videos",
            state: "accountreview_website_display_videos",
            options: {
                isVirtualSupported: true,
            },
            lockIcon: isLocked(swSettings.components.WsWebDisplayTrafficVideos),
            hidden: isHidden(swSettings.components.WsWebDisplayTrafficVideos),
        },
    ],
};

const adNetworksGroup = {
    title: "analysis.monetization.title",
    name: "traffic",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        text: translate("analysis.monetization.title"),
        "data-automation-group": "analysis.monetization.title",
        isInitiallyOpened: false,
    },
    subItems: [
        {
            title: "analysis.monetization.advertisers.title",
            name: "paid-outgoing",
            state: "accountreview_website_paidoutgoing",
            tab: "advertisers",
            defaultQueryParams: {
                selectedTab: "advertisers",
            },
            lockIcon: isLocked(swSettings.components.WsWebMonetizationAdvertisers),
            hidden: isHidden(swSettings.components.WsWebMonetizationAdvertisers),
        },
        {
            title: "analysis.monetization.adnetworks.title",
            name: "adNetworks",
            state: "accountreview_website_paidoutgoing",
            tab: "adNetworks",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            defaultQueryParams: {
                selectedTab: "adNetworks",
            },
            lockIcon: isLocked(swSettings.components.WsWebMonetizationNetworks),
            hidden: isHidden(swSettings.components.WsWebMonetizationNetworks),
        },
    ],
};

const socialGroup = {
    title: "Social",
    name: "social",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "accountreview_social_group",
        text: "Social",
        isInitiallyOpened: false,
        "data-automation-group": "accountreview.social.title",
    },
    subItems: [
        {
            title: "analysis.social.overview.title",
            name: "overview",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            state: "accountreview_website_social_overview",
            lockIcon: isLocked(swSettings.components.WsWebSocialTrafficOverview),
            hidden: isHidden(swSettings.components.WsWebSocialTrafficOverview),
        },
    ],
};

const contentGroup = {
    title: "analysis.content.title2",
    name: "websites",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "accountreview_content",
        text: "Content",
        isInitiallyOpened: false,
        "data-automation-group": "analysis.content.title2",
    },
    subItems: [
        {
            title: "analysis.content.subdomains.title",
            name: "subdomains",
            options: {
                isVirtualSupported: false,
                isUSStatesSupported: true,
            },
            state: "accountreview_website_subdomains",
            defaultQueryParams: {
                state: "desktop",
            },
            lockIcon: isLocked(swSettings.components.WsWebContentSubdomains),
            hidden: isHidden(swSettings.components.WsWebContentSubdomains),
        },
    ],
};

export const navObj = (): { navList: INavItem[] } => {
    return {
        navList: [
            overviewGroup,
            searchGroup,
            referralGroup,
            displayGroup,
            adNetworksGroup,
            socialGroup,
            contentGroup,
        ].map(applyNavItemPermissions),
    };
};
