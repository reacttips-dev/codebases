import styled from "styled-components";
import React, { FC, useMemo, useState } from "react";
import { connect } from "react-redux";
import { setSharedWithMeDashboards } from "pages/dashboard/DashboardSideNavActions";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import {
    DashboardMenuItemType,
    IDashboardItemMenuConfig,
    IDashboardNavItem,
    IDashboardsNavBarServices,
} from "./DashboardNavBarTypes";
import { adaptDashboardItemsData } from "components/SecondaryBar/NavBars/DashboardsNavBar/Services/DashboardNavBarDataHandler";
import { IDashboardNavItemConfig } from "components/SecondaryBar/NavBars/DashboardsNavBar/DashboardNavBarTypes";
import { DashboardNavItem } from "./NavComponents/DashboardNavItem";
import { ShareDashboardService } from "pages/dashboard/ShareDashboardService";
import { SecondaryBarGroupItem } from "components/SecondaryBar/Components/SecondaryBarGroupItem";
import { IModalService } from "../../../../@types/sw-angular-ui-bootstrap";
import {
    setDialogIsOpen,
    setSelectedDashboard,
} from "pages/dashboard/DashboardCopyToUserDialogActions";
import { SwTrack } from "services/SwTrack";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const BodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 8px;
`;

interface IDashboardsNavBarBodyProps {
    currentPage: string;
    currentStateId: string;
    navList: INavItem[];
    setSideNavItems: () => void;
    copyToUserDialogIsOpen: boolean;
    setCopyToUserDialogIsOpen: (isOpen: boolean) => void;
    setCopyToUserDialogSelectedDashboard: (selectedDashboard: IDashboardNavItem) => void;
}

export const DashboardsNavBarBody: FC<IDashboardsNavBarBodyProps> = (props) => {
    const { currentStateId, navList, setSideNavItems } = props;
    /**
     * Marks if there's an item that is currently in delete mode.
     * an item that is currently deleted shows a delete confirmation dialog above it
     */
    const [currentlyDeletedId, setCurrentlyDeletedId] = useState<string>(null);

    /**
     * Marks if there's an item that is currently in loading mode.
     * an item that is currently loading shows a loader.
     */
    const [currentlyLoadingId, setCurrentlyLoadingId] = useState<string>(null);

    /**
     * Marks if there's an item that is currenty in edit mode.
     * an item that is currently editing opens a rename input for changing its text (title)
     */
    const [currentlyEditedItem, setCurrentlyEditedItem] = useState<IDashboardNavItemConfig>(null);

    const services = useMemo<IDashboardsNavBarServices>(() => {
        return {
            translate: i18nFilter(),
            swNavigator: Injector.get<any>("swNavigator"),
            dashboardService: Injector.get<any>("dashboardService"),
            $modal: Injector.get<IModalService>("$modal"),
            swSettings,
        };
    }, []);

    /**
     * Runs after deleting an item. Navigates to another nav item.
     */
    const updateNavigationAfterDelete = (): void => {
        const { dashboardService, swNavigator } = services;
        setSideNavItems();

        if (dashboardService.dashboards.length > 0) {
            const firstDashboard = dashboardService.getFirstDashboard();
            swNavigator.go("dashboard-exist", { dashboardId: firstDashboard.id });
            return;
        }

        swNavigator.go("dashboard-gallery");
    };

    /**
     * Runs after editing an item. valides that the new item name is valid.
     */
    const isNewItemTitleValid = (newItemTitle: string): boolean => {
        const { dashboardService } = services;
        return dashboardService.validateDashboardTitle(currentlyEditedItem, newItemTitle);
    };

    /**
     * Deletes and un-shares the dashboard nav item from the navbar.
     */
    const handleDeleteDashboard = async (navListItem: any): Promise<void> => {
        const { dashboardService } = services;

        if (navListItem.isSharedByMe) {
            await ShareDashboardService.unShare({
                dashboardId: navListItem.id,
            });
        }

        await dashboardService.deleteDashboard({ id: navListItem.id });
        updateNavigationAfterDelete();
    };

    /**
     * Duplicates the dashboard nav item
     */
    const handleDuplicateDashboard = async (navListItem: any): Promise<void> => {
        const { swNavigator, dashboardService } = services;

        setCurrentlyLoadingId(navListItem.id);
        const dashboardDuplicateRes = await dashboardService.cloneDashboard(navListItem);
        await keywordsGroupsService.init();
        setCurrentlyLoadingId(null);
        setSideNavItems();

        swNavigator.go("dashboard-created", {
            dashboardId: dashboardDuplicateRes.id,
        });
    };

    /**
     * Shares the dashboard nav item with another user
     */
    const handleShareDashboard = (navListItem: IDashboardNavItem): void => {
        const {
            setCopyToUserDialogIsOpen,
            copyToUserDialogIsOpen,
            setCopyToUserDialogSelectedDashboard,
        } = props;
        setCopyToUserDialogIsOpen(!copyToUserDialogIsOpen);
        setCopyToUserDialogSelectedDashboard(navListItem);
    };

    /**
     * Renames the dashboard nav item
     */
    const handleRenameDashboard = async (
        navListItem: any,
        newDashboardName: string,
    ): Promise<void> => {
        const { dashboardService } = services;

        try {
            setCurrentlyLoadingId(navListItem.id);
            await dashboardService.renameDashboard({
                id: navListItem.id,
                title: newDashboardName,
            });
        } catch (e) {
        } finally {
            setCurrentlyLoadingId(null);
            setCurrentlyEditedItem(null);
        }
    };

    const handleItemConfirmDelete = async (navListItem: any): Promise<void> => {
        SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Delete/Yes");

        setCurrentlyLoadingId(navListItem.id);
        await handleDeleteDashboard(navListItem);

        setCurrentlyDeletedId(null);
        setCurrentlyLoadingId(null);
    };

    const handleItemCancelDelete = (): void => {
        SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Delete/No");
        setCurrentlyDeletedId(null);
    };

    const handleItemConfirmEdit = (newItemText: string): void => {
        const hasUpdatedText = currentlyEditedItem.title !== newItemText;
        if (!hasUpdatedText) {
            setCurrentlyEditedItem(null);
            return;
        }

        const hasValidNewText = isNewItemTitleValid(newItemText);
        if (!hasValidNewText) {
            setCurrentlyEditedItem(null);
            return;
        }

        SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Edit/" + newItemText);
        handleRenameDashboard(currentlyEditedItem, newItemText);
    };

    const handleItemCancelEdit = (): void => {
        setCurrentlyEditedItem(null);
    };

    const handleMenuItemClick = (menuItem: { id: DashboardMenuItemType }, navItem: any): void => {
        switch (menuItem.id) {
            case "rename":
                SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Edit");
                setCurrentlyEditedItem(navItem);
                return;

            case "erase":
                SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Delete");
                setCurrentlyDeletedId(navItem.id);
                return;

            case "duplicate":
                SwTrack.all.trackEvent("Duplicate Report", "click", "Side Bar");
                handleDuplicateDashboard(navItem);
                return;

            case "share":
                handleShareDashboard(navItem);
                return;

            default:
                return;
        }
    };

    const handleItemClick = (itemId: string): void => {
        const { swNavigator } = services;
        SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/" + itemId);
        swNavigator.go("dashboard-exist", {
            dashboardId: itemId,
        });
    };

    const buildMenuItems = (menuItemsConfig: IDashboardItemMenuConfig[]): JSX.Element[] => {
        return menuItemsConfig
            .filter((menuItem) => menuItem.isVisible)
            .map((menuItem) => {
                return (
                    <EllipsisDropdownItem
                        key={menuItem.id}
                        id={menuItem.id}
                        iconName={menuItem.iconName}
                        disabled={menuItem.disabled}
                    >
                        {menuItem.text}
                    </EllipsisDropdownItem>
                );
            });
    };

    const buildNavItems = (): JSX.Element[] => {
        const itemsData = adaptDashboardItemsData(
            navList,
            {
                selectedId: currentStateId,
                loadingId: currentlyLoadingId,
                deletedId: currentlyDeletedId,
                editingId: currentlyEditedItem?.id,
            },
            services,
        );
        return itemsData.map((groupItem) => {
            const hasActiveChild = groupItem.subItems.some((child) => child.id === currentStateId);

            const itemChildren = groupItem.subItems.map((child: IDashboardNavItemConfig) => {
                return (
                    <DashboardNavItem
                        key={child.id}
                        itemConfig={child}
                        onClick={handleItemClick}
                        onMenuItemClick={handleMenuItemClick}
                        getMenuItems={() => buildMenuItems(child.menuItems)}
                        onConfirmDelete={handleItemConfirmDelete}
                        onCancelDelete={handleItemCancelDelete}
                        onCancelEdit={handleItemCancelEdit}
                        onConfirmEdit={handleItemConfirmEdit}
                    />
                );
            });

            return (
                <SecondaryBarGroupItem
                    key={groupItem.id}
                    text={groupItem.title}
                    id={groupItem.id}
                    isInitiallyOpened={true}
                    hasActiveChild={hasActiveChild}
                    onClick={() => void 0}
                >
                    {itemChildren}
                </SecondaryBarGroupItem>
            );
        });
    };

    return <BodyContainer>{buildNavItems()}</BodyContainer>;
};

const mapStateToProps = (state) => {
    const { currentPage, currentStateId } = state.routing;
    const { navList } = state.customDashboard.dashboardSideNav;
    const { isOpen } = state.customDashboard.dashboardCopyToUserDialog;
    return {
        currentPage,
        currentStateId,
        navList,
        copyToUserDialogIsOpen: isOpen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSideNavItems: () => {
            dispatch(setSharedWithMeDashboards());
        },
        setCopyToUserDialogIsOpen: (isOpen = false) => {
            dispatch(setDialogIsOpen(isOpen));
        },
        setCopyToUserDialogSelectedDashboard: (selectedDashboard = null) => {
            dispatch(setSelectedDashboard(selectedDashboard));
        },
    };
};

const connected = connect(mapStateToProps, mapDispatchToProps)(DashboardsNavBarBody);

export default connected;
