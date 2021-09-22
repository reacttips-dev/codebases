import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { applyNavItemPermissions } from "pages/workspace/common/workspacesUtils";
import { NavBarGroupItemWithIcon } from "@similarweb/ui-components/dist/navigation-bar";
import { swSettings } from "common/services/swSettings";
import { isHidden, isLocked } from "common/services/pageClaims";

export const navObj = (): { navList: INavItem[] } => {
    return {
        navList: [
            {
                title: "affiliateresearch.findaffiliates",
                name: "findaffiliates",
                state: "findaffiliates_home",
                lockIcon: isLocked(swSettings.components.FindAffiliatesHome),
                hidden: isHidden(swSettings.components.FindAffiliatesHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "wand",
                    "data-automation-section": "affiliateresearch.findaffiliates",
                },
                openWhenSelected: true,
                subItems: [
                    {
                        title: "findaffiliates.bykeywords.title",
                        name: "findaffiliates.bykeywords.title",
                        state: "findaffiliates_bykeywords_homepage",
                        lockIcon: isLocked(swSettings.components.FindAffiliatesHome),
                        hidden: isHidden(swSettings.components.FindAffiliatesHome),
                        menuItemComponentProps: {
                            "data-automation-section":
                                "affiliateresearch.findaffiliates.bykeywords",
                        },
                        subItems: [
                            {
                                title: "findaffiliates.bykeywords.title",
                                name: "findaffiliates.bykeywords.title",
                                state: "findaffiliates_bykeywords",
                                lockIcon: isLocked(swSettings.components.FindAffiliatesHome),
                                hidden: isHidden(swSettings.components.FindAffiliatesHome),
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "affiliateresearch.findaffiliates.bykeywords",
                                },
                            },
                        ],
                        permanentlyClosed: true,
                    },
                    {
                        title: "findaffiliates.byindustry.title",
                        name: "findaffiliates.byindustry.title",
                        state: "findaffiliates_byindustry_homepage",
                        lockIcon: isLocked(swSettings.components.FindAffiliatesHome),
                        hidden: isHidden(swSettings.components.FindAffiliatesHome),
                        menuItemComponentProps: {
                            "data-automation-section":
                                "affiliateresearch.findaffiliates.byindustry",
                        },
                        subItems: [
                            {
                                title: "findaffiliates.byindustry.title",
                                name: "findaffiliates.byindustry.title",
                                state: "findaffiliates_byindustry",
                                lockIcon: isLocked(swSettings.components.FindAffiliatesHome),
                                hidden: isHidden(swSettings.components.FindAffiliatesHome),
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "affiliateresearch.findaffiliates.byindustry",
                                },
                            },
                        ],
                        permanentlyClosed: true,
                    },
                    {
                        title: "findaffiliates.bycompetition.title",
                        name: "findaffiliates.bycompetition.title",
                        state: "findaffiliates_bycompetition_homepage",
                        lockIcon: isLocked(swSettings.components.FindAffiliatesHome),
                        hidden: isHidden(swSettings.components.FindAffiliatesHome),
                        menuItemComponentProps: {
                            "data-automation-section":
                                "affiliateresearch.findaffiliatesh.bycompetition",
                        },
                        subItems: [
                            {
                                title: "findaffiliates.bycompetition.title",
                                name: "findaffiliates.bycompetition.title",
                                state: "findaffiliates_bycompetition",
                                tab: "keywords",
                                options: {
                                    isVirtualSupported: true,
                                    isUSStatesSupported: true,
                                },
                                defaultQueryParams: {
                                    selectedTab: "keywords",
                                    IncludeOrganic: false,
                                    IncludePaid: false,
                                    IncludeBranded: false,
                                    IncludeNoneBranded: true,
                                    IncludeNewKeywords: false,
                                    IncludeTrendingKeywords: false,
                                    IncludeQuestions: false,
                                    limits: "opportunities",
                                },
                                lockIcon: false, // menu item is hidden by parent anyway
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "affiliateresearch.findaffiliatesh.bycompetition",
                                },
                            },
                        ],
                        permanentlyClosed: true,
                    },
                ],
            },
            {
                title: "affiliateresearch.affiliateanalysis",
                name: "affiliateanalysis",
                state: "affiliateanalysis_home",
                lockIcon: isLocked(swSettings.components.AffiliateAnalysisHome),
                hidden: isHidden(swSettings.components.AffiliateAnalysisHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "nav-affiliates",
                    "data-automation-section": "affiliateresearch.affiliateanalysis",
                },
                subItems: [
                    {
                        title: "affiliateresearch.affiliateanalysis.performanceoverview",
                        name: "affiliateanalysis.performanceoverview",
                        state: "affiliateanalysis_performanceoverview",
                        lockIcon: isLocked(swSettings.components.WsWebOverview),
                        hidden: isHidden(swSettings.components.WsWebOverview),
                    },
                    {
                        title: "affiliateresearch.affiliateanalysis.outgoinglinks",
                        name: "affiliateanalysis.outgoinglinks",
                        state: "affiliateanalysis_outgoinglinks",
                        lockIcon: isLocked(swSettings.components.WsWebReferralOutgoingTraffic),
                        hidden: isHidden(swSettings.components.WsWebReferralOutgoingTraffic),
                    },
                    {
                        title: "affiliateresearch.affiliateanalysis.similarsites",
                        name: "affiliateanalysis.similarsites",
                        state: "affiliateanalysis_similarsites",
                        lockIcon: isLocked(swSettings.components.AffiliateAnalysisHome),
                        hidden: isHidden(swSettings.components.AffiliateAnalysisHome),
                    },
                ],
            },
            {
                title: "affiliateresearch.monitorpartners",
                name: "monitor_partners",
                state: "monitorpartners_home",
                lockIcon: isLocked(swSettings.components.FindAffiliatesHome),
                hidden: isHidden(swSettings.components.FindAffiliatesHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "partners-list",
                    "data-automation-section": "affiliateresearch.monitorpartners",
                },
                permanentlyClosed: true,
                subItems: [
                    {
                        title: "affiliateresearch.findaffiliates.byopportunities",
                        name: "monitorpartners",
                        state: "monitorpartners",
                        lockIcon: isLocked(swSettings.components.FindAffiliatesHome),
                        hidden: isHidden(swSettings.components.FindAffiliatesHome),
                    },
                ],
            },
        ].map(applyNavItemPermissions),
    };
};
