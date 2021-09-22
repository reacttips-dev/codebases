import { NavBarGroupItemWithIcon } from "@similarweb/ui-components/dist/navigation-bar";
import { swSettings } from "common/services/swSettings";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { isHidden, isLocked, isAvailable } from "../../../../../scripts/common/services/pageClaims";
import { applyNavItemPermissions } from "../../../workspace/common/workspacesUtils";
import { keywordService } from "pages/keyword-analysis/keywordService";
import { customRangeFormat } from "constants/dateFormats";

export const navObj = (): { navList: INavItem[] } => {
    return {
        navList: [
            {
                title: "keywordresearch.findkeywords",
                name: "findkeywords",
                state: "findkeywords_home",
                lockIcon: isLocked(swSettings.components.FindKeywordsHome),
                hidden: isHidden(swSettings.components.FindKeywordsHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "wand",
                    "data-automation-section": "competitiveanalysis.keywordresearch.findkeywords",
                },
                // decides whether to open the sub items when selected
                openByDefault: true,
                // close the sub items when other sub item is selected in the scope
                closeWhenSiblingIsOpen: true,
                subItems: [
                    {
                        title: "keywordresearch.KeywordGenerator",
                        name: "KeywordsGenerator",
                        state: "findkeywords_KeywordGenerator_home",
                        lockIcon: isLocked(swSettings.components.KeywordAnalysisHome),
                        hidden: isHidden(swSettings.components.KeywordAnalysisHome),
                        menuItemComponentProps: {
                            "data-automation-section":
                                "competitiveanalysis.keywordresearch.keywordanalysis",
                        },
                        subItems: [
                            {
                                title:
                                    "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                name: "keywordAnalysis-overview",
                                state: "findkeywords_keywordGeneratorTool",
                                lockIcon: isLocked(swSettings.components.KeywordAnalysis),
                                hidden: isHidden(swSettings.components.KeywordAnalysis),
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                },
                            },
                            {
                                title:
                                    "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                name: "keywordAnalysis-overview",
                                state: "findkeywords_amazonKeywordGenerator",
                                lockIcon: isLocked(swSettings.components.KeywordAnalysis),
                                hidden: isHidden(swSettings.components.KeywordAnalysis),
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                },
                            },
                            {
                                title:
                                    "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                name: "keywordAnalysis-overview",
                                state: "findkeywords_youtubeKeywordGenerator",
                                lockIcon: isLocked(swSettings.components.KeywordAnalysis),
                                hidden: isHidden(swSettings.components.KeywordAnalysis),
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                },
                            },
                        ],
                        permanentlyClosed: true,
                    },
                    {
                        title: "keywordresearch.KeywordGap",
                        name: "KeywordsGap",
                        state: "findkeywords_KeywordGap_home",
                        lockIcon: isLocked(swSettings.components.FindKeywordsHome),
                        hidden: isHidden(swSettings.components.FindKeywordsHome),
                        menuItemComponentProps: {
                            "data-automation-section":
                                "competitiveanalysis.keywordresearch.findkeywords",
                        },
                        subItems: [
                            {
                                title:
                                    "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                name: "keywordAnalysis-overview",
                                state: "findkeywords_bycompetition",
                                lockIcon: isLocked(swSettings.components.KeywordAnalysis),
                                hidden: isHidden(swSettings.components.KeywordAnalysis),
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                },
                            },
                        ],
                        permanentlyClosed: true,
                    },
                    {
                        title: "keywordresearch.SeasonalKeywords",
                        name: "SeasonalKeywords",
                        state: "findkeywords_SeasonalKeywords_home",
                        lockIcon: isLocked(swSettings.components.FindKeywordsHome),
                        hidden: isHidden(swSettings.components.FindKeywordsHome),
                        menuItemComponentProps: {
                            "data-automation-section":
                                "competitiveanalysis.keywordresearch.findkeywords",
                        },
                        subItems: [
                            {
                                title:
                                    "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                name: "keywordAnalysis-overview",
                                state: "findkeywords_byindustry_SeasonalKeywords",
                                lockIcon: isLocked(swSettings.components.KeywordAnalysis),
                                hidden: isHidden(swSettings.components.KeywordAnalysis),
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                },
                            },
                        ],
                        permanentlyClosed: true,
                    },
                    {
                        title: "keywordresearch.KeywordsbyIndustry",
                        name: "TopKeywords",
                        state: "findkeywords_TopKeywords_home",
                        lockIcon: isLocked(swSettings.components.FindKeywordsHome),
                        hidden: isHidden(swSettings.components.FindKeywordsHome),
                        menuItemComponentProps: {
                            "data-automation-section":
                                "competitiveanalysis.keywordresearch.findkeywords",
                        },
                        subItems: [
                            {
                                title:
                                    "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                name: "keywordAnalysis-overview",
                                state: "findkeywords_byindustry_TopKeywords",
                                lockIcon: isLocked(swSettings.components.KeywordAnalysis),
                                hidden: isHidden(swSettings.components.KeywordAnalysis),
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                                },
                            },
                        ],
                        permanentlyClosed: true,
                    },
                ],
            },
            {
                title: "competitiveanalysis.keywordresearch.keywordanalysis",
                name: "keyworkanalysis",
                state: "keywordanalysis_home",
                menuItemComponent: NavBarGroupItemWithIcon,
                lockIcon: isLocked(swSettings.components.KeywordAnalysisHome),
                hidden: isHidden(swSettings.components.KeywordAnalysisHome),
                menuItemComponentProps: {
                    iconName: "search-keywords",
                    "data-automation-section":
                        "competitiveanalysis.keywordresearch.keywordanalysis",
                },
                subItems: [
                    {
                        title: "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                        name: "keywordAnalysis-overview",
                        state: "keywordAnalysis_overview",
                        lockIcon: isLocked(swSettings.components.KeywordAnalysis),
                        hidden: isHidden(swSettings.components.KeywordAnalysis),
                        menuItemComponentProps: {
                            "data-automation-item":
                                "competitiveanalysis.keywordresearch.keywordanalysis.overview",
                        },
                    },
                    {
                        title: "competitiveanalysis.keywordresearch.keywordanalysis.total",
                        name: "keywordAnalysis-total",
                        state: "keywordAnalysis_total",
                        lockIcon: !isAvailable(swSettings.components.KeywordAnalysisTotal), // it's a true/false claim
                        hidden: false,
                        menuItemComponentProps: {
                            "data-automation-item":
                                "competitiveanalysis.keywordresearch.keywordanalysis.total",
                        },
                    },
                    {
                        title: "competitiveanalysis.keywordresearch.keywordanalysis.organic",
                        name: "keywordAnalysis-organic",
                        state: "keywordAnalysis_organic",
                        lockIcon: isLocked(swSettings.components.WsOrganicKeywords),
                        hidden: isHidden(swSettings.components.WsOrganicKeywords),
                        menuItemComponentProps: {
                            "data-automation-item":
                                "competitiveanalysis.keywordresearch.keywordanalysis.organic",
                        },
                    },
                    {
                        title: "competitiveanalysis.keywordresearch.keywordanalysis.paid",
                        name: "keywordAnalysis-paid",
                        state: "keywordAnalysis_paid",
                        lockIcon: isLocked(swSettings.components.WsPaidKeywords),
                        hidden: isHidden(swSettings.components.WsPaidKeywords),
                        menuItemComponentProps: {
                            "data-automation-item":
                                "competitiveanalysis.keywordresearch.keywordanalysis.paid",
                        },
                    },
                    {
                        title: "competitiveanalysis.keywordresearch.keywordanalysis.mobile",
                        name: "keywordanalysis.mobile",
                        state: "keywordAnalysis_mobileweb",
                        lockIcon: isLocked(swSettings.components.WsMobileKeywords),
                        hidden: isHidden(swSettings.components.WsMobileKeywords),
                        menuItemComponentProps: {
                            "data-automation-item": "",
                            badgeType: "beta",
                        },
                    },
                    {
                        title: "keywordAnalysis.geo.page.title",
                        name: "keywordAnalysis-geography",
                        hidden: false,
                        lockIcon: !keywordService.moduleAuthorized,
                        state: "keywordAnalysis_geography",
                        menuItemComponentProps: {
                            "data-automation-item": "",
                            badgeType: "new",
                        },
                    },
                    {
                        title: "competitiveanalysis.keywordresearch.keywordanalysis.serpsnapshot",
                        name: "keywordanalysis.serpsnapshot",
                        state: "keywordAnalysis_serpSnapshot",
                        lockIcon: isLocked(swSettings.components.SerpSnapshot),
                        hidden: isHidden(swSettings.components.SerpSnapshot),
                        menuItemComponentProps: {
                            "data-automation-item":
                                "competitiveanalysis.keywordresearch.keywordanalysis.serpsnapshot",
                            badgeType: "new",
                        },
                        overrideParams: {
                            duration: swSettings.components.SerpSnapshot.endDate
                                .startOf("month")
                                .format(`${customRangeFormat}-${customRangeFormat}`),
                        },
                    },
                    {
                        title: "competitiveanalysis.keywordresearch.keywordanalysis.ads",
                        name: "keywordAnalysis-ads",
                        state: "keywordAnalysis_ads",
                        lockIcon: isLocked(swSettings.components.KeywordsAds),
                        hidden: isHidden(swSettings.components.KeywordsAds),
                        menuItemComponentProps: {
                            "data-automation-item": "",
                        },
                        defaultQueryParams: {
                            webSource: "Desktop",
                        },
                    },
                    {
                        title: "competitiveanalysis.keywordresearch.keywordanalysis.topproducts",
                        name: "keywordanalysis.topproducts",
                        state: "keywordAnalysis_plaResearch",
                        lockIcon: isLocked(swSettings.components.KeywordsAds),
                        hidden: isHidden(swSettings.components.KeywordsAds),
                        menuItemComponentProps: {
                            "data-automation-item": "",
                        },
                    },
                ],
            },
            {
                title: "keywordresearch.monitorkeywords",
                name: "monitor_keywords",
                state: "monitorkeywords_home",
                lockIcon: isLocked(swSettings.components.FindKeywordsHome),
                hidden: isHidden(swSettings.components.FindKeywordsHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "keyword-group",
                    "data-automation-section":
                        "competitiveanalysis.keywordresearch.monitorkeywords",
                },
                permanentlyClosed: true,
                subItems: [
                    {
                        title: "keywordresearch.findkeywords.byindustry",
                        name: "findkeywords_byindustry",
                        state: "monitorkeywords",
                        lockIcon: false, // menu item is hidden by parent anyway
                    },
                ],
            },
        ].map(applyNavItemPermissions),
    };
};
