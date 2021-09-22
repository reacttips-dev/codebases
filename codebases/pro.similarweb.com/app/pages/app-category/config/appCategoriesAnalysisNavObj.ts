import { swSettings } from "common/services/swSettings";
import { INavItem } from "../../../components/React/SideNavComponents/SideNav.types";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { ISwSettings } from "../../../@types/ISwSettings";
import { isLocked } from "../../../../scripts/common/services/pageClaims";
import { applyNavItemPermissions } from "../../workspace/common/workspacesUtils";

export const navObj = (): { navList: INavItem[] } => {
    return {
        navList: [
            {
                name: "appcategory",
                title: "sidebar.rankings.title",
                subItems: [
                    {
                        name: "leaderboard",
                        title: "sidebar.rankings.topapps.title",
                        state: "appcategory-leaderboard",
                    },
                    {
                        name: "trends",
                        title: "sidebar.rankings.trendingapps.title",
                        state: "appcategory-trends",
                    },
                ],
            },
            // {
            //     name: 'store',
            //     title: 'sidebar.store.title',
            //     subItems: [
            //         {
            //             name: 'topkeywords',
            //             title: 'sidebar.store.topkeywords.title',
            //             state: 'appcategory.topkeywords',
            //             options: {
            //                 android: true
            //             },
            //             lockIcon: isLocked(swSettings.components.TopKeywords)
            //         }
            //     ]
            // }
        ].map(applyNavItemPermissions),
    };
};
