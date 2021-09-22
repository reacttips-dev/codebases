import { colorsPalettes } from "@similarweb/styles";
import { INavigationTileProps } from "./NavigationTile";
import { IMajorNavigationTileProps } from "./MajorNavigationTile";
import { EVwoDMIHomepageVariation } from "services/ABService";
import {
    NT_SEARCH_MARKETING_PRODUCT_KEY,
    NT_DISPLAY_MARKETING_PRODUCT_KEY,
    NT_AFFILIATE_MARKETING_PRODUCT_KEY,
    NT_ESSENTIAL_PRODUCT_KEY,
    NT_ADVANCED_PRODUCT_KEY,
} from "constants/ntProductKeys";

export const homepageVariationToEventSubName: Partial<Record<EVwoDMIHomepageVariation, string>> = {
    [EVwoDMIHomepageVariation.Variation1]: "Version A",
    [EVwoDMIHomepageVariation.Variation2]: "Version B",
};

export type NoTouchUserType =
    | typeof NT_SEARCH_MARKETING_PRODUCT_KEY
    | typeof NT_DISPLAY_MARKETING_PRODUCT_KEY
    | typeof NT_AFFILIATE_MARKETING_PRODUCT_KEY
    | typeof NT_ESSENTIAL_PRODUCT_KEY
    | typeof NT_ADVANCED_PRODUCT_KEY;

type UserPermissions = { userTypes?: NoTouchUserType[] };

const navigationTilesCategories = {
    displayAndPPC: {
        name: "digitalmarketing.homepage.display.and.ppc.category.name",
        icon: "paid-keywords",
        color: colorsPalettes.yellow[100],
    },
    referralsAndAffiliates: {
        name: "digitalmarketing.homepage.referrals.and.affiliates.category.name",
        icon: "nav-affiliates",
        color: colorsPalettes.green[100],
    },
    searchAndKeywords: {
        name: "digitalmarketing.homepage.search.and.keywords.category.name",
        icon: "search",
        color: colorsPalettes.sky[100],
    },
};

export const majorNavigationTiles: IMajorNavigationTileProps[] = [
    {
        id: "websiteAnalysis",
        title: "digitalmarketing.homepage.website.analysis.title",
        subTitle: "digitalmarketing.homepage.website.analysis.subtitle",
        redirectPageText: "digitalmarketing.homepage.website.analysis.redirect.subtitle",
        iconName: "website-analysis",
        navigationState: "competitiveanalysis_website_overview_websiteperformance",
        useRedirect: true,
    },
    {
        id: "websiteKeywords",
        title: "digitalmarketing.homepage.website.keywords.title",
        subTitle: "digitalmarketing.homepage.website.keywords.subtitle",
        redirectPageText: "digitalmarketing.homepage.website.keywords.redirect.subtitle",
        iconName: "search-interest-analysis",
        navigationState: "competitiveanalysis_website_search_keyword",
        useRedirect: true,
    },
    {
        id: "landingPages",
        title: "digitalmarketing.homepage.organic.landing.pages.title",
        subTitle: "digitalmarketing.homepage.organic.landing.pages.subtitle",
        redirectPageText: "digitalmarketing.homepage.organic.landing.pages.redirect.subtitle",
        iconName: "spaceship",
        navigationState: "competitiveanalysis_website_organiclandingpages",
        useRedirect: true,
    },
    {
        id: "searchAds",
        title: "digitalmarketing.homepage.search.ads.title",
        subTitle: "digitalmarketing.homepage.search.ads.subtitle",
        redirectPageText: "digitalmarketing.homepage.search.ads.redirect.subtitle",
        iconName: "ad-tech",
        navigationState: "competitiveanalysis_website_search_ads",
        useRedirect: true,
    },
];

type NavigationTileConfig = (
    | INavigationTileProps
    | (INavigationTileProps & IMajorNavigationTileProps)
) &
    UserPermissions;
