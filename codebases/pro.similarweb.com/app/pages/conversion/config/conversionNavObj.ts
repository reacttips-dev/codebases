import { INavItem } from "../../../components/React/SideNavComponents/SideNav.types";
import { applyNavItemPermissions } from "../../workspace/common/workspacesUtils";

export const navObj = (): { navList: INavItem[] } => {
    return {
        navList: [
            {
                name: "conversion",
                title: "sidebar.conversion.title",
                subItems: [
                    {
                        name: "industryConversion",
                        title: "sidebar.industry.conversion.title",
                        state: "conversion-categoryoverview",
                    },
                    {
                        name: "websiteConversionOverview",
                        title: "sidebar.website.conversion.overview.title",
                        state: "conversion.websiteoverview",
                    },
                ],
            },
        ].map(applyNavItemPermissions),
    };
};
