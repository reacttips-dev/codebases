import dayjs from "dayjs";
import { customRangeFormat } from "constants/dateFormats";
import { swSettings } from "common/services/swSettings";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { SecondaryBarGroupItem } from "components/SecondaryBar/Components/SecondaryBarGroupItem";
import { i18nFilter } from "filters/ngFilters";
import { isHidden, isLocked } from "../../../../../scripts/common/services/pageClaims";
import { applyNavItemPermissions } from "../../../workspace/common/workspacesUtils";

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
    ExcludeUrls: null,
    IncludeUrls: null,
    IncludeTerms: null,
    ExcludeTerms: null,
};

const overviewGroup = {
    title: "analysis.overview.title",
    name: "overview",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "competitiveanalysis_overview",
        text: translate("analysis.overview.title"),
        isInitiallyOpened: true,
        "data-automation-group": "competitiveanalysis.overview.title",
    },
    subItems: [
        {
            title: "analysis.overview.performance.title",
            name: "worldwideOverview",
            state: "competitiveanalysis_website_overview_websiteperformance",
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
            title: "analysis.traffic.marketing.channels.title",
            name: "overview",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            state: "competitiveanalysis_website_overview_marketingchannels",
            lockIcon: isLocked(swSettings.components.WsWebTrafficChannels),
            hidden: isHidden(swSettings.components.WsWebTrafficChannels),
        },
        swSettings.components.Home.resources.HasTechnographics && {
            title: "analysis.overview.technographics.title",
            name: "technographics",
            state: "competitiveanalysis_websites_technographicsOverview",
            options: {
                isVirtualSupported: false,
                isUSStatesSupported: false,
            },
            menuItemComponentProps: {
                "data-automation-item": "analysis.overview.technographics.title",
            },
            lockIcon: isLocked(swSettings.components.WebTechnographics),
        },
    ],
};

const organicSearchGroup = {
    title: "competitiveanalysis_organic_search_group",
    name: "search",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "competitiveanalysis_organic_search_group",
        text: translate("competitiveanalysis.organic_search.title"),
        isInitiallyOpened: true,
        "data-automation-group": "competitiveanalysis.organic_search.title",
    },
    subItems: [
        {
            id: "competitiveanalysis_organic_search_overview",
            title: "analysis.search.overview.title",
            name: "searchOverview",
            state: "competitiveanalysis_website_organic_search_overview",
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
            id: "competitiveanalysis_search_keywords",
            title: "analysis.search.keywords.title",
            name: "searchKeywords",
            state: "competitiveanalysis_website_search_keyword",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            defaultQueryParams: {
                ...ignoreSearchKeywordsParams,
            },
            lockIcon: isLocked(swSettings.components.WsWebSearchKeywords),
            hidden: isHidden(swSettings.components.WsWebSearchKeywords),
        },
        {
            id: "competitiveanalysis_search_phrases",
            title: "analysis.search.phrases.title",
            name: "searchPhrases",
            state: "competitiveanalysis_website_search_phrases",
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
        swSettings.components?.RankingDistribution?.isAllowed && {
            id: "competitiveanalysis_search_ranking_distribution",
            title: "analysis.search.ranking.distribution.title",
            name: "searchRankingDistribution",
            state: "competitiveanalysis_website_search_ranking_distribution",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            overrideParams: {
                ...ignoreSearchKeywordsParams,
                duration: swSettings.components.RankingDistribution.endDate
                    .startOf("month")
                    .format(`${customRangeFormat}-${customRangeFormat}`),
            },
            isBeta: true,
        },
        {
            title: "analysis.search.organic.landing.pages.title",
            name: "organicLandingPages",
            state: "competitiveanalysis_website_organiclandingpages",
            options: {
                isVirtualSupported: false,
                isUSStatesSupported: false,
            },
            defaultQueryParams: {
                webSource: "Desktop",
            },
            lockIcon: isLocked(swSettings.components.WebsiteOrganicLandingPages),
            hidden: isHidden(swSettings.components.WebsiteOrganicLandingPages),
        },
        {
            title: "analysis.search.organic.competitors.title",
            state: "competitiveanalysis_website_search_organic_competitors",
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
    ].filter((item) => item),
};

const paidSearchGroup = {
    title: "competitiveanalysis_paid_search_group",
    name: "search",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "competitiveanalysis_paid_search_group",
        text: translate("competitiveanalysis.paid_search.title"),
        isInitiallyOpened: true,
        "data-automation-group": "competitiveanalysis.paid_search.title",
    },
    subItems: [
        {
            id: "competitiveanalysis_paid_search_overview",
            title: "analysis.search.overview.title",
            name: "paidSearchOverview",
            state: "competitiveanalysis_website_paid_search_overview",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            defaultQueryParams: {
                ...ignoreSearchKeywordsParams,
            },
            hidden: isHidden(swSettings.components.WsPaidSearchOverview),
            isNew: true,
        },
        {
            id: "competitiveanalysis_search_ads",
            title: "analysis.search.ads.title",
            name: "searchAds",
            state: "competitiveanalysis_website_search_ads",
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
            id: "competitiveanalysis_search_plaResearch",
            title: "analysis.search.plaresearch.title",
            name: "plaResearch",
            state: "competitiveanalysis_website_search_plaResearch",
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
            title: "analysis.search.paid.competitors.title",
            state: "competitiveanalysis_website_search_paid_competitors",
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
    ].filter((item) => item),
};

const referalGroup = {
    title: "Referral",
    name: "Referral",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "competitiveanalysis_referral_group",
        text: "Referral",
        isInitiallyOpened: true,
        "data-automation-group": "competitiveanalysis.referral.title",
    },
    subItems: [
        {
            title: "analysis.referrals.incoming.title",
            name: "referrals",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            state: "competitiveanalysis_website_referrals_incomingtraffic",
            lockIcon: isLocked(swSettings.components.WsWebReferralIncomingTraffic),
            hidden: isHidden(swSettings.components.WsWebReferralIncomingTraffic),
            defaultQueryParams: {
                limits: null,
                ExcludeUrls: null,
                IncludeUrls: null,
            },
        },
        {
            title: "analysis.referrals.outgoing.title",
            name: "outgoing",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            state: "competitiveanalysis_website_referrals_outgoingtraffic",
            lockIcon: isLocked(swSettings.components.WsWebReferralOutgoingTraffic),
            hidden: isHidden(swSettings.components.WsWebReferralOutgoingTraffic),
        },
    ],
};

