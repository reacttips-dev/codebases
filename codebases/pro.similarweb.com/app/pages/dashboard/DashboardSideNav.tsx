import { CreateNewButton, menuItem } from "@similarweb/ui-components/dist/side-nav";
import { toggleSideNav } from "actions/layoutActions";
import { IRootScopeService } from "angular";
import autobind from "autobind-decorator";
import classNames from "classnames";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { IDashboardService } from "components/dashboard/services/DashboardService";
import { SideNav } from "components/React/SideNavComponents/SideNav";
import {
    INavItem,
    ISideNavProps,
    ISideNavState,
} from "components/React/SideNavComponents/SideNav.types";
import { isBeta, isLocked, isNew } from "components/React/SideNavComponents/SideNav.utils";
import { SideNavList } from "components/React/SideNavComponents/SideNavList";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import noop from "lodash/noop";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { setSharedWithMeDashboards } from "./DashboardSideNavActions";
import { ShareDashboardService } from "./ShareDashboardService";
import { IModalService } from "../../@types/sw-angular-ui-bootstrap";
import { SwTrack } from "services/SwTrack";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

interface IDashboardNavState extends ISideNavState {
    isButtonLoading?: boolean;
    editedItem: any;
    items: any;
    initialLoad: boolean;
    subItemNameList: string[];
}

export class DashboardSideNav extends PureComponent<ISideNavProps, IDashboardNavState> {
    private services;
    private stateChangeSuccessHandler;
    private editableProperties;

    constructor(props, context) {
        super(props, context);

        this.services = {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            chosenSites: Injector.get("chosenSites"),
            rootScope: Injector.get<IRootScopeService>("$rootScope"),
            swSettings,
            dashboardService: Injector.get<IDashboardService>("dashboardService"),
            $modal: Injector.get<IModalService>("$modal"),
        };

        const currentActiveItem = this.getCurrentActive(this.props);

        this.state = {
            activeItemName: currentActiveItem,
            editedItem: {},
            items: this.getSideNavList(currentActiveItem),
            isButtonLoading: false,
            initialLoad: true,
            subItemNameList: [],
        };

        this.editableProperties = {
            isDashboard: false,
            isEditable: true,
            isFocused: true,
            isSelected: true,
            isError: false,
            onItemChange: noop,
            onItemCancelEdit: this.onItemCancelEdit,
            onItemEdit: this.onItemEdit,
            debounce: 0,
        };
        this.props.setSideNavItems();
    }

    public componentDidMount() {
        this.stateChangeSuccessHandler = this.services.rootScope.$on(
            "navChangeComplete",
            this.onStateChangeSuccess,
        );
    }

    public componentWillUnmount() {
        this.stateChangeSuccessHandler();
    }

    public componentDidUpdate(prevProps, prevState) {
        const active = this.getCurrentActive(this.props);
        const prevActive = this.getCurrentActive(prevProps);

        if (
            active !== prevActive ||
            this.props.navList !== prevProps.navList ||
            this.state.initialLoad
        ) {
            this.setState({
                activeItemName: active,
                items: this.getSideNavList(active, this.props),
                initialLoad: false,
                subItemNameList: this.getAllSubItemNames(this.props.navList),
            });
        }
    }

    public render() {
        return null;
        const buttonDisabled =
            this.services.swNavigator.current().disableNewDashboardButton ||
            this.services.swSettings.components.Dashboard.resources.IsReadonly;
        const newDashboardCTA = i18nFilter()("home.page.dashboard.add.new");
        const buttonClassNames = classNames(
            "SideNav-button",
            this.state.isButtonLoading ? "Button--loading" : "",
        );
        const createButton = (
            <CreateNewButton
                onClick={this.onCreateNewButtonClick}
                className={buttonClassNames}
                isDisabled={buttonDisabled}
            >
                {newDashboardCTA}
            </CreateNewButton>
        );
        return (
            <SideNav>
                {createButton}
                <SideNavList navItems={this.state.items} />
            </SideNav>
        );
    }

    private getAllSubItemNames(itemsTree) {
        return itemsTree.reduce((flat, toFlatten) => {
            return flat.concat(
                Array.isArray(toFlatten.subItems) ? toFlatten.subItems.map((sub) => sub.title) : [],
            );
        }, []);
    }

    private flattenSubItems(itemsTree) {
        return itemsTree.reduce((flat, toFlatten) => {
            return flat.concat(Array.isArray(toFlatten.subItems) ? toFlatten.subItems : []);
        }, []);
    }

    @autobind
    private onStateChangeSuccess(evt, toState, toParams) {
        const dashboardId = toParams.dashboardId;
        this.setState({
            activeItemName: dashboardId,
            items: this.getSideNavList(dashboardId),
        });
    }

