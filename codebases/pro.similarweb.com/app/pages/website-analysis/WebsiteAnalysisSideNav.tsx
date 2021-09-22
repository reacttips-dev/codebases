import * as React from "react";
import { PureComponent } from "react";
import autobind from "autobind-decorator";
import { Injector } from "common/ioc/Injector";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { navObj } from "./config/websiteAnalysisNavObj";
import { connect } from "react-redux";
import { toggleSideNav } from "../../actions/layoutActions";
import { i18nFilter } from "../../filters/ngFilters";
import {
    SideNavList,
    SideNavListScrollSpace,
} from "../../components/React/SideNavComponents/SideNavList";
import { SideNav } from "../../components/React/SideNavComponents/SideNav";
import {
    isBeta,
    isItemDisabled,
    isLocked,
    isNew,
    navItemTooltip,
    trackSideNavItemClick,
} from "../../components/React/SideNavComponents/SideNav.utils";
import {
    INavItem,
    ISideNavProps,
    ISideNavState,
} from "../../components/React/SideNavComponents/SideNav.types";
import * as _ from "lodash";

class WebsiteAnalysisSideNav extends PureComponent<ISideNavProps, ISideNavState> {
    public static getDerivedStateFromProps(props, state) {
        if (props.currentPage !== state.activeItemName) {
            return {
                activeItemName: props.currentPage,
            };
        }

        return null;
    }

    private services;
    private stateChangeSuccessHandler;
    private stateUpdateSuccessHandler;
    private isUnmounting = false;

    constructor(props, context) {
        super(props, context);

        this.services = {
            swNavigator: Injector.get<any>("swNavigator"),
            rootScope: Injector.get<any>("$rootScope"),
        };
        this.state = {
            activeItemName: this.props.currentPage,
            items: this.getSideNavList(
                this.props.currentPage,
                this.services.swNavigator.getParams(),
            ),
        };
    }

    public componentDidMount() {
        this.stateChangeSuccessHandler = this.services.rootScope.$on(
            "navChangeComplete",
            this.onStateChangeSuccess,
        );
        this.stateUpdateSuccessHandler = this.services.rootScope.$on(
            "navUpdate",
            this.onStateChangeSuccess,
        );
    }

    public componentWillUnmount() {
        this.isUnmounting = true;
        this.stateChangeSuccessHandler();
    }

    public render() {
        return (
            <SideNav>
                <SideNavList persistenceKey={"websiteanalysis"} navItems={this.state.items}>
                    <SideNavListScrollSpace />
                </SideNavList>
            </SideNav>
        );
    }

    onStateChangeSuccess = _.debounce((evt, toState, toParams) => {
        if (this.isUnmounting) {
            return;
        }
        // TODO: move navlist to Redux state
        this.setState({
            items: this.getSideNavList(toState.name, toParams),
        });
    }, 300);

    @autobind
    private getSideNavList(activeItemName, params) {
        return navObj().navList.map((listItem: INavItem) => {
            if (_.isUndefined(listItem.subItems)) {
                return { ...this.interpretNavItem(listItem, activeItemName, params) };
            } else {
                return {
                    ...listItem,
                    title: i18nFilter()(listItem.title),
                    subItems: listItem.subItems.map((subItem) => {
                        return {
                            ...this.interpretNavItem(subItem, activeItemName, params, listItem),
                        };
                    }),
                };
            }
        });
    }

    @autobind
    private interpretNavItem(navListItem, activeItemName, params, parent?) {
        const result = {
            title: i18nFilter()(navListItem.title),
            name: navListItem.name,
            isDisabled: navListItem.disabled || isItemDisabled(navListItem),
            isBeta: isBeta(navListItem),
            isNew: isNew(navListItem),
            isLocked: isLocked(navListItem),
            isDashboard: false,
            isActive: navListItem.tab
                ? activeItemName === navListItem.state && params.selectedTab === navListItem.tab
                : activeItemName === navListItem.state,
            url: this.services.swNavigator.navLink(navListItem),
            onClick: () => this.onNavItemClick(navListItem, parent),
        };

        return {
            ...result,
            ...(isItemDisabled(navListItem) ? navItemTooltip(navListItem) : {}),
        };
    }

    @autobind
    private onNavItemClick(navListItem: INavItem, parent) {
        trackSideNavItemClick(navListItem.title, parent);
        if (window.outerWidth <= 1200) {
            this.props.toggleSideNav();
        }
        this.setState({
            activeItemName: navListItem.state,
        });
    }
}

function mapStateToProps(store) {
    const currentPage = store.routing.currentPage;
    const currentModule = store.routing.currentModule;
    return {
        currentPage,
        currentModule,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleSideNav: () => {
            dispatch(toggleSideNav());
        },
    };
}

SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(WebsiteAnalysisSideNav),
    "WebsiteAnalysisSideNav",
);

export default WebsiteAnalysisSideNav;
