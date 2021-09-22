import { NavBarGroupItemWithIcon } from "@similarweb/ui-components/dist/navigation-bar";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import {
    isLocked,
    isHidden,
    isHiddenForWorldWideOnlyUsers,
} from "../../../../../scripts/common/services/pageClaims";
import { INavItem } from "../../../../components/React/SideNavComponents/SideNav.types";
import { applyNavItemPermissions } from "../../../workspace/common/workspacesUtils";
import { SecondaryBarSectionItem } from "components/SecondaryBar/Components/SecondaryBarSectionItem";

const IOS_PREFIX = "1_";
const translate = i18nFilter();

const isIOSApp = (urlParams): boolean => {
    return urlParams?.appId?.startsWith(IOS_PREFIX);
};

export const navObj = (): { navList: INavItem[] } => {
    return {
        navList: [
            {
                name: "companyresearch.websiteanalysis",
                title: "marketintelligence.companyresearch.websites.menu",
                state: "companyresearch_websiteanalysis_home",
                lockIcon: isLocked(swSettings.components.WebMarketAnalysisOverviewHome),
                hidden: isHidden(swSettings.components.WebMarketAnalysisOverviewHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "globe",
                    "data-automation-section": "marketintelligence.companyresearch.websites.menu",
                },
                subItems: [
                    {
                        title: "analysis.overview.title",
                        name: "overview",
                        hideIfNoSubItems: true,
                        menuItemComponent: SecondaryBarSectionItem,
                        menuItemComponentProps: {
                            text: translate("analysis.overview.title"),
                            "data-automation-group": "analysis.overview.title",
                            isInitiallyOpened: true,
                        },
                        subItems: [
                            {
                                title: "analysis.overview.performance.title",
                                name: "worldwideOverview",
                                state: "companyresearch_website_websiteperformance",
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
                                title: "analysis.overview.competitive.landscape.title",
                                name: "competitiveLandscape",
                                state: "companyresearch_website_competitivelandscape",
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "analysis.overview.competitive.landscape.title",
                                },
                                options: {
                                    isVirtualSupported: false,
                                    isUSStatesSupported: true,
                                },
                                lockIcon: isLocked(swSettings.components.WsWebCompetitors),
                                hidden: isHidden(swSettings.components.WsWebCompetitors),
                            },
                            {
                                title: "analysis.content.subdomains.title",
                                name: "subdomains",
                                menuItemComponentProps: {
                                    "data-automation-item": "analysis.content.subdomains.title",
                                },
                                options: {
                                    isVirtualSupported: false,
                                    isUSStatesSupported: true,
                                },
                                state: "companyresearch_website_subdomains",
                                defaultQueryParams: {
                                    state: "desktop",
                                },
                                lockIcon: isLocked(swSettings.components.WsWebContentSubdomains),
                                hidden: isHidden(swSettings.components.WsWebContentSubdomains),
                            },
                        ],
                    },
                    {
                        title: "analysis.audience.title2",
                        name: "audience",
                        hideIfNoSubItems: true,
                        menuItemComponent: SecondaryBarSectionItem,
                        menuItemComponentProps: {
                            text: translate("analysis.audience.title2"),
                            "data-automation-group": "analysis.audience.title2",
                            isInitiallyOpened: true,
                        },
                        subItems: [
                            {
                                title: "analysis.traffic.engagement.title",
                                name: "traffic-traffic&engagement",
                                state: "companyresearch_website_trafficandengagement",
                                menuItemComponentProps: {
                                    "data-automation-item": "analysis.traffic.engagement.title",
                                },
                                options: {
                                    isUSStatesSupported: true,
                                    isVirtualSupported: false,
                                },
                                lockIcon: isLocked(swSettings.components.WsWebTrafficAndEngagement),
                                hidden: isHidden(swSettings.components.WsWebTrafficAndEngagement),
                            },
                            {
                                title: "analysis.traffic.new.vs.returning.title",
                                name: "newVsReturning",
                                state: "companyresearch_website_new_vs_returning",
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "analysis.traffic.new.vs.returning.title",
                                },
                                options: {
                                    isUSStatesSupported: false,
                                    isVirtualSupported: false,
                                },
                                lockIcon: isLocked(swSettings.components.WebNewVsReturning),
                                hidden: isHidden(swSettings.components.WebNewVsReturning),
                                isNew: true,
                                defaultQueryParams: {
                                    comparedDuration: "",
                                },
                            },
                            {
                                title: "analysis.audience.overlap.title",
                                name: "overlap",
                                options: {
                                    isVirtualSupported: false,
                                    isUSStatesSupported: true,
                                },
                                state: "companyresearch_website_audienceOverlap",
                                lockIcon: isLocked(swSettings.components.WebAudienceOverlap), //isLocked(swSettings.components.WebAudienceOverlap),
                                hidden: isHidden(swSettings.components.WebAudienceOverlap),
                                isBeta: true,
                            },
                            {
                                title: "analysis.audience.interests.title",
                                name: "audience",
                                menuItemComponentProps: {
                                    "data-automation-item": "analysis.audience.interests.title",
                                },
                                options: {
                                    isVirtualSupported: false,
                                    isUSStatesSupported: true,
                                },
                                state: "companyresearch_website_audienceInterests",
                                lockIcon: isLocked(swSettings.components.WsWebAudienceInterests),
                                hidden: isHidden(swSettings.components.WsWebAudienceInterests),
                            },
                            {
                                title: "analysis.audience.geo.title",
                                name: "geography",
                                menuItemComponentProps: {
                                    "data-automation-item": "analysis.audience.geo.title",
                                },
                                options: {
                                    isUSStatesSupported: false,
                                    isVirtualSupported: true,
                                },
                                state: "companyresearch_website_geography",
                                lockIcon: isLocked(swSettings.components.WsWebGeography),
                                hidden: isHidden(swSettings.components.WsWebGeography),
                            },
                            {
                                title: "analysis.audience.demo.title",
                                name: "demographics",
                                menuItemComponentProps: {
                                    "data-automation-item": "analysis.audience.demo.title",
                                },
                                options: {
                                    isUSStatesSupported: false,
                                    isVirtualSupported: true,
                                },
                                state: "companyresearch_website_demographics",
                                lockIcon: isLocked(swSettings.components.WebDemographics),
                                hidden: isHidden(swSettings.components.WebDemographics),
                            },
                        ],
                    },
                    {
                        title: "analysis.acquisition.title",
                        name: "acquisition",
                        hideIfNoSubItems: true,
                        menuItemComponent: SecondaryBarSectionItem,
                        menuItemComponentProps: {
                            text: translate("analysis.acquisition.title"),
                            "data-automation-group": "analysis.acquisition.title",
                            isInitiallyOpened: true,
                        },
                        subItems: [
                            {
                                title: "analysis.traffic.marketing.channels.title",
                                name: "overview",
                                menuItemComponentProps: {
                                    "data-automation-item":
                                        "analysis.traffic.marketing.channels.title",
                                },
                                options: {
                                    isVirtualSupported: true,
                                    isUSStatesSupported: true,
                                },
                                state: "companyresearch_website_marketingchannels",
                                lockIcon: isLocked(swSettings.components.WsWebTrafficChannels),
                                hidden: isHidden(swSettings.components.WsWebTrafficChannels),
                            },
                        ],
                    },
                    {
                        title: "marketintelligence.companyresearch.websiteanalysis.structure.title",
                        name: "structure",
                        hideIfNoSubItems: true,
                        menuItemComponent: SecondaryBarSectionItem,
                        menuItemComponentProps: {
                            text: translate(
                                "marketintelligence.companyresearch.websiteanalysis.structure.title",
                            ),
                            isInitiallyOpened: true,
                            "data-automation-group":
                                "marketintelligence.companyresearch.websiteanalysis.structure.title",
                        },
                        subItems: [
                            ...((swSettings.components.Workspaces.resources.WorkspaceType ===
                                undefined &&
                                swSettings.components.PopularPages.isAllowed) ||
                            (swSettings.components.Workspaces.resources.WorkspaceType !==
                                undefined &&
                                swSettings.components.WsWebContentPages.resources
                                    .AvaliabilityMode === "Open")
                                ? [
                                      {
                                          title: "analysis.content.popular.title2",
                                          name: "popular",
                                          menuItemComponentProps: {
                                              "data-automation-item":
                                                  "analysis.content.popular.title2",
                                          },
                                          options: {
                                              isVirtualSupported: false,
                                              isUSStatesSupported: true,
                                          },
                                          defaultQueryParams: {
                                              webSource: "Total",
                                              isWWW: "*",
                                              comparedDuration: "",
                                          },
                                          state: "companyresearch_website_popular",
                                      },
                                      {
                                          title: "analysis.content.folders.title",
                                          name: "folders",
                                          menuItemComponentProps: {
                                              "data-automation-item":
                                                  "analysis.content.folders.title",
                                          },
                                          options: {
                                              isVirtualSupported: false,
                                              isUSStatesSupported: true,
                                          },
                                          state: "companyresearch_website_folders",
                                          defaultQueryParams: {
                                              webSource: "Total",
                                              isWWW: "*",
                                          },
                                          lockIcon: isLocked(
                                              swSettings.components.WsWebContentFolders,
                                          ),
                                          hidden: isHidden(
                                              swSettings.components.WsWebContentFolders,
                                          ),
                                      },
                                  ]
                                : []),
                        ],
                    },
                    {
                        title: "Sneak Peek",
                        name: "websites",
                        disabled: false,
                        menuItemComponent: SecondaryBarSectionItem,
                        menuItemComponentProps: {
                            text: "Sneakpeek",
                            isInitiallyOpened: true,
                        },
                        hidden: !swSettings.components.Home.resources.HasNewSneakPeek,
                        subItems: [
                            {
                                title: "Data Query",
                                name: "sneakpeekQuery",
                                options: {
                                    isVirtualSupported: false,
                                    isUSStatesSupported: true,
                                },
                                state: "companyresearch_website_sneakpeekQuery",
                            },
                            {
                                title: "Data Results",
                                name: "sneakpeekResults",
                                options: {
                                    isVirtualSupported: false,
                                    isUSStatesSupported: true,
                                },
                                state: "companyresearch_website_sneakpeekResults",
                            },
                        ],
                    },
                ],
            },
            {
                name: "marketintelligence.companyresearch.segmentanalysis",
                title: "marketintelligence.companyresearch.segmentanalysis.menu",
                state: "companyresearch_segments-homepage",
                lockIcon: isLocked(swSettings.components.CustomSegments),
                hidden: isHidden(swSettings.components.CustomSegments),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "chart-pie",
                },
                subItems: [
                    {
                        title: "analysis.audience.title",
                        name: "segments",
                        menuItemComponent: SecondaryBarSectionItem,
                        menuItemComponentProps: {
                            text: translate("analysis.audience.title"),
                            isInitiallyOpened: true,
                        },
                        subItems: [
                            {
                                title: "segment.analysis.traffic.engagement.title",
                                name: "segmentOverview",
                                state: "companyresearch_segments-analysis-traffic",
                                options: {
                                    isUSStatesSupported: false,
                                    isVirtualSupported: false,
                                },
                            },
                            {
                                title: "segment.analysis.geography.title",
                                name: "segmentGeography",
                                state: "companyresearch_segments-analysis-geography",
                                options: {
                                    isUSStatesSupported: false,
                                    isVirtualSupported: false,
                                },
                                isNew: true,
                            },
                        ],
                    },
                    {
                        title: "analysis.acquisition.title",
                        name: "segments",
                        menuItemComponent: SecondaryBarSectionItem,
                        menuItemComponentProps: {
                            text: translate("analysis.acquisition.title"),
                            isInitiallyOpened: true,
                        },
                        subItems: [
                            {
                                title: "segment.analysis.marketingChannels.title",
                                name: "segmentTrafficChannels",
                                state: "companyresearch_segments-analysis-marketingChannels",
                                options: {
                                    isUSStatesSupported: false,
                                    isVirtualSupported: false,
                                },
                            },
                        ],
                    },
                ],
            },
            {
                name: "marketintelligence.companyresearch.appsanalysis",
                title: "marketintelligence.companyresearch.appanalysis.menu",
                state: "companyresearch_appanalysis_home",
                lockIcon: isLocked(swSettings.components.AppAnalysisHome),
                hidden: isHidden(swSettings.components.AppAnalysisHome),
                menuItemComponent: NavBarGroupItemWithIcon,
                menuItemComponentProps: {
                    iconName: "nav-app-category",
                },
                subItems: [
                    {
                        title: "mobileAppsAnalysis.overview.titleNew",
                        name: "appoverview",
                        hideIfNoSubItems: true,
                        menuItemComponent: SecondaryBarSectionItem,
                        menuItemComponentProps: {
                            text: translate("mobileAppsAnalysis.overview.titleNew"),
                            isInitiallyOpened: true,
                        },
                        subItems: [
                            {
                                title: "mobileAppsAnalysis.overview.performance.titleNew",
                                name: "appperformance",
                                state: "companyresearch_app_appperformance",
                                lockIcon: isLocked(swSettings.components.WsAppPerformance),
                                hidden: isHidden(swSettings.components.WsAppPerformance),
                            },
                            {
                                name: "ranking",
                                title: "mobileAppsAnalysis.overview.ranking.titleNew",
                                state: "companyresearch_app_appranking",
                                lockIcon: isLocked(swSettings.components.WsAppRanking),
                                hidden: isHidden(swSettings.components.WsAppRanking),
                            },
                            {
                                name: "apps-engagementoverview",
                                title: "mobileAppAnalysis.usageAndDownloads.engagement.title",
                                state: "companyresearch_app_appengagementoverview",
                                isBeta: isIOSApp,
                                lockIcon: isLocked(swSettings.components.WsAppEngagement),
                                hidden: isHidden(swSettings.components.WsAppEngagement),
                            },
                        ],
                    },
                    // {
                    //     title: "mobileAppAnalysis.usageAndDownloads.title",
                    //     menuItemComponent: SecondaryBarSectionItem,
                    //     menuItemComponentProps: {
                    //         text: translate("mobileAppAnalysis.usageAndDownloads.title"),
                    //         isInitiallyOpened: true,
                    //     },
                    //     subItems: [
                    //         {
                    //             name: "engagementusage",
                    //             title: "mobileAppAnalysis.usageAndDownloads.retention.title",
                    //             state: "companyresearch_app_appretention",
                    //             lockIcon: isLocked(swSettings.components.WsAppRetention),
                    //             hidden: isHidden(swSettings.components.WsAppRetention),
                    //         },
                    //         {
                    //             name: "engagementretention",
                    //             title: "mobileAppAnalysis.usageAndDownloads.usagePatterns.title",
                    //             state: "companyresearch_app_appusagepatterns",
                    //             lockIcon: isLocked(swSettings.components.WsAppUsagePatterns),
                    //             hidden: isHidden(swSettings.components.WsAppUsagePatterns),
                    //         },
                    //     ],
                    // },
                    {
                        title: "mobileAppAnalysis.appaudience.titleNew",
                        hideIfNoSubItems: true,
                        menuItemComponent: SecondaryBarSectionItem,
                        menuItemComponentProps: {
                            text: translate("mobileAppAnalysis.appaudience.titleNew"),
                            isInitiallyOpened: true,
                        },
                        subItems: [
                            {
                                name: "demographics",
                                title: "mobileAppAnalysis.appaudience.demographics.title",
                                state: "companyresearch_app_appdmg",
                                isBeta: true,
                                lockIcon: isLocked(swSettings.components.WsAppDemographics),
                                hidden: isHidden(swSettings.components.WsAppDemographics),
                                overrideParams: {
                                    duration: "1m",
                                },
                            },
                            {
                                name: "engagementaffinity",
                                title: "mobileAppAnalysis.appaudience.interests.title",
                                state: "companyresearch_app_appinterests",
                                lockIcon: isLocked(swSettings.components.WsAppInterests),
                                hidden: isHidden(swSettings.components.WsAppInterests),
                            },
                        ],
                    },
                    {
                        title: "Sneak Peek",
                        menuItemComponent: SecondaryBarSectionItem,
                        menuItemComponentProps: {
                            text: "Sneak Peek",
                            isInitiallyOpened: true,
                        },
                        hidden: !swSettings.components.Home.resources.HasNewSneakPeek,
                        subItems: [
                            {
                                title: "Data Query",
                                name: "sneakpeekQuery",
                                state: "companyresearch_app_sneakpeekQuery",
                            },
                            {
                                title: "Data Results",
                                name: "sneakpeekResults",
                                state: "companyresearch_app_sneakpeekResults",
                            },
                        ],
                    },
                ],
            },
        ].map(applyNavItemPermissions),
    };
};
