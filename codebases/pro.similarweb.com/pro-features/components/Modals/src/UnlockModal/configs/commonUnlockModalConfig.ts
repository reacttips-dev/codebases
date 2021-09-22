import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface ICommonUnlockModalConfigTypes {
    Default: "Default";
    CountryFilters: "Countries";
    DeviceFilters: "Devices";
    CompareFilters: "Compare";
    TimeRangeFilters: "TimeRanges";
    KeywordGroups: "KeywordGroups";
    DownloadTable: "DownloadTable";
    CompetitiveLandscape: "CompetitiveLandscape";
    UniqueVisitors: "UniqueVisitors";
    KeywordCompetitors: "KeywordCompetitors";
    SourceOpportunities: "SourceOpportunities";
    CustomMetrics: "CustomMetrics";
    TechnologiesList: "TechnologiesList";
    DeduplicationVisits: "DeduplicationVisits";
}

export const CommonModalConfig = (): {
    [D in keyof ICommonUnlockModalConfigTypes]: IModalConfig<D>;
} => ({
    Default: {
        slides: {
            Default: {
                img: AssetsService.assetUrl("/images/unlock-modal/default.svg"),
                title: i18nFilter()("hook_unlock.default.title"),
                text: i18nFilter()("hook_unlock.default.text"),
                subtitle: i18nFilter()("hook_unlock.default.title"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.default.cta_text"),
        label: "Default",
    },
    KeywordGroups: {
        slides: {
            KeywordGroups: {
                img: AssetsService.assetUrl("/images/unlock-modal/keyword-groups.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/keyword-groups-2x.jpg"),
                title: i18nFilter()("hook_unlock.keyword_groups.title"),
                subtitle: i18nFilter()("hook_unlock.keyword_groups.subtitle"),
                text: i18nFilter()("hook_unlock.keyword_groups.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.keyword_groups.cta_text"),
        label: "Keyword Groups",
    },
    CountryFilters: {
        slides: {
            Countries: {
                img: AssetsService.assetUrl("/images/unlock-modal/country.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/country-2x.jpg"),
                title: i18nFilter()("hook_unlock.filters.countries.title"),
                subtitle: i18nFilter()("hook_unlock.filters.countries.subtitle"),
                text: i18nFilter()("hook_unlock.filters.countries.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.filters.cta_text"),
        label: "Filters Hook",
    },
    DeviceFilters: {
        slides: {
            Devices: {
                img: AssetsService.assetUrl("/images/unlock-modal/web-source.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/web-source-2x.jpg"),
                title: i18nFilter()("hook_unlock.filters.devices.title"),
                subtitle: i18nFilter()("hook_unlock.filters.devices.subtitle"),
                text: i18nFilter()("hook_unlock.filters.devices.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.filters.cta_text"),
        label: "Filters Hook",
    },
    CompareFilters: {
        slides: {
            Compare: {
                img: AssetsService.assetUrl("/images/unlock-modal/more-competitors.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/more-competitors-2x.jpg"),
                title: i18nFilter()("hook_unlock.filters.compare.title"),
                subtitle: i18nFilter()("hook_unlock.filters.compare.subtitle"),
                text: i18nFilter()("hook_unlock.filters.compare.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.filters.cta_text"),
        label: "Filters Hook",
    },
    TimeRangeFilters: {
        slides: {
            TimeRanges: {
                img: AssetsService.assetUrl("/images/unlock-modal/time-ranges.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/time-ranges-2x.jpg"),
                title: i18nFilter()("hook_unlock.filters.time_ranges.title"),
                subtitle: i18nFilter()("hook_unlock.filters.time_ranges.subtitle"),
                text: i18nFilter()("hook_unlock.filters.time_ranges.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.filters.cta_text"),
        label: "Filters Hook",
    },
    DownloadTable: {
        slides: {
            DownloadTable: {
                img: AssetsService.assetUrl("/images/unlock-modal/excel.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/excel-2x.jpg"),
                title: i18nFilter()("hook_unlock.download_table.title"),
                subtitle: i18nFilter()("hook_unlock.download_table.subtitle"),
                text: i18nFilter()("hook_unlock.download_table.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.download_table.cta_text"),
        label: "Download Table",
    },
    CompetitiveLandscape: {
        slides: {
            CompetitiveLandscape: {
                img: AssetsService.assetUrl("/images/unlock-modal/competitive-landscape.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/competitive-landscape-2x.jpg"),
                title: i18nFilter()("hook_unlock.competitive_landscape.title"),
                subtitle: i18nFilter()("hook_unlock.competitive_landscape.subtitle"),
                text: i18nFilter()("hook_unlock.competitive_landscape.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.competitive_landscape.cta_text"),
        label: "Competitive Landscape",
    },
    UniqueVisitors: {
        slides: {
            UniqueVisitors: {
                img: AssetsService.assetUrl("/images/unlock-modal/unique-visitors.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/unique-visitors-2x.jpg"),
                title: i18nFilter()("hook_unlock.unique_visitors.title1"),
                subtitle: i18nFilter()("hook_unlock.unique_visitors.subtitle1"),
                text: i18nFilter()("hook_unlock.unique_visitors.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.unique_visitors.cta_text"),
        label: "Unique Visitors",
    },
    KeywordCompetitors: {
        slides: {
            KeywordCompetitors: {
                img: AssetsService.assetUrl(""),
                img2x: AssetsService.assetUrl(""),
                title: i18nFilter()("hook_unlock.keyword_competitors.competitors.title"),
                subtitle: i18nFilter()("hook_unlock.keyword_competitors.competitors.subtitle"),
                text: i18nFilter()("hook_unlock.keyword_competitors.competitors.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.keyword_competitors.cta_text"),
        label: "Keyword Competitors",
    },
    SourceOpportunities: {
        slides: {
            SourceOpportunities: {
                img: AssetsService.assetUrl("/images/unlock-modal/source-opportunities.svg"),
                title: i18nFilter()("hook_unlock.source_opportunities.title"),
                subtitle: i18nFilter()("hook_unlock.source_opportunities.subtitle"),
                text: i18nFilter()("hook_unlock.source_opportunities.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.source_opportunities.cta_text"),
        label: "Source Opportunities",
    },
    CustomMetrics: {
        slides: {
            CustomMetrics: {
                img: AssetsService.assetUrl("/images/unlock-modal/custom-metrics.gif"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/custom-metrics-2x.gif"),
                title: i18nFilter()("hook_unlock.custom_metrics.title"),
                subtitle: i18nFilter()("hook_unlock.custom_metrics.subtitle"),
                text: i18nFilter()("hook_unlock.custom_metrics.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.custom_metrics.cta_text"),
        label: "CustomMetrics",
    },
    TechnologiesList: {
        slides: {
            TechnologiesList: {
                img: AssetsService.assetUrl("/images/unlock-modal/technologies-categories.jpg"),
                img2x: AssetsService.assetUrl(
                    "/images/unlock-modal/technologies-categories-2x.jpg",
                ),
                title: i18nFilter()("hook_unlock.technologies_categories.title"),
                subtitle: i18nFilter()("hook_unlock.technologies_categories.subtitle"),
                text: i18nFilter()("hook_unlock.technologies_categories.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.technologies_categories.cta_text"),
        label: "Technologies Filter Lead Generator",
    },
    DeduplicationVisits: {
        slides: {
            DeduplicationVisits: {
                img: AssetsService.assetUrl("/images/unlock-modal/dedup-lock-modal.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/dedup-lock-modal.jpg"),
                title: i18nFilter()("hook_unlock.tae_dedup.title"),
                subtitle: i18nFilter()("hook_unlock.tae_dedup.subtitle"),
                text: i18nFilter()("hook_unlock.tae_dedup.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.technologies_categories.cta_text"),
        label: "Deduplicated Audiences ",
    },
});
