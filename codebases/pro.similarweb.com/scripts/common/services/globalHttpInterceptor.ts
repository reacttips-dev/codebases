import { swSettings } from "common/services/swSettings";
import { ProPageHeaders } from "../../../app/services/fetchService";
import angular from "angular";
import swLog from "@similarweb/sw-log";
/**
 * Created by dannyr on 06/04/2016.
 */
// register the interceptor as a service
class GlobalHttpInterceptor {
    private urlResolver;
    private swSettings = swSettings;
    constructor(private $q) {}

    request = (config) => {
        if (process.env.NODE_ENV === "development") {
            const { widgetId = null, ...restOfParams } = config.params || {};
            if (widgetId) {
                this.urlResolver =
                    this.urlResolver ||
                    require("components/dashboard/widget-wizard/tests/DashboardSpy")
                        .widgetUrlResolver;
                config.params = restOfParams;
                const resolverFn = this.urlResolver.get(widgetId);
                if (resolverFn) {
                    resolverFn(`${config.url}?${config.paramSerializer(restOfParams)}`);
                }
            }
        }
        config.headers = {
            ...config.headers,
            ...ProPageHeaders(),
        };
        return config;
    };

    response = (response) => {
        var versionHeader = response.headers("sw-version");
        if (versionHeader && this.swSettings.version && versionHeader !== this.swSettings.version) {
            //location.reload(true);
            //return false;
            swLog.warn("Client version mismatch");
        }
        return response;
    };

    responseError = (response) => {
        // handle logged out user
        const msg = `${response.config.method} [${response.config.url}] failed with error ${response.status}`;
        swLog.warn(msg);
        if (response.status === 401 || response.status === 403) {
            if (response.headers("SW-AuthNeedRefresh") === "true") {
                swLog.serverLogger(msg + " with refresh header", null, "Warn").then(() => {
                    location.reload();
                });
            } else {
                swLog.serverLogger(msg + " without refresh header", null, "Warn");
            }
        }
        return this.$q.reject(response);
    };
}

angular.module("sw.common").factory("globalHttpInterceptor", ($q) => {
    return new GlobalHttpInterceptor($q);
});
