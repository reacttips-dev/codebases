import { i18nFilter } from "filters/ngFilters";
import { INavItem } from "../../components/React/SideNavComponents/SideNav.types";
import { applyNavItemPermissions } from "../workspace/common/workspacesUtils";

export const navObj = (leadGeneratorReports) => {
    return [
        {
            title: i18nFilter()("grow.lead_generator.all.title"),
            name: "lead-generator-all",
            state: "leadGenerator.all",
        },
        {
            title: i18nFilter()("grow.lead_generator.my_reports"),
            name: "lead-generator-my-reports",
            subItems: leadGeneratorReports.filter((report) => report.status === 0),
        },
        {
            title: i18nFilter()("grow.lead_generator.archived_reports"),
            name: "lead-generator-archived-reports",
            subItems: leadGeneratorReports.filter((report) => report.status === 1),
        },
    ].map(applyNavItemPermissions);
};
