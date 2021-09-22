import * as _ from "lodash";
import * as DashboardWizardActionTypes from "../actions/dashboardWizardActionTypes";
import * as TrafficSources from "../utils/dashboardWizardTrafficSourceGenerator";
import getDefaultstate, {
    IDashboardWizardFormElements,
} from "../utils/dashboardWizardDefaultState";
import {
    isAllowedDurationInComponent,
    isMetricAllowsTrafficSource,
    getFormElementsStatus,
} from "../utils/dashboardWizardUtils";
import {
    IWidgetIndustryKey,
    IWidgetKeywordsKey,
    IWidgetMobileKey,
    IWidgetWebsiteKey,
    Widget,
} from "components/widget/widget-types/Widget";
import { DASHBOARD_WIZARD_DATAMODE_CHANGED } from "../actions/dashboardWizardActionTypes";

interface ICountryObj {
    children: any;
    id: number;
    text: string;
    icon: string;
    code: string;
}

const DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE = getDefaultstate();

function getAvailableTrafficSourcesByAction(action) {
    const _isCountryAllowedMobileWeb = _.find(
        action.desktopMobileWebTotalCountries,
        (country: ICountryObj) => {
            return parseInt(action.country) === country.id;
        },
    );
    //If the country does not support MobileWeb - return Desktop only.
    if (!_isCountryAllowedMobileWeb && action.country) {
        return TrafficSources.initTrafficSourcesDefault();
    } else {
        //If metric doesn't support MobileWeb - return Desktop only.
        if (!isMetricAllowsTrafficSource(action.metricProps, TrafficSources.TrafficSource.MOBILE)) {
            if (
                isMetricAllowsTrafficSource(
                    action.metricProps,
                    TrafficSources.TrafficSource.DESKTOP,
                )
            ) {
                return TrafficSources.initTrafficSourcesDefault();
            } else {
                return TrafficSources.initTrafficSourcesExcludeDesktopAndMobile();
            }
        } else {
            //If user can claim MobileWeb component.
            const _mobileWebComponentToClaim =
                action.metricProps.mobileWebComponent || "MobileWebTraffic";
            if (action.productClaims[_mobileWebComponentToClaim]) {
                //If metric can claim Total - return all traffic sources
                if (
                    isMetricAllowsTrafficSource(
                        action.metricProps,
                        TrafficSources.TrafficSource.TOTAL,
                    )
                ) {
                    return TrafficSources.initFullTrafficSources();
                    //Otherwise return Desktop and MobileWeb.
                } else {
                    return TrafficSources.initTrafficSourcesExcludeTotal();
                }
            } else {
                //If user cannot claim MobileWeb - suggest upgrade.
                if (
                    isMetricAllowsTrafficSource(
                        action.metricProps,
                        TrafficSources.TrafficSource.TOTAL,
                    )
                ) {
                    return TrafficSources.initTrafficSourcesExcludeDesktopAndMobile();
                } else {
                    return TrafficSources.initPartialTrafficSourcesExcludeTotalUpgradeMobile();
                }
            }
        }
    }
}

// A reducer to update widget.family.
function family(state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.family, action) {
    let _family: string;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            _family = action.family;
            return _family;
        default:
            return state;
    }
}

// A reducer to update widget.metric.
function metric(state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.metric, action) {
    let _metric: string;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            _metric = action.metric;
            return _metric;
        default:
            return state;
    }
}

// A reducer to update widget.key.
function key(state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.key, action, widget) {
    let _key: Array<IWidgetWebsiteKey | IWidgetMobileKey | IWidgetIndustryKey | IWidgetKeywordsKey>;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_APPEND:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_REMOVE:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            if (!key) {
                return state;
            }
            _key = action.key;
            return _key;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
            if (action.family != widget.family) {
                return [];
            }
            if (action.metricProps.noCompare && state.length > 1) {
                return [state[0]];
            }
            return state;
        default:
            return state;
    }
}

