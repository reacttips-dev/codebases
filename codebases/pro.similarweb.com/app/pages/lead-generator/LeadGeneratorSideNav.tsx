import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { SideNav } from "components/React/SideNavComponents/SideNav";
import autobind from "autobind-decorator";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { CreateNewButton } from "@similarweb/ui-components/dist/side-nav";
import { i18nFilter } from "filters/ngFilters";
import { ISideNavProps, ISideNavState } from "components/React/SideNavComponents/SideNav.types";
import classNames from "classnames";
import { Injector } from "common/ioc/Injector";
import { SideNavList } from "components/React/SideNavComponents/SideNavList";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import {
    hasAppTooltip,
    isBeta,
    isLocked,
    isNew,
    navItemAppTooltip,
    trackSideNavItemClick,
} from "components/React/SideNavComponents/SideNav.utils";
import { allTrackers } from "services/track/track";
import {
    fetchLeadGeneratorReports,
    updateLeadGeneratorReportName,
    IUpdateReport,
} from "actions/leadGeneratorActions";
import { toggleSideNav } from "actions/layoutActions";
import * as _ from "lodash";
import LeadGeneratorUtils from "./LeadGeneratorUtils";
import {
    archiveLeadGeneratorReport,
    unarchiveLeadGeneratorReport,
} from "../../actions/leadGeneratorActions";

enum menuItem {
    rename = "rename",
    copy = "copy",
    archive = "archive",
    unarchive = "unarchive",
}

interface ILeadGeneratorNavState extends ISideNavState {
    isButtonLoading?: boolean;
    editedItem: any;
}

interface ILeadGeneratorNavProps extends ISideNavProps {
    updateReportName: (report: IUpdateReport) => void;
    archiveReport: (report: IUpdateReport) => void;
    unarchiveReport: (report: IUpdateReport) => void;
    reportNameLoading: string;
}

export class LeadGeneratorSideNav extends PureComponent<
    ILeadGeneratorNavProps,
    ILeadGeneratorNavState
