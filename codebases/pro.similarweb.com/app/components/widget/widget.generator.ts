import angular from "angular";
import { swSettings } from "common/services/swSettings";
import dayjs from "dayjs";

export interface IWidgetTemplateService {
    generateWidgetTemplate(metric: string, pos: any, properties: any, key: any, flags: any);
}

angular.module("sw.common").service("widgetTemplateService", function (): IWidgetTemplateService {
    const getMetricCompoenet = function (metric) {
        const metricComponent = swSettings.widgets.metrics[metric].properties.component;
        return swSettings.components[metricComponent];
    };

    const getMetricDefaultParams = function (metric) {
        const metricFamily = swSettings.widgets.metrics[metric].properties.family;

        const componentDefaultParams = getMetricCompoenet(metric).defaultParams;
        return {
            metric: metric,
            family: metricFamily,
            country: componentDefaultParams.country,
            duration: componentDefaultParams.duration,
            filters: {},
        };
    };

    return {
        generateWidgetTemplate: function (
            metric: string,
            pos: any,
            properties: any,
            key: any,
            flags: any,
        ) {
            //Define min/max data window if available
            if (getMetricCompoenet(metric).resources.WindowInterval) {
                let componentMonthsWindow, componentFullWindow, from, to;
                const componentMaxMonthsWindow = getMetricCompoenet(metric).resources
                        .SnapshotInterval.count,
                    componentWindowUnits = getMetricCompoenet(metric).resources.SnapshotInterval
                        .units;
                if (componentMaxMonthsWindow < 6 || componentWindowUnits == "Day") {
                    componentMonthsWindow = 1;
                    componentFullWindow = 3;
                } else if (componentMaxMonthsWindow >= 6 && componentMaxMonthsWindow < 12) {
                    componentMonthsWindow = 3;
                    componentFullWindow = 6;
                } else if (componentMaxMonthsWindow >= 12 && componentMaxMonthsWindow < 24) {
                    componentMonthsWindow = 6;
                    componentFullWindow = 12;
                } else if (componentMaxMonthsWindow >= 24) {
                    componentMonthsWindow = 12;
                    componentFullWindow = 24;
                }

                switch (flags && flags.duration) {
                    case "max-last-period":
                        properties.duration = componentMonthsWindow + "m";
                        properties.titleTemplate = "i18nKeyDurationPrefix";
                        break;
                    case "max-period":
                        properties.duration = componentFullWindow + "m";
                        properties.titleTemplate = "i18nKeyDurationPrefix";
                        break;
                    case "max-last-before":
                        from = dayjs(getMetricCompoenet(metric).endDate._i)
                            .subtract(componentMonthsWindow * 2 - 1, "months")
                            .format("YYYY.MM");
                        to = dayjs(getMetricCompoenet(metric).endDate._i)
                            .subtract(componentMonthsWindow, "months")
                            .format("YYYY.MM");
                        properties.duration = from + "-" + to;
                        properties.titleTemplate = "i18nKeyDurationPrefix";
                        break;
                    default:
                        break;
                }
            }

            return {
                pos: Object.assign(pos, {}),
                properties: Object.assign(getMetricDefaultParams(metric), properties, { key: key }),
            };
        },
    };
});