    @autobind
    private getCurrentActive(props) {
        return props.currentStateId ? props.currentStateId : props.currentPage;
    }

    @autobind
    private onCreateNewButtonClick() {
        SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Add a New Dashboard");
        this.services.swNavigator.go("dashboard-gallery");
    }

    @autobind
    private getSideNavList(activeItemName, props?) {
        const _props = props || this.props;
        return _props.navList.map((listItem: INavItem) => {
            return {
                ...listItem,
                subItems: listItem.subItems.map((subItem) => {
                    return { ...this.interpretNavItem(subItem, activeItemName) };
                }),
            };
        });
    }

    @autobind
    private interpretNavItem(navListItem, activeItemName) {
        let menuItems = [
            { id: menuItem.rename },
            { id: menuItem.duplicate },
            { id: menuItem.share },
            { id: menuItem.erase },
        ];
        // Duplicate dashboard to other users is available only for internal users.
        if (!this.services.swSettings.components.Home.resources.CanDuplicateDashboardToOthers) {
            menuItems = menuItems.filter((item) => item.id !== menuItem.share);
        }

        if (!this.services.swSettings.components.Dashboard.resources.CanDuplicateADashboard) {
            menuItems = menuItems.map((item: any) => {
                if (item.id === menuItem.duplicate) {
                    item.disabled = true;
                }
                return item;
            });
        }

        if (navListItem.isSharedWithMe) {
            menuItems = menuItems.map((item: any) => {
                if (item.id !== menuItem.duplicate) {
                    item.disabled = true;
                }
                return item;
            });
        }

        const result = {
            isSharedByMe: navListItem.isSharedByMe,
            isSharedWithMe: navListItem.isSharedWithMe,
            title: navListItem.title,
            name: navListItem.name,
            isDisabled: false,
            isBeta: isBeta(navListItem),
            isNew: isNew(navListItem),
            isLocked: isLocked(navListItem),
            isActive: activeItemName === navListItem.id,
            url: navListItem.link,
            // specific for dashboard
            isDashboard: true,
            isLoading: false,
            menuItems,
            id: navListItem.id,
            deletePopUpIsOpen: navListItem.deletePopUpIsOpen,
            onCancel: () => this.onCancelDeleteClick(navListItem),
            onConfirm: () => this.onConfirmDeleteClick(navListItem),
            onMenuToggle: (isNavItemOpen) => noop,
            onMenuClick: (selectedMenuItem) =>
                this.onNavItemMenuClick(selectedMenuItem, navListItem),
            onClick: () => this.onNavItemClick(navListItem),
        };

        return result;
    }

    @autobind
    private onNavItemClick(navListItem) {
        SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/" + navListItem.title);
        if (window.outerWidth <= 1200) {
            this.props.toggleSideNav();
        }
        this.setState({
            activeItemName: navListItem.state,
        });
    }

    @autobind
    private onNavItemMenuClick(item, navListItem) {
        switch (item.id) {
            case menuItem.rename:
                SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Edit");
                this.setPropertiesToItem(
                    navListItem,
                    this.editableProperties,
                    this.setState({ editedItem: navListItem }),
                );
                break;
            case menuItem.erase:
                SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Delete");
                this.setPropertyToItem(navListItem, "deletePopUpIsOpen");
                break;
            case menuItem.duplicate:
                SwTrack.all.trackEvent("Duplicate Report", "click", "Side Bar");
                this.onDuplicateDashboard(navListItem);
                break;
            case menuItem.share:
                this.onShareDashboard(navListItem);
                break;
        }
    }

    @autobind
    private onItemCancelEdit() {
        this.setPropertiesToItem(this.state.editedItem, { isDashboard: true, isEditable: false });
    }

    @autobind
    private onItemEdit(newItemTitle) {
        if (this.state.editedItem.title === newItemTitle) {
            this.setPropertiesToItem(this.state.editedItem, {
                isDashboard: true,
                isEditable: false,
                isLoading: false,
            });
            return;
        }
        if (this.isItemValid(newItemTitle)) {
            SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Edit/" + newItemTitle);
            this.setPropertiesToItem(
                this.state.editedItem,
                { isLoading: true, isError: false },
                _.debounce(() => this.renameDashboard(this.state.editedItem, newItemTitle), 100),
            );
        } else {
            this.setPropertyToItem(this.state.editedItem, "isError");
        }
    }

    @autobind
    private isItemValid(newItemTitle) {
        return this.services.dashboardService.validateDashboardTitle(
            this.state.editedItem,
            newItemTitle,
        );
    }

