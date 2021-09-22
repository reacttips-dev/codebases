import { Injector } from "common/ioc/Injector";
import * as _ from "lodash";
import { Highcharts } from "libraries/reactHighcharts";
import { TableWidget } from "./TableWidget";
import "highcharts/modules/map";
import { CHART_COLORS } from "../../../constants/ChartColors";
import { getWidgetCTATarget } from "components/widget/widgetUtils";

export interface geoDataItem {
    hc_key: string;
    value: number;
}

export class WWOGeographyWidget extends TableWidget {
    static $inject = ["$filter"];
    private _$filter;
    private highchartsConfig: Highcharts.MapOptions;

    /**
     * See JIRA SIM-32273 for more details: we want to remove "add to dashboard" button
     * from this widget when it appears on the website performance (traffic-overview) page,
     * on every package, besides the websiteResearch package (legacy)
     */
    public hideAddToDashboard: boolean;

    static getWidgetMetadataType() {
        return "Table";
    }

    static getWidgetResourceType() {
        return "Table";
    }

    constructor() {
        super();
    }
    private isWorldwideOverview() {
        const Store: any = Injector.get("$swNgRedux");
        const { routing } = Store.getState();
        return routing.currentPage === "websites-worldwideOverview";
    }
    getProperties(clone = false) {
        // dashboard should show only worldwide
        if (this.isWorldwideOverview()) {
            this._widgetConfig.properties.country = 999;
        }
        return clone ? _.cloneDeep(this._widgetConfig.properties) : this._widgetConfig.properties;
    }
    initWidget(widgetConfig, context) {
        const [targetState, isSameModule] = getWidgetCTATarget(
            "websites-audienceGeography",
            ["marketresearch", "digitalmarketing"],
            this._swNavigator,
        );
        this.viewOptions.hook = {
            component: "WsWebGeography",
            hookModal: "WebMarketAnalysisOverviewHomepage",
        };
        this.viewOptions.link = this._swNavigator.href(targetState, this._swNavigator.getParams());
        this.viewOptions.target = isSameModule ? "_self" : "_blank";
        this.viewOptions.ctaButtonTracking = `${widgetConfig.properties.trackName}/${this._$filter(
            "i18n",
        )(widgetConfig.properties.options.ctaButton)}`;
        super.initWidget(widgetConfig, context);
        this.hideAddToDashboard = widgetConfig?.properties?.hideAddToDashboard ?? false;
    }
    callbackOnGetData(response: any) {
        this.runProfiling();

        const countryById = this._$filter("countryById");
        const highchartsMapData: geoDataItem[] = response.Data.map((item) => ({
            "hc-key": countryById(item.Country).code,
            value: item.Share,
        }));

        this.highchartsConfig = this.getHighchartsConfig();
        this.highchartsConfig.series[0].data = highchartsMapData;

        super.callbackOnGetData(response);

        this.legendItems = _.map(this.getLegendItems(), (legend) =>
            Object.assign({}, legend, { smallIcon: true }),
        );
    }

    setMetadata() {
        super.setMetadata();
    }

    onResize() {
        super.onResize();
    }

    validateData(response: any) {
        return super.validateData(response);
    }

    private getHighchartsConfig() {
        let widget = this;
        return {
            chart: {
                height: 280,
                events: {
                    load: function () {
                        let chart = this;
                        setTimeout(function () {
                            //fix for chart width
                            try {
                                chart.reflow();
                            } catch (e) {}
                        }, 100);
                    },
                },
            },

            colorAxis: { min: 0, maxColor: CHART_COLORS.map },

            credits: { enabled: false },

            legend: { enabled: false },

            exporting: { enabled: false },

            title: { text: null },

            tooltip: {
                useHTML: true,
                style: {
                    fontSize: "12px",
                    fontFamily: "'Roboto', sans-serif",
                    color: "#707070",
                },
                formatter: function () {
                    return `<span>
                                    <div class="u-bold">${this.point.name}</div>
                                    <div>
                                        ${this.series.name}: <span class="u-bold">${widget._$filter(
                        "percentagesign",
                    )(this.point.value, 2)}</span>
                                    </div>
                                </span>`;
                },
            },

            series: [
                {
                    mapData: Highcharts["maps"]["custom/world-lowres"],
                    name: widget._$filter("i18n")("analysis.single.trafficsource.overview.title"),
                    states: {
                        hover: {
                            borderWidth: 2,
                        },
                    },
                },
            ],
        };
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/wwogeography.html`;
    }

    getTitleTemplate() {
        return "/app/components/widget/containers/widget-custom-title.html";
    }

    public getTitleIcon() {
        return "desktop";
    }

    getWidgetModel() {
        let widgetModel = super.getWidgetModel();
        widgetModel.type = "Table";
        return widgetModel;
    }
}

WWOGeographyWidget.register();
