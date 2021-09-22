var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { cieUtilities } from "@bbyca/account-components";
import ApiBasketProviderFactory from "@bbyca/ecomm-checkout-components/dist/services/BasketProvider/ApiBasketProviderFactory";
import { CookieCartStoreProvider } from "@bbyca/ecomm-checkout-components/dist/services/CartStoreProvider";
import * as React from "react";
import { addLocaleData, injectIntl, IntlProvider, } from "react-intl";
import * as frLocaleData from "react-intl/locale-data/fr";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { createResponsiveStateReducer, responsiveStoreEnhancer, } from "redux-responsive";
import { navigationActionCreatorsFactory, } from "../../actions";
import en from "../../translations-merged/en.json";
import fr from "../../translations-merged/fr.json";
import { urlCleaner } from "../../utils";
import { getHelpTopicsId } from "../../utils/helpTopics";
import isMobileApp from "../../utils/isMobileApp";
import routeManager from "../../utils/routeManager";
import BestBuyLogoButton from "./BestBuyLogoButton";
import FlyoutNavigation from "./FlyoutNavigation";
import GlobalOverlay from "./GlobalOverlay";
import { LinkContext } from "./Link";
import MainLinks from "./MainLinks";
import Navigation from "./Navigation";
import SearchBar from "./SearchBar";
import SecondaryLinks from "./SecondaryLinks";
import * as styles from "./style.css";
import classNames from "classnames";
import setAnalyticVariable, { Evars } from "./setAnalyticVariable";
addLocaleData([...frLocaleData]);
const convertLocaleToLang = (locale = "en-CA") => locale.split("-")[0];
const messages = { en, fr };
export const HeaderContext = React.createContext({});
export class CustomHeader extends React.Component {
    constructor(props) {
        super(props);
        this.onSearch = (search, path) => {
            const { changeQuery, intl } = this.props;
            if (changeQuery) {
                changeQuery(search, path);
            }
            else {
                const searchPath = routeManager.getPathByKey(convertLocaleToLang(intl.locale), "search");
                window.location.href = `${searchPath}?search=${search}&path=${path}`;
            }
        };
        this.closeGlobalOverlay = () => this.props.navigationActions.toggleFlyoutOverlay(false);
        this.handleOnSignOutSuccess = () => {
            const { onSignOutSuccess, intl } = this.props;
            const language = convertLocaleToLang(intl.locale);
            new CookieCartStoreProvider().deleteCartId();
            this.setState({ isUserSignedIn: false });
            if (onSignOutSuccess) {
                onSignOutSuccess();
            }
            else {
                window.location.href = routeManager.getPathByKey(language, "homepage");
            }
        };
        this.sendMenuTracking = (hierarchy = [], menuItem = "") => {
            const joined = [menuItem]
                .concat(hierarchy)
                .join(";")
                .toLowerCase();
            if (this.props.client !== "ecomm-webapp") {
                setAnalyticVariable(Evars.eVar34, joined);
            }
            else {
                this.props.navigationActions.trackMenu(joined);
            }
        };
        this.state = { cartQuantity: 0, isUserSignedIn: false };
    }
    render() {
        const { client, query, navigationActions, navigation, intl, altLangUrl, categories, componentOverride, internalLinkHandler, isNewAccountsEntryEnabled, isNewOrderStatusLinkEnabled, config, locale, env, screenSize, flyoutOverlay, brandsMenuContent, shopMenuContent, globalMenuContent, environment, enableSearchSuggestions, } = this.props;
        const hideHeader = environment && isMobileApp(environment.appMode);
        const language = convertLocaleToLang(intl.locale);
        const searchPath = routeManager.getPathByKey(language, "search");
        const helpTopicsId = getHelpTopicsId(env);
        const ordersWebAppUrl = urlCleaner(config.ordersWebAppUrl);
        const customerIdentityExperienceServiceUrl = urlCleaner(config.customerIdentityExperienceServiceUrl);
        const headerContextProps = {
            config,
            client,
            locale: intl.locale,
            language,
        };
        const linkContextProps = {
            internalLinkHandler,
            locale: intl.locale,
        };
        return (React.createElement(IntlProvider, { locale: locale, messages: language ? messages[language] : messages.en, defaultLocale: "en-CA", textComponent: React.Fragment },
            React.createElement(HeaderContext.Provider, { value: headerContextProps },
                React.createElement(LinkContext.Provider, { value: linkContextProps },
                    React.createElement("header", { role: "banner", "data-automation": "x-headerContainer", className: `${hideHeader ? styles.hidden : ""}` },
                        React.createElement("div", { className: styles.hasSecondaryToolbar },
                            React.createElement("div", { className: styles.headerContainer },
                                React.createElement("div", { className: `${styles.headerContent} ${styles.upperToolbar}` },
                                    React.createElement("div", { "data-automation": "x-secondaryLinks", className: styles.secondaryLinks },
                                        React.createElement(SecondaryLinks, { altLangUrl: altLangUrl, navigationActions: navigationActions, client: client, helpTopicsId: helpTopicsId, isNewOrderStatusLinkEnabled: isNewOrderStatusLinkEnabled, ordersWebAppUrl: ordersWebAppUrl })),
                                    React.createElement("div", { className: styles.toolbar },
                                        React.createElement(BestBuyLogoButton, { client: client }),
                                        React.createElement("div", { className: classNames([styles.search, styles.tabletDesktop]) },
                                            React.createElement(SearchBar, { searchPath: searchPath, onSearch: this.onSearch, isVisible: false, search: query, searchSuggestionsApiUrl: config.searchSuggestionsApiUrl, locale: locale, enableSearchSuggestions: enableSearchSuggestions })),
                                        React.createElement("div", { className: styles.mainLinks },
                                            React.createElement(MainLinks, { accountDashboardUrl: config.accountDashboardUrl, onSignOutSuccess: this.handleOnSignOutSuccess, customerIdentityExperienceServiceUrl: customerIdentityExperienceServiceUrl, componentOverride: componentOverride, cartQuantity: this.state.cartQuantity, isNewAccountsDesktopEntryEnabled: this.props
                                                    .isNewAccountsDesktopEntryEnabled, isUserSignedIn: this.state
                                                    .isUserSignedIn, screenSize: screenSize, toggleFlyoutOverlay: navigationActions.toggleFlyoutOverlay })))),
                                React.createElement("div", { className: styles.navigationBar },
                                    React.createElement("div", { className: styles.headerContent },
                                        React.createElement("div", { className: styles.searchToolbar },
                                            React.createElement("div", { className: styles.flyoutNavigationGroup },
                                                React.createElement("div", { className: styles.xsmallOnly },
                                                    React.createElement(Navigation, { client: client, env: this.props.env, reset: navigationActions.clear, navigation: navigation, displayCategory: (categoryId) => navigationActions.displayCategory(categoryId), altLangUrl: altLangUrl, trackMenu: this.sendMenuTracking, cieServiceUrl: customerIdentityExperienceServiceUrl, accountDashboardUrl: config.accountDashboardUrl, locale: intl.locale, displayAccountMenu: isNewAccountsEntryEnabled, isUserSignedIn: this.state
                                                            .isUserSignedIn, onSignOutSuccess: this
                                                            .handleOnSignOutSuccess, helpTopicsId: helpTopicsId, toggleFlyoutOverlay: navigationActions.toggleFlyoutOverlay, retrieveShopMenuContent: navigationActions.retrieveShopMenuContent, isNewOrderStatusLinkEnabled: isNewOrderStatusLinkEnabled, ordersWebAppUrl: ordersWebAppUrl })),
                                                React.createElement("div", { className: styles.tabletDesktop },
                                                    React.createElement(FlyoutNavigation, { env: this.props.env, categories: categories, toggleFlyoutOverlay: navigationActions.toggleFlyoutOverlay, trackMenu: this.sendMenuTracking, brandsMenuContent: brandsMenuContent, retrieveBrandsMenuContent: navigationActions.retrieveBrandsMenuContent, shopMenuContent: shopMenuContent, retrieveShopMenuContent: navigationActions.retrieveShopMenuContent, globalMenuContent: globalMenuContent, retrieveGlobalMenuContent: navigationActions.retrieveGlobalMenuContent }))),
                                            React.createElement("div", { className: classNames([
                                                    styles.search,
                                                    styles.xsmallOnly
                                                ]) },
                                                React.createElement(SearchBar, { searchPath: searchPath, onSearch: this.onSearch, isVisible: false, search: query, searchSuggestionsApiUrl: config.searchSuggestionsApiUrl, locale: locale, enableSearchSuggestions: enableSearchSuggestions })))))))),
                    React.createElement(GlobalOverlay, { onClick: this.closeGlobalOverlay, open: screenSize.greaterThan.small && flyoutOverlay })))));
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            const { componentOverride, config, navigationActions, locale, } = this.props;
            this.setState({ isUserSignedIn: cieUtilities.isUserSignedIn() });
            navigationActions.retrieveBrandsMenuContent(locale);
            navigationActions.retrieveShopMenuContent(locale);
            if (!this.props.globalMenuContent) {
                navigationActions.retrieveGlobalMenuContent(locale);
            }
            if (!componentOverride) {
                const basketProvider = new ApiBasketProviderFactory(config.basketServiceApiUrl).make("BC", "V5H 3Z7", "en-CA");
                const cartId = new CookieCartStoreProvider().getCartId();
                if (cartId !== undefined) {
                    const response = (yield basketProvider.getBasket(cartId));
                    this.setState({ cartQuantity: response.totalQuantity });
                }
            }
        });
    }
}
export class GlobalHeader extends React.Component {
    constructor(props) {
        super(props);
        const dependencies = Object.assign({}, this.props);
        const mapStateToProps = (state) => ({
            categories: state.navigation.categories &&
                state.navigation.categories[0] &&
                state.navigation.categories[0].subCategories,
            brandsMenuContent: state.navigation.brandsMenuContent,
            shopMenuContent: state.navigation.shopMenuContent,
            globalMenuContent: state.navigation.globalMenuContent,
            navigation: state.navigation,
            flyoutOverlay: state.navigation.flyoutOverlay,
            screenSize: state.screenSize || state.app.screenSize,
            environment: state.app && state.app.environment,
        });
        const mapDispatchToPropsFactory = (globalHeaderProps) => {
            const navigationActionCreators = navigationActionCreatorsFactory(Object.assign({}, globalHeaderProps));
            return (dispatch) => ({
                changeQuery: dependencies.changeQuery
                    ? bindActionCreators(dependencies.changeQuery, dispatch)
                    : undefined,
                navigationActions: bindActionCreators(navigationActionCreators, dispatch),
            });
        };
        const InjectedCustomHeader = (headerProps) => React.createElement(CustomHeader, Object.assign({}, headerProps));
        this.InjectedGlobalHeader = injectIntl(connect(mapStateToProps, mapDispatchToPropsFactory(dependencies))(InjectedCustomHeader));
    }
    render() {
        return React.createElement(this.InjectedGlobalHeader, Object.assign({}, this.props));
    }
}
export const reduxScreenSize = createResponsiveStateReducer({
    extraLarge: Infinity,
    extraSmall: 767,
    small: 1024,
    medium: 1280,
    large: 1919,
}, { initialMediaType: "small" });
export const reduxScreenSizeEnhancer = responsiveStoreEnhancer;
export default GlobalHeader;
//# sourceMappingURL=index.js.map