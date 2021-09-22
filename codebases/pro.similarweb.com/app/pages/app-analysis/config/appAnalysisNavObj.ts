import { swSettings } from "common/services/swSettings";
import { isLocked } from "../../../../scripts/common/services/pageClaims";
import { INavItem } from "../../../components/React/SideNavComponents/SideNav.types";
import { canCreateSneak } from "../../sneakpeek/utilities";
import { applyNavItemPermissions } from "../../workspace/common/workspacesUtils";

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
                        state: "apps-performance",
                    },
                    {
                        name: "ranking",
                        title: "mobileAppsAnalysis.overview.ranking.titleNew",
                        state: "apps-ranking",
                    },
                    {
                        name: "apps-engagementoverview",
                        title: "mobileAppAnalysis.usageAndDownloads.engagement.title",
                        state: "apps-engagementoverview",
                        isBetaByChosenItem: (chosenItems) => chosenItems[0].AppStore !== "Google",
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
                        state: "apps-demographics",
                        isBeta: true,
                        overrideParams: {
                            duration: "1m",
                        },
                    },
                    {
                        name: "engagementaffinity",
                        title: "mobileAppAnalysis.appaudience.interests.title",
                        state: "apps-appaudienceinterests",
                    },
                ],
            },
            // {
            //     name: 'apps',
            //     title: 'mobileAppsAnalysis.storePage.titleNew',
            //     subItems: [
            //         {
            //             name: 'externaltraffic',
            //             title: 'mobileAppsAnalysis.storePage.externaltraffic.titleNew',
            //             state: 'apps.externaltraffic',
            //             lockIcon: isLocked(swSettings.components.StorePage)
            //         },
            //         {
            //             name: 'websearch',
            //             title: 'mobileAppsAnalysis.storePage.externalSearchKeywords.title',
            //             state: 'apps.websearch',
            //             lockIcon: isLocked(swSettings.components.StorePage)
            //         },
            //         {
            //             name: 'instoretraffic',
            //             title: 'mobileAppsAnalysis.storePage.storeTrafficChannels.title',
            //             state: 'apps.instoretraffic',
            //             lockIcon: isLocked(swSettings.components.StorePage)
            //         },
            //         {
            //             name: 'instoresearch',
            //             title: 'mobileAppsAnalysis.storePage.inStoreSearch.titleNew',
            //             state: 'apps.instoresearch',
            //             lockIcon: isLocked(swSettings.components.StorePage)
            //         }
            //     ]
            // },
            {
                title: "Sneak Peek",
                name: "apps",
                disabled: false,
                subItems: [
                    {
                        title: "Data Query",
                        name: "sneakpeekQuery",
                        state: "apps-sneakpeekQuery",
                    },
                    {
                        title: "Data Results",
                        name: "sneakpeekResults",
                        state: "apps-sneakpeekResults",
                    },
                ],
            },
        ]
            .filter(({ title }) => {
                return title !== "Sneak Peek" ? true : canCreateSneak();
            })
            .map(applyNavItemPermissions),
    };
};

// export const navObj = () => {
//     return {
//         navList: [
//             {
//                 name: 'apps',
//                 title: 'mobileAppsAnalysis.overview.title',
//                 subItems: [
//                     {
//                         name: 'performance',
//                         title: 'app.performance.title',
//                         state: 'apps-performance',
//                     },
//                     {
//                         name: 'ranking',
//                         title: 'mobileAppsAnalysis.overview.ranking.title',
//                         state: 'apps-ranking',
//                     }
//                 ]
//             },
//             {
//                 name: 'apps',
//                 title: 'mobileAppsAnalysis.appaudience.title',
//                 subItems: [
//                     {
//                         name: 'demographics',
//                         title: 'apps.audience.demographics.title',
//                         state: 'apps-demographics',
//                         isBeta: true,
//                     }, {
//                         name: 'engagementaffinity',
//                         title: 'apps-engagementaffinity.pageTitle',
//                         state: 'apps-appaudienceinterests'
//                     }
//                 ]
//             },
//             {
//                 name: 'apps',
//                 title: 'mobileAppsAnalysis.engagement.navigationTitle',
//                 subItems: [
//                     {
//                         name: 'apps-engagementoverview',
//                         title: 'apps-engagementoverview.pageTitle',
//                         state: 'apps-engagementoverview',
//                     }, {
//                         name: 'engagementusage',
//                         title: 'apps-engagementusage.pageTitle',
//                         state: 'apps-engagementusage',
//                     }, {
//                         name: 'engagementretention',
//                         title: 'apps-engagementretention.pageTitle',
//                         state: 'apps-engagementretention',
//                     }
//                 ]
//             },
//             {
//                 name: 'apps',
//                 title: 'mobileAppsAnalysis.storePage.title',
//                 subItems: [
//                     {
//                         name: 'instoretraffic',
//                         title: 'mobileAppsAnalysis.storePage.instoretraffic.title',
//                         state: 'apps.instoretraffic',
//                     },
//                     {
//                         name: 'externaltraffic',
//                         title: 'mobileAppsAnalysis.storePage.externaltraffic.title',
//                         state: 'apps.externaltraffic',
//                     },
//                     {
//                         name: 'instoresearch',
//                         title: 'mobileAppsAnalysis.storePage.inStoreSearch.title',
//                         state: 'apps.instoresearch',
//                     },
//                     {
//                         name: 'websearch',
//                         title: 'mobileAppsAnalysis.storePage.webSearch.title',
//                         state: 'apps.websearch',
//                     }
//                 ]
//             },
//             {
//                 title: 'Sneak Peek',
//                 name: 'apps',
//                 disabled: false,
//                 subItems: [
//                     {
//                         title: 'Data Query',
//                         name: 'sneakpeekQuery',
//                         state: 'apps-sneakpeekQuery',
//                     },
//                     {
//                         title: 'Data Results',
//                         name: 'sneakpeekResults',
//                         state: 'apps-sneakpeekResults',
//                     }
//                 ]
//             }
//         ].filter(({title}) => {
//             return title !== 'Sneak Peek' ? true : canCreateSneak();
//         })
//     };
// }
