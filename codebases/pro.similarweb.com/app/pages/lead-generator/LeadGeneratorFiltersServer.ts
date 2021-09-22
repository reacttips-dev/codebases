import { getClientValueChips } from "./lead-generator-new/components/filters/ChipsFilter";
import {
    getCountryListSubtitle,
    getCountrySubtitle,
} from "./lead-generator-new/components/filters/CountryFilter";
import { getFunctionalFlagSubtitle } from "./lead-generator-new/components/filters/FunctionalFlagBoxFilter";
import { getFunctionalFlagBoxRadioBtnText } from "./lead-generator-new/components/filters/FunctionalFlagBoxRadioBtnFilter";
import { getGrowthSubtitle } from "./lead-generator-new/components/filters/GrowthFilters";
import {
    getInputComboSubtitle,
    getInputComboSubtitleValue,
} from "./lead-generator-new/components/filters/InputComboFilter";
import { getOnOffSubtitle } from "./lead-generator-new/components/filters/OnOffFilter";
import { getRangeNumberSubtitle } from "./lead-generator-new/components/filters/RangeNumberFilter";
import { getRangePercentSubtitle } from "./lead-generator-new/components/filters/RangePercentFilter";
import { getSliderSubtitle } from "./lead-generator-new/components/filters/SliderFilter";
import { getSwitcherSubtitle } from "./lead-generator-new/components/filters/SwitcherFilter";
import { getTechnographicsReportResultSubtitle } from "./lead-generator-new/components/filters/TechnographicsBoxFilter";
import LeadGeneratorUtils from "./LeadGeneratorUtils";
import { formatDescriptionForAvgVisitDuration } from "./lead-generator-new/helpers";

export const mapServerFilters = {
    top: {
        getFilterSubtitle: (value) =>
            getSliderSubtitle(value, "grow.lead_generator.exist.description.number_of_results"),
    },
    // Engagement
    bounce_rate: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(value, "grow.lead_generator.exist.description.bounce_rate"),
    },
    pages_per_visit: {
        getFilterSubtitle: (value) =>
            getRangeNumberSubtitle(value, "grow.lead_generator.exist.description.pages_per_visit"),
    },
    avg_visit_duration: {
        getFilterSubtitle: (value) => {
            return getRangeNumberSubtitle(
                value,
                "grow.lead_generator.exist.description.avg_visit_duration",
                formatDescriptionForAvgVisitDuration,
            );
        },
    },
    order_by: {
        getFilterSubtitle: (value) =>
            getSwitcherSubtitle(value, "grow.lead_generator.exist.description.sort_websites_by"),
    },
    categories: {
        getFilterSubtitle: (value) =>
            getClientValueChips(value, LeadGeneratorUtils.getComponentCategories()),
    },
    functionality: {
        getFilterSubtitle: (value) => getFunctionalFlagSubtitle(value),
    },
    countries: {
        getFilterSubtitle: (value) =>
            getClientValueChips(value, LeadGeneratorUtils.getComponentCountries()),
    },
    visits: {
        getFilterSubtitle: (value) =>
            getRangeNumberSubtitle(value, "grow.lead_generator.exist.description.monthly_visits"),
    },
    mobileweb_visits_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.exist.description.share_of_mobile_web_visits",
            ),
    },
    visitors: {
        getFilterSubtitle: (value) =>
            getRangeNumberSubtitle(
                value,
                "grow.lead_generator.exist.description.unique_monthly_visitors",
            ),
    },
    pageviews: {
        getFilterSubtitle: (value) =>
            getRangeNumberSubtitle(value, "grow.lead_generator.exist.description.total_page_views"),
    },
    direct_desktop_visits_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(value, "grow.lead_generator.exist.description.direct_share"),
    },
    referrals_desktop_visits_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(value, "grow.lead_generator.exist.description.referrals_share"),
    },
    social_desktop_visits_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(value, "grow.lead_generator.exist.description.social_share"),
    },
    organic_search_desktop_visits_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.exist.description.organic_search_share",
            ),
    },
    paid_search_desktop_visits_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.exist.description.paid_search_share",
            ),
    },
    displayads_desktop_visits_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.exist.description.display_ads_share",
            ),
    },
    male_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.new.demographic.gender_distribution.male_users",
            ),
    },
    female_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.new.demographic.gender_distribution.female_users",
            ),
    },
    age_group_18_24_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.exist.description.age_group_18_24_share",
            ),
    },
    age_group_25_34_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.exist.description.age_group_25_34_share",
            ),
    },
    age_group_35_44_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.exist.description.age_group_35_44_share",
            ),
    },
    age_group_45_54_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.exist.description.age_group_45_54_share",
            ),
    },
    age_group_55_64_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.exist.description.age_group_55_64_share",
            ),
    },
    age_group_65_share: {
        getFilterSubtitle: (value) =>
            getRangePercentSubtitle(
                value,
                "grow.lead_generator.exist.description.age_group_65_share",
            ),
    },
    growth: {
        getFilterSubtitle: getGrowthSubtitle,
    },
    company_country_code: {
        getFilterSubtitle: (value) =>
            getCountrySubtitle(value, "grow.lead_generator.exist.description.company_country_code"),
    },
    company_country_code_list: {
        getFilterSubtitle: (value) =>
            getCountryListSubtitle(value, LeadGeneratorUtils.getCompanyInformationCountries()),
    },
    company_state_code: {
        getFilterSubtitle: (value) =>
            getCountrySubtitle(value, "grow.lead_generator.exist.description.company_state_code"),
    },
    company_zip: {
        getFilterSubtitle: (value) => getInputComboSubtitleValue(value),
    },
    company_country_code_functionality: {
        getFilterSubtitle: (value) => getFunctionalFlagBoxRadioBtnText(value),
    },
    domain_contains: {
        getFilterSubtitle: (value) =>
            getInputComboSubtitle(value, "grow.lead_generator.exist.description.domains_contains"),
    },
    domain_ends_with: {
        getFilterSubtitle: (value) =>
            getInputComboSubtitle(value, "grow.lead_generator.exist.description.domains_ends_with"),
    },
    has_adsense: {
        getFilterSubtitle: () =>
            getOnOffSubtitle("grow.lead_generator.exist.description.has_adsense"),
    },
    technographics_included: {
        getFilterSubtitle: (filter) => (rest) =>
            getTechnographicsReportResultSubtitle({ ...rest, filter }),
    },
    technographics_excluded: {
        getFilterSubtitle: (filter) => (rest) =>
            getTechnographicsReportResultSubtitle({ ...rest, filter }),
    },
};
