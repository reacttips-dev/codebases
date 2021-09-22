import { swSettings } from "common/services/swSettings";
import DurationService from "services/DurationService";
import * as DashboardWizardActionTypes from "./dashboardWizardActionTypes";
import * as _ from "lodash";
import queryString from "query-string";
import { Injector } from "common/ioc/Injector";
import {
    getComponentProperties,
    getComponentByWebSource,
    getMetricProperties,
    getProductClaims,
    getMetricWidgetTypes,
    getMetricWidgetFilters,
    getPeriodOverPeriodParams,
    getWidgetWidth,
    getWebsiteHeaderData,
} from "../utils/dashboardWizardUtils";
import { DefaultFetchService } from "services/fetchService";
//todo: rename to defaultActionParams
//todo: check if reducer really need all the returning values and if not divide to separate functions
export const defaultStateParams = (
    customDashboardState,
    webSource?,
    metric?,
    type?,
    key?,
    family?,
    duration?,
) => {
    const _metric = metric || customDashboardState.widget.metric;
    const _webSource = webSource || customDashboardState.widget.webSource;
    const _key = key || customDashboardState.widget.key;
    const _family = family || customDashboardState.widget.family;
    const _duration = duration || customDashboardState.widget.duration;
    const _type =
        type || customDashboardState.widget.type || customDashboardState.widget.widgetType;
    const _componentName = getComponentByWebSource(
        customDashboardState,
        _webSource,
        _metric,
        _family,
        _key,
    );
    let _isCompare =
        key && Object.keys(key).length > 0
            ? key.length > 1
            : customDashboardState.widget.key
            ? customDashboardState.widget.key.length > 1
            : false;

    const _metricProps = getMetricProperties(_metric, _family);
    if (_metricProps.noCompare) {
        _isCompare = false;
    }
    const _componentProps = getComponentProperties(_componentName, _metricProps);

    const _productClaims = getProductClaims();
    const _metricWidgetTypes = getMetricWidgetTypes(_metric, _isCompare, customDashboardState);
    const _metricWidgetFilters = getMetricWidgetFilters(
        _metric,
        _family,
        _type,
        _isCompare,
        customDashboardState,
    );
    const _periodOverPeriodParams = getPeriodOverPeriodParams(
        _family,
        _metric,
        _key,
        _duration,
        _componentName,
    );
    const _widgetWidth = getWidgetWidth(_type);

    return {
        component: _componentName,
        componentProps: _componentProps,
        metricProps: _metricProps,
        productClaims: _productClaims,
        metricWidgetTypes: _metricWidgetTypes,
        metricWidgetFilters: _metricWidgetFilters,
        periodOverPeriodParams: _periodOverPeriodParams,
        width: _widgetWidth,
    };
};

export const dashboardWizardMetricAndFamilyChanged = (
    customDashboardState,
    metric,
    family,
    key,
) => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED,
        metric,
        family,
        key,
        ...defaultStateParams(customDashboardState, null, metric, null, key, family),
    };
};

export const dashboardWizardKeyChanged = (customDashboardState, key) => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_CHANGED,
        key,
        isCompare: key.length > 1,
        ...defaultStateParams(customDashboardState, null, null, null, key),
    };
};

export const dashboardWizardNewWidget = () => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_NEW,
    };
};

export const dashboardWizardKeyAppend = (customDashboardState, key) => {
    const _newKey = [...customDashboardState.widget.key, key];
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_APPEND,
        key: _newKey,
        isCompare: customDashboardState.widget.key.length + 1 > 1,
        ...defaultStateParams(customDashboardState, null, null, null, _newKey),
    };
};

export const dashboardWizardKeyRemove = (customDashboardState, key) => {
    const _newKey = customDashboardState.widget.key.filter((item) => {
        if (item) {
            if (item.id && item.id !== key.id) {
                return key;
            }
            if (item.name && item.name !== key.name) {
                return key;
            }
        }
    });
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_REMOVE,
        key: _newKey,
        isCompare: customDashboardState.widget.key.length - 1 > 1,
        ...defaultStateParams(customDashboardState, null, null, null, _newKey),
    };
};

export const dashboardWizardWebSourceChanged = (customDashboardState, webSource) => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED,
        webSource,
        ...defaultStateParams(customDashboardState, webSource),
    };
};

export const dashboardWizardCountryChanged = (customDashboardState, country) => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_COUNTRY_CHANGED,
        country,
        desktopMobileWebTotalCountries: getComponentProperties(
            "DesktopMobileWebTotal",
            customDashboardState.metricProps,
        ).countries,
        ...defaultStateParams(customDashboardState),
    };
};

