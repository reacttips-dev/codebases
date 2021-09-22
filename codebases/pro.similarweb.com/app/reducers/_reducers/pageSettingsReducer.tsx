import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import { formatDate } from "utils";

let selectedTab;
const getPageTitle = (pageState) => {
    // state pageTitle (string or Getter)
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    selectedTab = swNavigator.getParams().selectedTab;
    switch (pageState.name) {
        case "apps-performance":
        case "salesIntelligence-apps-performance":
        case "companyresearch_app_appperformance":
            const pageFilters = swNavigator.getApiParams(null);
            const Date = formatDate(pageFilters.from, pageFilters.to, "MMMM YYYY");
            return i18nFilter()(pageState.pageTitle) + ` - ` + Date;
        case "industryAnalysis-categoryLeaders":
        case "marketresearch_webmarketanalysis_rankings":
            const { tab } = swNavigator.getParams();
            switch (tab) {
                case "CategoryLeadersSearch":
                    return i18nFilter()(
                        "industryanalysis.categoryLeaders.CategoryLeadersSearch.title",
                    );
                case "CategoryLeadersSocial":
                    return i18nFilter()(
                        "industryanalysis.categoryLeaders.CategoryLeadersSocial.title",
                    );
                case "CategoryLeadersAds":
                    return i18nFilter()(
                        "industryanalysis.categoryLeaders.CategoryLeadersAds.title",
                    );
                case "CategoryLeadersReferrals":
                    return i18nFilter()(
                        "industryanalysis.categoryLeaders.CategoryLeadersReferrals.title",
                    );
                case "CategoryLeadersDirect":
                    return i18nFilter()(
                        "industryanalysis.categoryLeaders.CategoryLeadersDirect.title",
                    );
                case "CategoryLeadersMail":
                    return i18nFilter()(
                        "industryanalysis.categoryLeaders.CategoryLeadersMail.title",
                    );
                default:
                    return i18nFilter()("industryCategoryLeaders.page.title");
            }
        case "websites-paidoutgoing":
            switch (selectedTab) {
                case "advertisers":
                    return i18nFilter()("analysis.monetization.advertisers.title");
                case "adNetworks":
                    return i18nFilter()("analysis.monetization.adnetworks.title");
                default:
                    return i18nFilter()("analysis.monetization.title");
            }
        case "websites-trafficDisplay":
        case "competitiveanalysis_website_display":
            switch (selectedTab) {
                case "publishers":
                    return i18nFilter()("analysis.display.publishers.title");
                default:
                    return i18nFilter()("analysis.display.${selectedTab}.title");
            }
        case "websites-trafficSearch":
        case "competitiveanalysis_website_search":
            switch (selectedTab) {
                case "overview":
                    return i18nFilter()(`analysis.search.overview.page.title`);
                case "keywords":
                    return i18nFilter()(`analysis.search.keywords.title`);
                case "phrases":
                    return i18nFilter()(`analysis.search.phrases.title`);
                case "ads":
                    return i18nFilter()(`analysis.search.ads.title`);
                case "plaResearch":
                    return i18nFilter()("analysis.search.plaresearch.title");
                default:
                    return i18nFilter()("analysis.sources.search.title");
            }
        default:
            return i18nFilter()(pageState.pageTitle);
    }
};
const getPageSubtitle = (pageState) => {
    // state pageSubtitle (string or Getter)
    switch (pageState.name) {
        case "appcategory-leaderboard":
        case "appcategory-trends":
            return pageState.pageSubtitle
                ? i18nFilter()(pageState.pageSubtitle) +
                      ` ` +
                      dayjs.utc(swSettings.current.resources.SupportedDate).format("MMMM DD, YYYY")
                : null;
        default:
            return pageState.pageSubtitle ? i18nFilter()(pageState.pageSubtitle) : null;
    }
};
// to support the orange badge in tab base pages.
// to add the badge to your tab add tab name to the "showInTabs" array
const getOrangeBadgeTitle = (pageState) => {
    const { orangeBadgeTitle } = pageState;
    const i18n = i18nFilter();
    const showInTabs = ["plaResearch"];
    if (orangeBadgeTitle) {
        return i18n(orangeBadgeTitle);
    }
    if (showInTabs.includes(selectedTab)) {
        return i18n("sidenav.new");
    }
    return null;
};
export const getPageSettings = (pageState) => {
    const pageTitle = getPageTitle(pageState);
    const pageSubtitle = getPageSubtitle(pageState);
    const isPdfDownloadButton = pageState.isPdfDownloadButton;
    const pdfDownloadsMethod = pageState.pdfDownloadsMethod;
    const orangeBadgeTitle = getOrangeBadgeTitle(pageState);
    const GreenBadgeTitleComponent = pageState.getGreenBadgeTitleComponent
        ? pageState.getGreenBadgeTitleComponent
        : undefined;
    const pinkBadgeTitle = pageState.pinkBadgeTitle ? i18nFilter()(pageState.pinkBadgeTitle) : null;
    return {
        pageTitle,
        pageSubtitle,
        isPdfDownloadButton,
        pdfDownloadsMethod,
        orangeBadgeTitle,
        GreenBadgeTitleComponent,
        pinkBadgeTitle,
        isPdfDownload: false,
    };
};
