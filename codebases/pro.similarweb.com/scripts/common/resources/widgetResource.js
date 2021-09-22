import angular from "angular";
import * as _ from "lodash";

angular.module("sw.common").factory("widgetResource", function ($resource) {
    // Resource for website/apps widgets
    var websiteAppsResource = function (metric) {
        var endPointPrefix = "/api/WidgetKpis";
        var timeout = 300000;
        return $resource(
            "",
            {},
            {
                Settings: {
                    url: `${endPointPrefix}/${metric}/GetMetricMetaData`,
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            response.resource.Records = response.resource.Data;
                            return response.resource;
                        },
                    },
                },
                Table: {
                    url: `${endPointPrefix}/${metric}/GetTableData`,
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            // TODO: for backward compitability reasons
                            response.resource.Records = response.resource.Data;
                            return response.resource;
                        },
                    },
                },
                SingleMetric: {
                    url: `${endPointPrefix}/${metric}/GetSingleMetricData`,
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            return response.resource;
                        },
                    },
                },
                Graph: {
                    url: `${endPointPrefix}/${metric}/GetGraphData`,
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            return response.resource;
                        },
                    },
                },
                PieChart: {
                    url: `${endPointPrefix}/${metric}/GetPieChartData`,
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            return response.resource;
                        },
                    },
                },
                BarChart: {
                    url: `${endPointPrefix}/${metric}/GetPieChartData`,
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            return response.resource;
                        },
                    },
                },
            },
        );
    };

    // Resource for widgets based on componentId
    var resourceByController = function (componentId, metric) {
        var endPointPrefix = "/widgetApi/" + componentId;
        var timeout = 300000;
        return $resource(
            "",
            {},
            {
                Settings: {
                    url: endPointPrefix + "/" + metric + "/MetricMetaData",
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            return response.resource;
                        },
                    },
                },
                Table: {
                    url: endPointPrefix + "/" + metric + "/Table",
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            // TODO: for backward compitability reasons
                            response.resource.Records = response.resource.Data;
                            return response.resource;
                        },
                    },
                },
                Data: {
                    url: endPointPrefix + "/" + metric + "/Data",
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            // TODO: for backward compitability reasons
                            response.resource.Records = response.resource.Data;
                            return response.resource;
                        },
                    },
                },
                SingleMetric: {
                    url: endPointPrefix + "/" + metric + "/SingleMetric",
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            return response.resource;
                        },
                    },
                },
                Graph: {
                    url: endPointPrefix + "/" + metric + "/Graph",
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            return response.resource;
                        },
                    },
                },
                SwitchGraph: {
                    url: endPointPrefix + "/" + metric + "/SwitchGraph",
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            return response.resource;
                        },
                    },
                },
                PieChart: {
                    url: endPointPrefix + "/" + metric + "/PieChart",
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            return response.resource;
                        },
                    },
                },
                BarChart: {
                    url: endPointPrefix + "/" + metric + "/PieChart",
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            return response.resource;
                        },
                    },
                },
                GraphPOP: {
                    url: endPointPrefix + "/" + metric + "/GraphPOP",
                    method: "GET",
                    timeout: timeout,
                    cache: true,
                    interceptor: {
                        response: function (response) {
                            return response.resource;
                        },
                    },
                },
            },
        );
    };

    return {
        websiteAppsResource: websiteAppsResource,
        resourceByController: resourceByController,
    };
});
