import { utils as adobeLaunch } from "@bbyca/adobe-launch";
import * as React from "react";
import { injectIntl } from "react-intl";
import { HeaderContext } from "../";
import BrandsMenu from "./BrandsMenu";
import { FlyoutContainer } from "./FlyoutContainer";
import ShopMenu from "./ShopMenu";
import * as styles from "./style.css";
import messages from "./translations/messages";
import MenuPanel from "../../MenuPanel";
import parseMenuData from "../utils/menuDataParser";
export class FlyoutNavigation extends React.Component {
    constructor(props) {
        super(props);
        this.getDealsMenuData = (globalMenuContent) => { var _a; return (_a = globalMenuContent === null || globalMenuContent === void 0 ? void 0 : globalMenuContent["header-primary"]) === null || _a === void 0 ? void 0 : _a.items[0]; };
        this.getServicesMenuData = (globalMenuContent) => { var _a; return (_a = globalMenuContent === null || globalMenuContent === void 0 ? void 0 : globalMenuContent["header-primary"]) === null || _a === void 0 ? void 0 : _a.items[1]; };
        this.setSelectedItem = (item) => {
            if (item) {
                const navName = `Nav:${item}:Click`;
                adobeLaunch.pushEventToDataLayer({
                    event: "secondNavClicked",
                    navName,
                });
            }
            this.props.toggleFlyoutOverlay(!!item);
            this.setState({ selectedItem: item });
        };
        this.resetFlyout = () => this.setSelectedItem("");
        this.state = {
            selectedItem: "",
        };
    }
    render() {
        const { intl, brandsMenuContent, trackMenu, retrieveBrandsMenuContent, globalMenuContent, } = this.props;
        const menu = [
            {
                content: (React.createElement(ShopMenu, { trackMenu: (hierarchy) => trackMenu(hierarchy, "shop"), resetFlyout: this.resetFlyout, shopMenuContent: this.props.shopMenuContent, retrieveShopMenuContent: this.props.retrieveShopMenuContent })),
                id: "shop",
                label: (React.createElement("span", { "data-automation": "x-shop" }, intl.formatMessage({ id: messages.shopHeading.id }))),
            },
            {
                content: (React.createElement(BrandsMenu, { trackMenu: (hierarchy) => trackMenu(hierarchy, "brands"), resetFlyout: this.resetFlyout, brandsMenuContent: brandsMenuContent, retrieveBrandsMenuContent: retrieveBrandsMenuContent })),
                id: "brands",
                label: (React.createElement("span", { "data-automation": "x-brands" }, intl.formatMessage({ id: messages.brandsHeading.id }))),
            },
            {
                id: "deals",
                label: (React.createElement("span", { "data-automation": "x-deals" }, intl.formatMessage({ id: messages.dealsHeading.id }))),
                content: (React.createElement(MenuPanel, { className: styles.menuPanel, menuTitle: intl.formatMessage({ id: messages.dealsHeading.id }), shopMenuContent: parseMenuData(this.getDealsMenuData(globalMenuContent)), client: this.props.client, trackMenuSelection: (hierarchy) => trackMenu(hierarchy, "deals"), onNavigate: this.resetFlyout, isVisible: false, locale: this.props.locale })),
            },
            {
                id: "services",
                label: React.createElement("span", { "data-automation": "x-deals" }, "Services"),
                content: (React.createElement(MenuPanel, { className: styles.menuPanel, menuTitle: "Services", shopMenuContent: parseMenuData(this.getServicesMenuData(globalMenuContent)), client: this.props.client, trackMenuSelection: (hierarchy) => trackMenu(hierarchy, "services"), onNavigate: this.resetFlyout, isVisible: false, locale: this.props.locale })),
            },
        ];
        return (React.createElement(FlyoutContainer, { className: styles.flyoutContainer, selectedItem: this.state.selectedItem, setSelectedItem: this.setSelectedItem, menuItems: menu }));
    }
}
export default injectIntl((props) => (React.createElement(HeaderContext.Consumer, null, (value) => (React.createElement(FlyoutNavigation, Object.assign({ locale: value.locale, client: value.client }, props))))));
//# sourceMappingURL=FlyoutNavigation.js.map