> {
    private services;
    private stateChangeSuccessHandler;

    constructor(props) {
        super(props);

        this.services = {
            swNavigator: Injector.get("swNavigator"),
            rootScope: Injector.get("$rootScope"),
        };

        const currentActiveItem = this.getCurrentActive(
            this.props.currentPage,
            this.props.currentParams.reportId,
        );

        this.state = {
            activeItemName: currentActiveItem,
            editedItem: {},
            items: this.getSideNavList(currentActiveItem),
            isButtonLoading: false,
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
        const activeItemName = this.getCurrentActive(
            this.props.currentPage,
            this.props.currentParams.reportId,
        );
        if (activeItemName !== prevState.activeItemName) {
            this.setState({
                activeItemName,
                items: this.getSideNavList(activeItemName, this.props),
            });
        }
    }

    public render() {
        const newReportCTA = i18nFilter()("grow.lead_generator.add.new.report");
        const buttonClassNames = classNames(
            "SideNav-button",
            this.state.isButtonLoading ? "Button--loading" : "",
        );
        return (
            <SideNav>
                <CreateNewButton onClick={this.onCreateNewButtonClick} className={buttonClassNames}>
                    {newReportCTA}
                </CreateNewButton>
                <SideNavList persistenceKey="leadgenerator" navItems={this.state.items} />
            </SideNav>
        );
    }

    @autobind
    private onStateChangeSuccess(evt, toState, toParams) {
        const activeItemName = this.getCurrentActive(toState.name, toParams.reportId);
        this.setState({
            activeItemName,
            items: this.getSideNavList(activeItemName),
        });
    }

    @autobind
    private getCurrentActive(crrState, crrReportId) {
        return crrState === "leadGenerator.exist" ? crrReportId : crrState;
    }

    @autobind
    private async onCreateNewButtonClick() {
        this.setState({ isButtonLoading: true });
        allTrackers.trackEvent(
            "lead generation reports",
            "click",
            "Side Bar/Add a New lead generation report",
        );
        await this.services.swNavigator.go("leadGenerator.new");
        this.setState({ isButtonLoading: false });
    }

    @autobind
    private getSideNavList(activeItemName, props?) {
        const _props = props || this.props;
        return _props.navList.map((listItem: INavItem) => {
            if (_.isUndefined(listItem.subItems)) {
                return {
                    ...this.interpretNavItem(listItem, activeItemName, _props.reportNameLoading),
                };
            } else {
                return {
                    ...listItem,
                    subItems: listItem.subItems.map((subItem) => {
                        return {
                            ...this.interpretNavItem(
                                subItem,
                                activeItemName,
                                _props.reportNameLoading,
                                listItem,
                            ),
                        };
                    }),
                };
            }
        });
    }

    @autobind
    private interpretNavItem(navListItem, activeItemName, reportNameLoading, parent?) {
        let menuItems = [
            {
                id: menuItem.rename,
                key: menuItem.rename,
                iconName: "edit",
                text: i18nFilter()("grow.lead_generator.sidenav.action.rename"),
            },
            {
                id: menuItem.copy,
                key: menuItem.copy,
                iconName: "copy",
                text: i18nFilter()("grow.lead_generator.sidenav.action.copy"),
            },
            {
                id: menuItem.archive,
                key: menuItem.archive,
                iconName: "archive",
                text: i18nFilter()("grow.lead_generator.sidenav.action.archive"),
            },
        ];

        if (navListItem.status === 1) {
            menuItems = [
                {
                    id: menuItem.unarchive,
                    key: menuItem.unarchive,
                    iconName: "unarchive",
                    text: i18nFilter()("grow.lead_generator.sidenav.action.unarchive"),
                },
            ];
        }

        const result = {
            title: navListItem.title,
            name: navListItem.name,
            isDisabled: navListItem.disabled,
            isBeta: isBeta(navListItem),
            isNew: isNew(navListItem),
            isLocked: isLocked(navListItem),
            isDashboard: true,
            isFocused: true,
            isSelected: true,
            isLoading: reportNameLoading === navListItem.reportId,
            isActive:
                navListItem.state === "leadGenerator.exist"
                    ? activeItemName === navListItem.reportId
                    : activeItemName === navListItem.state,
            url: this.services.swNavigator.href(navListItem.state, navListItem),
            onClick: () => this.onNavItemClick(navListItem, parent),
            id: navListItem.reportId,
            menuItems,
            onMenuToggle: () => {},
            onMenuClick: (selectedMenuItem) =>
                this.onNavItemMenuClick(selectedMenuItem, navListItem, parent),
            onItemCancelEdit: this.onItemCancelEdit,
            onItemEdit: this.renameReport,
            inputMaxLength: 100,
        };

        return { ...result, ...(hasAppTooltip(navListItem) ? navItemAppTooltip() : {}) };
    }

    @autobind
    private onNavItemMenuClick(item, navListItem, parent) {
        switch (item.id) {
            case menuItem.rename:
                allTrackers.trackEvent("lead generation reports", "click", "Side Bar/Rename");
                this.updateItem(navListItem, { isDashboard: false, isEditable: true });
                this.setState({ editedItem: navListItem });
                break;
            case menuItem.copy:
                allTrackers.trackEvent(
                    "lead generation reports",
                    "click",
                    `Side Bar/${navListItem.reportId}/create a copy`,
                );
                this.services.swNavigator.go("leadGenerator.edit", {
                    reportId: navListItem.reportId,
                });
                break;
            case menuItem.archive:
                allTrackers.trackEvent(
                    "lead generation reports",
                    "click",
                    `Side Bar/${navListItem.reportId}/archive`,
                );
                this.props.archiveReport({
                    reportId: navListItem.reportId,
                    reportName: navListItem.name,
                });
                break;
            case menuItem.unarchive:
                allTrackers.trackEvent(
                    "lead generation reports",
                    "click",
                    `Side Bar/${navListItem.reportId}/unarchive`,
                );
                this.props.unarchiveReport({
                    reportId: navListItem.reportId,
                    reportName: navListItem.name,
                });
                break;
        }
    }

    @autobind
    private onItemCancelEdit() {
        this.updateItem(this.state.editedItem, {
            isDashboard: true,
            isEditable: false,
            isError: false,
        });
        this.setState({ editedItem: {} });
    }

    @autobind
    private renameReport(newTitle) {
        if (this.state.editedItem.title === newTitle) {
            return;
        }
        if (!LeadGeneratorUtils.isReportNameValid(newTitle)) {
            this.updateItem(this.state.editedItem, { isError: true });
            return;
        }
        allTrackers.trackEvent(
            "lead generation reports",
            "submit-ok",
            `Side Bar/${this.state.editedItem.reportId}/rename/${newTitle}`,
        );
        this.props.updateReportName({
            reportId: this.state.editedItem.reportId,
            reportName: newTitle,
        });
    }

    @autobind
    private updateItem(navListItem, properties) {
        const items = this.state.items.map((listItem) => {
            if (_.isUndefined(listItem.subItems)) {
                return { ...listItem };
            }
            return {
                ...listItem,
                subItems: listItem.subItems.map((subItem) => {
                    if (navListItem.reportId === subItem.id) {
                        return { ...subItem, ...properties };
                    }
                    return { ...subItem };
                }),
            };
        });

        this.setState({ items });
    }

    @autobind
    private onNavItemClick(navListItem, parent) {
        trackSideNavItemClick(navListItem.title, parent);
        if (window.outerWidth <= 1200) {
            this.props.toggleSideNav();
        }
        this.setState({
            activeItemName: this.getCurrentActive(navListItem.state, navListItem.reportId),
        });
    }
}

function mapStateToProps(store) {
    const currentPage = store.routing.currentPage;
    const currentParams = store.routing.params;
    const { navList, reportNameLoading } = store.leadGenerator;
    return {
        currentPage,
        currentParams,
        navList,
        reportNameLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleSideNav: () => dispatch(toggleSideNav()),
        setSideNavItems: () => dispatch(fetchLeadGeneratorReports()),
        updateReportName: (report: IUpdateReport) =>
            dispatch(updateLeadGeneratorReportName(report)),
        archiveReport: (report: IUpdateReport) => dispatch(archiveLeadGeneratorReport(report)),
        unarchiveReport: (report: IUpdateReport) => dispatch(unarchiveLeadGeneratorReport(report)),
    };
}

SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(LeadGeneratorSideNav),
    "LeadGeneratorSideNav",
);
