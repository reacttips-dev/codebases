import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { IDashboardNavItemConfig } from "components/SecondaryBar/NavBars/DashboardsNavBar/DashboardNavBarTypes";
import {
    IDashboardItemMenuConfig,
    IDashboardNavItem,
    IDashboardsNavBarServices,
} from "../DashboardNavBarTypes";

/**
 * Builds the elipsis menu config. (actions menu for each of the nav items)
 */
const buildMenuConfigForItem = (
    item: IDashboardNavItem,
    services: IDashboardsNavBarServices,
): IDashboardItemMenuConfig[] => {
    const hasDuplicatePermission =
        services.swSettings.components.Dashboard.resources.CanDuplicateADashboard;

    const hasSharePermission =
        services.swSettings.components.Home.resources.CanDuplicateDashboardToOthers;

    return [
        /**
         * Renames the current item in the user dashboard
         */
        {
            id: "rename",
            disabled: item.isSharedWithMe,
            iconName: "edit",
            text: "Rename",
            isVisible: true,
        },
        /**
         * Duplicates the current item in the user dashboard
         */
        {
            id: "duplicate",
            disabled: !hasDuplicatePermission,
            iconName: "copy",
            text: "Duplicate",
            isVisible: true,
        },
        /**
         * Shares the current item with another user
         */
        {
            id: "share",
            disabled: item.isSharedWithMe,
            iconName: "copy",
            text: "Copy to user",
            isVisible: hasSharePermission,
        },
        /**
         * Deletes the current item from the user's navbar
         */
        {
            id: "erase",
            disabled: item.isSharedWithMe,
            iconName: "delete",
            text: "Delete",
            isVisible: true,
        },
    ];
};

/**
 * Builds the item config for each of the dashboard navbar items
 */
const buildDashboardItemConfig = (
    item: IDashboardNavItem,
    ids: {
        selectedId: string;
        loadingId: string;
        deletedId: string;
        editingId: string;
    },
    services: IDashboardsNavBarServices,
): IDashboardNavItemConfig => {
    const res = {
        isSharedByMe: item.isSharedByMe,
        isSharedWithMe: item.isSharedWithMe,
        title: item.title,
        name: item.name,
        isActive: ids.selectedId === item.id,
        isEditable: ids.editingId === item.id,
        isDashboard: true,
        isLoading: ids.loadingId === item.id,
        id: item.id,
        deletePopUpIsOpen: ids.deletedId === item.id,
        menuItems: buildMenuConfigForItem(item, services),
    };

    return res;
};

export const adaptDashboardItemsData = (
    navList: INavItem[],
    ids: {
        selectedId: string;
        loadingId: string;
        deletedId: string;
        editingId: string;
    },
    services: IDashboardsNavBarServices,
): INavItem[] => {
    const itemsConfig = navList?.map((item) => {
        return {
            ...item,
            subItems: item.subItems.map((subItem: IDashboardNavItem) =>
                buildDashboardItemConfig(subItem, ids, services),
            ),
        };
    });

    return itemsConfig;
};
