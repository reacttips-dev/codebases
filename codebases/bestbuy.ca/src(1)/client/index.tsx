import "../wdyr";
import "core-js/stable";
import "regenerator-runtime/runtime";
import "whatwg-fetch";
import "custom-event-polyfill";
import "intl";
import "intl/locale-data/jsonp/en-CA";
import "intl/locale-data/jsonp/fr-CA";
import * as Moment from "moment";
import "raf/polyfill";
import "intersection-observer";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {addLocaleData} from "react-intl";
import {IntlProvider} from "react-intl-redux";
import * as frLocaleData from "react-intl/locale-data/fr";
import {Provider} from "react-redux";
import {Router} from "react-router";
import {applyRouterMiddleware, browserHistory as routerBrowserHistory} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";
import {createHistory} from "history";
import {useScroll} from "react-router-scroll";
import {calculateResponsiveState} from "redux-responsive";
import AzureLogger from "../common/logging/AzureJSLogger";
import ConsoleLogger from "../common/logging/ConsoleLogger";
import getLogger, {setLogger} from "../common/logging/getLogger";
import {
    configActionCreators,
    userActionCreators,
    geekSquadMembershipDialogActionCreators,
    setNavigationActions,
    appActionCreators,
} from "./actions";
import {
    localStorage,
    ApiProductRelationshipProvider,
    ApiSearchProvider,
    ApiCellPhoneUpgradeEligibilityProvider,
    ApiCustomerReviewsProvider,
    ProductListProvider,
} from "./providers";
import State from "./store";
import configureStore from "./store/configureStore";
import analyticsEventBuffer from "./utils/analytics/eventBuffer";
import routes from "./utils/routeManager";
import {unregisterServiceWorker} from "../client/utils/serviceWorker";
import {ApiSignOutProvider, ApiCustomerInfoProvider} from "@bbyca/account-components";
import {
    CartAdder,
    CartRefiller,
    CartRemover,
    CartUpdater,
} from "@bbyca/ecomm-checkout-components/dist/business-rules/use-cases";
import {ApiBasketProviderFactory} from "@bbyca/ecomm-checkout-components/dist/services/BasketProvider";
import {CookieCartStoreProvider} from "@bbyca/ecomm-checkout-components/dist/services/CartStoreProvider";
import get from "lodash-es/get";
import CheckoutEvents from "@bbyca/ecomm-checkout-components/dist/events";
import {navigationActionCreatorsFactory} from "../../node_modules/@bbyca/apex-components";
import "whatwg-fetch";
import {Cookie, CookieUtils} from "@bbyca/bbyca-components";
import JssProvider from "react-jss/lib/JssProvider";
import {createGenerateClassName} from "@material-ui/core/styles";
import {ApiBenefitProvider} from "@bbyca/ecomm-checkout-components/dist/services/BenefitProvider";
import {ApiRequiredProductsProvider} from "@bbyca/ecomm-checkout-components/dist/services/RequiredProductsProvider";
import {ApiAvailabilityProvider as BasketAvailabilityProvider} from "@bbyca/ecomm-checkout-components/dist/services/AvailabilityProvider";
import {ApiOfferProvider as BasketOfferProvider} from "@bbyca/ecomm-checkout-components/dist/services/OfferProvider";
import {ApiManufacturerWarrantyProvider} from "@bbyca/ecomm-checkout-components/dist/services/ManufacturerWarrantyProvider";
import {HeaderUrlConfig} from "@bbyca/apex-components/dist/components/GlobalHeader";
import {AppMode, BlueShirtChatEvents, blueShirtChatStateSessionKey} from "models";
import {SplitFactory} from "@splitsoftware/splitio";
import {splitIOFeatureToggles} from "config/featureToggles";
import {SplitIOService, SplitIOABTestProvider, SplitIOClientBuilder} from "@bbyca/ecomm-abtests";
import {ApiStoresStatusProvider} from "Decide/providers/StoresStatusProvider";
import {getAdobeVisitorId} from "utils/analytics/adobeCookie";
import {ApiCellPhonePlanPricingProvider} from "Decide/providers/CellPhonePlanPricingProvider/ApiCellPhonePlanPricingProvider";
import fetch from "./utils/fetch";
import {ApiStoreMessageProvider} from "providers/StoreMessageProvider";
import {getProductListApiUrl} from "store/selectors";
import {ChatType} from "Decide/pages/ProductDetailPage/components/BlueShirtChat/brands";
import { ApiRelatedProductsProvider } from "Decide/providers/RelatedProductsProvider/APIRelatedProductsProvider";

