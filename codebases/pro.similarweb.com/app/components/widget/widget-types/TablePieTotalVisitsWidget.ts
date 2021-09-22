import { TableWidget } from "./TableWidget";
export class TablePieTotalVisitsWidget extends TableWidget {
    protected _ngHighchartsConfig;
    protected _chosenSites;
    static $inject = ["ngHighchartsConfig", "chosenSites"];

    chartConfig: any = {};

    callbackOnGetData(response: any) {
        this.chartConfig = this._ngHighchartsConfig.pie(
            {
                type: "PieChart",
                height: "180px",
                isCompare: false,
                viewOptions: {
                    cssClass: "swTable--simple",
                    loadingSize: 5,
                    showTitle: true,
                    showTitleTooltip: true,
                    showSubtitle: true,
                    showLegend: false,
                    legendAlign: "right",
                    showFrame: true,
                    showSettings: false,
                    showTopLine: false,
                    titleType: "text",
                    twoColorMode: true,
                    dashboardSubtitleMarginBottom: 20,
                    widgetColors: "mobileWebColors",
                    widgetIcons: "mobileWebIcons",
                    isMobileOrDesktopOnly: true,
                },
            },
            [
                {
                    name: "",
                    data: response.Data.map((item) => {
                        return {
                            name: item.Domain,
                            color: this._chosenSites.getSiteColor(item.Domain),
                            y: item.SearchTotal,
                        };
                    }),
                },
            ],
            undefined,
        );
        this.chartConfig.options.legend = { enabled: false };
        this.chartConfig.options.tooltip = {
            formatter: function () {
                return this.key + "<br /><b>" + this.percentage.toFixed(2) + "%</b>";
            },
        };
        super.callbackOnGetData(response);
    }

    constructor() {
        super();
    }

    get templateUrl() {
        return `/app/components/widget/widget-templates/table-pie-totalvisits.html`;
    }

    getWidgetModel() {
        let widgetModel = super.getWidgetModel();
        widgetModel.type = "Table";
        return widgetModel;
    }
}
TablePieTotalVisitsWidget.register();
