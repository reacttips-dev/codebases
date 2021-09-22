import swLog from "@similarweb/sw-log";
import { isHidden, isLocked } from "common/services/pageClaims";
import { swSettings } from "common/services/swSettings";
import { IMetric } from "components/widget/widget-config/metrics/@types/IMetric";
import * as _ from "lodash";
import { createSelector } from "reselect";
import SWWidget from "../widget/widget-types/widget.reg";
import pagesConfig from "pages/website-analysis/config/page-config";
class WidgetSettings {
    get metrics() {
        return swSettings.widgets.metrics;
    }

    get metadata() {
        return swSettings.widgets.metadata;
    }

    get utilities() {
        return swSettings.widgets.utilities;
    }

    // @ts-ignore
    public widgetMetrics = createSelector(
        () => swSettings,
        (swSettings) => {
            return (Object.values(this.metrics) as IMetric[])
                .flatMap((metric: IMetric) => {
                    const res = [];
                    const component =
                        swSettings.components && swSettings.components[metric.properties.component]
                            ? swSettings.components[metric.properties.component]
                            : { isDisabled: true };
                    const _metricModules = metric.properties.modules;
                    if (_metricModules) {
                        for (const family in _metricModules) {
                            if (_metricModules[family].dashboard === "true") {
                                const isMetricHidden = _metricModules[family].isHidden
                                    ? _metricModules[family].isHidden(swSettings)
                                    : false;
                                if (!isMetricHidden) {
                                    const familyComponent =
                                        swSettings.components &&
                                        swSettings.components[_metricModules[family].component]
                                            ? swSettings.components[
                                                  _metricModules[family].component
                                              ]
                                            : { isDisabled: true };
                                    res.push({
                                        id: metric.id,
                                        text:
                                            _metricModules[family].title || metric.properties.title,
                                        family: _.capitalize(family),
                                        androidOnly: metric.properties.androidOnly === "true",
                                        isDisabled:
                                            familyComponent.isDisabled ||
                                            isLocked(
                                                swSettings.components[
                                                    _metricModules[family].availabilityComponent
                                                ],
                                            ) ||
                                            isHidden(
                                                swSettings.components[
                                                    _metricModules[family].availabilityComponent
                                                ],
                                            ),
                                    });
                                }
                            }
                        }
                    }

                    if (metric.properties.dashboard === "true") {
                        const isMetricHidden = metric.properties.isHidden
                            ? metric.properties.isHidden(swSettings)
                            : false;
                        if (!isMetricHidden) {
                            res.push({
                                id: metric.id,
                                text: metric.properties.title,
                                family: metric.properties.family,
                                androidOnly: metric.properties.androidOnly === "true",
                                isDisabled:
                                    component.isDisabled ||
                                    isLocked(
                                        swSettings.components[
                                            metric.properties.availabilityComponent
                                        ],
                                    ) ||
                                    isHidden(
                                        swSettings.components[
                                            metric.properties.availabilityComponent
                                        ],
                                    ),
                            });
                        }
                    }
                    return res;
                })
                .filter((metric) => !!metric);
        },
    ) as () => any[];

    public getWidgetMetrics() {
        return this.widgetMetrics();
    }

    public getMetricsForFamily(family) {
        return this.widgetMetrics().filter((metric) => metric.family === family);
    }

    public getWidgetTypes() {
        return _.map(this.metadata, (widget: any) =>
            Object.assign({}, widget, { type: widget.id }),
        ).filter((type: any) => type.dashboard);
    }

    public getWidgetUtilities(utilityGroups) {
        return _.forEach(utilityGroups, (utilityGroup) => {
            utilityGroup.utilities = utilityGroup.utilities
                .filter((utility) => utility)
                .map((utility) => {
                    return _.merge({}, this.utilities[utility.id], utility);
                });
        });
    }

    public getMetricWidgets(metric, compare) {
        return this.metrics[metric].widgets[compare ? "compare" : "single"];
    }

    public getWidgetClass(type) {
        const widgetClass = SWWidget[type + "Widget"];
        return widgetClass;
    }

    public getWidgetMetadataType(type) {
        return this.getWidgetClass(type) && this.getWidgetClass(type).getWidgetMetadataType();
    }

    public getWidgetResourceType(type) {
        return this.getWidgetClass(type).getWidgetResourceType();
    }

    public getWidgetDashboardType(type) {
        const widgetClass = this.getWidgetClass(type);
        if (widgetClass && _.isFunction(widgetClass.getWidgetDashboardType)) {
            return widgetClass.getWidgetDashboardType();
        } else {
            return null;
        }
    }

    public getWidgetMetadata(type) {
        const metadataType = this.getWidgetMetadataType(type);
        return this.metadata[metadataType];
    }

