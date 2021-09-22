import * as _ from "lodash";
/**
 * Created by olegg on 27-Oct-16.
 */
import { PageId } from "userdata";
import { Widget } from "components/widget/widget-types/Widget";
import { SwTrack } from "services/SwTrack";
import { isSalesIntelligenceAppsState } from "pages/sales-intelligence/helpers/helpers";

export type AgeMap = { range: string; name: string };

export const ageDefinitions: AgeMap[] = [
    {
        range: "18-24",
        name: "app.demographics.genz",
    },
    {
        range: "25-34",
        name: "app.demographics.millenials",
    },
    {
        range: "35-54",
        name: "app.demographics.genx",
    },
    {
        range: "55+",
        name: "app.demographics.baby",
    },
];

export interface IAlsoUsedApp {
    Affinity: number;
    AppId: string;
    AppName: string;
    Icon: string;
    Url?: string;
}

export class AverageUserWidget extends Widget {
    static getWidgetMetadataType() {
        return "AppDemographicsAverageUser";
    }

    static getWidgetResourceType() {
        return "SingleMetric";
    }

    static $inject = ["stateService", "$filter"];

    constructor() {
        super();
    }

    protected _stateService;
    _$filter: any;

    protected appDemographicsPage: PageId = {
        section: "apps",
        subSection: "audience",
        subSubSection: "demographics",
    };

    protected appDemographicsSalesPage: PageId = {
        section: "sales-apps",
        subSection: "audience",
        subSubSection: "demographics",
    };

    protected setMetadata() {}

    protected validateData(response: any): boolean {
        return true;
    }

    callbackOnGetData(response: any) {
        this.runProfiling();
        const widget = this;
        // should be implemented on each of the extending classes
        widget.data = response.Data;
        widget.data.noAgeName = _.isEmpty(widget.data.AgeGroup);

        if (!widget.data.noAgeName) {
            widget.data.ageName = this._$filter("i18n")(
                _.find(ageDefinitions, (age: AgeMap) => {
                    return age.range == widget.data.AgeGroup;
                }).name,
            );
        }
        widget.data.noGender = _.isEmpty(widget.data.Gender);
        if (!widget.data.noGender) {
            widget.data.gender = widget.data.Gender.toLowerCase();
        }
        widget.data.noAlsoUsed = _.isEmpty(widget.data.AlsoUsed);
        if (!widget.data.noAlsoUsed) {
            const pageId = isSalesIntelligenceAppsState(this._swNavigator)
                ? this.appDemographicsSalesPage
                : this.appDemographicsPage;

            widget.data.AlsoUsed = _.map(widget.data.AlsoUsed, (app: IAlsoUsedApp) => {
                app.Url = this._stateService.buildItemUrl("app", app.AppId, [], "google", pageId);
                return app;
            });
        }

        const state = isSalesIntelligenceAppsState(this._swNavigator)
            ? "salesIntelligence-apps-appaudienceinterests"
            : "apps-appaudienceinterests";

        widget.data.audienceInterestLink = this._swNavigator.href(
            state,
            this._swNavigator.getParams(),
        );
    }

    onResize() {
        return;
    }

    trackAffinityApp(appName) {
        SwTrack.all.trackEvent("Internal Link", "click", `Apps Also uses/${appName}`);
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/average-user.html`;
    }

    static getAllConfigs(params) {
        const mode = params.key.length > 1 ? "compare" : "single";
        const apiController = "AppDemographics";
        const widgetConfig = AverageUserWidget.getWidgetConfig(params, apiController);
        const metricConfig = AverageUserWidget.getMetricConfig(apiController);
        return {
            widgetConfig,
            metricConfig: metricConfig.properties,
            metricTypeConfig: metricConfig[mode],
            apiController,
            viewOptions: widgetConfig.properties.options,
        };
    }

    static getWidgetConfig(params, apiController) {
        return {
            type: "AverageUser",
            async: true,
            properties: {
                ...params,
                family: "Mobile",
                metric: "AppDemographicsAverageUser",
                apiController,
                apiParams: {
                    metric: "AppDemographicsAverageUser",
                },
                type: "AverageUser",
                width: "12",
                height: "auto",
                loadingHeight: "112px",
                title: "appdemographics.average.user.title",
                options: {
                    showTitle: true,
                    showTitleTooltip: true,
                    titleType: "text",
                    showSubtitle: false,
                    showLegend: false,
                    showSettings: false,
                    showTopLine: false,
                    showFrame: true,
                    titleIcon: true,
                    titlePaddingBottom: "0",
                },
            },
        };
    }

    static getMetricConfig(apiController) {
        return {
            id: "AppDemographicsAverageUser",
            properties: {
                metric: "AppDemographicsAverageUser",
                title: "metric.demographics.title",
                tooltip: "appdemographics.average.user.title.tooltip",
                family: "Mobile",
                component: "AppAudienceDemographics",
                order: "0",
                dynamicSettings: true,
                disableDatepicker: true,
                state: "apps-demographics",
                apiController,
            },
            single: {
                properties: {},
            },
            compare: {},
        };
    }
}
