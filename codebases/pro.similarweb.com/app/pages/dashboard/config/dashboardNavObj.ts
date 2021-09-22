import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "../../../filters/ngFilters";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { INavItem } from "../../../components/React/SideNavComponents/SideNav.types";

export const navObj = ({ sharedWithMeDashboards }) => {
    const dashboardService = Injector.get<any>("dashboardService");
    let navList = [
        {
            title: i18nFilter()("home.page.dashboard.my"),
            name: "dashboard",
            isOpen: true,
            hidden: false,
            subItems: dashboardService.dashboards.filter((d) => !d.isSharedWithMe) as INavItem[],
        },
    ];
    const hasSharedWithMeDashboardsCached = dashboardService.dashboards.filter(
        (d) => d.isSharedWithMe,
    );
    if (swSettings.components.ShareDashboard.resources.CanViewSharedDashboards) {
        if (sharedWithMeDashboards.length > 0) {
            sharedWithMeDashboards.forEach(dashboardService.addDefaultsToSharedDashboard);
        }
        if (sharedWithMeDashboards.length > 0 || hasSharedWithMeDashboardsCached.length > 0) {
            navList.push({
                title: i18nFilter()("home.page.dashboard.shared.with.me"),
                name: "sharedWithMe",
                isOpen: true,
                hidden: false,
                subItems: dashboardService.dashboards.filter((d) => d.isSharedWithMe) as INavItem[],
            });
        }
    }
    navList.forEach((subNavList) => [...subNavList.subItems]);
    return { navList };
};