const socialGroup = {
    title: "Social",
    name: "social",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "competitiveanalysis_social_group",
        text: "Social",
        isInitiallyOpened: true,
        "data-automation-group": "competitiveanalysis.social.title",
    },
    subItems: [
        {
            title: "analysis.social.overview.title",
            name: "overview",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            state: "competitiveanalysis_website_social_overview",
            lockIcon: isLocked(swSettings.components.WsWebSocialTrafficOverview),
            hidden: isHidden(swSettings.components.WsWebSocialTrafficOverview),
        },
    ],
};

const displayGroup = {
    title: "Display",
    name: "display",
    hideIfNoSubItems: true,
    menuItemComponent: SecondaryBarGroupItem,
    menuItemComponentProps: {
        id: "competitiveanalysis_display_group",
        text: "Display",
        isInitiallyOpened: true,
        "data-automation-group": "competitiveanalysis.display.title",
    },
    subItems: [
        {
            title: "analysis.display.overview.title",
            name: "displayOverview",
            id: "competitiveanalysis_display_overview",
            state: "competitiveanalysis_website_display_overview",
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
            state: "competitiveanalysis_website_display",
            tab: "publishers",
            id: "competitiveanalysis_display_publishers",
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
            state: "competitiveanalysis_website_display_ad_networks",
            id: "competitiveanalysis_display_mediators",
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
            state: "competitiveanalysis_website_display_creatives",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            lockIcon: isLocked(swSettings.components.WsWebDisplayTrafficAdCreatives),
            hidden: isHidden(swSettings.components.WsWebDisplayTrafficAdCreatives),
        },
        {
            title: "analysis.display.videos.title",
            subTitle: "analysis.display.videos.title",
            name: "videos",
            state: "competitiveanalysis_website_display_videos",
            options: {
                isVirtualSupported: true,
                isUSStatesSupported: true,
            },
            lockIcon: isLocked(swSettings.components.WsWebDisplayTrafficVideos),
            hidden: isHidden(swSettings.components.WsWebDisplayTrafficVideos),
        },
    ],
};

export const navObj = (): { navList: INavItem[] } => {
    return {
        navList: [
            overviewGroup,
            organicSearchGroup,
            paidSearchGroup,
            referalGroup,
            displayGroup,
            socialGroup,
        ].map(applyNavItemPermissions),
    };
};
