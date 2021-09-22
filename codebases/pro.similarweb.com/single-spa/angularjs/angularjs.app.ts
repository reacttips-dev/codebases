import * as angular from "angular";
import * as Highcharts from "highcharts";
import * as Map from "highcharts/highmaps";
import swLog from "@similarweb/sw-log";
import singleSpaAngularJS from "./angularjsLifecycleManager";
import { legacyBootstrap } from "./legacyBootstrap";

declare global {
    interface Window {
        Highcharts: any;
        similarweb: any;
        i18n: any;
        jQuery: any;
        newrelic: any;
        runSWModule(options);
        trackManagementData?: any;
        GTM?: any;
    }
}

window.Highcharts = Highcharts;
window.Highcharts.Map = Map.mapChart;

function domElementGetter() {
    let el = document.getElementById("angularjs-app");
    if (!el) {
        el = document.createElement("div");
        el.id = "angularjs-app";
        document.body.appendChild(el);
    }
    return el;
}

const angularLifecycles = singleSpaAngularJS({
    angular,
    domElementGetter,
    mainAngularModule: "sw",
    uiRouter: true,
    preserveGlobal: true,
    appRemainsMounted: false,
    template: `
    <div ui-view><!-- sw-layout content appended here (unless you prevent the very first navigation --></div>
    <div>
        <!-- template down here will be included for every state even if you preventDefault the very first navigation,
             because its outside the the first ui-view
             99% chances that you don't need to include anything here, as sw-layout.html is probably good enough for your case.
        -->
        <sw-react component="AccessDeniedModal"></sw-react>
        <sw-react component="ContactUsModal"></sw-react>
    </div>
  `,
});

export const bootstrap = (opts, props) => {
    return new Promise<void>(async (resolve) => {
        try {
            if (!opts) {
                swLog.error("Bootstrap opts are empty");
            }
            await legacyBootstrap(opts);
            await import(/* webpackChunkName: "angular-scripts" */ "../../scripts");
            await import(/* webpackChunkName: "angular-app" */ "../../app");
            window.runSWModule(opts);
            resolve();
        } catch (e) {
            swLog.error("ERROR in bootstrap: ", e);
        }
    });
};

export const mount = (opts, props) => {
    return Promise.resolve().then(() => {
        $(".app-loader").remove();
        return angularLifecycles.mount(opts, props);
    });
};

export const unmount = [angularLifecycles.unmount];
