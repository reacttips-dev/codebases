import { swSettings } from "common/services/swSettings";
import { isHidden, isLocked } from "../../../../scripts/common/services/pageClaims";
import { INavItem } from "../../../components/React/SideNavComponents/SideNav.types";
import { canCreateSneak } from "../../sneakpeek/utilities";
import { applyNavItemPermissions } from "../../workspace/common/workspacesUtils";

export interface ISlimNavItems {
    state: string;
    tab?: string;
    title?: string;
}

const ignoreSearchKeywordsParams = {
    IncludeOrganic: null,
    IncludePaid: null,
    IncludeBranded: null,
    IncludeNoneBranded: null,
    IncludeNewKeywords: null,
    IncludeTrendingKeywords: null,
    IncludeQuestions: null,
    limits: null,
    BooleanSearchTerms: null,
};

export const navObj = (): { navList: INavItem[] } => {
    let items;
    if (swSettings.components.Home.resources.IsNoTouchUser) {
        items = navObjNoTouch();
    } else {
        items = navObjRegular();
    }
    return {
        navList: items
            .filter(({ title, subItems }) => {
                return subItems.length > 0 && (title !== "Sneak Peek" ? true : canCreateSneak());
            })
            .map(applyNavItemPermissions),
    };
};

const navObjRegular = () => {
    return [
        {
            title: "analysis.overview.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.overview.performance.title",
                    name: "worldwideOverview",
                    state: "websites-worldwideOverview",
                    options: {
                        isUSStatesSupported: true,
                        isVirtualSupported: false,
                    },
                    lockIcon: isLocked(swSettings.components.WorldwideOverviewPage),
                },
                {
                    title: "analysis.overview.competitive.landscape.title",
                    name: "similarsites",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-similarsites",
                    lockIcon: isLocked(swSettings.components.WorldwideOverviewPage),
                },
                swSettings.components.Home.resources.HasTechnographics
                    ? {
                          title: "analysis.overview.technographics.title",
                          name: "technographics",
                          options: {
                              isVirtualSupported: false,
                              isUSStatesSupported: false,
                          },
                          lockIcon: !swSettings.components.Home.resources.AllowTechnographics,
                          state: "websites-technographicsOverview",
                      }
                    : false,
            ].filter((item) => item),
        },
        {
            title: "analysis.traffic.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.traffic.engagement.title",
                    name: "audienceOverview",
                    state: "websites-audienceOverview",
                    options: {
                        isUSStatesSupported: true,
                        isVirtualSupported: false,
                    },
                    lockIcon: isLocked(swSettings.components.AudienceOverview),
                },
                {
                    title: "analysis.traffic.new.vs.returning.title",
                    name: "newVsReturning",
                    state: "websites-newVsReturning",
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
                    title: "analysis.traffic.marketing.channels.title",
                    name: "overview",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    state: "websites-trafficOverview",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
            ],
        },
        {
            title: "analysis.audience.title2",
            name: "websites",
            subItems: [
                {
                    title: "analysis.audience.geo.title",
                    name: "geography",
                    options: {
                        isUSStatesSupported: false,
                        isVirtualSupported: true,
                    },
                    state: "websites-audienceGeography",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.audience.demo.title",
                    name: "demographics",
                    options: {
                        isUSStatesSupported: false,
                        isVirtualSupported: true,
                    },
                    state: "websites-audienceDemographics",
                    lockIcon: isLocked(swSettings.components.WebDemographics),
                },
                {
                    title: "analysis.audience.interests.title",
                    name: "audience",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-audienceInterests",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.audience.overlap.title",
                    name: "loyalty",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-audienceOverlap",
                    lockIcon: isLocked(swSettings.components.WebAudienceOverlap),
                    hidden: isHidden(swSettings.components.WebAudienceOverlap),
                    isBeta: true,
                },
            ],
        },
        {
            title: "analysis.search.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.search.overview.title",
                    name: "searchOverview",
                    state: "websites-trafficSearch-overview",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    defaultQueryParams: {
                        ...ignoreSearchKeywordsParams,
                    },
                    lockIcon: isLocked(swSettings.components.WsWebSearchOverview),
                    hidden: isHidden(swSettings.components.WsWebSearchOverview),
                },
                {
                    title: "analysis.search.adspend.title",
                    name: "searchAdSpend",
                    state: "websites-trafficSearch-adspend",
                    options: {
                        isVirtualSupported: true,
                    },
                    isBeta: true,
                    hidden: isHidden(swSettings.components.WsAdSpend),
                },
                {
                    title: "analysis.search.keywords.title",
                    name: "searchKeywords",
                    state: "websites-trafficSearch-keywords",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    lockIcon: isLocked(swSettings.components.WsWebSearchKeywords),
                    hidden: isHidden(swSettings.components.WsWebSearchKeywords),
                },
                {
                    title: "analysis.search.phrases.title",
                    name: "searchPhrases",
                    state: "websites-trafficSearch-phrases",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    defaultQueryParams: {
                        ...ignoreSearchKeywordsParams,
                    },
                    lockIcon: isLocked(swSettings.components.WsWebSearchPhrases),
                    hidden: isHidden(swSettings.components.WsWebSearchPhrases),
                },
                {
                    title: "analysis.search.organic.landing.pages.title",
                    name: "organicLandingPages",
                    state: "websites-organicLandingPages",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: false,
                    },
                    defaultQueryParams: {
                        webSource: "Desktop",
                    },
                    isBeta: true,
                    lockIcon: isLocked(swSettings.components.WebsiteOrganicLandingPages),
                    hidden: isHidden(swSettings.components.WebsiteOrganicLandingPages),
                },
                {
                    title: "analysis.search.ads.title",
                    name: "searchAds",
                    state: "websites-trafficSearch-ads",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    defaultQueryParams: {
                        ...ignoreSearchKeywordsParams,
                    },
                    lockIcon: isLocked(swSettings.components.WsWebSearchAds),
                    hidden: isHidden(swSettings.components.WsWebSearchAds),
                },
                {
                    title: "analysis.search.plaresearch.title",
                    name: "plaResearch",
                    state: "websites-trafficSearch-plaResearch",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    defaultQueryParams: {
                        ...ignoreSearchKeywordsParams,
                    },
                    lockIcon: isLocked(swSettings.components.WsWebSearchAds),
                    hidden: isHidden(swSettings.components.WsWebSearchAds),
                },
                {
                    title: "analysis.search.organic.competitors.title",
                    name: "competitorsOrganicKeywords",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-competitorsOrganicKeywords",
                    lockIcon: isLocked(swSettings.components.WsWebOrganicSearchCompetitors),
                    hidden: isHidden(swSettings.components.WsWebOrganicSearchCompetitors),
                    overrideParams: {
                        duration: "3m",
                        category: null,
                    },
                },
                {
                    title: "analysis.search.paid.competitors.title",
                    name: "competitorsPaidKeywords",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-competitorsPaidKeywords",
                    lockIcon: isLocked(swSettings.components.WsWebPaidSearchCompetitors),
                    hidden: isHidden(swSettings.components.WsWebPaidSearchCompetitors),
                    overrideParams: {
                        duration: "3m",
                        category: null,
                    },
                },
            ].filter((item) => item),
        },
        {
            title: "analysis.referrals.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.referrals.incoming.title",
                    name: "referrals",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    state: "websites-trafficReferrals",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                    defaultQueryParams: {
                        limits: null,
                    },
                },
                {
                    title: "analysis.referrals.outgoing.title",
                    name: "outgoing",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    state: "websites-outgoing",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
            ],
        },
        {
            title: "analysis.display.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.display.overview.title",
                    name: "displayOverview",
                    state: "websites-trafficDisplay-overview",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.display.publishers.title",
                    name: "Publishers",
                    state: "websites-trafficDisplay",
                    tab: "publishers",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    defaultQueryParams: {
                        selectedTab: "publishers",
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.display.mediators.title",
                    name: "adNetworks",
                    state: "websites-trafficDisplay-adNetworks",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.display.creatives.title",
                    name: "creatives",
                    state: "websites-trafficDisplay-creatives",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: false,
                    },
                    lockIcon: isLocked(swSettings.components.WebsiteAdsIntelDisplay),
                },
                {
                    title: "analysis.display.videos.title",
                    name: "videos",
                    state: "websites-trafficDisplay-videos",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: false,
                    },
                    lockIcon: isLocked(swSettings.components.WebsiteAdsIntelVideo),
                },
            ],
        },
        {
            title: "analysis.social.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.social.overview.title",
                    name: "social",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    state: "websites-trafficSocial",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
            ],
        },
        {
            title: "analysis.content.title2",
            name: "websites",
            subItems: [
                {
                    title: "analysis.content.subdomains.title",
                    name: "subdomains",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-subdomains",
                    defaultQueryParams: {
                        state: "desktop",
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                ...((swSettings.components.Workspaces.resources.WorkspaceType === undefined &&
                    swSettings.components.PopularPages.isAllowed) ||
                (swSettings.components.Workspaces.resources.WorkspaceType !== undefined &&
                    swSettings.components.WsWebContentPages.resources.AvaliabilityMode === "Open")
                    ? [
                          {
                              title: "analysis.content.popular.title2",
                              name: "popular",
                              options: {
                                  isVirtualSupported: false,
                                  isUSStatesSupported: true,
                              },
                              defaultQueryParams: {
                                  webSource: "Total",
                              },
                              state: "websites-popular",
                          },
                          {
                              title: "analysis.content.folders.title",
                              name: "folders",
                              options: {
                                  isVirtualSupported: false,
                                  isUSStatesSupported: true,
                              },
                              state: "websites-folders",
                              defaultQueryParams: {
                                  webSource: "Total",
                              },
                          },
                      ]
                    : []),
            ],
        },
        {
            title: "analysis.monetization.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.monetization.advertisers.title",
                    name: "paid-outgoing",
                    state: "websites-paidoutgoing",
                    tab: "advertisers",
                    defaultQueryParams: {
                        selectedTab: "advertisers",
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.monetization.adnetworks.title",
                    name: "paid-outgoing",
                    state: "websites-paidoutgoing",
                    tab: "adNetworks",
                    defaultQueryParams: {
                        selectedTab: "adNetworks",
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
            ],
        },
        {
            title: "Sneak Peek",
            name: "websites",
            disabled: false,
            subItems: [
                {
                    title: "Data Query",
                    name: "sneakpeekQuery",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-sneakpeekQuery",
                },
                {
                    title: "Data Results",
                    name: "sneakpeekResults",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-sneakpeekResults",
                },
            ],
        },
    ];
};

const navObjNoTouch = () => {
    return [
        {
            title: "analysis.overview.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.overview.performance.title",
                    name: "worldwideOverview",
                    state: "websites-worldwideOverview",
                    options: {
                        isUSStatesSupported: true,
                        isVirtualSupported: false,
                    },
                    lockIcon: isLocked(swSettings.components.WorldwideOverviewPage),
                },
                {
                    title: "analysis.overview.competitive.landscape.title",
                    name: "similarsites",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-similarsites",
                    lockIcon: isLocked(swSettings.components.WorldwideOverviewPage),
                },
                {
                    title: "analysis.content.subdomains.title",
                    name: "subdomains",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-subdomains",
                    defaultQueryParams: {
                        state: "desktop",
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                swSettings.components.Home.resources.HasTechnographics
                    ? {
                          title: "analysis.overview.technographics.title",
                          name: "technographics",
                          options: {
                              isVirtualSupported: false,
                              isUSStatesSupported: false,
                          },
                          lockIcon: !swSettings.components.Home.resources.AllowTechnographics,
                          state: "websites-technographicsOverview",
                      }
                    : false,
            ].filter((item) => item),
        },
        {
            title: "analysis.audience.title2",
            name: "websites",
            subItems: [
                {
                    title: "analysis.traffic.engagement.title",
                    name: "audienceOverview",
                    state: "websites-audienceOverview",
                    options: {
                        isUSStatesSupported: true,
                        isVirtualSupported: false,
                    },
                    lockIcon: isLocked(swSettings.components.AudienceOverview),
                },
                {
                    title: "analysis.audience.geo.title",
                    name: "geography",
                    options: {
                        isUSStatesSupported: false,
                        isVirtualSupported: true,
                    },
                    state: "websites-audienceGeography",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.audience.demo.title",
                    name: "demographics",
                    options: {
                        isUSStatesSupported: false,
                        isVirtualSupported: true,
                    },
                    state: "websites-audienceDemographics",
                    lockIcon: isLocked(swSettings.components.WebDemographics),
                },
                {
                    title: "analysis.audience.interests.title",
                    name: "audience",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-audienceInterests",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
            ],
        },
        {
            title: "analysis.marketingoverview.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.traffic.marketing.channels.title",
                    name: "overview",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    state: "websites-trafficOverview",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
            ],
        },
        {
            title: "analysis.search.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.search.overview.title",
                    name: "searchOverview",
                    state: "websites-trafficSearch-overview",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    defaultQueryParams: {
                        ...ignoreSearchKeywordsParams,
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.search.adspend.title",
                    name: "searchAdSpend",
                    state: "websites-trafficSearch-adspend",
                    options: {
                        isVirtualSupported: true,
                    },
                    isBeta: true,
                    hidden: isHidden(swSettings.components.WsAdSpend),
                },
                {
                    title: "analysis.search.keywords.title",
                    name: "searchKeywords",
                    state: "websites-trafficSearch-keywords",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.search.phrases.title",
                    name: "searchPhrases",
                    state: "websites-trafficSearch-phrases",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    defaultQueryParams: {
                        ...ignoreSearchKeywordsParams,
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.search.ads.title",
                    name: "searchAds",
                    state: "websites-trafficSearch-ads",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    defaultQueryParams: {
                        ...ignoreSearchKeywordsParams,
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.search.plaresearch.title",
                    name: "plaResearch",
                    state: "websites-trafficSearch-plaResearch",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    defaultQueryParams: {
                        ...ignoreSearchKeywordsParams,
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.search.competitors.title",
                    name: "competitorsOrganicKeywords",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-competitorsOrganicKeywords",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                    overrideParams: {
                        duration: "3m",
                    },
                },
                {
                    title: "analysis.search.competitors.title",
                    name: "competitorsPaidKeywords",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-competitorsPaidKeywords",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                    overrideParams: {
                        duration: "3m",
                    },
                },
            ],
        },
        {
            title: "analysis.referrals.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.referrals.incoming.title",
                    name: "referrals",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    state: "websites-trafficReferrals",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                    defaultQueryParams: {
                        limits: null,
                    },
                },
                {
                    title: "analysis.referrals.outgoing.title",
                    name: "outgoing",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    state: "websites-outgoing",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
            ],
        },
        {
            title: "analysis.display.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.display.overview.title",
                    name: "displayOverview",
                    state: "websites-trafficDisplay-overview",
                    tab: "overview",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    defaultQueryParams: {
                        selectedTab: "overview",
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.display.publishers.title",
                    name: "Publishers",
                    state: "websites-trafficDisplay",
                    tab: "publishers",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    defaultQueryParams: {
                        selectedTab: "publishers",
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.display.mediators.title",
                    name: "adNetworks",
                    state: "websites-trafficDisplay-adNetworks",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.display.creatives.title",
                    name: "creatives",
                    state: "websites-trafficDisplay-creatives",
                    tab: "creatives",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: false,
                    },
                    lockIcon: isLocked(swSettings.components.WebsiteAdsIntelDisplay),
                },
                {
                    title: "analysis.display.videos.title",
                    name: "videos",
                    state: "websites-trafficDisplay-videos",
                    tab: "videos",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: false,
                    },
                    lockIcon: isLocked(swSettings.components.WebsiteAdsIntelVideo),
                },
            ],
        },
        {
            title: "analysis.social.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.social.overview.title",
                    name: "social",
                    options: {
                        isVirtualSupported: true,
                        isUSStatesSupported: true,
                    },
                    state: "websites-trafficSocial",
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
            ],
        },
        {
            title: "analysis.content.title2",
            name: "websites",
            subItems: [
                ...((swSettings.components.Workspaces.resources.WorkspaceType === undefined &&
                    swSettings.components.PopularPages.isAllowed) ||
                (swSettings.components.Workspaces.resources.WorkspaceType !== undefined &&
                    swSettings.components.WsWebContentPages.resources.AvaliabilityMode === "Open")
                    ? [
                          {
                              title: "analysis.content.popular.title2",
                              name: "popular",
                              options: {
                                  isVirtualSupported: false,
                                  isUSStatesSupported: true,
                              },
                              defaultQueryParams: {
                                  webSource: "Total",
                              },
                              state: "websites-popular",
                          },
                          {
                              title: "analysis.content.folders.title",
                              name: "folders",
                              options: {
                                  isVirtualSupported: false,
                                  isUSStatesSupported: true,
                              },
                              state: "websites-folders",
                              defaultQueryParams: {
                                  webSource: "Total",
                              },
                          },
                      ]
                    : []),
            ],
        },
        {
            title: "analysis.monetization.title",
            name: "websites",
            subItems: [
                {
                    title: "analysis.monetization.advertisers.title",
                    name: "paid-outgoing",
                    state: "websites-paidoutgoing",
                    tab: "advertisers",
                    defaultQueryParams: {
                        selectedTab: "advertisers",
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
                {
                    title: "analysis.monetization.adnetworks.title",
                    name: "paid-outgoing",
                    state: "websites-paidoutgoing",
                    tab: "adNetworks",
                    defaultQueryParams: {
                        selectedTab: "adNetworks",
                    },
                    lockIcon: isLocked(swSettings.components.WebAnalysis),
                },
            ],
        },
        {
            title: "Sneak Peek",
            name: "websites",
            disabled: false,
            subItems: [
                {
                    title: "Data Query",
                    name: "sneakpeekQuery",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-sneakpeekQuery",
                },
                {
                    title: "Data Results",
                    name: "sneakpeekResults",
                    options: {
                        isVirtualSupported: false,
                        isUSStatesSupported: true,
                    },
                    state: "websites-sneakpeekResults",
                },
            ],
        },
    ];
};
