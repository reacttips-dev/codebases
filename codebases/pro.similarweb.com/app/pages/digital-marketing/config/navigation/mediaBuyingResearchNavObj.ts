import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { applyNavItemPermissions } from "../../../workspace/common/workspacesUtils";
import { NavBarGroupItemWithIcon } from "@similarweb/ui-components/dist/navigation-bar";
import { swSettings } from "common/services/swSettings";
import { isHidden, isLocked } from "../../../../../scripts/common/services/pageClaims";

export const navObj = (): { navList: INavItem[] } => {
    return {
        navList: [
            {
                title: "mediabuying.analyzepublisher.home",
                name: "analyzepublisher.home",
                state: "analyzepublishers_home",
                lockIcon: isLocked(swSettings.components.PublishersAnalysisHome),
                hidden: isHidden(swSettings.components.PublishersAnalysisHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "nav-publishers",
                    "data-automation-section": "mediabuying.analyzepublisher.home",
                },
                subItems: [
                    {
                        title: "mediabuying.analyzepublisher.overview",
                        name: "analyzepublisher.overview",
                        state: "analyzepublishers_performanceoverview",
                        lockIcon: isLocked(swSettings.components.WsWebOverview),
                        hidden: isHidden(swSettings.components.WsWebOverview),
                    },
                    {
                        title: "mediabuying.analyzepublisher.monitizationnetworks",
                        name: "analyzepublisher.monitizationnetworks",
                        state: "analyzepublishers_monitizationnetworks",
                        tab: "adNetworks",
                        defaultQueryParams: {
                            selectedTab: "adNetworks",
                        },
                        lockIcon: isLocked(swSettings.components.WsWebMonetizationAdvertisers),
                        hidden: isHidden(swSettings.components.WsWebMonetizationAdvertisers),
                    },
                    {
                        title: "mediabuying.analyzepublisher.advertisers",
                        name: "analyzepublisher.advertisers",
                        state: "analyzepublishers_advertisers",
                        tab: "advertisers",
                        defaultQueryParams: {
                            selectedTab: "advertisers",
                        },
                        lockIcon: isLocked(swSettings.components.WsWebMonetizationAdvertisers),
                        hidden: isHidden(swSettings.components.WsWebMonetizationAdvertisers),
                    },
                    {
                        title: "mediabuying.analyzepublisher.outgoinglinks",
                        name: "analyzepublisher.outgoinglinks",
                        state: "analyzepublishers_outgoinglinks",
                        lockIcon: isLocked(swSettings.components.WsWebReferralOutgoingTraffic),
                        hidden: isHidden(swSettings.components.WsWebReferralOutgoingTraffic),
                    },
                ],
            },
            {
                title: "mediabuying.findpublishers.home",
                name: "findpublishers.home",
                state: "findpublishers_home",
                lockIcon: isLocked(swSettings.components.FindPublishersHome),
                hidden: isHidden(swSettings.components.FindPublishersHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "wand",
                    "data-automation-section": "mediabuying.findpublishers.home",
                },
                permanentlyClosed: true,
                subItems: [
                    {
                        title: "mediabuying.findpublishers.byindustry",
                        name: "findpublishers.byindustry",
                        state: "findpublishers_byindustry",
                        isLocked: false, // Item hidden by parent anyway
                    },
                    {
                        title: "mediabuying.findpublishers.bycompetition",
                        name: "findpublishers.bycompetition",
                        state: "findpublishers_bycompetition",
                        tab: "publishers",
                        defaultQueryParams: {
                            selectedTab: "publishers",
                        },
                        isLocked: false, // Item hidden by parent anyway
                    },
                ],
            },
            {
                title: "mediabuying.findadnetworks.home",
                name: "findadnetworks.home",
                state: "findadnetworks_home",
                lockIcon: isLocked(swSettings.components.FindAdNetworksHome),
                hidden: isHidden(swSettings.components.FindAdNetworksHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "wand",
                    "data-automation-section": "mediabuying.findadnetworks.home",
                },
                permanentlyClosed: true,
                subItems: [
                    {
                        title: "mediabuying.findadnetworks.byindustry",
                        name: "findadnetworks.byindustry",
                        state: "findadnetworks_byindustry",
                        isLocked: false, // Item hidden by parent anyway
                    },
                    {
                        title: "mediabuying.findadnetworks.bycompetition",
                        name: "findadnetworks.bycompetition",
                        state: "findadnetworks_bycompetition",
                        tab: "mediators",
                        isLocked: false, // Item hidden by parent anyway
                    },
                ],
            },
        ].map(applyNavItemPermissions),
    };
};