    @autobind
    private onCancelDeleteClick(navListItem) {
        SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Delete/No");
        this.setState({
            items: this.getSideNavList(this.state.activeItemName),
        });
    }

    @autobind
    private onConfirmDeleteClick(navListItem) {
        SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Delete/Yes");
        this.setPropertyToItem(navListItem, "isLoading", () => {
            this.deleteDashboard(navListItem);
        });
    }

    @autobind
    private onShareDashboard(navListItem) {
        this.services.$modal.open({
            templateUrl: "/app/components/duplicate-dashboard-popup/duplicate-dashboard-popup.html",
            controller: "duplicateDashbordPopupCtrl as ctrl",
            windowClass: "sw-user-modal sw-user-modal-impersonate",
            resolve: {
                item: () => navListItem,
            },
        });
    }

    @autobind
    private renameDashboard(navListItem, newTitle) {
        const oldTitle = navListItem.title;
        const setPropertiesToItem = this.setPropertiesToItem;
        this.services.dashboardService
            .renameDashboard({ id: navListItem.id, title: newTitle })
            .then(
                () => {
                    this.props.setSideNavItems();
                    setPropertiesToItem(navListItem, {
                        title: newTitle,
                        isDashboard: true,
                        isEditable: false,
                        isLoading: false,
                    });
                },
                function fail() {
                    setPropertiesToItem(navListItem, {
                        title: oldTitle,
                        isDashboard: false,
                        isEditable: true,
                        isLoading: false,
                        isError: true,
                    });
                },
            );
    }

    @autobind
    private async deleteDashboard(navListItem) {
        const swNavigator = this.services.swNavigator;
        const dashboardService = this.services.dashboardService;
        const fail = () => {
            this.setState({
                items: this.getSideNavList(this.state.activeItemName),
            });
        };
        const success = () => {
            this.props.setSideNavItems();
            if (dashboardService.dashboards.length) {
                const dashboard = dashboardService.getFirstDashboard();
                if (dashboard.name && dashboard.name === "newdashboard") {
                    swNavigator.go("dashboard-new"); // if the last item is the "add dashboard" button
                } else {
                    swNavigator.go("dashboard-exist", {
                        dashboardId: dashboard.id,
                    });
                }
            } else {
                swNavigator.go("dashboard-gallery");
            }
        };

        try {
            if (navListItem.isSharedByMe) {
                const { err, success } = await ShareDashboardService.unShare({
                    dashboardId: navListItem.id,
                });
                if (err || !success) {
                    fail();
                    return;
                }
            }
            await dashboardService.deleteDashboard({ id: navListItem.id });
            success();
        } catch (e) {
            fail();
        }
    }

    @autobind
    private setPropertyToItem(navListItem, property, callback?) {
        const items = this.state.items.map((listItem) => {
            return {
                ...listItem,
                subItems: listItem.subItems.map((subItem) => {
                    subItem[property] = navListItem.id === subItem.id;
                    return { ...subItem };
                }),
            };
        });

        this.setState(
            {
                items,
            },
            callback,
        );
    }

    @autobind
    private setPropertiesToItem(navListItem, properties, callback?) {
        const items = this.state.items.map((listItem) => {
            return {
                ...listItem,
                subItems: listItem.subItems.map((subItem) => {
                    if (navListItem.id === subItem.id) {
                        subItem = Object.assign({}, subItem, properties);
                    }
                    return { ...subItem };
                }),
            };
        });

        this.setState(
            {
                items,
            },
            callback,
        );
    }

    @autobind
    private onDuplicateDashboard(navListItem) {
        this.setPropertyToItem(navListItem, "isLoading", this.duplicateDashboard(navListItem));
    }

    @autobind
    private duplicateDashboard(navListItem) {
        const swNavigator = this.services.swNavigator;
        this.services.dashboardService.cloneDashboard(navListItem).then(
            async (createdDashboard) => {
                await keywordsGroupsService.init();
                this.props.setSideNavItems();
                swNavigator.go("dashboard-created", {
                    dashboardId: createdDashboard.id,
                });
            },
            function fail() {
                this.setState({
                    items: this.getSideNavList(this.state.activeItemName),
                });
            },
        );
    }
}

function mapStateToProps(store) {
    const currentPage = store.routing.currentPage;
    const currentStateId = store.routing.currentStateId;
    const { navList } = store.customDashboard.dashboardSideNav;
    return {
        currentPage,
        currentStateId,
        navList,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleSideNav: () => {
            dispatch(toggleSideNav());
        },
        setSideNavItems: () => {
            dispatch(setSharedWithMeDashboards());
        },
    };
}

SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(DashboardSideNav),
    "DashboardSideNav",
);
