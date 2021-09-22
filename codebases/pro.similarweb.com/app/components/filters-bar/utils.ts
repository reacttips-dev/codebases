/* eslint-disable @typescript-eslint/camelcase */
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { i18nFilter } from "../../filters/ngFilters";
import CountryService, { ICountryObject } from "../../services/CountryService";
import { SwTrack } from "services/SwTrack";

export function isHasMobileWebData(duration, country, componentId = "MobileWeb"): boolean {
    const hasMobileWebData =
        swSettings.allowedDuration(duration, componentId) &&
        swSettings.allowedCountry(country, componentId);
    return hasMobileWebData;
}
export function isHasMobileWebDataIgnoreDuration(country, componentId = "MobileWeb"): boolean {
    const hasMobileWebData = swSettings.allowedCountry(country, componentId);
    return hasMobileWebData;
}
export const commonWebSources = {
    // disabled = NOT has data AND NOT has permission
    // available = has data
    total: (disabled = false, available = true, props?: object) => ({
        id: "Total",
        text: i18nFilter()("websources.total"),
        icon: "combined",
        disabled,
        available,
        ...props,
    }),
    desktop: (disabled = false, available = true, props?: object) => ({
        id: "Desktop",
        text: i18nFilter()("toggler.title.desktop"),
        icon: "desktop",
        disabled,
        available,
        ...props,
    }),
    mobileWeb: (disabled = false, available = true, props?: object) => ({
        id: "MobileWeb",
        text: i18nFilter()("toggler.title.mobile"),
        icon: "mobile-web",
        disabled,
        available,
        ...props,
    }),
};

export const isSubdomainsFilterDisabled = (params, state): boolean => {
    // The next three lines are a temporary solution. They will be deprecated soon after the backends will fix the  SIM-28181 issue.
    const disabledTabsArray = ["plaResearch", "ads"];
    if (disabledTabsArray.includes(params.selectedTab)) {
        return true;
    }

    const isWebsiteVirtual = params.key && params.key[0] === "*";
    if (isWebsiteVirtual) {
        return true;
    }
    const isMainDomainDisabled = swSettings.current.resources.IsMainDomainDisabled;
    if (isMainDomainDisabled) {
        return true;
    } else {
        /*
        SIM-29737
        */
        // if (state.name === "websites-trafficSearch" && params.selectedTab === "keywords") {
        //     const duration = DurationService.getDurationData(params.duration);
        //     if (duration.raw.isDaily) {
        //         return true;
        //     }
        // }
        const disabledSupportedPages = [
            {
                subSection: "traffic",
                subSubSection: "referrals",
            },
            {
                subSection: "traffic",
                subSubSection: "search",
            },
            {
                subSection: "content",
                subSubSection: "popular",
            },
            {
                subSection: "content",
                subSubSection: "subdomains",
            },
        ];
        const isMobileWeb = params.webSource && params.webSource === "MobileWeb";
        const matchedPage = _.find(disabledSupportedPages, {
            subSection: state.pageId.subSection,
            subSubSection: state.pageId.subSubSection,
        });
        if (matchedPage && isMobileWeb) {
            return true;
        } else {
            return false;
        }
    }
};

const displayPagesWebSources = () => {
    return [commonWebSources.desktop(false)];
};

const searchPagesWebSources = (params) => {
    const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
    const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebSearch");
    const enabled = available && hasMobileWebSearchPermission;
    return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
};

const rankingDistributionWebSources = (params) => {
    return [commonWebSources.desktop(), commonWebSources.mobileWeb(false, true)];
};