// A reducer to update widget.webSource.
function webSource(state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.webSource, action) {
    let _webSource: string | number;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            _webSource = action.webSource;
            return _webSource;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_COUNTRY_CHANGED:
            const _enabledTrafficSources = getAvailableTrafficSourcesByAction(action).filter(
                (item) => {
                    return !item.disabled;
                },
            );
            if (_.find(_enabledTrafficSources, { id: state, disabled: false })) {
                return state;
            }
            _webSource = _enabledTrafficSources[0].id;
            return _webSource;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_APPEND:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_REMOVE:
            if (!key) {
                return state;
            }
            //For apps remove the webSource property.
            if (action.key[0] && action.key[0].store) {
                return undefined;
            }
        default:
            return state;
    }
}

// A reducer to update the list of available traffic sources in the wizard.
function availableTrafficSources(
    state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.availableTrafficSources,
    action,
) {
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_COUNTRY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            return getAvailableTrafficSourcesByAction(action);
        default:
            return state;
    }
}

// A reducer to update widget.country.
function country(
    state: any = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.country,
    action,
    widget,
) {
    let _country: number;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_COUNTRY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            _country = action.country;
            if (!_.find(action.componentProps.countries, { id: parseInt(action.country) })) {
                return action.componentProps.defaultParams.country;
            }
            return _country;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
            const _countryAllowed = _.find(action.componentProps.countries, {
                id: parseInt(state),
            });
            if (!_countryAllowed || (action.family && action.family != widget.family)) {
                _country = action.componentProps.defaultParams.country;
            } else {
                _country = state;
            }
            return _country;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_RECEIVE_METRIC_META_DATA_SUCCESS:
            _country = action.componentProps.defaultParams.country;
            return _country;
        default:
            return state;
    }
}

// A reducer to update the list of available countries in the wizard.
function availableCountries(
    state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.availableCountries,
    action,
) {
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            return action.componentProps.countries;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_RECEIVE_METRIC_META_DATA_SUCCESS:
            return action.countries;
        default:
            return state;
    }
}

// A reducer to update widget.duration.
function duration(state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.duration, action, widget) {
    let _duration: string;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_DURATION_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            _duration = action.duration;
            return _duration;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
            const _componentProps = action.componentProps;
            _duration = isAllowedDurationInComponent(_componentProps, state)
                ? state
                : _componentProps.defaultParams.duration;
            return _duration;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
            const _isCurrentDurationAvailable: any = _.find(
                action.componentProps.datePickerPresets,
                { value: widget.duration },
            );
            const _isCurrentDurationAllowed =
                _isCurrentDurationAvailable && _isCurrentDurationAvailable.enabled;
            if (action.family != widget.family || !_isCurrentDurationAllowed) {
                return action.componentProps.defaultParams.duration;
            } else {
                return state;
            }
        default:
            return state;
    }
}

// A reducer to update the list of available durations in the wizard.
function availableDurations(
    state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.availableDurations,
    action,
) {
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
            return action.componentProps.datePickerPresets;
        default:
            return state;
    }
}

// A reducer to update the min date available in the wizard duration selector.
function minDate(state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.minDate, action) {
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
            return action.componentProps.minDate;
        default:
            return state;
    }
}

// A reducer to update the max date available in the wizard duration selector.
function maxDate(state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.maxDate, action) {
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
            return action.componentProps.maxDate;
        default:
            return state;
    }
}

// A reducer to update widget.type.
function widgetType(state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.type, action, widget) {
    let _widgetType: string;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_TYPE_CHANGED:
            _widgetType = action.widgetType.type;
            return _widgetType;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_APPEND:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_REMOVE:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_DURATION_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
            const _availableMetricWidgetTypes = action.metricWidgetTypes;
            const _currentSelectedWidgetType: any = _.find(_availableMetricWidgetTypes, {
                type: widget.type,
                disabled: false,
            });
            if (_currentSelectedWidgetType) {
                return _currentSelectedWidgetType.type;
            } else {
                const _firstTypeAvailable: any = _.find(_availableMetricWidgetTypes, {
                    disabled: false,
                });
                return _firstTypeAvailable.type;
            }
        default:
            return state;
    }
}

