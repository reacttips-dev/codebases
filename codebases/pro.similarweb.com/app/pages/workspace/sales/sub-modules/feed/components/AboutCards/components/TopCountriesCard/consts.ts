import { CountryCell } from "../../../../../../../../../components/React/Table/cells/CountryCell";
import { ChangePercentage } from "../../../../../../../../../components/React/Table/cells/ChangePercentage";
import { CountryCellNew } from "components/React/Table/cells/CountryCellNew";
import {
    TOP_COUNTRIES_TAB_GROWTH,
    TOP_COUNTRIES_TAB_SHARE,
    TOP_COUNTRIES_TAB_TOOLTIP1,
    TOP_COUNTRIES_TAB_TOOLTIP2,
} from "../../../../constants";
import { i18nFilter } from "filters/ngFilters";

// TOP COUNTRIES COLUMNS CONFIG
export const shareColumns = [
    {
        field: "country",
        displayName: i18nFilter()("workspace.sales.about.topCountries.config.share.country"),
        type: "string",
        format: "None",
        sortable: false,
        isSorted: false,
        groupable: false,
        cellComponent: CountryCell,
        headTemp: "",
        totalCount: true,
        tooltip: false,
        minWidth: 230,
        ppt: {
            // override the table column format when rendered in ppt
            overrideFormat: "Country",
        },
    },
    {
        field: "share",
        displayName: i18nFilter()("workspace.sales.about.topCountries.config.share.share"),
        type: "string",
        format: "percentagesign",
        sortable: false,
        isSorted: false,
        isLink: true,
        groupable: false,
        headTemp: "",
        totalCount: false,
        tooltip: false,
        width: "",
    },
    {
        field: "visits",
        displayName: i18nFilter()("workspace.sales.about.topCountries.config.share.visits"),
        type: "string",
        format: "None",
        sortable: false,
        isSorted: false,
        groupable: false,
        headTemp: "",
        totalCount: true,
        tooltip: false,
        minWidth: 230,
    },
];
export const growthColumns = [
    {
        field: "country",
        displayName: i18nFilter()("workspace.sales.about.topCountries.config.growth.country"),
        type: "string",
        format: "None",
        sortable: false,
        isSorted: false,
        groupable: false,
        cellComponent: CountryCellNew,
        headTemp: "",
        totalCount: true,
        tooltip: false,
        minWidth: 230,
        ppt: {
            // override the table column format when rendered in ppt
            overrideFormat: "Country",
        },
    },
    {
        field: "change",
        displayName: i18nFilter()("workspace.sales.about.topCountries.config.growth.change"),
        type: "string",
        format: "percentagesign",
        cellComponent: ChangePercentage,
        sortable: false,
        isSorted: false,
        groupable: false,
        headTemp: "",
        totalCount: true,
        tooltip: false,
        minWidth: 230,
    },
    {
        field: "visits",
        displayName: i18nFilter()("workspace.sales.about.topCountries.config.growth.visits"),
        type: "string",
        format: "none",
        sortable: false,
        isSorted: false,
        isLink: true,
        groupable: false,
        headTemp: "",
        totalCount: false,
        tooltip: true,
        width: "",
    },
];

export const topCountriesCols = { shareColumns, growthColumns };

export const TOP_COUNTRIES_PAGE_SIZE = 5;

export const HEADER_TOOLTIPS = {
    [TOP_COUNTRIES_TAB_SHARE]: TOP_COUNTRIES_TAB_TOOLTIP1,
    [TOP_COUNTRIES_TAB_GROWTH]: TOP_COUNTRIES_TAB_TOOLTIP2,
};
// ICONS
export const NO_DATA_ICON = "no-data-lab";
export const INFO_ICON = "info";
export const DAILY_RANKING_ICON = "daily-ranking";

// CLASSES
export const TAB_PANEL_CLASS = "TabPanel";
export const EMPTY_TOP_COUNTRY_CLASS = "emptyTopCountries";
export const TOP_COUNTRIES_CLASS = "topCountries";
