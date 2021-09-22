import { swSettings } from "common/services/swSettings";
import dayjs, { Dayjs, OpUnitType } from "dayjs";
import _ from "lodash";
import { periodOverPeriodService } from "services/PeriodOverPeriodService";
import { DefaultFetchService } from "../../../../services/fetchService";
import widgetSettings from "components/dashboard/WidgetSettings";

export function dateFromString(yearMonthString) {
    const date = yearMonthString.split(".");
    return dayjs
        .utc()
        .year(parseInt(date[0]))
        .month(parseInt(date[1]) - 1);
}

export function isAllowedDurationInComponent(component, duration) {
    const customDuration = duration.split("-");
    let granularity: OpUnitType, start: Dayjs, end: Dayjs;
    let returnedValue;

    if (component.CustomDurations) {
        return component.CustomDurations.indexOf(duration) > -1;
    }

    // custom duration
    if (customDuration.length > 1) {
        (granularity = "month"),
            (start = dateFromString(customDuration[0]).startOf(granularity).clone()),
            (end = dateFromString(customDuration[1]).endOf(granularity).clone());

        returnedValue =
            (start.isAfter(component.minDate, granularity) ||
                start.isSame(component.minDate, granularity)) &&
            (end.isBefore(component.maxDate, granularity) ||
                end.isSame(component.maxDate, granularity));
    }
    // preset
    else {
        const preset: any = _.find(component.datePickerPresets, { value: duration });
        returnedValue = !_.isUndefined(preset) ? preset.enabled && !preset.locked : false;
    }
    return returnedValue;
}

export function isMetricAllowsTrafficSource(metricProps, trafficSource) {
    const hasWebSource =
        metricProps.component === "IndustryAnalysisOverview"
            ? metricProps.modules.Industry.hasWebSource || metricProps.hasWebSource
            : metricProps.hasWebSource;
    const viewPermissions =
        metricProps.component === "IndustryAnalysisOverview"
            ? metricProps.modules.Industry.viewPermissions || metricProps.viewPermissions
            : metricProps.viewPermissions;
    if (trafficSource == getComponentDefaultWebSource(metricProps.component)) {
        return true;
    }
    if (hasWebSource && !viewPermissions) {
        return true;
    } else if (!hasWebSource && !viewPermissions) {
        return false;
    }
    return (
        viewPermissions &&
        viewPermissions.trafficSources &&
        _.includes(viewPermissions.trafficSources, trafficSource)
    );
}

export function getComponentDefaultWebSource(componentId) {
    return swSettings.components[componentId].resources.DefaultSource;
}

export function getComponentProperties(component, metricProps) {
    const _component = swSettings.components[component];
    const allowedCountries = [];
    _component.allowedCountries.forEach((country: any, index) => {
        if (!country.children || country.children.length < 1) {
            allowedCountries.push({
                ...country,
            });
        } else {
            allowedCountries.push({
                ...country,
            });
            country.children.forEach((state, index) => {
                allowedCountries.push({
                    ...state,
                });
            });
        }
    });
    return {
        countries: allowedCountries,
        datePickerPresets: _.map(_component.datePickerPresets, (preset) => {
            const elem: any = Object.assign({}, preset);
            elem.buttonText =
                (elem.buttonText.indexOf("Last") == -1 ? "Last " : "") + elem.buttonText;
            if (metricProps && metricProps.disableWindowInDatepicker && preset.value === "28d") {
                elem.enabled = false;
            }
            return elem;
        }),
        minDate: _component.startDate,
        maxDate: _component.endDate,
        defaultParams: _component.defaultParams,
        customDurations: _component.resources.CustomDurations,
    };
}

export function getComponentByWebSource(customDashboardState, webSource, metric?, family?, key?) {
    const _metric = metric || customDashboardState.widget.metric;
    const _family = family || customDashboardState.widget.family;
    const _metricProperties = widgetSettings.getMetricProperties(_metric, _family);
    return webSource === "MobileWeb"
        ? _metricProperties.mobileWebComponent || _metricProperties.component
        : _metricProperties.componentFunction
        ? _metricProperties.componentFunction({ webSource, metric, family, key })
        : _metricProperties.component;
}

export function getMetricProperties(metric, family) {
    return widgetSettings.getMetricProperties(metric, family);
}

export function getProductClaims() {
    return swSettings.components["ProductClaims"].resources;
}