// A reducer to update the selectedWidgetTypeId for the wizard selector
function selectedWidgetType(
    state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.type,
    action,
    widget,
) {
    let _deafultWidgetType: string;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_TYPE_CHANGED:
            _deafultWidgetType = action.widgetType.id;
            return _deafultWidgetType;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_APPEND:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_REMOVE:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
            const _availableMetricWidgetTypes = action.metricWidgetTypes;
            const _currentSelectedWidgetType: any = _.find(_availableMetricWidgetTypes, {
                type: widget.type,
                disabled: false,
            });
            if (_currentSelectedWidgetType) {
                return _currentSelectedWidgetType.id;
            } else {
                const _firstTypeAvailable: any = _.find(_availableMetricWidgetTypes, {
                    disabled: false,
                });
                return _firstTypeAvailable.id;
            }
        default:
            return state;
    }
}

// A reducer to update the list of available widget types (visualizations) in the wizard.
function availableWidgetTypes(
    state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.availableWidgetTypes,
    action,
) {
    //TODO: add suport for metricProperties.getDashboardWidgetTypes funciton.
    let _availableWidgetType: string;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_DURATION_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_APPEND:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_REMOVE:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
            return action.metricWidgetTypes;
        default:
            return state;
    }
}

// A reducer to update props for the wizard's form elements (e.g. isActive).
function formElements(state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.formElements, action, widget) {
    let _formElements: IDashboardWizardFormElements = state;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_REQUEST_METRIC_META_DATA:
            Object.keys(_formElements).forEach((element) => {
                _formElements[element].isActive = false;
            });
            return _formElements;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_RECEIVE_METRIC_META_DATA_ERROR:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_RECEIVE_METRIC_META_DATA_SUCCESS:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_APPEND:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_REMOVE:
            return getFormElementsStatus(_formElements, action, widget);
        default:
            return state;
    }
}

// A reducer to update available filters based on selected metric and widet type.
function availableFilters(
    state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.availableFilters,
    action,
    widgetFilters,
) {
    let _availableFilters = action.metricWidgetFilters;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_RECEIVE_GA_VERIFIED_SUCCESS:
            if (
                _availableFilters["ShouldGetVerifiedData"] !== undefined &&
                !action.isGAVerifiedDataSupported
            ) {
                delete _availableFilters["ShouldGetVerifiedData"];
            }
            return _availableFilters;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_TYPE_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
            if (_availableFilters["ShouldGetVerifiedData"] !== undefined) {
                delete _availableFilters["ShouldGetVerifiedData"];
            }
            return _availableFilters;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            return _availableFilters;
        default:
            return state;
    }
}

