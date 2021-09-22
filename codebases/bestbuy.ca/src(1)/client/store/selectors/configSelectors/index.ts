import {createSelector, Selector} from "reselect";
import {ConfigState} from "../../../reducers/configReducer";
import {State} from "store";
import {FeatureToggles, ClientConfig} from "config";
import {RemoteConfig} from "models";
import {get} from "lodash-es";
import {getIntlLanguage} from "../intlSelectors";

type DataSourcesType = ClientConfig["dataSources"] | undefined;
type MaybeString = string | undefined;

export const getConfig: Selector<State, ConfigState> = (state: State) => state.config;

export const getConfigFeatures = createSelector<State, ConfigState, FeatureToggles>([getConfig], (config) =>
    get(config, "features"),
);

export const getRemoteConfig = createSelector<State, ConfigState, RemoteConfig | undefined>([getConfig], (config) =>
    get(config, "remoteConfig"),
);

export const getConfigCheckout = createSelector<State, ConfigState, ClientConfig["checkout"] | undefined>(
    [getConfig],
    (config) => get(config, "checkout"),
);

export const getGeekSquadSubscriptionSKU = createSelector<
    State,
    ClientConfig["checkout"] | undefined,
    string | undefined
>([getConfigCheckout], (checkout) => get(checkout, "geekSquadSubscriptionSKU"));

export const isRpuEnabled = createSelector<State, RemoteConfig | undefined, boolean>([getRemoteConfig], (state) =>
    get(state, "isRpuEnabled", false),
);

export const isAddToCartEnabled = createSelector<State, RemoteConfig | undefined, boolean>([getRemoteConfig], (state) =>
    get(state, "isAddToCartEnabled", false),
);

export const isLightWeightBasketEnabled = createSelector<State, RemoteConfig | undefined, boolean>(
    [getRemoteConfig],
    (state) => get(state, "isLightweightBasket", false),
);

export const isQueueItEnabled = createSelector<State, RemoteConfig | undefined, boolean>([getRemoteConfig], (state) =>
    get(state, "isQueueItEnabled", false),
);

export const getDataSources = createSelector<State, ClientConfig, DataSourcesType>([getConfig], (state) =>
    get(state, "dataSources"),
);

export const getTermsAndConditionsUrl = createSelector<State, Language, DataSourcesType, MaybeString>(
    [getIntlLanguage, getDataSources],
    (language, dataSources) => get(dataSources, `warrantyTermsAndConditionsUrl.${language}`),
);

export const getQuebecLegalWarrantyUrl = createSelector<State, Language, DataSourcesType, MaybeString>(
    [getIntlLanguage, getDataSources],
    (language, dataSources) => get(dataSources, `quebecLegalWarrantyUrl.${language}`),
);

export const getReCaptchaKey = createSelector<State, ConfigState, string>([getConfig], (config) => {
    return get(config, "reCaptchaSitekey");
});

export const getAccountApiUrl = createSelector<State, DataSourcesType, MaybeString>([getDataSources], (dataSources) =>
    get(dataSources, "accountApiUrl"),
);

export const getBasketServiceApiUrl = createSelector<State, DataSourcesType, MaybeString>(
    [getDataSources],
    (dataSources) => get(dataSources, "basketServiceApiUrl"),
);

export const getCategoryApiUrl = createSelector<State, DataSourcesType, MaybeString>([getDataSources], (dataSources) =>
    get(dataSources, "categoryApiUrl"),
);

export const getProductListApiUrl = createSelector<State, DataSourcesType, MaybeString>(
    [getDataSources],
    (dataSources) => get(dataSources, "productListApiUrl"),
);

export const getAccountDashboardUrl = createSelector<State, DataSourcesType, MaybeString>(
    [getDataSources],
    (dataSources) => get(dataSources, "accountDashboardUrl"),
);

export const getContentApiUrl = createSelector<State, DataSourcesType, MaybeString>([getDataSources], (dataSources) =>
    get(dataSources, "contentApiUrl"),
);

export const getSearchApiUrl = createSelector<State, DataSourcesType, MaybeString>([getDataSources], (dataSources) =>
    get(dataSources, "searchApiUrl"),
);

export const getAppPaths = createSelector<State, ConfigState, ConfigState["appPaths"]>(
    [getConfig],
    (state) => state.appPaths,
);

export const getCustomerIdentityExperienceService = createSelector<State, ConfigState["appPaths"], string>(
    [getAppPaths],
    (state) => state.customerIdentityExperienceService,
);
export const getOrders = createSelector<State, ConfigState["appPaths"], string>([getAppPaths], (state) => state.orders);

export const getEnvironment = createSelector<State, ConfigState, MaybeString>(
    [getConfig],
    (state) => state.environment,
);

export const getIsNewOrderStatusLinkEnabled = createSelector<State, ConfigState, boolean>([getConfig], (state) =>
    get(state, "isNewOrderStatusLinkEnabled", false),
);

export const getAccount = createSelector<State, ConfigState, ConfigState["account"]>(
    [getConfig],
    (state) => state.account,
);

export const getIsNewAccountsEntryEnabled = createSelector<State, ConfigState["account"], boolean>(
    [getAccount],
    (state) => get(state, "isNewAccountsEntryEnabled", false),
);
export const getIsNewAccountsDesktopEntryEnabled = createSelector<State, ConfigState["account"], boolean>(
    [getAccount],
    (state) => get(state, "isNewAccountsDesktopEntryEnabled", false),
);

export const getFeatureToggle = <T extends FeatureToggles, K extends keyof T>(featureToggle: K) =>
    createSelector<State, ConfigState["features"], T[K]>([getConfigFeatures], (toggleState) =>
        get(toggleState, featureToggle, false),
    );

export const isFutureDatePricingEnabled = createSelector<State, ConfigState, boolean>(
    [getConfig],
    (state) => state.isFutureDatePricingEnabled,
);

export const getFutureDatePricingValue = createSelector<State, ConfigState, string | null>(
    [getConfig],
    (state) => state.futureDatePricingValue,
);