export const pagesWebsources = {
    "websites-trafficReferrals": (params) => {
        const hasMobileWebReferralsPermission = swSettings.components.MobileWebReferrals.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebReferrals");
        const enabled = available && hasMobileWebReferralsPermission;
        return [
            commonWebSources.total(!enabled, available),
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    findaffiliates_bycompetition: (params) => {
        const hasMobileWebReferralsPermission = swSettings.components.MobileWebReferrals.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebReferrals");
        const enabled = available && hasMobileWebReferralsPermission;
        return [
            commonWebSources.total(!enabled, available),
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    competitiveanalysis_website_referrals_incomingtraffic: (params) => {
        const hasMobileWebReferralsPermission = swSettings.components.MobileWebReferrals.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebReferrals");
        const enabled = available && hasMobileWebReferralsPermission;
        return [
            commonWebSources.total(!enabled, available),
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    companyresearch_website_marketingchannels: (params) => {
        const hasMobileWebReferralsPermission = swSettings.components.MobileMarketingMix.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileMarketingMix");
        const enabled = available && hasMobileWebReferralsPermission;
        return [
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    accountreview_website_marketingchannels: (params) => {
        const hasMobileWebReferralsPermission = swSettings.components.MobileMarketingMix.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileMarketingMix");
        const enabled = available && hasMobileWebReferralsPermission;
        return [
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "websites-trafficOverview": (params) => {
        const hasMobileWebReferralsPermission = swSettings.components.MobileMarketingMix.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileMarketingMix");
        const enabled = available && hasMobileWebReferralsPermission;
        return [
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    competitiveanalysis_website_overview_marketingchannels: (params) => {
        const hasMobileWebReferralsPermission = swSettings.components.MobileMarketingMix.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileMarketingMix");
        const enabled = available && hasMobileWebReferralsPermission;
        return [
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    competitiveanalysis_website_organic_search_overview: searchPagesWebSources,
    competitiveanalysis_website_search_keyword: searchPagesWebSources,
    competitiveanalysis_website_search_phrases: searchPagesWebSources,
    competitiveanalysis_website_search_ranking_distribution: rankingDistributionWebSources,
    competitiveanalysis_website_search_ads: searchPagesWebSources,
    competitiveanalysis_website_search_plaResearch: () => {
        return [commonWebSources.desktop()];
    },
    competitiveanalysis_website_paid_search_overview: () => {
        return [commonWebSources.desktop()];
    },
    findSearchTextAds_bycompetitor: (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [
            commonWebSources.desktop(),
            params.selectedTab !== "plaResearch" && commonWebSources.mobileWeb(!enabled, available),
        ];
    },
    findProductListingAds_bycompetitor: (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [
            commonWebSources.desktop(),
            params.selectedTab !== "plaResearch" && commonWebSources.mobileWeb(!enabled, available),
        ];
    },
    findkeywords_bycompetition: (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [
            commonWebSources.desktop(),
            params.selectedTab !== "plaResearch" && commonWebSources.mobileWeb(!enabled, available),
        ];
    },
    "websites-trafficSearch-plaResearch": () => {
        return [commonWebSources.desktop()];
    },
    "websites-trafficSearch-adspend": () => {
        return [commonWebSources.desktop()];
    },
    companyresearch_website_subdomains: (params) => {
        const hasSubDomainsPagesMobileWeb =
            swSettings.components.WebAnalysis.resources.HasSubDomainsPagesMobileWeb;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const enabled = available && hasSubDomainsPagesMobileWeb;
        return [
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    accountreview_website_subdomains: (params) => {
        const hasSubDomainsPagesMobileWeb =
            swSettings.components.WebAnalysis.resources.HasSubDomainsPagesMobileWeb;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const enabled = available && hasSubDomainsPagesMobileWeb;
        return [
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "websites-subdomains": (params) => {
        const hasSubDomainsPagesMobileWeb =
            swSettings.components.WebAnalysis.resources.HasSubDomainsPagesMobileWeb;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const enabled = available && hasSubDomainsPagesMobileWeb;
        return [
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    companyresearch_website_folders: (params) => {
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const hasPopularPagesPermission = swSettings.components.PopularPages.isAllowed;
        const hasPopularPagesMobileWeb =
            swSettings.components.WebAnalysis.resources.HasPopularPagesMobileWeb;
        const enabled = available && hasPopularPagesPermission && hasPopularPagesMobileWeb;
        return [commonWebSources.total(!enabled, available)];
    },
    "websites-folders": (params) => {
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const hasPopularPagesPermission = swSettings.components.PopularPages.isAllowed;
        const hasPopularPagesMobileWeb =
            swSettings.components.WebAnalysis.resources.HasPopularPagesMobileWeb;
        const enabled = available && hasPopularPagesPermission && hasPopularPagesMobileWeb;
        return [commonWebSources.total(!enabled, available)];
    },
    companyresearch_website_popular: (params) => {
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const hasPopularPagesPermission = swSettings.components.PopularPages.isAllowed;
        const hasPopularPagesMobileWeb =
            swSettings.components.WebAnalysis.resources.HasPopularPagesMobileWeb;
        const enabled = available && hasPopularPagesPermission && hasPopularPagesMobileWeb;
        return [commonWebSources.total(!enabled, available)];
    },
    "websites-organicLandingPages": (params) => {
        return [commonWebSources.desktop()];
    },
    "websites-popular": (params) => {
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const hasPopularPagesPermission = swSettings.components.PopularPages.isAllowed;
        const hasPopularPagesMobileWeb =
            swSettings.components.WebAnalysis.resources.HasPopularPagesMobileWeb;
        const enabled = available && hasPopularPagesPermission && hasPopularPagesMobileWeb;
        return [commonWebSources.total(!enabled, available)];
    },
    affiliateanalysis_performanceoverview: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const isWWOApiController =
            params.country === "999" && !swSettings.allowedCountry(params.country, "WebAnalysis");
        return [
            commonWebSources.total(isWWOApiController ? false : !available, available),
            commonWebSources.desktop(
                isWWOApiController ? true : !hasMobileWebPermission && available,
            ),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    analyzepublishers_performanceoverview: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const isWWOApiController =
            params.country === "999" && !swSettings.allowedCountry(params.country, "WebAnalysis");
        return [
            commonWebSources.total(isWWOApiController ? false : !available, available),
            commonWebSources.desktop(
                isWWOApiController ? true : !hasMobileWebPermission && available,
            ),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "websites-worldwideOverview": (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const isWWOApiController =
            params.country === "999" && !swSettings.allowedCountry(params.country, "WebAnalysis");
        return [
            commonWebSources.total(isWWOApiController ? false : !available, available),
            commonWebSources.desktop(
                isWWOApiController ? true : !hasMobileWebPermission && available,
            ),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    competitiveanalysis_website_overview_websiteperformance: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const isWWOApiController =
            params.country === "999" && !swSettings.allowedCountry(params.country, "WebAnalysis");
        return [
            commonWebSources.total(isWWOApiController ? false : !available, available),
            commonWebSources.desktop(
                isWWOApiController ? true : !hasMobileWebPermission && available,
            ),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    competitiveanalysis_website_organiclandingpages: (params) => {
        return [commonWebSources.desktop()];
    },
    accountreview_website_overview_websiteperformance: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const isWWOApiController =
            params.country === "999" && !swSettings.allowedCountry(params.country, "WebAnalysis");
        return [
            commonWebSources.total(isWWOApiController ? false : !available, available),
            commonWebSources.desktop(
                isWWOApiController ? true : !hasMobileWebPermission && available,
            ),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    companyresearch_website_websiteperformance: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const isWWOApiController =
            params.country === "999" && !swSettings.allowedCountry(params.country, "WebAnalysis");
        return [
            commonWebSources.total(isWWOApiController ? false : !available, available),
            commonWebSources.desktop(
                isWWOApiController ? true : !hasMobileWebPermission && available,
            ),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    companyresearch_website_trafficandengagement: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(!hasMobileWebPermission && available),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    accountreview_website_trafficandengagement: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(!hasMobileWebPermission && available),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    companyresearch_website_new_vs_returning: () => {
        return [commonWebSources.desktop(false)];
    },
    "websites-newVsReturning": () => {
        return [commonWebSources.desktop(false)];
    },
    "websites-audienceOverview": (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(!hasMobileWebPermission && available),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "websites.performanceReport": () => {
        return [commonWebSources.total()];
    },
    "websites-audienceDemographics": (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWebDemographics.isAllowed;
        const available = isHasMobileWebData(
            params.duration,
            params.country,
            "MobileWebDemographics",
        );
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(!hasMobileWebPermission && available),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    companyresearch_website_demographics: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWebDemographics.isAllowed;
        const available = isHasMobileWebData(
            params.duration,
            params.country,
            "MobileWebDemographics",
        );
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(!hasMobileWebPermission && available),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    accountreview_website_audience_demographics: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWebDemographics.isAllowed;
        const available = isHasMobileWebData(
            params.duration,
            params.country,
            "MobileWebDemographics",
        );
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(!hasMobileWebPermission && available),
            commonWebSources.mobileWeb(!hasMobileWebPermission || !available, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    findpublishers_bycompetition: displayPagesWebSources,
    findadnetworks_bycompetition: displayPagesWebSources,
    findVideoAds_bycompetitor: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(
            params.duration,
            params.country,
            "WebsiteAdsIntelVideo",
        );
        const enabled = available && hasMobileWebPermission;

        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "websites-trafficDisplay": displayPagesWebSources,
    competitiveanalysis_website_display: displayPagesWebSources,
    competitiveanalysis_website_display_ad_networks: displayPagesWebSources,
    competitiveanalysis_website_display_overview: displayPagesWebSources,
    competitiveanalysis_website_display_creatives: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(
            params.duration,
            params.country,
            "WebsiteAdsIntelDisplay",
        );
        const enabled = available && hasMobileWebPermission;

        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    competitiveanalysis_website_display_videos: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(
            params.duration,
            params.country,
            "WebsiteAdsIntelVideo",
        );
        const enabled = available && hasMobileWebPermission;

        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    findDisplayAds_bycompetitor: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(
            params.duration,
            params.country,
            "WebsiteAdsIntelDisplay",
        );
        const enabled = available && hasMobileWebPermission;

        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "websites-trafficSearch-overview": searchPagesWebSources,
    "websites-trafficSearch-keywords": searchPagesWebSources,
    "websites-trafficSearch-phrases": searchPagesWebSources,
    "websites-trafficSearch-ads": searchPagesWebSources,
    companyresearch_website_audienceInterests: () => {
        return [commonWebSources.desktop(false)];
    },
    accountreview_website_audience_interests: () => {
        return [commonWebSources.desktop(false)];
    },
    "websites-audienceInterests": () => {
        return [commonWebSources.desktop(false)];
    },
    "websites-audienceOverlap": () => {
        return [commonWebSources.desktop(false)];
    },
    companyresearch_website_audienceOverlap: () => {
        return [commonWebSources.desktop(false)];
    },
    "industryAnalysis-overview": (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const enabled = available && hasMobileWebPermission;
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(!hasMobileWebPermission && available, true),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "industryAnalysis-topSites": (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available =
            swSettings.allowedDuration(params.duration, "MobileWeb") &&
            _.includes(
                swSettings.components.Home.resources.MobileWebCountries,
                parseInt(params.country),
            );
        const enabled = available && hasMobileWebPermission;
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(available && !hasMobileWebPermission, true),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "industryAnalysis-categoryShare": (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const enabled = available && hasMobileWebPermission;
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "industryAnalysis-demographics": (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const enabled = available && hasMobileWebPermission;

        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "industryAnalysis-loyalty": () => {
        return [commonWebSources.desktop(false)];
    },
    marketresearch_webmarketanalysis_loyalty: () => {
        return [commonWebSources.desktop(false)];
    },
    marketresearch_webmarketanalysis_searchtrends: () => {
        return [commonWebSources.desktop(false)];
    },
    findpublishers_byindustry: () => {
        return [commonWebSources.desktop(false)];
    },
    findaffiliates_byindustry: () => {
        return [commonWebSources.desktop(false)];
    },
    findadnetworks_byindustry: () => {
        return [commonWebSources.desktop(false)];
    },
    findaffiliates_bykeywords: (params) => {
        return [commonWebSources.desktop(false)];
    },
    "industryAnalysis-trafficSources": () => {
        return [commonWebSources.desktop(false)];
    },
    "industryAnalysis-categoryLeaders": () => {
        return [commonWebSources.desktop(false)];
    },
    marketresearch_webmarketanalysis_rankings: () => {
        return [commonWebSources.desktop(false)];
    },
    findkeywords_byindustry: () => {
        return [commonWebSources.desktop(false)];
    },
    findkeywords_byindustry_SeasonalKeywords: () => {
        return [commonWebSources.desktop(false)];
    },
    findkeywords_byindustry_TopKeywords: () => {
        return [commonWebSources.desktop(false)];
    },
    "industryAnalysis-topKeywords": () => {
        return [commonWebSources.desktop(false)];
    },
    "industryAnalysis-KeywordsSeasonality": () => {
        return [commonWebSources.desktop(false)];
    },
    "keywordAnalysis-keywordGeneratorTool": (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    "marketingWorkspace-keywordGeneratorTool": (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    findkeywords_keywordGeneratorTool: (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    findkeywords_amazonKeywordGenerator: (params) => {
        return [commonWebSources.total()];
    },
    findkeywords_youtubeKeywordGenerator: (params) => {
        return [commonWebSources.total()];
    },
    monitorkeywords: (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    "keywordAnalysis-generator": (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    findSearchTextAds_bykeyword: (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    "keywordAnalysis-ads": (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    findProductListingAds_bykeyword: () => {
        return [commonWebSources.desktop()];
    },
    "keywordAnalysis-plaResearch": () => {
        return [commonWebSources.desktop()];
    },
    "keywordAnalysis-geo": () => {
        return [commonWebSources.desktop()];
    },
    keywordAnalysis_geography: () => {
        return [commonWebSources.desktop()];
    },
    keywordAnalysis_overview: () => {
        return [commonWebSources.total()];
    },
    keywordAnalysis_total: () => {
        return [commonWebSources.total()];
    },
    "keywordAnalysis-overview": () => {
        return [commonWebSources.total()];
    },
    "keywordAnalysis-total": () => {
        return [commonWebSources.total()];
    },
    keywordAnalysis_serpSnapshot: (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    affiliateanalysis_outgoinglinks: () => {
        return [commonWebSources.desktop()];
    },
    competitiveanalysis_website_referrals_outgoingtraffic: () => {
        return [commonWebSources.desktop()];
    },
    analyzepublishers_outgoinglinks: () => {
        return [commonWebSources.desktop()];
    },
    "websites-outgoing": () => {
        return [commonWebSources.desktop()];
    },
    marketresearch_webmarketanalysis_overview: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const enabled = available && hasMobileWebPermission;
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(!hasMobileWebPermission && available, true),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    marketresearch_webmarketanalysis_mapping: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available =
            swSettings.allowedDuration(params.duration, "MobileWeb") &&
            _.includes(
                swSettings.components.Home.resources.MobileWebCountries,
                parseInt(params.country),
            );
        const enabled = available && hasMobileWebPermission;
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(available && !hasMobileWebPermission, true),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    marketresearch_webmarketanalysis_trends: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const enabled = available && hasMobileWebPermission;
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    marketresearch_webmarketanalysis_trafficChannels: () => {
        return [commonWebSources.desktop(false)];
    },
    marketresearch_webmarketanalysis_demographics: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(params.duration, params.country, "MobileWeb");
        const enabled = available && hasMobileWebPermission;
        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "websites-trafficDisplay-overview": displayPagesWebSources,
    "websites-trafficDisplay-adNetworks": displayPagesWebSources,
    "websites-trafficDisplay-creatives": (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(
            params.duration,
            params.country,
            "WebsiteAdsIntelDisplay",
        );
        const enabled = available && hasMobileWebPermission;

        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "websites-trafficDisplay-videos": (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(
            params.duration,
            params.country,
            "WebsiteAdsIntelVideo",
        );
        const enabled = available && hasMobileWebPermission;

        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    marketresearch_keywordmarketanalysis_total: () => {
        return [commonWebSources.total()];
    },
    marketresearch_keywordmarketanalysis_geo: () => {
        return [commonWebSources.desktop()];
    },
    competitiveanalysis_website_search_organic_competitors: (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    competitiveanalysis_website_search_paid_competitors: (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    "websites-competitorsOrganicKeywords": (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    "websites-competitorsPaidKeywords": (params) => {
        const hasMobileWebSearchPermission = swSettings.components.MobileWebSearch.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebSearch");
        const enabled = available && hasMobileWebSearchPermission;
        return [commonWebSources.desktop(), commonWebSources.mobileWeb(!enabled, available)];
    },
    "salesIntelligence-findLeads-industry-result": () => {
        return [
            commonWebSources.desktop(true),
            commonWebSources.mobileWeb(true),
            commonWebSources.total(true),
        ];
    },
    "salesIntelligence-findLeads-keyword-results": () => {
        return [
            commonWebSources.desktop(true),
            commonWebSources.mobileWeb(true),
            commonWebSources.total(true),
        ];
    },
    "salesIntelligence-findLeads-industry-result-TopWebsites": () => {
        return [
            commonWebSources.desktop(false, true),
            commonWebSources.mobileWeb(false, true),
            commonWebSources.total(false, true),
        ];
    },
    "salesIntelligence-findLeads-industry-result-SearchLeaders": () => {
        return [
            commonWebSources.desktop(true),
            commonWebSources.mobileWeb(true),
            commonWebSources.total(true),
        ];
    },
    "salesIntelligence-findLeads-industry-result-SocialLeaders": () => {
        return [
            commonWebSources.desktop(true),
            commonWebSources.mobileWeb(true),
            commonWebSources.total(true),
        ];
    },
    "salesIntelligence-findLeads-industry-result-DisplayLeaders": () => {
        return [
            commonWebSources.desktop(true),
            commonWebSources.mobileWeb(true),
            commonWebSources.total(true),
        ];
    },
    "salesIntelligence-findLeads-industry-result-ReferralLeaders": () => {
        return [
            commonWebSources.desktop(true),
            commonWebSources.mobileWeb(true),
            commonWebSources.total(true),
        ];
    },
    "salesIntelligence-findLeads-industry-result-DirectLeaders": () => {
        return [
            commonWebSources.desktop(true),
            commonWebSources.mobileWeb(true),
            commonWebSources.total(true),
        ];
    },
    "salesIntelligence-findLeads-industry-result-EmailLeaders": () => {
        return [
            commonWebSources.desktop(true),
            commonWebSources.mobileWeb(true),
            commonWebSources.total(true),
        ];
    },
    "salesIntelligence-findLeads-industry-result-IncomingTraffic": () => {
        return [
            commonWebSources.desktop(true),
            commonWebSources.mobileWeb(true),
            commonWebSources.total(true),
        ];
    },
    "salesIntelligence-findLeads-competitors-result-outgoing": () => {
        return [commonWebSources.desktop()];
    },
    accountreview_website_referrals_incomingtraffic: (params: any) => {
        const hasMobileWebReferralsPermission = swSettings.components.MobileWebReferrals.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebReferrals");
        const enabled = available && hasMobileWebReferralsPermission;
        return [
            commonWebSources.total(!enabled, available),
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "salesIntelligence-findLeads-competitors-result-incoming": (params: any) => {
        const hasMobileWebReferralsPermission = swSettings.components.MobileWebReferrals.isAllowed;
        const available = isHasMobileWebDataIgnoreDuration(params.country, "MobileWebReferrals");
        const enabled = available && hasMobileWebReferralsPermission;
        return [
            commonWebSources.total(!enabled, available),
            commonWebSources.desktop(),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    "salesIntelligence-findLeads-keyword-results-total": () => {
        return [commonWebSources.total(true)];
    },
    accountreview_website_display_overview: displayPagesWebSources,
    accountreview_website_display_ad_networks: displayPagesWebSources,
    accountreview_website_display_creatives: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(
            params.duration,
            params.country,
            "WebsiteAdsIntelDisplay",
        );
        const enabled = available && hasMobileWebPermission;

        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    accountreview_website_display_videos: (params) => {
        const hasMobileWebPermission = swSettings.components.MobileWeb.isAllowed;
        const available = isHasMobileWebData(
            params.duration,
            params.country,
            "WebsiteAdsIntelVideo",
        );
        const enabled = available && hasMobileWebPermission;

        return [
            commonWebSources.total(!available, available),
            commonWebSources.desktop(
                available && !hasMobileWebPermission,
                available || hasMobileWebPermission,
            ),
            commonWebSources.mobileWeb(!enabled, available, {
                isMobileWebBeta: CountryService.isMobileWebBetaCountry(params.country),
            }),
        ];
    },
    accountreview_website_social_overview: () => {
        return [commonWebSources.desktop(true)];
    },
    competitiveanalysis_website_social_overview: () => {
        return [commonWebSources.desktop(true)];
    },
    "websites-trafficSocial": () => {
        return [commonWebSources.desktop(true)];
    },
    analyzepublishers_advertisers: () => {
        return [commonWebSources.desktop(true)];
    },
    accountreview_website_paidoutgoing: () => {
        return [commonWebSources.desktop(true)];
    },
    "websites-paidoutgoing": () => {
        return [commonWebSources.desktop(true)];
    },
};

export const getAvailableWebSource = (state, params) => {
    if (pagesWebsources.hasOwnProperty(state.name)) {
        return pagesWebsources[state.name](params).filter((item) => item.available);
    } else {
        return [];
    }
};

export const showWebSourceTooltip = (toState): boolean => {
    if (toState.name === "websites-popular" || toState.name === "websites-folders") {
        const hasPopularPagesPermission = swSettings.components.PopularPages.isAllowed;
        return hasPopularPagesPermission;
    } else {
        return true;
    }
};

export const getCountries = (excludeStates = false, component = swSettings.current): any[] => {
    const Store: any = Injector.get("$swNgRedux");
    const { routing } = Store.getState();
    const permitted = [];
    const unpermitted = [];
    const moduleAllowedCountries: number[] = component.resources.Countries;
    const mobileWebAllowedCountries: any = component.resources.MobileWebCountries;
    component.totalCountries.forEach((country: ICountryObject) => {
        const isMobileWeb = mobileWebAllowedCountries
            ? mobileWebAllowedCountries.indexOf(country.id) > -1
            : false;
        const countryObj = {
            ...country,
            children: [],
            states: [],
            permitted: _.includes(moduleAllowedCountries, country.id),
            showDeviceIcon:
                ["apps", "keywords", "appcategory"].indexOf(routing.currentModule) === -1 &&
                country.id !== 999,
            mobileWeb: isMobileWeb,
            tooltipText: isMobileWeb
                ? `${i18nFilter()("countryFilter.mobileWeb")}`
                : `${i18nFilter()("countryFilter.desktopOnly")}`,
            key: country.id,
        };
        if (countryObj.permitted) {
            permitted.push(countryObj);
        } else {
            unpermitted.push(countryObj);
        }
        if (!excludeStates) {
            if (country.children && country.children.length !== 0) {
                (country.children as any[]).forEach((child) => {
                    const countryObj = {
                        ...child,
                        children: [],
                        states: [],
                        key: child.id,
                        permitted: _.includes(moduleAllowedCountries, country.id),
                        isChild: true,
                        showDeviceIcon: false,
                    };
                    if (countryObj.permitted) {
                        permitted.push(countryObj);
                    } else {
                        unpermitted.push(countryObj);
                    }
                });
            }
        }
    });
    permitted.length && unpermitted && unpermitted.length > 0
        ? (permitted[permitted.length - 1].isLastPermitted = true)
        : _.noop();
    return [...permitted, ...unpermitted];
};

export const getSelectedId = (obj: { id: string | number }) => {
    if (obj) {
        return {
            [obj.id]: true,
        };
    } else {
        return null;
    }
};

export const trackSideBar = (isOpen): void => {
    SwTrack.all.trackEvent("filter side bar", isOpen ? "expand" : "collapse", "menu");
};

export const FiltersEnum = {
    ENABLED: "enabled",
    DISABLED: "disabled",
    HIDDEN: "hidden",
};
