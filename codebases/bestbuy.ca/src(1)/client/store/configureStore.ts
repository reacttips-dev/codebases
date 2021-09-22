import {
    requiredProducts,
    servicePlan,
    servicePlanBenefits,
    manufacturerWarranty,
    cart,
} from "@bbyca/ecomm-checkout-components/dist/redux";
import {reducer as categoryContent} from "@bbyca/ecomm-webapp-content/dist/categories/redux";
import {reducer as content} from "@bbyca/ecomm-webapp-content/dist/components/Content/state";
import {reducer as stores} from "@bbyca/ecomm-webapp-content/dist/stores";
import {routerMiddleware} from "react-router-redux";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {createResponsiveStoreEnhancer} from "redux-responsive";
import * as reduceReducersLib from "reduce-reducers";
import {ThunkInjectables} from "models";
import {navigation} from "@bbyca/apex-components";
import thunk, {ThunkMiddleware} from "redux-thunk";
import {
    addOnsPage,
    ads,
    brand,
    cartPage,
    config,
    createAppReducer,
    dynamicContent,
    eligibilityCheck,
    errors,
    geekSquadMembershipDialog,
    gspReducer,
    help,
    homePage,
    intl,
    notification,
    npsSurvey,
    offersReducer,
    product,
    productListReducer,
    productSellers,
    promotionalBadges,
    recommendations,
    rootReducer,
    router,
    search,
    seller,
    sideNavigation,
    storeMessages,
    storesStatus,
    user,
    bazaarVoiceJS,
    productRelatedProducts,
} from "../reducers";

import analyticsMiddleware from "../utils/analytics/middleware";
import {State} from "./";
import {AppActions} from "../actions";

export default (initialState: State, initialMediaType: string, thunkInjectables: ThunkInjectables, browserHistory) => {
    const isProduction =
        initialState &&
        initialState.config &&
        initialState.config.environment &&
        initialState.config.environment === "production";

    const app = createAppReducer(initialMediaType);
    const reduceReducers = reduceReducersLib.default || reduceReducersLib;
    const reducer = reduceReducers(
        combineReducers<State>({
            addOnsPage,
            ads,
            app,
            brand,
            cart,
            cartPage,
            categoryContent,
            config,
            content,
            dynamicContent,
            errors,
            geekSquadMembershipDialog,
            gsp: gspReducer,
            help,
            homePage,
            intl,
            manufacturerWarranty,
            mobileActivationEligibilityCheck: eligibilityCheck,
            navigation,
            notification,
            npsSurvey,
            offers: offersReducer,
            product,
            productSellers,
            productList: productListReducer,
            promotionalBadges,
            requiredProducts,
            recommendations,
            routing: router,
            search,
            seller,
            servicePlan,
            servicePlanBenefits,
            sideNavigation,
            storeMessages,
            stores,
            storesStatus,
            user,
            bazaarVoiceJS,
            productRelatedProducts,
        }),
        rootReducer,
    );

    const middlewares = [
        (thunk as ThunkMiddleware<State, AppActions, ThunkInjectables>).withExtraArgument(thunkInjectables),
        routerMiddleware(browserHistory),
        analyticsMiddleware,
    ];
    const responsiveStoreEnhancer = createResponsiveStoreEnhancer({calculateInitialState: false});
    const composables = [responsiveStoreEnhancer, applyMiddleware(...middlewares)];

    // enable tracing of redux actions when in dev mode
    const devToolsConfig = {
        trace: true,
        traceLimit: 30,
    };

    return createStore<State>(
        reducer,
        initialState,
        isProduction ? compose(...composables) : composeWithDevTools(devToolsConfig)(...composables),
    );
};
