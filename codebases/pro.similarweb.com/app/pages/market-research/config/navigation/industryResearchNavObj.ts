import { NavBarGroupItemWithIcon } from "@similarweb/ui-components/dist/navigation-bar";
import { isLocked, isHidden } from "common/services/pageClaims";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import { INavItem } from "../../../../components/React/SideNavComponents/SideNav.types";
import { applyNavItemPermissions } from "../../../workspace/common/workspacesUtils";
import { SecondaryBarSectionItem } from "components/SecondaryBar/Components/SecondaryBarSectionItem";
import { keywordService } from "pages/keyword-analysis/keywordService";

const translate = i18nFilter();

const webMarketAnalysisGroup = {
    name: "marketintelligence.marketresearch.webmarketanalysis",
    title: "sidebar.marketresearch.web.title",
    state: "marketresearch_webmarketanalysis_home",
    menuItemComponent: NavBarGroupItemWithIcon,
    lockIcon: isLocked(swSettings.components.WebMarketAnalysisOverviewHome),
    hidden: isHidden(swSettings.components.WebMarketAnalysisOverviewHome),
    menuItemComponentProps: {
        iconName: "category",
    },
    subItems: [
        {
            name: "overview",
            title: "sidebar.marketresearch.web.overview.title",
            menuItemComponent: SecondaryBarSectionItem,
            menuItemComponentProps: {
                text: translate("analysis.overview.title"),
                isInitiallyOpened: true,
            },
            subItems: [
                {
                    title: "sidebar.marketresearch.web.overview.marketoverview.title",
                    name: "overview",
                    state: "marketresearch_webmarketanalysis_overview",
                    lockIcon: isLocked(swSettings.components.WsWebCategoryPerformance),
                    hidden: isHidden(swSettings.components.WsWebCategoryPerformance),
                },
                {
                    title: "sidebar.marketresearch.web.overview.mapping.title",
                    name: "mapping",
                    state: "marketresearch_webmarketanalysis_mapping",
                    lockIcon: isLocked(swSettings.components.WsWebCategoryTopSites),
                    hidden: isHidden(swSettings.components.WsWebCategoryTopSites),
                },
                {
                    title: "sidebar.marketresearch.web.overview.trends.title",
                    name: "trends",
                    lockIcon: isLocked(swSettings.components.WsWebCategoryShare),
                    hidden: isHidden(swSettings.components.WsWebCategoryShare),
                    state: "marketresearch_webmarketanalysis_trends",
                },
                {
                    title: "industryAnalysis.trafficChannels.title",
                    name: "trafficChannels",
                    lockIcon: isLocked(swSettings.components.IndustryAnalysisGeneral),
                    hidden: isHidden(swSettings.components.IndustryAnalysisGeneral),
                    state: "marketresearch_webmarketanalysis_trafficChannels",
                },
            ],
        },
        {
            name: "audience",
            title: "sidebar.marketresearch.web.audience.title",
            menuItemComponent: SecondaryBarSectionItem,
            menuItemComponentProps: {
                text: translate("sidebar.marketresearch.web.audience.title"),
                isInitiallyOpened: false,
            },
            subItems: [
                {
                    title: "industryAnalysis.demographics.title",
                    name: "demographics",
                    lockIcon: isLocked(swSettings.components.WsCategoryDemographics),
                    hidden: isHidden(swSettings.components.WsCategoryDemographics),
                    state: "marketresearch_webmarketanalysis_demographics",
                },
                {
                    title: "industryAnalysis.geo.title",
                    name: "geography",
                    lockIcon: isLocked(swSettings.components.WsWebCategoryGeo),
                    hidden: isHidden(swSettings.components.WsWebCategoryGeo),
                    state: "marketresearch_webmarketanalysis_geography",
                },
                {
                    title: "industryAnalysis.loyalty.title",
                    name: "loyalty",
                    isBeta: true,
                    lockIcon: isLocked(swSettings.components.IndustryAnalysisAudienceLoyalty),
                    hidden: isHidden(swSettings.components.IndustryAnalysisAudienceLoyalty),
                    state: "marketresearch_webmarketanalysis_loyalty",
                    overrideParams: {
                        webSource: "Desktop",
                    },
                },
                {
                    title: "industryAnalysis.searchTrends.title",
                    name: "searchTrends",
                    isNew: true,
                    lockIcon: isLocked(swSettings.components.IndustryAnalysisGeneral),
                    hidden: isHidden(swSettings.components.IndustryAnalysisGeneral),
                    state: "marketresearch_webmarketanalysis_searchtrends",
                    overrideParams: {
                        webSource: "Desktop",
                    },
                },
            ],
        },
        {
            name: "rankings",
            title: translate("industryAnalysis.rankings.title"),
            menuItemComponent: SecondaryBarSectionItem,
            menuItemComponentProps: {
                text: translate("industryAnalysis.rankings.title"),
                isInitiallyOpened: false,
            },
            isOpen: true,
            subItems: [
                {
                    title: "industryanalysis.categoryLeaders.CategoryLeadersSearch.title",
                    name: "Search",
                    hidden: isHidden(swSettings.components.WsWebCategorySearchLeaders),
                    customClass: "pull-childs-left",
                    state: "marketresearch_webmarketanalysis_rankings",
                    tab: "CategoryLeadersSearch",
                    overrideParams: {
                        duration: "1m",
                    },
                    defaultQueryParams: {
                        tab: "CategoryLeadersSearch",
                    },
                    reloadOnSearch: true,
                },
                {
                    title: "industryanalysis.categoryLeaders.CategoryLeadersSocial.title",
                    name: "Social",
                    hidden: isHidden(swSettings.components.WsWebCategorySocialLeaders),
                    customClass: "pull-childs-left",
                    state: "marketresearch_webmarketanalysis_rankings",
                    tab: "CategoryLeadersSocial",
                    overrideParams: {
                        duration: "1m",
                    },
                    defaultQueryParams: {
                        tab: "CategoryLeadersSocial",
                    },
                    reloadOnSearch: true,
                },
                {
                    title: "industryanalysis.categoryLeaders.CategoryLeadersAds.title",
                    name: "DisplayAds",
                    hidden: isHidden(swSettings.components.WsWebCategoryDisplayLeaders),
                    customClass: "pull-childs-left",
                    state: "marketresearch_webmarketanalysis_rankings",
                    tab: "CategoryLeadersAds",
                    overrideParams: {
                        duration: "1m",
                    },
                    defaultQueryParams: {
                        tab: "CategoryLeadersAds",
                    },
                    reloadOnSearch: true,
                },
                {
                    title: "industryanalysis.categoryLeaders.CategoryLeadersReferrals.title",
                    name: "Referrals",
                    hidden: isHidden(swSettings.components.WsWebCategoryReferralLeaders),
                    customClass: "pull-childs-left",
                    state: "marketresearch_webmarketanalysis_rankings",
                    tab: "CategoryLeadersReferrals",
                    overrideParams: {
                        duration: "1m",
                    },
                    defaultQueryParams: {
                        tab: "CategoryLeadersReferrals",
                    },
                    reloadOnSearch: true,
                },
                {
                    title: "industryanalysis.categoryLeaders.CategoryLeadersDirect.title",
                    name: "Direct",
                    hidden: isHidden(swSettings.components.WsWebCategoryDirectLeaders),
                    customClass: "pull-childs-left",
                    state: "marketresearch_webmarketanalysis_rankings",
                    tab: "CategoryLeadersDirect",
                    overrideParams: {
                        duration: "1m",
                    },
                    defaultQueryParams: {
                        tab: "CategoryLeadersDirect",
                    },
                    reloadOnSearch: true,
                },
                {
                    title: "industryanalysis.categoryLeaders.CategoryLeadersMail.title",
                    name: "Email",
                    hidden: isHidden(swSettings.components.WsWebCategoryEmailLeaders),
                    customClass: "pull-childs-left",
                    state: "marketresearch_webmarketanalysis_rankings",
                    tab: "CategoryLeadersMail",
                    overrideParams: {
                        duration: "1m",
                    },
                    defaultQueryParams: {
                        tab: "CategoryLeadersMail",
                    },
                    reloadOnSearch: true,
                },
            ],
        },
    ],
};

