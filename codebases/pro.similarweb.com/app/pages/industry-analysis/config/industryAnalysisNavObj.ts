import { swSettings } from "common/services/swSettings";
import { isHidden, isLocked } from "../../../../scripts/common/services/pageClaims";
import { INavItem } from "../../../components/React/SideNavComponents/SideNav.types";
import { applyNavItemPermissions } from "../../workspace/common/workspacesUtils";

export const navObj = (): { navList: INavItem[] } => {
    return {
        navList: [
            {
                name: "category",
                title: "industryAnalysis.overview.title", // getItemToActivate() is setting this value
                isOpen: true,
                subItems: [
                    {
                        title: "industryAnalysis.performance.page.title",
                        name: "overview",
                        lockIcon: isLocked(swSettings.components.IndustryAnalysisOverview),
                        customClass: "pull-childs-left",
                        state: "industryAnalysis-overview",
                    },
                    {
                        title: "industryAnalysis.categoryShare.title",
                        name: "categoryShare",
                        lockIcon: isLocked(swSettings.components.CategoryShare),
                        customClass: "pull-childs-left",
                        state: "industryAnalysis-categoryShare",
                    },
                    {
                        title: "industryAnalysis.trafficChannels.title",
                        name: "traffic",
                        lockIcon: isLocked(swSettings.components.IndustryAnalysisGeneral),
                        customClass: "pull-childs-left",
                        state: "industryAnalysis-trafficSources",
                    },
                    {
                        title: "industryAnalysis.outgoingLinks.title",
                        name: "outgoinglinks",
                        lockIcon: swSettings.components.IndustryAnalysisGeneral.isDisabled,
                        state: "industryAnalysis-outgoingLinks",
                    },
                ],
            },
            {
                name: "audience",
                title: "industryAnalysis.audience.title",
                isOpen: true,
                subItems: [
                    {
                        title: "industryAnalysis.geo.title",
                        name: "geography",
                        lockIcon: swSettings.components.IndustryAnalysisGeneral.isDisabled,
                        state: "industryAnalysis-geo",
                    },
                    {
                        title: "industryAnalysis.demographics.title",
                        name: "demographics",
                        lockIcon: swSettings.components.IndustryAnalysisGeneral.isDisabled,
                        state: "industryAnalysis-demographics",
                    },
                    {
                        title: "industryAnalysis.loyalty.title",
                        name: "loyalty",
                        isBeta: true,
                        lockIcon: swSettings.components.IndustryAnalysisGeneral.isDisabled,
                        state: "industryAnalysis-loyalty",
                        overrideParams: {
                            webSource: "Desktop",
                        },
                    },
                ],
            },
            {
                name: "rankings",
                title: "industryAnalysis.rankings.title",
                isOpen: true,
                subItems: [
                    {
                        title: "industryAnalysis.topSites.title",
                        name: "topSites",
                        hidden: isHidden(swSettings.components.WsWebCategorySearchLeaders),
                        customClass: "pull-childs-left",
                        state: "industryAnalysis-topSites",
                        overrideParams: {
                            duration: "1m",
                        },
                    },
                    {
                        title: "industryanalysis.categoryLeaders.CategoryLeadersSearch.title",
                        name: "Search",
                        hidden: isHidden(swSettings.components.WsWebCategorySearchLeaders),
                        customClass: "pull-childs-left",
                        state: "industryAnalysis-categoryLeaders",
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
                        state: "industryAnalysis-categoryLeaders",
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
                        state: "industryAnalysis-categoryLeaders",
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
                        state: "industryAnalysis-categoryLeaders",
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
                        state: "industryAnalysis-categoryLeaders",
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
                        state: "industryAnalysis-categoryLeaders",
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
            {
                name: "search",
                title: "industryAnalysis.search.title",
                isOpen: true,
                subItems: [
                    {
                        title: "industryAnalysis.topKeywords.title",
                        name: "topKeywords",
                        lockIcon: isLocked(swSettings.components.IndustryAnalysisGeneral),
                        customClass: "pull-childs-left",
                        state: "industryAnalysis-topKeywords",
                    },
                    {
                        title: "industryAnalysis.keywordsSeasonality.title",
                        name: "keywordsSeasonality",
                        lockIcon: isLocked(swSettings.components.IndustryAnalysisGeneral),
                        customClass: "pull-childs-left",
                        state: "industryAnalysis-KeywordsSeasonality",
                        overrideParams: {
                            duration: "12m",
                        },
                        defaultQueryParams: {
                            webSource: "Desktop",
                        },
                        isNew: true,
                    },
                ],
            },
        ].map(applyNavItemPermissions),
    };
};
