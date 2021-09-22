import { IDashboardTemplate } from "../DashboardTemplateService";
import { EFamilyTypes } from "../components/DashboardTemplatesConfig";

const dashboard: IDashboardTemplate = {
    id: "blank",
    empty: true,
    locked: false,
    title: "dashboard.templates.blank.title",
    description: "dashboard.templates.blank.description",
    descriptionLong: "",
    keyMetrics: "",
    sticky: true,
    minItems: 1,
    maxItems: 5,
    familyType: EFamilyTypes.Website,
};

export default dashboard;