// A reducer to update selected widget filters.
function filters(
    state: any = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.filters,
    action,
    widget,
) {
    const fixGranularityByDuration = (granularity, duration, availableGranularity = []) => {
        if (duration === "28d") {
            const granOpts = ["Daily", "Weekly"];
            return [
                ...(granOpts.includes(granularity) ? [granularity] : [granOpts[0]]), // give precedence to given granularity
                granOpts.slice(1),
            ].find(
                (newGran) => availableGranularity.findIndex((gran) => gran.id === newGran) !== -1,
            );
        }
    };
    let _selectedFilters: any = {};
    const _availableFilters = action.metricWidgetFilters;
    const _changedFilter = action.filter;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_TYPE_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_RECEIVE_GA_VERIFIED_SUCCESS:
            Object.keys(_availableFilters).forEach((filterName) => {
                if (
                    state[filterName] !== undefined &&
                    _.find(_availableFilters[filterName], { id: state[filterName].toString() })
                ) {
                    _selectedFilters[filterName] = state[filterName].toString();
                } else {
                    _selectedFilters[filterName] = _availableFilters[filterName][0].id;
                }
            });
            if (action.widgetType && action.widgetType.type === "SingleMetric") {
                _selectedFilters["timeGranularity"] = "Monthly";
            }
            const metricFixedGran = fixGranularityByDuration(
                _selectedFilters["timeGranularity"] ?? state.timeGranularity,
                widget.duration,
                _availableFilters.timeGranularity,
            );
            if (
                metricFixedGran &&
                metricFixedGran !== (_selectedFilters["timeGranularity"] ?? state.timeGranularity)
            ) {
                _selectedFilters["timeGranularity"] = metricFixedGran;
            }
            if (action.metric) {
                return _selectedFilters;
            } else {
                return Object.assign(state, _selectedFilters);
            }
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_FILTER_CHANGED:
            if (Array.isArray(_changedFilter)) {
                _changedFilter.forEach((filter) => {
                    _selectedFilters[filter.name] = filter.value;
                });
            } else {
                for (let filterName in _availableFilters) {
                    if (filterName === _changedFilter.name) {
                        _selectedFilters[filterName] = _changedFilter.id;
                    } else {
                        _selectedFilters[filterName] =
                            state[filterName] !== undefined
                                ? state[filterName]
                                : _availableFilters[filterName][0].id;
                    }
                }
            }
            if (_changedFilter.name === "filter") {
                if (state.filter) {
                    const stateFilterObject = Widget.filterParse(state.filter);
                    const actionFilterObject = Widget.filterParse(_changedFilter.filter);
                    _selectedFilters.filter = Object.assign(stateFilterObject, actionFilterObject);
                }
            }
            return _selectedFilters;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            const _chosenFilters = action.filters;
            Object.keys(_chosenFilters).forEach((filterName) => {
                _selectedFilters[filterName] =
                    _chosenFilters[filterName] !== undefined
                        ? _chosenFilters[filterName]
                        : _availableFilters[filterName][0].id;
            });
            return _selectedFilters;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_DURATION_CHANGED:
            // Compared duration supports only monthly granularity
            if (action.comparedDuration) {
                return {
                    ...state,
                    timeGranularity: "Monthly",
                };
            }
            if (widget.metric === "EngagementOverview" && action.duration === "28d") {
                return {
                    ...state,
                    timeGranularity: "Daily",
                };
            } else if (widget.metric === "EngagementOverview" && action.duration !== "28d") {
                return {
                    ...state,
                    timeGranularity: "Monthly",
                };
            }
            const durationFixedGran = fixGranularityByDuration(
                state.timeGranularity,
                action.duration,
                _availableFilters.timeGranularity,
            );
            if (durationFixedGran && durationFixedGran !== state.timeGranularity) {
                return {
                    ...state,
                    timeGranularity: durationFixedGran,
                };
            }
            return state;
        default:
            return state;
    }
}

// A reducer to update the selected widget dataMode
function dataMode(state: any = null, action, widget) {
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            return action.dataMode;
        case DASHBOARD_WIZARD_DATAMODE_CHANGED:
            return action.dataMode;
        default:
            return state;
    }
}

// A reducer to updated widget comparedDuratrion according to key, duration and widget type.
function comparedDuration(
    state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.comparedDuration,
    action,
    widget,
) {
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_APPEND:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_REMOVE:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_DURATION_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_TYPE_CHANGED:
            if (action.comparedDuration !== undefined) {
                return action.comparedDuration || undefined;
            }
            // if(widget.key.length > 1){
            //     return undefined;
            // }
            return widget.comparedDuration || undefined;
        default:
            return state;
    }
}

// A reducer to updated wizard comparedDuratrionItems according to key, duration and widget type.
function comparedDurationItems(
    state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.comparedDurationItems,
    action,
) {
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_APPEND:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_REMOVE:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WEBSOURCE_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_DURATION_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_TYPE_CHANGED:
            return action.periodOverPeriodParams.items
                .filter((item) => !item.disabled)
                .map((item, index) => {
                    return {
                        id: item.id,
                        title: item.text,
                        value: index,
                        disabled: item.disabled,
                    };
                });
        default:
            return state;
    }
}