export function getMetricWidgetTypes(metric, isCompare, customDashboardState) {
    const _metricGetDashboardWidgetTypes = widgetSettings.getMetric(metric).getDashboardWidgetTypes;
    const _widgetTypes: any = widgetSettings.getMetricWidgets(metric, isCompare);
    const _defaultWidgetTypes: any = getDefaultWidgetTypes();

    if (typeof _metricGetDashboardWidgetTypes === "function") {
        const _customMetricWidgetTypes = _metricGetDashboardWidgetTypes(
            customDashboardState,
            isCompare,
        );
        _customMetricWidgetTypes.forEach((type) => {
            const _dashboardType = widgetSettings.getWidgetDashboardType(type) || type;
            const _defaultType: any = _.find(_defaultWidgetTypes, { id: _dashboardType });
            if (_defaultType) {
                _defaultType.disabled = false;
                _defaultType.type = type;
            }
        });
    } else {
        for (const type in _widgetTypes) {
            const _dashboardType = widgetSettings.getWidgetDashboardType(type) || type;
            const _defaultType: any = _.find(_defaultWidgetTypes, { id: _dashboardType });
            const _isDefaultType = !_.isEmpty(_.find(_defaultWidgetTypes, { id: type }));
            if (!(_widgetTypes[_dashboardType] && !_isDefaultType)) {
                if (_defaultType) {
                    _defaultType.disabled = false;
                    _defaultType.type = type;
                }
            }
        }
    }

    const _result = _defaultWidgetTypes.map((type) => {
        if (
            metric === "EngagementVisits" &&
            !isCompare &&
            type.id === "PieChart" &&
            customDashboardState.widget.webSource !== "Total"
        ) {
            type.disabled = true;
        }
        return {
            id: type.id,
            type: type.type,
            order: type.order,
            text: type.title,
            disabled: type.disabled,
        };
    });

    return _result;
}

export function getDefaultWidgetTypes() {
    const defaultWidgetTypes = _.forEach(widgetSettings.getWidgetTypes(), (widgetType) => {
        widgetType.disabled = true;
    });
    return defaultWidgetTypes;
}

export function getWebsiteHeaderData(keys) {
    let _keys: any = [];
    keys.forEach((key) => {
        _keys.push(key.name);
    });
    _keys = _keys.join();
    const _url = `/api/WebsiteOverview/getheader?includeCrossData=true&mainDomainOnly=true&keys=${_keys}`;
    const fetchService = DefaultFetchService.getInstance();
    return fetchService.get<any>(_url);
}

export function getMetricWidgetFilters(metric, family, type, isCompare, customDashboardState) {
    const availableWidgetTypes = getMetricWidgetTypes(metric, isCompare, customDashboardState);
    if (typeof type === "object") {
        type = type.type;
    }

    const currentSelectedWidgetType: any = _.find(availableWidgetTypes, {
        type: type,
        disabled: false,
    });
    if (currentSelectedWidgetType) {
        type = currentSelectedWidgetType.type;
    } else {
        const firstTypeAvailable: any = _.find(availableWidgetTypes, { disabled: false });
        type = firstTypeAvailable.type;
    }

    if (type == "ComparedLine" && !customDashboardState.widget.comparedDuration) {
        type = "Graph";
    }
    const availableFilters = widgetSettings.getMetricWidgetFilters(metric, type, isCompare);
    if (customDashboardState.widget.comparedDuration) {
        if (availableFilters["timeGranularity"]) {
            delete availableFilters["timeGranularity"];
        }
    }

    if (
        family === "Website" &&
        ["WebDemographicsAge", "WebDemographicsGender"].indexOf(metric) === -1
    ) {
        availableFilters["includeSubDomains"] = [
            {
                id: "true",
                text: "Yes",
            },
            {
                id: "false",
                text: "No",
            },
        ];
    }

    return availableFilters;
}

export function getPeriodOverPeriodParams(family, metric, key, duration, component) {
    // PoP is allowed only if the metric supports it and the user have permission for it
    const metricHasPeriodOverPeriod = periodOverPeriodService.periodOverPeriodEnabledForMetric(
        metric,
        key.length > 1,
    );
    const comparedDurationItems = periodOverPeriodService.getPeriodOverPeriodDropdownItems(
        duration,
        key,
        component,
    );
    return {
        enabled: metricHasPeriodOverPeriod,
        items: comparedDurationItems,
    };
}

export function getFormElementsStatus(formElements, action, widget) {
    const _family = action.family || widget.family;
    const _metric = action.metric || widget.metric;
    const _isCompare = action.isCompare !== undefined ? action.isCompare : widget.key.length > 1;
    Object.keys(formElements).forEach((element) => {
        switch (element) {
            case "webSource":
                if (_family === "Mobile") {
                    formElements[element].isActive = false;
                } else {
                    formElements[element].isActive = true;
                }
                break;
            case "trafficChannels":
                if (action.metricProps.multipleChannelSupport && _isCompare) {
                    formElements[element].isActive = true;
                } else {
                    formElements[element].isActive = false;
                }
                break;
            default:
                formElements[element].isActive = true;
        }
    });
    return formElements;
}

export function getWidgetWidth(widgetType) {
    if (typeof widgetType === "string") {
        return widgetSettings.getDefaultWidgetSize(widgetType);
    } else {
        return widgetSettings.getDefaultWidgetSize(widgetType.type);
    }
}

export function isMetricMetaDataNeeded(metric, family) {
    const _metricProps = getMetricProperties(metric, family);
    return _metricProps.dynamicSettings;
}
