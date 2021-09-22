import * as _ from "lodash";
declare const process: any;

import * as redux from "redux";
import * as React from "react";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import dashboardWizardReducer from "../reducers/dashboardWizardReducer";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import WebsiteSniffer from "./sniffers/WebsiteSniffer";
import KeywordSniffer from "./sniffers/KeywordSniffer";
import IndustrySniffer from "./sniffers/IndustrySniffer";
import autobind from "autobind-decorator";
import widgetSettings from "components/dashboard/WidgetSettings";

export const widgetUrlResolver = new Map();

const { createStore, applyMiddleware, combineReducers } = redux;

function createStoreForSniffer(metric) {
    const composeEnhancers = composeWithDevTools({
        name: metric.id,
    });
    return createStore<any, any, any, any>(
        combineReducers({ customDashboard: dashboardWizardReducer }),
        composeEnhancers(
            applyMiddleware(...[thunk]),
            // other store enhancers if any
        ),
    );
}

function modelsFromMetric(metric) {
    const store = createStoreForSniffer(metric);
    let metricSniffer;
    switch (metric.family) {
        case "Website":
            metricSniffer = new WebsiteSniffer(metric, store);
            break;
        case "Keyword":
            metricSniffer = new KeywordSniffer(metric, store);
            break;
        case "Industry":
            metricSniffer = new IndustrySniffer(metric, store);
            break;
    }
    return metricSniffer.getSingleModeModels();
}

function getAllModels(allMetics) {
    const promises = allMetics.map((metric) => modelsFromMetric(metric));
    return Promise.all(promises);
}

function getAllUrls(allModelsGroups) {
    const promises = allModelsGroups.map((modelsGroup) =>
        Promise.all(modelsGroup.map((model) => urlFromModel(model))),
    );
    return Promise.all(promises);
}

function urlFromModel(model) {
    const $rootScope = Injector.get("$rootScope") as any;
    const widgetFactoryService = Injector.get("widgetFactoryService") as any;
    const widget = widgetFactoryService.create({
        dashboardId: "PREVIEW",
        width: widgetSettings.getDefaultWidgetSize(model.type),
        properties: {
            ...model,
            autoFetchData: false,
        },
    });

    return new Promise((resolve) => {
        const widgetId = Date.now() + "_" + Math.random();
        widgetUrlResolver.set(widgetId, (internalUrl) => {
            widgetUrlResolver.delete(widgetId);
            resolve(internalUrl);
        });
        widget.apiParams = {
            widgetId,
        };
    });
}

async function loadAvailableDashboardModels(allMetics) {
    const allModels = await getAllModels(allMetics);
    const allUrls = await getAllUrls(allModels);
    const modelsAndUrls = allModels.map((modelGroup: any[], modelGroupIndex) =>
        modelGroup.map((model, modelIndex) => {
            return {
                model,
                url: allUrls[modelGroupIndex][modelIndex],
            };
        }),
    );

    return new Map(_.zip(allMetics, modelsAndUrls) as any);
}

function getSupportedMetricsList() {
    // TODO: create sniffers for the rest of families (Eran)
    const allMetics = widgetSettings
        .getWidgetMetrics()
        .map((metric) => ({
            ...metric,
            translatedText: i18nFilter()(metric.text),
        }))
        .filter(({ family, id }) => /Website|Keyword|Industry/.test(family));
    return allMetics;
}

function createModelsPromise() {
    const allMetrics = getSupportedMetricsList();
    return loadAvailableDashboardModels(allMetrics);
}

const MetricInfo = ({ metric, models, onCopy }) => {
    return (
        <div style={{ marginBottom: 50 }}>
            <h2>{`${metric.id} : ${metric.translatedText}`}</h2>
            {models.map(({ model, url }) => {
                const modelText = JSON.stringify(model);
                return (
                    <div key={url} style={{ border: "1px solid black", marginBottom: 20 }}>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: "bold" }}>
                                model :<button onClick={(e) => onCopy(modelText, e)}>copy</button>
                            </div>
                            <span>{modelText}</span>
                        </div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: "bold" }}>
                                url :<button onClick={(e) => onCopy(url, e)}>copy</button>
                            </div>
                            <span>{url}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default class DashboardSpy extends React.Component<any, any> {
    private textArea: HTMLTextAreaElement;

    constructor(props) {
        super(props);
        this.state = {
            allMetricsModels: null,
            renderedModels: [],
        };
    }

    @autobind
    renderAllModels() {
        const { allMetricsModels } = this.state;
        const renderedModels = [];
        allMetricsModels.forEach((models, metric) => {
            renderedModels.push(
                <MetricInfo
                    key={_.random(1, 100000)}
                    metric={metric}
                    models={models}
                    onCopy={this.onCopy}
                />,
            );
        });
        this.setState({
            renderedModels,
        });
    }

    @autobind
    onCopy(text, e) {
        const textField = document.createElement("textarea");
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        textField.remove();
    }

    @autobind
    saveToFile() {
        const { allMetricsModels } = this.state;
        const a = document.createElement("a");
        const blob = new Blob([JSON.stringify(allMetricsModels, null, 2)], {
            type: "application/json;charset=utf-8",
        });
        a.href = window.URL.createObjectURL(blob);
        a.download = "models.json";
        a.click();
    }

    @autobind
    async loadModels() {
        const allMetricsModels = await createModelsPromise();
        this.setState(
            {
                allMetricsModels,
            },
            () => {
                alert("done!");
            },
        );
    }

    render() {
        if (process.env.NODE_ENV === "development") {
            const { allMetricsModels, renderedModels } = this.state;
            const status = allMetricsModels ? "active" : "disabled";
            return (
                <div style={{ marginTop: 50 }}>
                    <h2
                        className="dashboard-border dashboard-title"
                        style={{ marginLeft: 0, marginBottom: 10 }}
                    >
                        snapshot testing (only in dev)
                    </h2>
                    <header style={{ display: "flex" }}>
                        <button
                            type="button"
                            className={`mdButton btn btn-primary active`}
                            onClick={this.loadModels}
                        >
                            load models
                        </button>
                        <button
                            type="button"
                            className={`mdButton btn btn-success ${status}`}
                            onClick={this.renderAllModels}
                            disabled={!allMetricsModels}
                        >
                            render models
                        </button>
                        <button
                            type="button"
                            className={`mdButton btn btn-success ${status}`}
                            onClick={this.saveToFile}
                            disabled={!allMetricsModels}
                        >
                            save to file
                        </button>
                    </header>
                    {renderedModels}
                </div>
            );
        } else {
            return null;
        }
    }
}
