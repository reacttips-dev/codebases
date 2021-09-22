import { i18nFilter } from "filters/ngFilters";

interface TileObject {
    Name: string;
    Description: string;
    Key: string;
    Url: string;
    ImageUrl: string;
    Hidden: boolean;
}

interface InsightObject {
    Name: string;
    Tiles: TileObject[];
}

export class InsightsHomeService {
    private i18n = i18nFilter();

    public getGroups = (): InsightObject[] => {
        return this.InsightsData.map((x) => ({
            Name: x.Name,
            Tiles: x.Tiles.filter((tile) => !tile.Hidden),
        }));
    };

    public getTypes = (): string[] => {
        return this.InsightsData.reduce((res, crr) => [...res, ...crr.Tiles], []);
    };

    private InsightsData: InsightObject[] = [
        {
            Name: this.i18n("insights.group.name.advisory_services"),
            Tiles: [
                {
                    Name: this.i18n("insights.tile.name.custom_reports"),
                    Description: this.i18n("insights.tile.description.custom_reports"),
                    Key: "AS",
                    Url: "#/insights/reports?types=AS",
                    ImageUrl: "images/insights/types/advisory-services.png",
                    Hidden: false,
                },
            ],
        },
        {
            Name: this.i18n("insights.group.name.conversion"),
            Tiles: [
                {
                    Name: this.i18n("insights.tile.name.site_conversion"),
                    Description: this.i18n("insights.tile.description.site_conversion"),
                    Key: "SC",
                    Url: "#/insights/reports?types=SC",
                    ImageUrl: "images/insights/types/site-conversion.svg",
                    Hidden: false,
                },
                {
                    Name: this.i18n("insights.tile.name.brand_channel_conversion"),
                    Description: this.i18n("insights.tile.description.brand_channel_conversion"),
                    Key: "BCC",
                    Url: "#/insights/reports?types=BCC",
                    ImageUrl: "images/insights/types/brand-channel-conversion.svg",
                    Hidden: false,
                },
                {
                    Name: this.i18n("insights.tile.name.top_keywords_conversion"),
                    Description: this.i18n("insights.tile.description.top_keywords_conversion"),
                    Key: "TKC",
                    Url: "#/insights/reports?types=TKC",
                    ImageUrl: "images/insights/types/top-keywords-conversion.svg",
                    Hidden: false,
                },
                {
                    Name: this.i18n("insights.tile.name.referrals_conversion"),
                    Description: this.i18n("insights.tile.description.referrals_conversion"),
                    Key: "TRC",
                    Url: "#/insights/reports?types=TRC",
                    ImageUrl: "images/insights/types/referrals-conversion.svg",
                    Hidden: false,
                },
            ],
        },
        {
            Name: this.i18n("insights.group.name.product_optimization"),
            Tiles: [
                {
                    Name: this.i18n("insights.tile.name.onsite_search"),
                    Description: this.i18n("insights.tile.description.onsite_search"),
                    Key: "OSS",
                    Url: "#/insights/reports?types=OSS",
                    ImageUrl: "images/insights/types/onsite-search.svg",
                    Hidden: false,
                },
                {
                    Name: this.i18n("insights.tile.name.top_products"),
                    Description: this.i18n("insights.tile.description.top_products"),
                    Key: "TPRD",
                    Url: "#/insights/reports?types=TPRD",
                    ImageUrl: "images/insights/types/top-products.svg",
                    Hidden: false,
                },
                {
                    Name: this.i18n("insights.tile.name.market_landscape"),
                    Description: this.i18n("insights.tile.description.market_landscape"),
                    Key: "BML",
                    Url: "#/insights/reports?types=BML",
                    ImageUrl: "images/insights/types/market-landscape.svg",
                    Hidden: false,
                },
            ],
        },
        {
            Name: this.i18n("insights.group.name.audience_behavior"),
            Tiles: [
                {
                    Name: this.i18n("insights.tile.name.audience_conversion"),
                    Description: this.i18n("insights.tile.description.audience_conversion"),
                    Key: "AB",
                    Url: "#/insights/reports?types=AB",
                    ImageUrl: "images/insights/types/audience-conversion.svg",
                    Hidden: false,
                },
            ],
        },
        {
            Name: this.i18n("insights.group.name.leads_management"),
            Tiles: [
                {
                    Name: this.i18n("insights.tile.name.prospecting"),
                    Description: this.i18n("insights.tile.description.prospecting"),
                    Key: "PRS",
                    Url: "#/insights/reports?types=PRS",
                    ImageUrl: "images/insights/types/prospecting.svg",
                    Hidden: false,
                },
                {
                    Name: this.i18n("insights.tile.name.data_enrichment"),
                    Description: this.i18n("insights.tile.description.data_enrichment"),
                    Key: "DE",
                    Url: "#/insights/reports?types=DE",
                    ImageUrl: "images/insights/types/data-enrichment.svg",
                    Hidden: false,
                },
            ],
        },
        {
            Name: this.i18n("insights.group.name.other"),
            Tiles: [
                {
                    Name: this.i18n("insights.tile.name.folder_analysis"),
                    Description: this.i18n("insights.tile.description.folder_analysis"),
                    Key: "FA",
                    Url: "#/insights/reports?types=FA",
                    ImageUrl: "images/insights/types/folder-analysis.svg",
                    Hidden: false,
                },
                {
                    Name: this.i18n("insights.tile.name.traffic_pulse"),
                    Description: this.i18n("insights.tile.description.traffic_pulse"),
                    Key: "TPLS",
                    Url: "#/insights/reports?types=TPLS",
                    ImageUrl: "images/insights/types/traffic-pulse.svg",
                    Hidden: false,
                },
                {
                    Name: this.i18n("insights.tile.name.custom_solutions"),
                    Description: "",
                    Key: "CS",
                    Url: "#/insights/reports?types=CS",
                    ImageUrl: "images/insights/types/folder-analysis.svg",
                    Hidden: true,
                },
            ],
        },
    ];
}