export const dashboardWizardDurationChanged = (
    customDashboardState,
    duration,
    comparedDuration,
) => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_DURATION_CHANGED,
        duration,
        comparedDuration,
        ...defaultStateParams(customDashboardState, null, null, null, null, null, duration),
    };
};

export const dashboardWizardWidgetTypeChanged = (customDashboardState, widgetType) => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_TYPE_CHANGED,
        widgetType,
        ...defaultStateParams(customDashboardState, null, null, widgetType.type),
    };
};

export const dashboardWizardComparedDurationChanged = (customDashboardState, comparedDuration) => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_COMPARED_DURATION_CHANGED,
        comparedDuration,
        ...defaultStateParams(customDashboardState),
    };
};

export const dashboardWizardWidgetChanged = (customDashboardState, widgetModel) => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED,
        ...widgetModel,
        isCompare: widgetModel.key.length > 1,
        desktopMobileWebTotalCountries: getComponentProperties(
            "DesktopMobileWebTotal",
            customDashboardState.metricProps,
        ).countries,
        ...defaultStateParams(customDashboardState),
    };
};

export const dashboardWizardFilterChanged = (customDashboardState, filter) => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_FILTER_CHANGED,
        filter,
        ...defaultStateParams(customDashboardState),
    };
};

export const dashboardWizardSelectedChannelChanged = (customDashboardState, selectedChannel) => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_SELECTED_CHANNEL_CHANGED,
        selectedChannel,
        ...defaultStateParams(customDashboardState),
    };
};

export const dashboardWizardDataModeChanged = (customDashboardState, dataMode) => {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_DATAMODE_CHANGED,
        dataMode,
        ...defaultStateParams(customDashboardState),
    };
};

//Async flow for GetMetricMetaData.
function receiveMetricMetaDataSuccess(customDashboardState, countries) {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_RECEIVE_METRIC_META_DATA_SUCCESS,
        countries,
        ...defaultStateParams(customDashboardState),
    };
}

function receiveMetricMetaDataFail(customDashboardState, error) {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_RECEIVE_METRIC_META_DATA_ERROR,
        error,
        ...defaultStateParams(customDashboardState),
    };
}

function requestMetricMetaData(customDashboardState) {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_REQUEST_METRIC_META_DATA,
        ...defaultStateParams(customDashboardState),
    };
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const fetchMetricMetaData = (customDashboardState, keys) => {
    const SWSettings: any = swSettings;
    const fetchService = DefaultFetchService.getInstance();
    let keyForAPI = keys.map((k) => {
        return k.id;
    });
    keyForAPI = keyForAPI.join();
    const params = {
        from: DurationService.getDurationData(
            customDashboardState.widget.duration,
            null,
            customDashboardState.component,
        ).forAPI["from"],
        to: DurationService.getDurationData(
            customDashboardState.widget.duration,
            null,
            customDashboardState.component,
        ).forAPI["to"],
        keys: keyForAPI,
        store: capitalizeFirstLetter(keys[0].store),
        metric: customDashboardState.widget.metric,
    };
    const stateParams = defaultStateParams(customDashboardState) as any;
    const apiController = stateParams.metricProps.apiController;
    const url =
        `/widgetApi/${typeof apiController === "function" ? apiController(keys) : apiController}/${
            params.metric
        }/MetricMetaData?` + queryString.stringify(params);
    return (dispatch) => {
        dispatch(requestMetricMetaData(customDashboardState));
        return fetchService
            .get<any>(url)
            .then(
                // On success return response.json().
                (response) => response,
                // On error dispatch error action.
                (error) => dispatch(receiveMetricMetaDataFail(customDashboardState, error)),
            )
            .then((response) => {
                const countries = SWSettings.filterCountries(response.settings.countries);
                return dispatch(receiveMetricMetaDataSuccess(customDashboardState, countries));
            });
    };
};

export function receiveGaVerifiedDataSuccess(customDashboardState, isGAVerifiedSupported) {
    return {
        type: DashboardWizardActionTypes.DASHBOARD_WIZARD_RECEIVE_GA_VERIFIED_SUCCESS,
        isGAVerifiedDataSupported: isGAVerifiedSupported,
        ...defaultStateParams(customDashboardState),
    };
}

export const updateGAVerifiedDataFilter = (customDashboardState, key) => {
    if (key.length < 1) {
        return (dispatch) => {
            return dispatch({ type: DashboardWizardActionTypes.DASHBOARD_WIZARD_NO_KEYS });
        };
    }
    return (dispatch) => {
        return getWebsiteHeaderData(key).then((res) => {
            return dispatch(
                receiveGaVerifiedDataSuccess(
                    customDashboardState,
                    !!_.find(res, { hasGaToken: true }),
                ),
            );
        });
    };
};