const appModeCookie = CookieUtils.getCookie("AppMode");
if (appModeCookie && appModeCookie.value === AppMode.delegate) {
    document.cookie = "AppMode= ; domain=.bestbuy.ca; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    CookieUtils.removeCookie("AppMode");
}

let browserHistory = routerBrowserHistory;
if (appModeCookie && (appModeCookie.value === "iphone" || appModeCookie.value === "android")) {
    browserHistory = createHistory({forceRefresh: true});
}

// Log uncaught errors
window.addEventListener("error", (event: ErrorEvent) => {
    if (event && event.error && (!event.message || event.message.indexOf("Script error.") === -1)) {
        // "Script error." originates from a JavaScript file served from a different origin
        getLogger().error(event.error);
    }
});

// Log uncaught promise rejections
window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    if (event && event.reason) {
        getLogger().error(event.reason);
    }
});

const initApp = async () => {
    addLocaleData([...frLocaleData]);

    analyticsEventBuffer();

    const initialState: State = (window as any).__INITIAL_STATE__;

    const logging = initialState.config.logging;
    const consoleLogger = new ConsoleLogger(logging.level);
    if (logging.azureLogging) {
        setLogger(new AzureLogger(logging.level, logging.azureLogging, consoleLogger));
    } else {
        setLogger(consoleLogger);
    }

    // SplitIO initialization
    const splitApiKey = initialState.config.splitIO.core.authorizationKey;
    const splitIOConfig = Object.assign({}, initialState.config.splitIO);
    const abTestClient = new SplitIOClientBuilder()
        .setFactory(SplitFactory)
        .setApiKey(splitApiKey)
        .setUserKey(SplitIOService.getUserKey())
        .setConfig(splitIOConfig)
        .build();

    const splitIOService = new SplitIOService(abTestClient, getLogger().info);

    const abTestProvider = new SplitIOABTestProvider(
        splitIOService,
        Object.keys(splitIOFeatureToggles),
        getLogger().info,
    );

    const {config} = initialState;

    const navigationActionCreators = navigationActionCreatorsFactory({
        logger: getLogger as any,
        config: {
            accountApiUrl: config.dataSources.accountApiUrl,
            accountDashboardUrl: config.dataSources.accountDashboardUrl,
            contentApiUrl: config.dataSources.contentApiUrl,
            categoryApiUrl: config.dataSources.categoryApiUrl,
            basketServiceApiUrl: config.dataSources.basketServiceApiUrl,
            customerIdentityExperienceServiceUrl: config.appPaths.customerIdentityExperienceService,
        } as HeaderUrlConfig,
        fetch,
    } as any);

    setNavigationActions(navigationActionCreators);

    /* START Checkout Components */
    const accountApiUrl = get(initialState, "config.dataSources.accountApiUrl");
    const availabilityApiUrl = get(initialState, "config.dataSources.availabilityApiUrl");
    const basketServiceApiUrl = get(initialState, "config.dataSources.basketServiceApiUrl");
    const offerApiUrl = get(initialState, "config.dataSources.offerApiUrl");
    const productApiUrl = get(initialState, "config.dataSources.productApiUrl");
    const customerIdentityExperienceServiceUrl = get(initialState, "config.appPaths.customerIdentityExperienceService");
    const storeMessageApiUrl = get(initialState, "config.dataSources.storeMessageApiUrl");
    const storesStatusApiUrl = get(initialState, "config.dataSources.storesStatusApiUrl");
    const cellPhonePlanApiUrl = get(initialState, "config.dataSources.cellPhonesCarrierPlansUrl");
    const cellPhoneUpgradeEligibilityApiUrl = get(initialState, "config.dataSources.cellPhoneUpgradeEligibilityUrl");

    const cellPhoneUpgradeEligibilityProvider = new ApiCellPhoneUpgradeEligibilityProvider(
        cellPhoneUpgradeEligibilityApiUrl,
    );
    const apiBasketProviderFactory = new ApiBasketProviderFactory(basketServiceApiUrl);
    const apiBenefitProvider = new ApiBenefitProvider(productApiUrl);
    const cookieCartStoreProvider = new CookieCartStoreProvider();
    const customerInfoProvider = new ApiCustomerInfoProvider(accountApiUrl);
    const signOutProvider = new ApiSignOutProvider(customerIdentityExperienceServiceUrl);

    const cartAdder = new CartAdder(apiBasketProviderFactory, cookieCartStoreProvider);
    const cartRefiller = new CartRefiller(
        apiBasketProviderFactory,
        cookieCartStoreProvider,
        customerInfoProvider,
        signOutProvider,
    );
    const cartRemover = new CartRemover(apiBasketProviderFactory, cookieCartStoreProvider);
    const cartUpdater = new CartUpdater(apiBasketProviderFactory, cookieCartStoreProvider);
    const checkoutEvents = new CheckoutEvents();
    const requiredProductsProvider = new ApiRequiredProductsProvider(
        productApiUrl,
        new BasketAvailabilityProvider(availabilityApiUrl),
        new BasketOfferProvider(offerApiUrl),
    );
    const apiManufacturerWarrantyProvider = new ApiManufacturerWarrantyProvider(offerApiUrl);
    const storeMessageProvider = new ApiStoreMessageProvider(storeMessageApiUrl);
    const storesStatusProvider = new ApiStoresStatusProvider(storesStatusApiUrl);
    const cellPhonePlanPricingProvider = new ApiCellPhonePlanPricingProvider(cellPhonePlanApiUrl);

    const productRelationshipProvider = new ApiProductRelationshipProvider(
        config.dataSources.productGatewayApiUrl,
        config.productGatewayApiKey,
    );

    const searchProvider = new ApiSearchProvider(
        config.dataSources.searchApiUrl,
        initialState.intl.locale,
        initialState.app.location.regionCode,
    );
    const cookieCartProvider = new CookieCartStoreProvider();

    const apiCustomerReviewsProvider = new ApiCustomerReviewsProvider(
        config.dataSources.reviewApiUrl,
        initialState.intl.locale,
    );

    const productListProvider = new ProductListProvider({
        baseUrl: getProductListApiUrl(initialState),
        logger: getLogger(),
    });

    const relatedProductsProvider = new ApiRelatedProductsProvider(
        config.dataSources.relatedProductsApiUrl,
        config.dataSources.productApiUrl,
        new BasketAvailabilityProvider(availabilityApiUrl),
        new BasketOfferProvider(offerApiUrl),
    );

    const thunkInjectables = {
        abTestProvider,
        apiBenefitProvider,
        apiCustomerReviewsProvider,
        apiManufacturerWarrantyProvider,
        cartAdder,
        cartRefiller,
        cartRemover,
        cartUpdater,
        cellPhonePlanPricingProvider,
        cellPhoneUpgradeEligibilityProvider,
        checkoutEvents,
        cookieCartProvider,
        productListProvider,
        productRelationshipProvider,
        requiredProductsProvider,
        searchProvider,
        storeMessageProvider,
        storesStatusProvider,
        relatedProductsProvider,
    };
    /* END Checkout Components */

    const store = configureStore(initialState, initialState.app.screenSize.mediaType, thunkInjectables, browserHistory);
    Moment.locale(initialState.intl.locale);
    const history = syncHistoryWithStore(browserHistory, store);

    splitIOService.init(() => {
        store.dispatch(configActionCreators.fetchFeatureToggles());
    });

    // Required by material-ui
    process.env = {
        ...process.env,
        NODE_ENV: (store.getState() as State).app.environment.nodeEnv,
    };

    await render(store, history, initialState);
    loadRemoteConfig(store);
    store.dispatch(userActionCreators.updateCartCount());
    const preference = localStorage.getItem("preference");
    if (preference) {
        store.dispatch(userActionCreators.setPreference(preference));
    }
    setInterval(() => loadRemoteConfig(store), 1000 * 60 * 2);

    const checkout = (store.getState() as State).config.checkout;
    if (checkout.subdomain) {
        const enabledCookieName = "enabled";
        const initialEnabledCookieValue = 1;
        const enabledCookie: Cookie = new Cookie(enabledCookieName, initialEnabledCookieValue.toString());
        enabledCookie.path = "/";
        enabledCookie.domain = checkout.subdomain;
        CookieUtils.setCookie(enabledCookie);

        if (checkout.returnUrl) {
            const returnUrlCookieName = "ReturnUrl";
            const returnUrlValue = checkout.returnUrl;
            const returnUrlCookie: Cookie = new Cookie(returnUrlCookieName, returnUrlValue);
            returnUrlCookie.path = "/";
            returnUrlCookie.domain = checkout.subdomain;
            CookieUtils.setCookie(returnUrlCookie);
        }
    }
    disableConfirmItSurvey(checkout.subdomain);

    if ((getLogger() as any).trackPageView) {
        (getLogger() as any).trackPageView();
    }

    store.dispatch(calculateResponsiveState(window));

    checkoutEvents.addEventListener("afteraddtocart", () =>
        store.dispatch(geekSquadMembershipDialogActionCreators.close()),
    );

    store.dispatch(appActionCreators.setMcfCookies());
};

