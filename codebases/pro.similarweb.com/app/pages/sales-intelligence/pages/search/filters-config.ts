import {
    IQueryConfig,
    newReportConfig,
} from "pages/lead-generator/lead-generator-new/leadGeneratorNewConfig";
import WizardBox from "pages/lead-generator/lead-generator-new/components/boxes/WizardBox";
import { SwitcherFilter } from "pages/lead-generator/LeadGeneratorFilters";
import { SORT_BY_OPTIONS } from "pages/lead-generator/lead-generator-new/filters-options";

// TODO: [lead-gen-remove]
const getConfig = () => {
    const config: IQueryConfig[] = [...newReportConfig];

    config[0] = {
        id: "generalBox",
        component: WizardBox,
        getActiveFilters: (filters) => filters,
        title: "grow.lead_generator.wizard.general.title",
        subtitle: "grow.lead_generator.wizard.general.subtitle",
        filters: [
            new SwitcherFilter(
                "order_by",
                "grow.lead_generator.new.general.sort_websites_by",
                SORT_BY_OPTIONS,
            ),
        ],
    };
    config[1] = {
        ...config[1],
        groupingWarning: false,
    };
    config[3] = {
        ...config[3],
        groupingWarning: false,
    };
    const newConfig = config.filter((item) => item.id !== "adsenseBox");

    return newConfig;
};

export default getConfig;
