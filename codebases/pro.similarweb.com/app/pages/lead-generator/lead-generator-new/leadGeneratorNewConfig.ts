import _ from "lodash";
import { swSettings } from "common/services/swSettings";
import {
    ChipsFilter,
    FunctionalFlagFilter,
    FunctionalFlagFilterRadioBtn,
    GrowthFilter,
    IBaseFilter,
    InputComboFilter,
    OnOffFilter,
    RangeNumberFilter,
    RangePercentFilter,
    SliderFilter,
    SwitcherFilter,
} from "../LeadGeneratorFilters";
import DemographicBox from "./components/boxes/DemographicBox";
import DesktopOnlyBox from "./components/boxes/DesktopOnlyBox";
import FiltersBox, { getFiltersBoxActiveFilters } from "./components/boxes/FiltersBox";
import GrowthBox from "./components/boxes/GrowthBox";
import OrbBox from "./components/boxes/OrbBox";
import SingleFilterBox from "./components/boxes/SingleFilterBox";
import TldBox from "./components/boxes/TldBox";
import WarningBox from "./components/boxes/WarningBox";
import {
    getReportValue as getTechnographicsReportValue,
    TechnographicsBoxFilter,
    TechnographicsSummary,
} from "./components/filters/TechnographicsBoxFilter";
import {
    ABSOLUTE_NUMBERS_OPTIONS,
    AVERAGE_PAGES_PER_VISIT_OPTIONS,
    AVERAGE_VISIT_DURATION_OPTIONS,
    MONTHLY_VISITS_OPTIONS,
    SORT_BY_OPTIONS,
    TOP_SITES_OPTIONS,
} from "pages/lead-generator/lead-generator-new/filters-options";
import { formatDescriptionForAvgVisitDuration } from "./helpers";

// TODO: Re-think filter configuration

export interface IQueryConfig {
    id: string;
    component: any;
    title: string;
    subtitle?: string;
    subtitleCollapsed?: string;
    tooltip?: string;
    filters: IBaseFilter[];
    hasToggle?: boolean;
    isActive?: () => boolean;
    setActive?: (active) => void;
    groupingWarningText?: string;
    groupingWarning?: boolean;
    groupingDesktopOnly?: boolean;
    initiallyCollapsed?: boolean;
    isLocked?(): boolean;
    isBoxActive?(box: IQueryConfig): boolean;
    getActiveFilters(filters, isActive): any[];
}

const isFilterLocked = (filter): boolean => {
    const leadGenFilters = swSettings.components.SalesWorkspace.resources.WSLeadGeneratorFilters;

    return (
        leadGenFilters &&
        leadGenFilters.indexOf("All") === -1 &&
        leadGenFilters.indexOf(filter) === -1
    );
};

