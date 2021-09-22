import { i18nFilter } from "filters/ngFilters";

export const TOTAL_NUMBER_OF_TIERS = 5;
export const FORMAT_VISUAL = "MMM YY";
export const FORMAT_DATA = "YYYY-MM";
export const firstAvailableDateForData = "2020-01";

export enum ETiers {
    TIER1,
    TIER2,
    TIER3,
    TIER4,
    TIER5,
}

export const tiersMeta = {
    [ETiers.TIER1]: {
        id: "01-03",
        color: "#2A3E52",
        text: i18nFilter()("ranking.distribution.tiers.single.1"),
        tooltipText: i18nFilter()("ranking.distribution.tiers.single.tooltip.1"),
        compareTableTooltipText: i18nFilter()(
            "ranking.distribution.compare.table.tiers.single.tooltip.1",
        ),
    },
    [ETiers.TIER2]: {
        id: "04-10",
        color: "#195AFE",
        text: i18nFilter()("ranking.distribution.tiers.single.2"),
        tooltipText: i18nFilter()("ranking.distribution.tiers.single.tooltip.2"),
        compareTableTooltipText: i18nFilter()(
            "ranking.distribution.compare.table.tiers.single.tooltip.2",
        ),
    },
    [ETiers.TIER3]: {
        id: "11-20",
        color: "#3E74FE",
        text: i18nFilter()("ranking.distribution.tiers.single.3"),
        tooltipText: i18nFilter()("ranking.distribution.tiers.single.tooltip.3"),
        compareTableTooltipText: i18nFilter()(
            "ranking.distribution.compare.table.tiers.single.tooltip.3",
        ),
    },
    [ETiers.TIER4]: {
        id: "21-50",
        color: "#94B2FE",
        text: i18nFilter()("ranking.distribution.tiers.single.4"),
        tooltipText: i18nFilter()("ranking.distribution.tiers.single.tooltip.4"),
        compareTableTooltipText: i18nFilter()(
            "ranking.distribution.compare.table.tiers.single.tooltip.4",
        ),
    },
    [ETiers.TIER5]: {
        id: "51-100",
        color: "#B8CCFE",
        text: i18nFilter()("ranking.distribution.tiers.single.5"),
        tooltipText: i18nFilter()("ranking.distribution.tiers.single.tooltip.5"),
        compareTableTooltipText: i18nFilter()(
            "ranking.distribution.compare.table.tiers.single.tooltip.5",
        ),
    },
};

export const timeRangeOptions = [
    {
        title: "3m",
        disabled: false,
        name: "3m",
        value: 3,
    },
    {
        title: "6m",
        disabled: false,
        name: "6m",
        value: 6,
    },
    {
        title: "12m",
        disabled: false,
        name: "12m",
        value: 12,
    },
];