// A reducer to update the widget selectedChannel value.
function selectedChannel(
    state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.selectedChannel,
    action,
) {
    let _selectedChannel: any;
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_APPEND:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_REMOVE:
            if (action.metricProps.multipleChannelSupport) {
                _selectedChannel = state || "Direct";
            } else {
                _selectedChannel = state;
            }
            return _selectedChannel;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_SELECTED_CHANNEL_CHANGED:
            _selectedChannel = action.selectedChannel;
            return _selectedChannel.id;
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            _selectedChannel = action.selectedChannel;
            return _selectedChannel;
        default:
            return state;
    }
}

// A reducer to update the store isCompare property which defined whether or not the current metric supports compare mode.
function isCompare(state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.isCompare, action) {
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_METRIC_FAMILY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            return !action.metricProps.noCompare;
        default:
            return state;
    }
}

// A reducer to update the store disableDatepicker property to indicate when the datepicker should be disabled.
function disableDatepicker(
    state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.disableDatepicker,
    action,
) {
    switch (action.type) {
        default:
            return action.metricProps ? action.metricProps.disableDatepicker : state;
    }
}

// A reducer to update the store customAsset property, based on the widget's key, in order to indicate whether to add HASH to API call (e.g. custom categories)
function customAsset(
    state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE.widget.customAsset,
    family,
    action,
) {
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_CHANGED:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_APPEND:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_KEY_REMOVE:
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_CHANGED:
            if (action.key.length && action.key[0].id && action.key[0].id.indexOf("*") > -1) {
                return family;
            } else {
                return false;
            }
        default:
            return state;
    }
}

export default function (state = DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE, action) {
    switch (action.type) {
        case DashboardWizardActionTypes.DASHBOARD_WIZARD_WIDGET_NEW:
            return DEFAULT_DASHBOARD_WIDGET_WIZARD_STATE;
        default:
            return {
                ...state,
                availableTrafficSources: availableTrafficSources(
                    state.availableTrafficSources,
                    action,
                ),
                availableCountries: availableCountries(state.availableCountries, action),
                availableDurations: availableDurations(state.availableDurations, action),
                minDate: minDate(state.minDate, action),
                maxDate: maxDate(state.maxDate, action),
                availableFilters: availableFilters(
                    state.availableFilters,
                    action,
                    state.widget.filters,
                ),
                availableWidgetTypes: availableWidgetTypes(state.availableWidgetTypes, action),
                formElements: formElements(state.formElements, action, state.widget),
                selectedWidgetType: selectedWidgetType(
                    state.selectedWidgetType,
                    action,
                    state.widget,
                ),
                comparedDurationItems: comparedDurationItems(state.comparedDurationItems, action),
                isCompare: isCompare(state.isCompare, action),
                disableDatepicker: disableDatepicker(state.disableDatepicker, action),
                androidOnly: action.metricProps
                    ? action.metricProps.androidOnly
                    : state.androidOnly,
                widget: {
                    ...state.widget,
                    family: family(state.widget.family, action),
                    metric: metric(state.widget.metric, action),
                    key: key(state.widget.key, action, state.widget),
                    webSource: webSource(state.widget.webSource, action),
                    duration: duration(state.widget.duration, action, state.widget),
                    comparedDuration: comparedDuration(
                        state.widget.comparedDuration,
                        action,
                        state.widget,
                    ),
                    country: country(state.widget.country, action, state.widget),
                    type: widgetType(state.widget.type, action, state.widget),
                    filters: filters(state.widget.filters, action, state.widget),
                    dataMode: dataMode(state.widget.dataMode, action, state.widget),
                    selectedChannel: selectedChannel(state.widget.selectedChannel, action),
                    width: parseInt(action.width),
                    customAsset: customAsset(state.widget.customAsset, state.widget.family, action),
                },
            };
    }
}
