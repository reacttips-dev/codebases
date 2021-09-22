import CircularProgress from "@material-ui/core/CircularProgress";
import { utils as adobeLaunch } from "@bbyca/adobe-launch";
import { Modal } from "@bbyca/bbyca-components";
import * as React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
// import setAnalyticVariable, { Evars } from "../setAnalyticVariable";
import AccountList from "./AccountList";
import { DrawerMenuButton } from "./DrawerMenuButton";
import Menu from "./Menu";
import MenuPanel from "../../MenuPanel";
import * as styles from "./style.css";
import messages from "./translations/messages";
import parseBrandMenuData from "../utils/brandMenuDataParser";
import parseShopMenuData from "../utils/shopMenuDataParser";
import parseMenuData from "../utils/menuDataParser";
export var MenuOptions;
(function (MenuOptions) {
    MenuOptions["account"] = "account";
    MenuOptions["services"] = "services";
    MenuOptions["shop"] = "shop";
    MenuOptions["brands"] = "brands";
    MenuOptions["deals"] = "deals";
})(MenuOptions || (MenuOptions = {}));
/**
 * Best Buy Menu component
 */
export class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.handleBackClick = () => this.setState({ selectedMenu: undefined });
        this.selectMenu = (menu) => () => {
            const navName = `Nav:${menu}:Click`;
            adobeLaunch.pushEventToDataLayer({
                event: "secondNavClicked",
                navName,
            });
            this.setState({ selectedMenu: menu });
        };
        this.toggleNavigation = () => {
            const { open } = this.state;
            if (!open) {
                const navName = "Nav:Menu:Click";
                adobeLaunch.pushEventToDataLayer({
                    event: "secondNavClicked",
                    navName,
                });
            }
            this.setState({ open: !open });
            this.props.reset();
            this.props.toggleFlyoutOverlay(!open);
            if (open) {
                this.setState({ selectedMenu: undefined });
            }
        };
        this.state = {
            open: false,
        };
    }
    render() {
        var _a, _b, _c, _d;
        const { selectedMenu } = this.state;
        const displayAccountMenu = selectedMenu === MenuOptions.account;
        const displayShopMenu = selectedMenu === MenuOptions.shop;
        const displayBrandsMenu = selectedMenu === MenuOptions.brands;
        const displayDealsMenu = selectedMenu === MenuOptions.deals;
        const displayServicesMenu = selectedMenu === MenuOptions.services;
        const shopMenuContent = parseShopMenuData(this.props.navigation.shopMenuContent);
        const brandsMenuContent = parseBrandMenuData(this.props.navigation.brandsMenuContent);
        const dealsMenuContent = parseMenuData((_b = (_a = this.props.navigation.globalMenuContent) === null || _a === void 0 ? void 0 : _a["header-primary"]) === null || _b === void 0 ? void 0 : _b.items[0]);
        const servicesMenuContent = parseMenuData((_d = (_c = this.props.navigation.globalMenuContent) === null || _c === void 0 ? void 0 : _c["header-primary"]) === null || _d === void 0 ? void 0 : _d.items[1]);
        return (React.createElement("div", { className: styles.navigationMenu },
            React.createElement(DrawerMenuButton, { onClick: this.toggleNavigation, label: this.props.intl.formatMessage(messages.drawerMenu) }),
            React.createElement(Modal, { blockScrollingOnOpen: true, closeIcon: false, theme: "toaster", className: styles.sideBar, onClose: this.toggleNavigation, visible: this.state.open }, this.props.navigation.loading ? (React.createElement(CircularProgress, { style: {
                    animation: "none",
                    left: "50%",
                    position: "absolute",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                } })) : (React.createElement(React.Fragment, null,
                React.createElement("div", { className: `${styles.rootMenuPanel} ${!selectedMenu ? styles.active : ""}` },
                    React.createElement(Menu, { ordersWebAppUrl: this.props.ordersWebAppUrl, cieServiceUrl: this.props.cieServiceUrl, locale: this.props.locale, client: this.props.client, onBrandClick: this.selectMenu(MenuOptions.brands), onCategoryClick: this.selectMenu(MenuOptions.shop), onDealClick: this.selectMenu(MenuOptions.deals), onAccountClick: this.selectMenu(MenuOptions.account), onServicesClick: this.selectMenu(MenuOptions.services), altLangUrl: this.props.altLangUrl, customerFirstName: this.props.navigation.customerFirstName, isUserSignedIn: this.props.isUserSignedIn, isNewOrderStatusLinkEnabled: this.props.isNewOrderStatusLinkEnabled, env: this.props.env, accountDashboardUrl: this.props.accountDashboardUrl })),
                React.createElement("div", { "data-automation": "account-menu", className: `${styles.menuPanel} ${displayAccountMenu ? styles.active : ""}` },
                    React.createElement(AccountList, { cieServiceUrl: this.props.cieServiceUrl, locale: this.props.locale, accountDashboardUrl: this.props.accountDashboardUrl, onSignOutSuccess: this.props.onSignOutSuccess, toggleNavigation: this.toggleNavigation, onBackClick: this.handleBackClick })),
                React.createElement("div", { "data-automation": "shop-menu", className: `${styles.menuPanel} ${displayShopMenu ? styles.active : ""}` },
                    React.createElement(MenuPanel, { client: this.props.client, trackMenuSelection: (hierarchy) => {
                            hierarchy.shift();
                            this.props.trackMenu(hierarchy, "shop");
                        }, shopMenuContent: shopMenuContent, menuTitle: React.createElement(FormattedMessage, Object.assign({}, messages.shop)), onBackClick: this.handleBackClick, onNavigate: this.toggleNavigation, isVisible: displayShopMenu, locale: this.props.locale })),
                React.createElement("div", { "data-automation": "brands-menu", className: `${styles.menuPanel} ${displayBrandsMenu ? styles.active : ""}` },
                    React.createElement(MenuPanel, { client: this.props.client, trackMenuSelection: (hierarchy) => {
                            hierarchy.shift();
                            this.props.trackMenu(hierarchy, "brands");
                        }, menuTitle: React.createElement(FormattedMessage, Object.assign({}, messages.brands)), shopMenuContent: brandsMenuContent, onBackClick: this.handleBackClick, onNavigate: this.toggleNavigation, isVisible: displayBrandsMenu, locale: this.props.locale })),
                React.createElement("div", { "data-automation": "deals-menu", className: `${styles.menuPanel} ${displayDealsMenu ? styles.active : ""}` },
                    React.createElement(MenuPanel, { client: this.props.client, trackMenuSelection: (hierarchy) => {
                            hierarchy.shift();
                            this.props.trackMenu(hierarchy, "deals");
                        }, menuTitle: React.createElement(FormattedMessage, Object.assign({}, messages.deals)), shopMenuContent: dealsMenuContent, onBackClick: this.handleBackClick, onNavigate: this.toggleNavigation, isVisible: displayDealsMenu, locale: this.props.locale })),
                React.createElement("div", { "data-automation": "services-menu", className: `${styles.menuPanel} ${displayServicesMenu ? styles.active : ""}` },
                    React.createElement(MenuPanel, { menuTitle: "Services", shopMenuContent: servicesMenuContent, client: this.props.client, trackMenuSelection: (hierarchy) => {
                            hierarchy.shift();
                            this.props.trackMenu(hierarchy, "services");
                        }, onBackClick: this.handleBackClick, onNavigate: this.toggleNavigation, isVisible: displayServicesMenu, locale: this.props.locale })))))));
    }
}
Navigation.displayName = "Navigation";
export default injectIntl(Navigation);
//# sourceMappingURL=index.js.map