import * as React from "react";
import {bindActionCreators} from "redux";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {State} from "../../store";
import {GlobalHeader} from "@bbyca/apex-components";
import {
    searchActionCreators,
    SearchActionCreators,
    routingActionCreators,
    RoutingActionCreators,
    basketActionCreators,
    appActionCreators,
} from "actions";
import {CartIndicator} from "@bbyca/ecomm-checkout-components/dist/components";
import {IBrowser} from "redux-responsive";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {getCmsEnvironment} from "../../utils/environment";
import fetch from "utils/fetch";
import {
    getAccountApiUrl,
    getAccountDashboardUrl,
    getBasketServiceApiUrl,
    getCategoryApiUrl,
    getCustomerIdentityExperienceService,
    getEnvironment,
    getIsNewAccountsDesktopEntryEnabled,
    getIsNewAccountsEntryEnabled,
    getIsNewOrderStatusLinkEnabled,
    getOrders,
    getRoutingAltLangUrl,
    getScreenSize,
    getSearchApiUrl,
    getSearchQuery,
    getContentApiUrl,
} from "store/selectors";

interface StateProps {
    altLangUrl: string;
    query: string;
    screenSize: IBrowser;
    pageKey?: string;
    accountApiUrl: string;
    accountDashboardUrl: string;
    categoryApiUrl: string;
    basketServiceApiUrl: string;
    customerIdentityExperienceServiceUrl: string;
    orders: string;
    contentApiUrl: string;
    searchApiUrl: string;
    isNewAccountsEntryEnabled: boolean;
    isNewAccountsDesktopEntryEnabled: boolean;
    isNewOrderStatusLinkEnabled: boolean;
    environment: string;
}

interface DispatchProps {
    searchActions: SearchActionCreators;
    clearCart: () => any;
    goToCartPage: () => void;
    routingActions: RoutingActionCreators;
}

export const Header = (props: StateProps & DispatchProps & InjectedIntlProps) => {
    const {
        altLangUrl,
        query,
        searchActions,
        accountApiUrl,
        accountDashboardUrl,
        basketServiceApiUrl,
        categoryApiUrl,
        clearCart,
        contentApiUrl,
        customerIdentityExperienceServiceUrl,
        environment,
        goToCartPage,
        intl,
        isNewAccountsDesktopEntryEnabled,
        isNewAccountsEntryEnabled,
        isNewOrderStatusLinkEnabled,
        orders,
        routingActions,
        screenSize,
        searchApiUrl,
    } = props;

    return (
        <GlobalHeader
            altLangUrl={altLangUrl}
            client={"ecomm-webapp"}
            config={{
                accountApiUrl,
                accountDashboardUrl,
                categoryApiUrl,
                basketServiceApiUrl,
                customerIdentityExperienceServiceUrl,
                ordersWebAppUrl: orders,
                contentApiUrl,
                searchSuggestionsApiUrl: `${searchApiUrl}/autocomplete`,
            }}
            changeQuery={(searchQuery: string, path?: string) => () => searchActions.changeQuery(searchQuery, path)}
            isNewAccountsEntryEnabled={isNewAccountsEntryEnabled}
            isNewAccountsDesktopEntryEnabled={isNewAccountsDesktopEntryEnabled}
            query={query}
            onSignOutSuccess={clearCart}
            internalLinkHandler={(path) => routingActions.push(path)}
            locale={intl.locale as Locale}
            env={getCmsEnvironment(environment)}
            isNewOrderStatusLinkEnabled={isNewOrderStatusLinkEnabled}
            enableSearchSuggestions={true}
            fetch={fetch}
            componentOverride={{
                cartIndicator: (
                    <CartIndicator onViewCart={goToCartPage} showLabel={screenSize.greaterThan.extraSmall} />
                ),
            }}
        />
    );
};

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => ({
    accountApiUrl: getAccountApiUrl(state) || "",
    accountDashboardUrl: getAccountDashboardUrl(state) || "",
    basketServiceApiUrl: getBasketServiceApiUrl(state) || "'",
    customerIdentityExperienceServiceUrl: getCustomerIdentityExperienceService(state),
    categoryApiUrl: getCategoryApiUrl(state) || "",
    contentApiUrl: getContentApiUrl(state) || "",
    searchApiUrl: getSearchApiUrl(state) || "",
    orders: getOrders(state),
    environment: getEnvironment(state) || "",
    isNewOrderStatusLinkEnabled: getIsNewOrderStatusLinkEnabled(state),
    isNewAccountsEntryEnabled: getIsNewAccountsEntryEnabled(state),
    isNewAccountsDesktopEntryEnabled: getIsNewAccountsDesktopEntryEnabled(state),
    query: getSearchQuery(state) || "",
    screenSize: getScreenSize(state),
    altLangUrl: getRoutingAltLangUrl(state) || "",
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => {
    return {
        searchActions: bindActionCreators(searchActionCreators, dispatch),
        clearCart: () => {
            dispatch(appActionCreators.logout());
        },
        goToCartPage: () => dispatch(basketActionCreators.goToCartPage()),
        routingActions: bindActionCreators(routingActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps, {}, State>(mapStateToProps, mapDispatchToProps)(injectIntl(Header));
