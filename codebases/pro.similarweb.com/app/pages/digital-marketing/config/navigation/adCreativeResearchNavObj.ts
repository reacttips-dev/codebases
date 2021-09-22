import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { applyNavItemPermissions } from "../../../workspace/common/workspacesUtils";
import { NavBarGroupItemWithIcon } from "@similarweb/ui-components/dist/navigation-bar";
import { swSettings } from "common/services/swSettings";
import { isHidden, isLocked } from "../../../../../scripts/common/services/pageClaims";

export const navObj = (): { navList: INavItem[] } => {
    return {
        navList: [
            {
                title: "adcreativeresearch.findsearchtextads.home",
                name: "findsearchtextads.home",
                state: "findSearchTextAds_home",
                lockIcon: isLocked(swSettings.components.AdCreativeFindTextAdsHome),
                hidden: isHidden(swSettings.components.AdCreativeFindTextAdsHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "wand",
                    "data-automation-section": "affiliateresearch.affiliateanalysis",
                },
                permanentlyClosed: true,
                subItems: [
                    {
                        title: "adcreativeresearch.findsearchtextads.bycompetitor",
                        name: "findsearchtextads.bycompetitor",
                        state: "findSearchTextAds_bycompetitor",
                        lockIcon: false, // menu item is hidden by parent anyway
                    },
                    {
                        title: "adcreativeresearch.findsearchtextads.bykeyword",
                        name: "findsearchtextads.bykeyword",
                        state: "findSearchTextAds_bykeyword",
                        lockIcon: false, // menu item is hidden by parent anyway
                    },
                ],
            },
            {
                title: "adcreativeresearch.findproductlistingads.home",
                name: "findproductlistingads.home",
                state: "findProductListingAds_home",
                lockIcon: isLocked(swSettings.components.AdCreativeFindProductAdsHome),
                hidden: isHidden(swSettings.components.AdCreativeFindProductAdsHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "wand",
                    "data-automation-section": "findproductlistingads.home",
                },
                permanentlyClosed: true,
                subItems: [
                    {
                        title: "adcreativeresearch.findproductlistingads.bycompetitor",
                        name: "findproductlistingads.bycompetitor",
                        state: "findProductListingAds_bycompetitor",
                        lockIcon: false, // menu item is hidden by parent anyway
                    },
                    {
                        title: "adcreativeresearch.findproductlistingads.bykeyword",
                        name: "findproductlistingads.bykeyword",
                        state: "findProductListingAds_bykeyword",
                        lockIcon: false, // menu item is hidden by parent anyway
                    },
                ],
            },
            {
                title: "adcreativeresearch.finddisplayads.home",
                name: "finddisplayads.home",
                state: "findDisplayAds_home",
                lockIcon: isLocked(swSettings.components.AdCreativeFindDisplayAdsHome),
                hidden: isHidden(swSettings.components.AdCreativeFindDisplayAdsHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "wand",
                    "data-automation-section": "finddisplayads.home",
                },
                permanentlyClosed: true,
                subItems: [
                    {
                        title: "adcreativeresearch.finddisplayads.bycompetitor",
                        name: "finddisplayads.bycompetitor",
                        state: "findDisplayAds_bycompetitor",
                        tab: "creatives",
                        lockIcon: false, // menu item is hidden by parent anyway
                    },
                ],
            },
            {
                title: "adcreativeresearch.findvideoads.home",
                name: "findvideoads.home",
                state: "findVideoAds_home",
                lockIcon: isLocked(swSettings.components.AdCreativeFindVideoAdsHome),
                hidden: isHidden(swSettings.components.AdCreativeFindVideoAdsHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "wand",
                    "data-automation-section": "findvideoads.home",
                },
                permanentlyClosed: true,
                subItems: [
                    {
                        title: "adcreativeresearch.findvideoads.bycompetitor",
                        name: "findvideoads.bycompetitor",
                        state: "findVideoAds_bycompetitor",
                        tab: "videos",
                        lockIcon: false, // menu item is hidden by parent anyway
                    },
                ],
            },
        ].map(applyNavItemPermissions),
    };
};