    public getMetricWidgetMetadata(metric, type, compare): any {
        if (!metric || !this.metrics.hasOwnProperty(metric)) {
            return {};
        }
        const _metricObj = this.metrics[metric].widgets[compare ? "compare" : "single"];
        let _metricWidgetMetaData = {};
        const metadataType = this.getWidgetMetadataType(type);
        try {
            _metricWidgetMetaData = _metricObj[metadataType];
            if (_metricWidgetMetaData === undefined && _metricObj["defaultType"]) {
                const _defaultType = _metricObj["defaultType"];
                _metricWidgetMetaData = _metricObj[_defaultType];
            }
        } catch (e) {}
        return _metricWidgetMetaData;
    }

    public getMetricWidgetType(metric, type, compare): any {
        if (!metric || !this.metrics.hasOwnProperty(metric)) {
            return {};
        }
        const _metricObj = this.metrics[metric].widgets[compare ? "compare" : "single"];
        let _metricWidgetMetaData = {};
        const metadataType = this.getWidgetMetadataType(type);
        try {
            _metricWidgetMetaData = _metricObj[metadataType];
            if (_metricWidgetMetaData === undefined && _metricObj["defaultType"]) {
                const _defaultType = _metricObj["defaultType"];
                return _defaultType;
            } else {
                return type;
            }
        } catch (e) {}
        return type;
    }

    public getWidgetSize(metric, type, compare) {
        const width = this.getDefaultWidgetSize(type);
        const properties = this.getMetricWidgetMetadata(metric, type, compare).properties;

        return properties && properties.width ? properties.width : width;
    }

    public getDefaultWidgetSize(type) {
        return this.getWidgetMetadata(type).width;
    }

    public getMetricWidgetFilters(metric, type, compare, forAPI?: boolean) {
        const metadata = this.getMetricWidgetMetadata(metric, type, compare);
        const filters = {};
        if (metadata) {
            if (forAPI) {
                _.forEach(metadata.filters, (filterOptions, filterName) => {
                    if (filterName != "timeGranularity") {
                        filters[filterName] = filterOptions.map((option, i) => {
                            return option.value;
                        });
                        filters[filterName] = filters[filterName][0];
                    }
                });
            } else {
                _.forEach(metadata.filters, (filterOptions, filterName) => {
                    filters[filterName] = filterOptions.map(function (option) {
                        return { id: option.value, text: option.title };
                    });
                });
            }
        }
        return filters;
    }

    public getMetricProperties(metric, module?) {
        let metricProps: any = {};
        if (!metric) {
            return metricProps;
        }
        metricProps = this.metrics[metric] ? _.clone(this.metrics[metric].properties) : {};
        //Check for module properties extension.
        if (
            metricProps.modules != undefined &&
            module &&
            metricProps.modules[module] != undefined
        ) {
            metricProps = Object.assign(metricProps, metricProps.modules[module]);
            //Check for module component extension.
            if (metricProps.modules[module].component) {
                metricProps = Object.assign(
                    metricProps,
                    swSettings.components[metricProps.modules[module].component],
                );
            }
        }
        return metricProps;
    }

    public getMetricId(metric) {
        if (!metric) {
            return "";
        }
        const _metric = this.metrics[metric];
        if (!_metric) {
            return "";
        }
        // allows metric to override the metric parameter which sent to the server
        return _metric.serverId ? _metric.serverId : _metric.id;
    }

    public getMetric(metric) {
        const _metric = this.metrics[metric] || "";
        return _metric;
    }

    public getPageWidgets(pageId, mode) {
        try {
            return { ...pagesConfig[pageId.replace(".", "_").toUpperCase()][mode] };
        } catch (e) {
            swLog.error("Error getting page widgets settings");
            return null;
        }
    }

    public getWidgetProperties(properties, metric) {
        const metricWidgetMetaData = this.getMetricWidgetMetadata(
            metric,
            properties.type,
            properties.key instanceof Array && properties.key.length > 1,
        );
        const widgetProperties = (metricWidgetMetaData && metricWidgetMetaData.properties) || {};
        return widgetProperties;
    }

    public getWidgetOptions(properties, metric) {
        const widgetProperties = this.getWidgetProperties(properties, metric);
        const metricWidgetMetaDataOptions = (widgetProperties && widgetProperties.options) || {};
        const options = _.merge({}, metricWidgetMetaDataOptions, properties.options);
        return options;
    }

    public getWidgetCustomApiParams(properties, metric) {
        const widgetProperties = this.getWidgetProperties(properties, metric);
        const metricWidgetMetaDataApiParams =
            (widgetProperties && widgetProperties.apiParams) || {};
        return metricWidgetMetaDataApiParams;
    }
}

export default new WidgetSettings();