export const navigationTiles: NavigationTileConfig[] = [
    {
        id: "organicCompetitors",
        title: "digitalmarketing.homepage.organic.competitors.title",
        subTitle: "digitalmarketing.homepage.organic.competitors.subtitle",
        redirectPageText: "digitalmarketing.homepage.organic.competitors.redirect.subtitle",
        navigationState: "competitiveanalysis_website_search_organic_competitors",
        iconName: "megaphone",
        category: navigationTilesCategories.searchAndKeywords,
        useRedirect: true,
        userTypes: [
            NT_DISPLAY_MARKETING_PRODUCT_KEY,
            NT_SEARCH_MARKETING_PRODUCT_KEY,
            NT_ESSENTIAL_PRODUCT_KEY,
            NT_ADVANCED_PRODUCT_KEY,
        ],
    },
    {
        id: "paidCompetitors",
        title: "digitalmarketing.homepage.paid.competitors.title",
        subTitle: "digitalmarketing.homepage.paid.competitors.subtitle",
        redirectPageText: "digitalmarketing.homepage.paid.competitors.redirect.subtitle",
        navigationState: "websites-competitorsPaidKeywords",
        iconName: "paid-competitors",
        category: navigationTilesCategories.searchAndKeywords,
        useRedirect: true,
        userTypes: [
            NT_AFFILIATE_MARKETING_PRODUCT_KEY,
            NT_DISPLAY_MARKETING_PRODUCT_KEY,
            NT_ESSENTIAL_PRODUCT_KEY,
            NT_ADVANCED_PRODUCT_KEY,
        ],
    },
    {
        id: "keywordGenerator",
        title: "digitalmarketing.homepage.keyword.generator.title",
        subTitle: "digitalmarketing.homepage.keyword.generator.subtitle",
        iconName: "page-with-coffee",
        navigationState: "findkeywords_KeywordGenerator_home",
        category: navigationTilesCategories.searchAndKeywords,
        userTypes: [
            NT_SEARCH_MARKETING_PRODUCT_KEY,
            NT_ESSENTIAL_PRODUCT_KEY,
            NT_ADVANCED_PRODUCT_KEY,
        ],
    },
    {
        id: "keywordGap",
        title: "digitalmarketing.homepage.keyword.gap.title",
        subTitle: "digitalmarketing.homepage.keyword.gap.subtitle",
        navigationState: "findkeywords_KeywordGap_home",
        iconName: "keyword-gap",
        category: navigationTilesCategories.searchAndKeywords,
        userTypes: [
            NT_SEARCH_MARKETING_PRODUCT_KEY,
            NT_ESSENTIAL_PRODUCT_KEY,
            NT_ADVANCED_PRODUCT_KEY,
        ],
    },
    {
        id: "keywordAnalysis",
        title: "digitalmarketing.homepage.keyword.analysis.title",
        subTitle: "digitalmarketing.homepage.keyword.analysis.subtitle",
        iconName: "affiliates-keyword",
        navigationState: "keywordanalysis_home",
        category: navigationTilesCategories.searchAndKeywords,
        userTypes: [
            NT_SEARCH_MARKETING_PRODUCT_KEY,
            NT_ESSENTIAL_PRODUCT_KEY,
            NT_ADVANCED_PRODUCT_KEY,
        ],
    },
    {
        id: "keywordSeasonality",
        title: "digitalmarketing.homepage.keyword.seasonality.title",
        subTitle: "digitalmarketing.homepage.keyword.seasonality.subtitle",
        navigationState: "findkeywords_SeasonalKeywords_home",
        category: navigationTilesCategories.searchAndKeywords,
        userTypes: [NT_ESSENTIAL_PRODUCT_KEY, NT_ADVANCED_PRODUCT_KEY],
    },
    {
        id: "competitorsAffiliates",
        title: "digitalmarketing.homepage.competitor.affiliates.title",
        subTitle: "digitalmarketing.homepage.competitor.affiliates.subtitle",
        navigationState: "findaffiliates_bycompetition_homepage",
        iconName: "handshake",
        category: navigationTilesCategories.referralsAndAffiliates,
        userTypes: [
            NT_AFFILIATE_MARKETING_PRODUCT_KEY,
            NT_ESSENTIAL_PRODUCT_KEY,
            NT_ADVANCED_PRODUCT_KEY,
        ],
    },
    {
        id: "affiliatesByKeyword",
        title: "digitalmarketing.homepage.affiliates.by.keyword.title",
        subTitle: "digitalmarketing.homepage.affiliates.by.keyword.subtitle",
        navigationState: "findaffiliates_bykeywords_homepage",
        iconName: "ad-tech",
        category: navigationTilesCategories.referralsAndAffiliates,
        userTypes: [
            NT_AFFILIATE_MARKETING_PRODUCT_KEY,
            NT_ESSENTIAL_PRODUCT_KEY,
            NT_ADVANCED_PRODUCT_KEY,
        ],
    },
    {
        id: "affiliatesAnalysis",
        title: "digitalmarketing.homepage.affiliates.analysis.title",
        subTitle: "digitalmarketing.homepage.affiliates.analysis.subtitle",
        navigationState: "affiliateanalysis_home",
        category: navigationTilesCategories.referralsAndAffiliates,
        userTypes: [
            NT_AFFILIATE_MARKETING_PRODUCT_KEY,
            NT_ESSENTIAL_PRODUCT_KEY,
            NT_ADVANCED_PRODUCT_KEY,
        ],
    },
    {
        id: "displayAds",
        title: "digitalmarketing.homepage.display.ads.title",
        subTitle: "digitalmarketing.homepage.display.ads.subtitle",
        navigationState: "findDisplayAds_home",
        iconName: "pencil",
        category: navigationTilesCategories.displayAndPPC,
        userTypes: [
            NT_DISPLAY_MARKETING_PRODUCT_KEY,
            NT_ESSENTIAL_PRODUCT_KEY,
            NT_ADVANCED_PRODUCT_KEY,
        ],
    },
    {
        id: "videoAds",
        title: "digitalmarketing.homepage.video.ads.title",
        subTitle: "digitalmarketing.homepage.video.ads.subtitle",
        navigationState: "findVideoAds_home",
        category: navigationTilesCategories.displayAndPPC,
        userTypes: [
            NT_DISPLAY_MARKETING_PRODUCT_KEY,
            NT_ESSENTIAL_PRODUCT_KEY,
            NT_ADVANCED_PRODUCT_KEY,
        ],
    },
];
