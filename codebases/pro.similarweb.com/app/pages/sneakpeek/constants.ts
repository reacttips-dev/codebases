import {
    Change,
    DefaultCell,
    NumberCommaCell,
    PercentageCell,
    RankCell,
    TrafficShare,
} from "components/React/Table/cells";
import { WebsiteTooltipTopCellWrapper } from "./SneakpeekTable";

export const enum EDataSources {
    ATHENA = "Athena",
    HBASE = "Hbase",
    FIREBOLT = "Firebolt",
}

export const dataSourcesMap = {
    [EDataSources.ATHENA]: { id: "Athena", text: "Athena" },
    [EDataSources.HBASE]: { id: "Hbase", text: "Hbase" },
    [EDataSources.FIREBOLT]: { id: "Firebolt", text: "Firebolt" },
};

export const cellTemplates = {
    ChangePercentage: "Change",
    WebsiteCell: "Domain",
    DefaultCell: "Default(Text)",
    TrafficShare: "Traffic Share",
    KeywordAnalysisPosition: "Number",
    PercentageCell: "Percent",
    RankCell: "Rank",
};

export const cellTemplateResolver = {
    percentageTemplate: PercentageCell,
    PercentageCell,
    siteCellTemplate: WebsiteTooltipTopCellWrapper,
    WebsiteCell: WebsiteTooltipTopCellWrapper,
    ChangePercentage: Change,
    TrafficShare,
    KeywordAnalysisPosition: NumberCommaCell,
    RankCell,
    defaultCell: DefaultCell,
    DefaultCell,
};

export const modulesEntityMap = (state: string) => {
    switch (state) {
        case "websites-sneakpeekQuery":
        case "websites-sneakpeekResults":
        case "companyresearch_website_sneakpeekQuery":
        case "companyresearch_website_sneakpeekResults":
            return {
                entity: "site",
                example:
                    "select visits from daily_site_adjusted_estimations where site={site} and country={country}",
            };
        case "apps-sneakpeekQuery":
        case "apps-sneakpeekResults":
        case "companyresearch_app_sneakpeekQuery":
        case "companyresearch_app_sneakpeekResults":
            return {
                entity: "app",
                example:
                    "select country, avg(reach) as population, avg(active_users) as dau from daily_app_engagement_estimations_realnumbers where app = {app} group by country order by population desc",
            };
        case "keywordAnalysis-sneakpeekQuery":
        case "keywordAnalysis-sneakpeekResults":
        case "marketresearch_keywordmarketanalysis_sneakpeekQuery":
        case "marketresearch_keywordmarketanalysis_sneakpeekResults":
            return {
                entity: "keyword",
                example:
                    "select estimatedvisits_total from snapshot_keywords_totals where keyword like %{keyword}% and country={country}",
            };
    }
};

export const granularityOptions = [
    {
        title: "D",
        name: "D",
        disabled: false,
        value: "daily",
    },
    {
        title: "W",
        name: "W",
        disabled: false,
        value: "weekly",
    },
    {
        title: "M",
        name: "M",
        disabled: false,
        value: "monthly",
    },
];

export const displayOptions = [
    {
        title: "Line graph",
        name: "Line graph",
        disabled: false,
        value: "graph",
        tooltipText: "Graph",
    },
    {
        title: "Data table",
        name: "Data table",
        disabled: false,
        value: "table",
        tooltipText: "Table",
    },
    {
        title: "Bar chart",
        name: "Bar chart",
        disabled: false,
        value: "piechart",
        tooltipText: "Bar Chart",
    },
];
