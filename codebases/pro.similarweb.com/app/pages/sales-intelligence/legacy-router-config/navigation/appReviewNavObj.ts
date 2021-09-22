import { isHidden, isLocked } from "common/services/pageClaims";
import { swSettings } from "common/services/swSettings";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { applyNavItemPermissions } from "pages/workspace/common/workspacesUtils";

export const navObj = (): { navList: INavItem[] } => {
    return {
        navList: [
            {
                name: "apps",
                title: "mobileAppsAnalysis.overview.titleNew",
                subItems: [
                    {
                        name: "performance",
                        title: "mobileAppsAnalysis.overview.performance.titleNew",
                        state: "salesIntelligence-apps-performance",
                        lockIcon: isLocked(swSettings.components.WsAppPerformance),
                        hidden: isHidden(swSettings.components.WsAppPerformance),
                    },
                    {
                        name: "ranking",
                        title: "mobileAppsAnalysis.overview.ranking.titleNew",
                        state: "salesIntelligence-apps-ranking",
                        lockIcon: isLocked(swSettings.components.WsAppRanking),
                        hidden: isHidden(swSettings.components.WsAppRanking),
                    },
                    {
                        name: "engagementoverview",
                        title: "mobileAppAnalysis.usageAndDownloads.engagement.title",
                        state: "salesIntelligence-apps-engagementoverview",
                        isBetaByChosenItem: (chosenItems) => chosenItems[0].AppStore !== "Google",
                        lockIcon: isLocked(swSettings.components.WsAppEngagement),
                        hidden: isHidden(swSettings.components.WsAppEngagement),
                    },
                ],
            },
            {
                name: "apps",
                title: "mobileAppAnalysis.appaudience.titleNew",
                subItems: [
                    {
                        name: "demographics",
                        title: "mobileAppAnalysis.appaudience.demographics.title",
                        state: "salesIntelligence-apps-demographics",
                        lockIcon: isLocked(swSettings.components.WsAppDemographics),
                        hidden: isHidden(swSettings.components.WsAppDemographics),
                        isBeta: true,
                        overrideParams: {
                            duration: "1m",
                        },
                    },
                    {
                        name: "engagementaffinity",
                        title: "mobileAppAnalysis.appaudience.interests.title",
                        state: "salesIntelligence-apps-appaudienceinterests",
                        lockIcon: isLocked(swSettings.components.WsAppInterests),
                        hidden: isHidden(swSettings.components.WsAppInterests),
                    },
                ],
            },
        ].map(applyNavItemPermissions),
    };
};
