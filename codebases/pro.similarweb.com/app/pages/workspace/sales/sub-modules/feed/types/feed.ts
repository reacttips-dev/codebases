import { ActionType } from "typesafe-actions";
import { AdNetwork } from "./adNetwork";
import * as ac from "../store/action-creators";
import { TTopCountries } from "./topCountries";
import { TAdNetworksAbout } from "./adNetwork";
import { TSiteInfo } from "./siteInfo";
import { BenchmarksSettingsType } from "pages/workspace/sales/sub-modules/benchmarks/types/settings";
import { BenchmarksQuotaType } from "pages/workspace/sales/sub-modules/benchmarks/types/benchmarks";
import { TechnologiesStore } from "./technologies";

export type FeedRequestParams = {
    domain: string;
};

export enum FeedFeedbackType {
    NEGATIVE = "negative",
    POSITIVE = "positive",
}
export enum FeedMetric {
    NEWS = "news",
    AD_NETWORK = "ad_networks_change",
    DESKTOP_MMX_OUTLIER = "desktop_mmx_outlier_change",
    MONTHLY_TOTAL_VISITS = "monthly_total_visits_change",
    TOP_COUNTRIES = "topCountries",
}

export type FeedItemFeedback = {
    Type?: FeedFeedbackType;
    Reason?: string;
};

export type BaseFeed = {
    id: string;
    site: string;
    dataDate: string;
    metric: FeedMetric;
    lastSeenDate: string;
    feedbackItemFeedback: FeedItemFeedback;
};

export type NewsFeed = BaseFeed & {
    title: string;
    company: string;
    category: string;
    parent_category: string;
    grand_parent_category: string;
    summary: string;
    publisher: string;
    image_url: string;
    link: string;
};

export type MonthlyTotalVisitsFeed = BaseFeed & {
    Country: number;
    Change: number;
    WebSource: string;
};

export type DesktopMMXOutlierFeed = BaseFeed & {
    Country: number;
    Change: number;
    Channel: string;
    WebSource: string;
};

export type DesktopMarketingAlertFeed = BaseFeed & {
    Country: number;
    Channel: string;
    WebSource: string;
    Traffic: { [key: string]: number };
};

export type AdNetworksFeed = BaseFeed & {
    ad_networks: AdNetwork[];
};

export type Feed = NewsFeed | MonthlyTotalVisitsFeed | DesktopMMXOutlierFeed | AdNetworksFeed;

export type FeedsByDate = {
    [date: string]: Feed[];
};

export type FeedActions = ActionType<typeof ac>;

export type GroupedFeedsContainerProps = {
    benchmarksAreEmpty: boolean;
    benchmarksQuota: BenchmarksQuotaType;
    feedsGroup: FeedsByDate;
    topCountries: TTopCountries;
    adNetworks: TAdNetworksAbout;
    siteInfo: TSiteInfo;
    linkToTrends(): void;
    linkToBenchmarks(): void;
    accountReviewLink?: string;
    news: Feed[];
    enabledNews: boolean;
    topic: BenchmarksSettingsType["topic"];
    technologies: TechnologiesStore;
    activeWebsite: string;
    isSales: boolean;
};

export type FeedTabPropsType = {
    linkToTrends(): void;
    linkToBenchmarks(): void;
    enabledNews: boolean;
    accountReviewLink?: string;
};