export const newReportConfig = [
    {
        id: "generalBox",
        component: FiltersBox,
        getActiveFilters: _.identity,
        title: "grow.lead_generator.new.general.title",
        subtitle: "grow.lead_generator.new.general.subtitle",
        tooltip: "grow.lead_generator.new.general.tooltip",
        filters: [
            new SliderFilter(
                "top",
                "grow.lead_generator.new.general.number_of_results",
                TOP_SITES_OPTIONS[10000], // default value for unlimited users - actual value will be set by quota
            ),
            new SwitcherFilter(
                "order_by",
                "grow.lead_generator.new.general.sort_websites_by",
                SORT_BY_OPTIONS,
            ),
        ],
    },
    {
        id: "countriesBox",
        preface: "grow.lead_generator.new.filters_group_title.traffic",
        component: WarningBox,
        getActiveFilters: _.identity,
        initiallyCollapsed: false,
        title: "grow.lead_generator.new.general.countries.title",
        subtitle: "grow.lead_generator.new.general.countries.subtitle",
        subtitleCollapsed: "grow.lead_generator.new.general.countries.subtitle_collapsed",
        filters: [
            new ChipsFilter(
                "countries",
                "grow.lead_generator.new.general.countries.title",
                "grow.lead_generator.new.general.countries.placeholder",
            ),
        ],
        groupingWarningText: "grow.lead_generator.new.general.countries.warning.text",
        groupingWarning: true,
        groupingDesktopOnly: true,
    },
    {
        id: "engagementAndTrafficBox",
        component: DesktopOnlyBox,
        getActiveFilters: getFiltersBoxActiveFilters,
        hasToggle: true,
        title: "grow.lead_generator.new.traffic_and_engagement.title",
        subtitle: "grow.lead_generator.new.traffic_and_engagement.subtitle",
        subtitleCollapsed: "grow.lead_generator.new.traffic_and_engagement.subtitle_collapsed",
        filters: [
            new RangeNumberFilter(
                "visits",
                "grow.lead_generator.new.traffic_and_engagement.monthly_visits",
                MONTHLY_VISITS_OPTIONS,
            ),
            new RangePercentFilter(
                "mobileweb_visits_share",
                "grow.lead_generator.new.traffic_and_engagement.share_of_mobile_web_visits",
                null,
                true,
            ),
            new RangeNumberFilter(
                "visitors",
                "grow.lead_generator.new.traffic_and_engagement.unique_monthly_visitors",
                ABSOLUTE_NUMBERS_OPTIONS,
            ),
            new RangeNumberFilter(
                "pageviews",
                "grow.lead_generator.new.traffic_and_engagement.total_page_views",
                ABSOLUTE_NUMBERS_OPTIONS,
            ),
        ],
    },
    {
        id: "engagementBox",
        component: WarningBox,
        getActiveFilters: getFiltersBoxActiveFilters,
        title: "grow.lead_generator.new.engagement.title",
        subtitle: "grow.lead_generator.new.engagement.subtitle",
        subtitleCollapsed: "grow.lead_generator.new.engagement.subtitle_collapsed",
        filters: [
            new RangePercentFilter(
                "bounce_rate",
                "grow.lead_generator.new.engagement.total.bounce.rate",
            ),
            new RangeNumberFilter(
                "pages_per_visit",
                "grow.lead_generator.new.engagement.avg.pages.per.visit",
                AVERAGE_PAGES_PER_VISIT_OPTIONS,
            ),
            new RangeNumberFilter(
                "avg_visit_duration",
                "grow.lead_generator.new.engagement.avg.visit.duration",
                AVERAGE_VISIT_DURATION_OPTIONS,
                formatDescriptionForAvgVisitDuration,
            ),
        ],
    },
    {
        id: "trafficSourcesBox",
        component: DesktopOnlyBox,
        getActiveFilters: getFiltersBoxActiveFilters,
        hasToggle: true,
        title: "grow.lead_generator.new.traffic_sources.title",
        subtitle: "grow.lead_generator.new.traffic_sources.subtitle",
        subtitleCollapsed: "grow.lead_generator.new.traffic_sources.subtitle_collapsed",
        filters: [
            new RangePercentFilter(
                "direct_desktop_visits_share",
                "grow.lead_generator.new.traffic_sources.direct_share",
            ),
            new RangePercentFilter(
                "referrals_desktop_visits_share",
                "grow.lead_generator.new.traffic_sources.referrals_share",
            ),
            new RangePercentFilter(
                "social_desktop_visits_share",
                "grow.lead_generator.new.traffic_sources.social_share",
            ),
            new RangePercentFilter(
                "organic_search_desktop_visits_share",
                "grow.lead_generator.new.traffic_sources.organic_search_share",
            ),
            new RangePercentFilter(
                "paid_search_desktop_visits_share",
                "grow.lead_generator.new.traffic_sources.paid_search_share",
            ),
            new RangePercentFilter(
                "displayads_desktop_visits_share",
                "grow.lead_generator.new.traffic_sources.display_ads_share",
            ),
        ],
    },
    {
        id: "growthFilterBox",
        hasToggle: true,
        isLocked: () => isFilterLocked("Growth"),
        trialHookName: "Growth",
        component: GrowthBox,
        getActiveFilters: getFiltersBoxActiveFilters,
        title: "grow.lead_generator.new.growth_filters_box.title",
        subtitle: "grow.lead_generator.new.growth_filters_box.subtitle",
        subtitleCollapsed: "grow.lead_generator.new.growth_filters_box.subtitle_collapsed",
        filters: [new GrowthFilter("growth")],
    },
    {
        id: "demographicBox",
        component: DemographicBox,
        getActiveFilters: getFiltersBoxActiveFilters,
        hasToggle: true,
        title: "grow.lead_generator.new.demographic.title",
        subtitle: "grow.lead_generator.new.demographic.subtitle",
        subtitleCollapsed: "grow.lead_generator.new.demographic.subtitle_collapsed",
        filters: [
            new RangePercentFilter(
                "female_share",
                "grow.lead_generator.new.demographic.gender_distribution",
                "grow.lead_generator.new.demographic.gender_distribution.female_users",
            ),
            new RangePercentFilter(
                "male_share",
                "grow.lead_generator.new.demographic.gender_distribution",
                "grow.lead_generator.new.demographic.gender_distribution.male_users",
            ),
            new RangePercentFilter(
                "age_group_18_24_share",
                "grow.lead_generator.new.demographic.age_group_18",
            ),
            new RangePercentFilter(
                "age_group_25_34_share",
                "grow.lead_generator.new.demographic.age_group_25",
            ),
            new RangePercentFilter(
                "age_group_35_44_share",
                "grow.lead_generator.new.demographic.age_group_35",
            ),
            new RangePercentFilter(
                "age_group_45_54_share",
                "grow.lead_generator.new.demographic.age_group_45",
            ),
            new RangePercentFilter(
                "age_group_55_64_share",
                "grow.lead_generator.new.demographic.age_group_55",
            ),
            new RangePercentFilter(
                "age_group_65_share",
                "grow.lead_generator.new.demographic.age_group_65",
            ),
        ],
    },
    {
        id: "categoriesBox",
        component: WarningBox,
        getActiveFilters: _.identity,
        preface: "grow.lead_generator.new.filters_group_title.website",
        title: "grow.lead_generator.new.general.categories.title",
        subtitle: "grow.lead_generator.new.general.categories.subtitle",
        subtitleCollapsed: "grow.lead_generator.new.general.categories.subtitle_collapsed",
        filters: [
            new ChipsFilter(
                "categories",
                "grow.lead_generator.new.general.categories.title",
                "grow.lead_generator.new.general.categories.placeholder",
            ),
        ],
        groupingWarningText: "grow.lead_generator.new.general.categories.warning.text",
        groupingWarning: true,
    },
    {
        id: "websiteFunctionalityBox",
        component: FiltersBox,
        getActiveFilters: _.identity,
        title: "grow.lead_generator.new.general.website_functionality.title",
        subtitle: "grow.lead_generator.new.general.website_functionality.subtitle",
        subtitleCollapsed:
            "grow.lead_generator.new.general.website_functionality.subtitle_collapsed",
        filters: [
            new FunctionalFlagFilter(
                "functionality",
                () => isFilterLocked("WebsiteCategory"),
                "WebsiteCategory",
            ),
        ],
    },
    {
        id: "technographicsIncludeBox",
        component: WarningBox,
        isBoxActive: () => swSettings.components.Home.resources.HasTechnographics,
        getActiveFilters: ([technoGraphicsFilter], isActive) =>
            isActive && technoGraphicsFilter.getValue().values.length ? [technoGraphicsFilter] : [],
        hasToggle: true,
        title: "grow.lead_generator.new.general.technographics.include.title",
        subtitle: "grow.lead_generator.new.general.technographics.include.subtitle",
        subtitleCollapsed:
            "grow.lead_generator.new.general.technographics.include.subtitle_collapsed",
        filters: [
            {
                stateName: "technographics_included",
                title: "",
                placeholder: "",
                component: TechnographicsBoxFilter,
                initValue: {
                    mode: "technologies",
                    functionality: "include",
                    values: [],
                },
                hideInBox: false,
                hideInSummary: false,
                isActive: true,
                getReportValue: getTechnographicsReportValue,
                summaryComponent: TechnographicsSummary,
                hasValue: function () {
                    return this.getValue().values.length > 0;
                },
            },
        ],
    },
    {
        id: "technographicsExcludeBox",
        component: WarningBox,
        isBoxActive: () => swSettings.components.Home.resources.HasTechnographics,
        getActiveFilters: ([technoGraphicsFilter], isActive) =>
            isActive && technoGraphicsFilter.getValue().values.length ? [technoGraphicsFilter] : [],
        hasToggle: true,
        title: "grow.lead_generator.new.general.technographics.excluded.title",
        subtitle: "grow.lead_generator.new.general.technographics.excluded.subtitle",
        subtitleCollapsed:
            "grow.lead_generator.new.general.technographics.excluded.subtitle_collapsed",
        filters: [
            {
                stateName: "technographics_excluded",
                title: "",
                placeholder: "",
                component: TechnographicsBoxFilter,
                initValue: {
                    mode: "technologies",
                    functionality: "exclude",
                    values: [],
                },
                hideInBox: false,
                hideInSummary: false,
                isActive: true,
                getReportValue: getTechnographicsReportValue,
                summaryComponent: TechnographicsSummary,
                hasValue: function () {
                    return this.getValue().values.length > 0;
                },
            },
        ],
    },
    {
        id: "adsenseBox",
        component: SingleFilterBox,
        getActiveFilters: getFiltersBoxActiveFilters,
        title: "grow.lead_generator.new.advertising_technology.title",
        subtitle: "grow.lead_generator.new.advertising_technology.subtitle",
        subtitleCollapsed: "grow.lead_generator.new.advertising_technology.subtitle_collapsed",
        filters: [
            new OnOffFilter(
                "has_adsense",
                "grow.lead_generator.new.advertising_technology.subtitle",
            ),
        ],
    },
    {
        id: "topLevelDomainsBox",
        component: TldBox,
        getActiveFilters: getFiltersBoxActiveFilters,
        hasToggle: true,
        title: "grow.lead_generator.new.top_level_domains.title",
        subtitle: "grow.lead_generator.new.top_level_domains.subtitle",
        subtitleCollapsed: "grow.lead_generator.new.top_level_domains.subtitle_collapsed",
        filters: [
            new InputComboFilter(
                "domain_contains",
                "grow.lead_generator.new.top_level_domains.summary.contains",
                "grow.lead_generator.new.top_level_domains.placeholder",
                "globe",
                "",
                "grow.lead_generator.new.top_level_domains.error",
                null,
                "domainContains",
            ),
            new InputComboFilter(
                "domain_ends_with",
                "grow.lead_generator.new.top_level_domains.summary.ends_with",
                "grow.lead_generator.new.top_level_domains.placeholder",
                "globe",
                "",
                "grow.lead_generator.new.top_level_domains.error",
                null,
                "domainEndsWith",
            ),
        ],
    },
    {
        id: "companyInformationBox",
        component: OrbBox,
        getActiveFilters: getFiltersBoxActiveFilters,
        hasToggle: true,
        isLocked: () => isFilterLocked("CompanyHQ"),
        trialHookName: "CompanyHQ",
        preface: "grow.lead_generator.new.filters_group_title.company",
        title: "grow.lead_generator.new.company_information.title",
        subtitle: "grow.lead_generator.new.company_information.subtitle",
        subtitleCollapsed: "grow.lead_generator.new.company_information.subtitle_collapsed",
        filters: [
            new FunctionalFlagFilterRadioBtn(
                "company_country_code_functionality",
                () => isFilterLocked("CompanyHQ"),
                "CompanyHQ",
            ),
            new ChipsFilter(
                "company_country_code_list",
                "grow.lead_generator.new.company.headquarters.summary.title",
                "grow.lead_generator.new.general.countries.placeholder",
            ),
            new InputComboFilter(
                "company_zip",
                "grow.lead_generator.new.company_information.zipcodes.title",
                "grow.lead_generator.new.company_information.zipcodes.placeholder",
                "country-usage-rank",
                "grow.lead_generator.new.company_information.zipcodes.disabled",
                "grow.lead_generator.new.company_information.zipcodes.error",
                "Headquarters country zip code",
                "companyZip",
                "grow.lead_generator.new.company_information.zipcodes.tooltip",
            ),
        ],
    },
];