// TODO: This is used so the survey modal doesn't pop-up as the user is navigating within the order status iFrame. Once the iFrame has been updated we can remove this variable.
const disableConfirmItSurvey = (domain) => {
    const surveyOptOutCookieName = "surveyOptOut";
    const surveyOptOutCookieValue = 1;
    const surveyOptOutCookie: Cookie = new Cookie(surveyOptOutCookieName, surveyOptOutCookieValue.toString());
    surveyOptOutCookie.path = "/";
    surveyOptOutCookie.domain = domain;
    CookieUtils.setCookie(surveyOptOutCookie);
};

const loadRemoteConfig = (store) => {
    store.dispatch(configActionCreators.loadRemoteConfig());
};
const generateClassName = createGenerateClassName({productionPrefix: "ecomm-webapp-"});

const anchorLinkScrollHandler = () => {
    const {hash} = window.location;
    let observer: MutationObserver;

    if (hash !== "") {
        const scrollToEl = (mutation?: MutationRecord[]) => {
            const id = hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView();
                }, 0);
                observer.disconnect();
            }
        };

        observer = new MutationObserver(scrollToEl);
        observer.observe(document, {attributes: false, childList: true, characterData: false, subtree: true});
    }
};

const render = (store, history, appInitialState) => {
    const html = (
        <JssProvider generateClassName={generateClassName}>
            <Provider store={store}>
                <IntlProvider textComponent={React.Fragment}>
                    <Router
                        history={history}
                        render={applyRouterMiddleware(useScroll())}
                        onUpdate={anchorLinkScrollHandler}>
                        {routes.buildRoute(appInitialState.intl.language)}
                    </Router>
                </IntlProvider>
            </Provider>
        </JssProvider>
    );

    const root = document.getElementById("root");
    const state = store.getState() as State;

    // Initialize Blue Shirt Chat Config by dispatching an event
    const adobeVisitorId = getAdobeVisitorId();
    window.dispatchEvent(
        new CustomEvent(BlueShirtChatEvents.BLUE_SHIRT_AGENT_UPDATE_SALESFORCE_CONFIG, {
            detail: {
                chatType: "BLUE_SHIRT_CHAT" as ChatType,
                ...state.config.blueShirtChatAgent,
                LOCALE: state.intl.language,
                ADOBE_VISITOR_ID: adobeVisitorId,
            },
        }),
    );

    window.dispatchEvent(
        new CustomEvent(BlueShirtChatEvents.BLUE_SHIRT_AGENT_UPDATE_SALESFORCE_CONFIG, {
            detail: {
                chatType: "BRAND_EXPERT_CHAT" as ChatType,
                ...state.config.brandExpertChatAgent,
                LOCALE: state.intl.language,
                ADOBE_VISITOR_ID: adobeVisitorId,
            },
        }),
    );

    const chatStateFromSessionStorage = window.sessionStorage.getItem(blueShirtChatStateSessionKey);
    if (!!chatStateFromSessionStorage) {
        const {activeChat} = JSON.parse(chatStateFromSessionStorage);
        if (!!activeChat) {
            window.dispatchEvent(
                new CustomEvent(BlueShirtChatEvents.BLUE_SHIRT_AGENT_RESTORE_CHAT, {detail: activeChat}),
            );
        }
    }

    if (
        state.config.remoteConfig.isServerSideRenderEnabled &&
        routes.isServerSideRenderEnabledByKey(state.routing.pageKey)
    ) {
        return ReactDOM.hydrate(html, root);
    } else {
        return ReactDOM.render(html, root);
    }
};

initApp();

const myWindow: any = window;

delete myWindow.__INITIAL_STATE__;

browserHistory.listen((location) => {
    if (myWindow.persistentMetaData) {
        myWindow.persistentMetaData.startTransition = new Date();
    }
    if (myWindow && myWindow.QueueIt) {
        myWindow.QueueIt.Javascript.PageEventIntegration.initQueueClient(myWindow.queueit_clientside_config);
    }
});

// initServiceWorker();
unregisterServiceWorker();