const appMarketAnalysisGroup = {
    name: "marketintelligence.appmarketanalysis",
    title: "sidebar.marketresearch.app.title",
    state: "marketresearch_appmarketanalysis_home",
    lockIcon: isLocked(swSettings.components.AppMarketAnalysisHome),
    hidden: isHidden(swSettings.components.AppMarketAnalysisHome),
    menuItemComponent: NavBarGroupItemWithIcon,
    menuItemComponentProps: {
        iconName: "nav-app-category",
    },
    subItems: [
        {
            name: "top",
            title: "sidebar.rankings.topapps.title",
            state: "marketresearch_appmarketanalysis_top",
            lockIcon: isLocked(swSettings.components.WsTopApps),
            hidden: isHidden(swSettings.components.WsTopApps),
            defaultQueryParams: {
                country: 840,
            },
        },
        {
            name: "trending",
            title: "sidebar.rankings.trendingapps.title",
            state: "marketresearch_appmarketanalysis_trending",
            lockIcon: isLocked(swSettings.components.WsTrendingApps),
            hidden: isHidden(swSettings.components.WsTrendingApps),
            defaultQueryParams: {
                country: 840,
            },
        },
    ],
};

export const navObj = (): { navList: INavItem[] } => {
    const keywordMarketAnalysisGroup = {
        name: "keywordmarketanalysis",
        title: "sidebar.marketresearch.keyword.title",
        state: "marketresearch_keywordmarketanalysis_home",
        lockIcon: isLocked(swSettings.components.TopicMarketAnalysisHome),
        hidden: isHidden(swSettings.components.TopicMarketAnalysisHome),
        menuItemComponent: NavBarGroupItemWithIcon,
        menuItemComponentProps: {
            iconName: "nav-keyword-group",
        },
        subItems: [
            {
                title: "KeywordAnalysis.nav.total.title",
                name: "total",
                lockIcon: !keywordService.moduleAuthorized,
                state: "marketresearch_keywordmarketanalysis_total",
            },
            {
                title: "keywordAnalysis.geo.page.title",
                name: "geo",
                hidden: false,
                lockIcon: !keywordService.moduleAuthorized,
                isNew: true,
                state: "marketresearch_keywordmarketanalysis_geo",
            },
            {
                title: "Sneak Peek",
                menuItemComponent: SecondaryBarSectionItem,
                menuItemComponentProps: {
                    text: "Sneak Peek",
                    isInitiallyOpened: true,
                },
                hidden: !swSettings.components.Home.resources.HasNewSneakPeek,
                disabled: false,
                subItems: [
                    {
                        title: "Data Query",
                        name: "sneakpeekQuery",
                        state: "marketresearch_keywordmarketanalysis_sneakpeekQuery",
                    },
                    {
                        title: "Data Results",
                        name: "sneakpeekResults",
                        state: "marketresearch_keywordmarketanalysis_sneakpeekResults",
                    },
                ],
            },
        ],
    };
    return {
        navList: [webMarketAnalysisGroup, appMarketAnalysisGroup, keywordMarketAnalysisGroup].map(
            applyNavItemPermissions,
        ),
    };
};
