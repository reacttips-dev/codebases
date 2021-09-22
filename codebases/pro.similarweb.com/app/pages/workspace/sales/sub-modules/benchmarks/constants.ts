import { colorsPalettes, rgba } from "@similarweb/styles";
import { ANALYSIS_ENDPOINT } from "pages/workspace/sales/types";

const BENCHMARKS = `/api/benchmarks`;
const WORKSPACES = `/api/workspaces/{workspaceId}`;
const PROSPECTS = "prospects/{domain}";
const WORKSPACES_BENCHMARKS_PATH = `${WORKSPACES}/benchmarks`;
const PROSPECTS_PATH = `${WORKSPACES_BENCHMARKS_PATH}/${PROSPECTS}`;
const EMAIL_PATH = `${BENCHMARKS}/${PROSPECTS}/email`;
const BENCHMARK_TOP_OPPORTUNITY =
    "SalesSiteAnalysis/TopOpportunity?country={country}&domain={domain}&workspaceId={workspaceId}";

export const BenchmarksEndpoint = {
    QUOTA: `${BENCHMARKS}/quota`,
    TOPICS: `${BENCHMARKS}/topics`,
    SETTINGS: `${WORKSPACES_BENCHMARKS_PATH}/settings`,
    COMPETITORS: `${PROSPECTS_PATH}/competitors`,
    OPPORTUNITY: `${PROSPECTS_PATH}/opportunity`,
    SIMILAR_SITES: `${BENCHMARKS}/${PROSPECTS}/similar-sites`,
    TOP_OPPORTUNITY: `${ANALYSIS_ENDPOINT}/${BENCHMARK_TOP_OPPORTUNITY}`,
    OPPORTUNITIES: `${PROSPECTS_PATH}/opportunities`,
    EMAIL: `${EMAIL_PATH}`,
    PROSPECTS_COUNTRY: `${BENCHMARKS}/${PROSPECTS}/country-shares`,
    WEBSITES: `/api/benchmarks/websites`,
};

export enum BenchmarksVisualizationType {
    LEADERBOARD,
    CHART,
    TABLE,
}
export enum OpportunityMode {
    Opportunity = "Opportunity",
    Achievement = "Achievement",
}
export enum BenchmarksMode {
    TopCountry,
    SelectedCountry,
    TopOpportunities,
    TopAchievements,
}
export const BenchmarksValuesUnits = {
    PERCENT: "%",
    SECONDS: "s",
};
export const BENCHMARK_VISITS_METRIC_NAME = "total_estimated_visits";
export const BENCHMARK_VALUE_PRECISION = 2;
export const BENCHMARK_COMPETITORS_MAX_COUNT = 3;
export const BENCHMARKS_TOOLTIP_MAX_WIDTH = 300;
export const BENCHMARKS_BAR_CHART_BASE_HEIGHT = 200;
export const BENCHMARKS_PROSPECT_QUOTA_THRESHOLD = 3;

export const BENCHMARK_PROSPECT_COLOR: string = colorsPalettes.bluegrey["600"];
export const BENCHMARK_AVG_COLOR: string = rgba(colorsPalettes.carbon["500"], 0.15);
export const BENCHMARK_COMPETITORS_COLORS: string[] = [
    colorsPalettes.torquoise["300"],
    colorsPalettes.orange["300"],
    colorsPalettes.red["400"],
];

const BENCHMARKS_TRANSLATION_KEY = "workspace.sales.benchmarks";
const BENCHMARKS_TRANSLATION_WELCOME_PAGE_KEY = "welcome_page";

export const TOPICS_TRANSLATION_KEY = `${BENCHMARKS_TRANSLATION_KEY}.topics`;
export const TOPICS_GROUP_KEY = `${TOPICS_TRANSLATION_KEY}.groups`;
export const METRICS_TRANSLATION_KEY = `${BENCHMARKS_TRANSLATION_KEY}.metrics`;
export const BENCHMARKS_SETTING_KEY = `${BENCHMARKS_TRANSLATION_KEY}.settings`;
export const BENCHMARK_ITEM_KEY = `${BENCHMARKS_TRANSLATION_KEY}.item`;
export const BENCHMARK_ITEMS_KEY = `${BENCHMARKS_TRANSLATION_KEY}.items`;
export const BENCHMARK_ITEM_TABLE_KEY = `${BENCHMARK_ITEM_KEY}.table`;
export const BENCHMARK_TOOLBAR_KEY = `${BENCHMARKS_TRANSLATION_KEY}.toolbar`;

export const BENCHMARK_TOOLTIP_KEY = `${BENCHMARKS_TRANSLATION_KEY}.tooltip`;

export const WELCOME_PAGE_TRANSLATION_KEY_TITLE = `${BENCHMARKS_TRANSLATION_KEY}.${BENCHMARKS_TRANSLATION_WELCOME_PAGE_KEY}.content.title`;
export const WELCOME_PAGE_TRANSLATION_KEY_SUBTITLE = `${BENCHMARKS_TRANSLATION_KEY}.${BENCHMARKS_TRANSLATION_WELCOME_PAGE_KEY}.content.subtitle`;
export const WELCOME_PAGE_TRANSLATION_KEY_BUTTON_TITLE = `${BENCHMARKS_TRANSLATION_KEY}.${BENCHMARKS_TRANSLATION_WELCOME_PAGE_KEY}.button.go`;

// Tooltip
export const TOOLTIP_DROPDOWN_TITLE_SETTINGS = `${BENCHMARK_TOOLTIP_KEY}.settings`;

// Toolbar
export const TOOLBAR_DROPDOWN_KEY = `${BENCHMARK_TOOLBAR_KEY}.dropdown`;
export const TOOLBAR_DROPDOWN_COUNTRIES = `${TOOLBAR_DROPDOWN_KEY}.countries`;
export const TOOLBAR_DROPDOWN_BTN_TITLE_ALL_COUNTRIES = `${TOOLBAR_DROPDOWN_COUNTRIES}.btn_title.selected_all`;
export const TOOLBAR_DROPDOWN_TITLE_ALL_COUNTRIES = `${TOOLBAR_DROPDOWN_COUNTRIES}.title.selected_all`;
export const TOOLBAR_DROPDOWN_COUNTRIES_HEADER_LEFT_TITLE = `${TOOLBAR_DROPDOWN_COUNTRIES}.header.left_column.title`;
export const TOOLBAR_DROPDOWN_COUNTRIES_HEADER_RIGHT_TITLE = `${TOOLBAR_DROPDOWN_COUNTRIES}.header.right_column.title`;
export const TOOLBAR_FOOTER_BUTTON_TITTLE = `${TOOLBAR_DROPDOWN_KEY}.footer.button`;
export const TOOLBAR_DROPDOWN_COUNTRIES_DISABLED_TOOLTIP = `${TOOLBAR_DROPDOWN_COUNTRIES}.tooltip.disabled`;

// EditableCompetitor component
export const SELECT_PLACEHOLDER_TEXT = "Search any website";

export const BENCHMARK_ITEMS_LINK_FULL_REVIEW = `${BENCHMARK_ITEMS_KEY}.button.linkTo.full_review`;

export const ADD_TO_LIST_TOOLTIP = `workspace.sales.benchmarks.settings.addToList.tooltip`;
