import * as _ from "lodash";
import { KeywordsGraphDashboardBaseWidget } from "./KeywordsGraphDashboardBaseWidget";
import { KeywordAnalysisDashboardWidgetFilters } from "../widget-filters/KeywordAnalysisDashboardWidgetFilters";
import { CHART_COLORS } from "constants/ChartColors";
import {
    IPptAreaChartRequest,
    IPptSlideExportRequest,
} from "services/PptExportService/PptExportServiceTypes";
import {
    getWidgetSubtitle,
    getWidgetTitle,
    getYAxisFormat,
} from "../widget-utilities/widgetPpt/PptWidgetUtils";
import { getAreaGraphWidgetPptOptions } from "../widget-utilities/widgetPpt/PptGraphWidgetUtils";

/**
 * Created by Eyal.Albilia on 2/9/2017.
 */
export class KeywordsGraphDashboardWidget extends KeywordsGraphDashboardBaseWidget {
    public isPptSupported = () => {
        return true;
    };

    public getDataForPpt = (): IPptSlideExportRequest => {
        return {
            title: getWidgetTitle(this),
            subtitle: getWidgetSubtitle(this, { showEntities: false }),
            type: "area",
            details: {
                format: getYAxisFormat(this),
                options: getAreaGraphWidgetPptOptions(this),
                // Format the data as if it was a line chart data
                data: this.getSeriesDataForPpt()
                    // filter out series data that are labeled as "Others".
                    // this data have no contribution to the graph, but cause rendering issues in the PPT graph
                    .filter((series) => series.seriesName !== "Others")
                    // Reverse the data, so that the ppt stacked graph will look similar to the graph in the pro platform.
                    .reverse(),
            } as IPptAreaChartRequest,
        };
    };

    static getWidgetMetadataType() {
        return "KeywordsGraphDashboard";
    }

    static getWidgetResourceType() {
        return "Graph";
    }

    static getWidgetDashboardType() {
        return "Graph";
    }

    static getFiltersComponent() {
        return KeywordAnalysisDashboardWidgetFilters;
    }

    constructor() {
        super();
    }

    protected updateLegendItems() {
        this.setUtilityData("legendItems", this.legendItems);
    }

    protected getSearchKey() {
        return "Domain";
    }

    protected getLegendResources(siteList) {
        let index = 0;
        return siteList.map((rootDomain) => {
            const item: any = {};
            this._sitesResource.GetWebsiteImage({ website: rootDomain }, function (data) {
                item.icon = data.image;
            });
            return Object.assign(item, {
                id: rootDomain,
                name: rootDomain,
                color: CHART_COLORS.chartMainColors[index],
                smallIcon: true,
                type: "Website",
                index: index++,
            });
        });
    }

    protected getChartSeries(unorderedData: any): any[] {
        this.shareType = this.apiParams.shareType || "RelativeShare";
        if (this.apiParams.sites) {
            unorderedData = this.mergeSubdomains(unorderedData);
        }

        const selectedSites = this.getDomainsOrderByShare(unorderedData);
        const totalSites = selectedSites.length - 1;

        this.legendItems = this.getLegendResources(selectedSites);
        this.updateLegendItems();
        let index = 0;
        return selectedSites.reverse().map((rootDomain) => {
            return {
                name: rootDomain,
                showInLegend: false,
                color: CHART_COLORS.chartMainColors[totalSites - index],
                seriesName: rootDomain,
                data: super.formatSeries(unorderedData[rootDomain][this.webSource][0]),
                marker: {
                    symbol: "circle",
                    lineWidth: 1,
                    color: CHART_COLORS.chartMainColors[index],
                },
                index: index++,
            };
        });
    }

    private getDomainsOrderByShare(unorderedData) {
        const orderedData = Object.keys(unorderedData)
            .map((domain) => {
                const totalShare = unorderedData[domain][this.webSource][0].reduce((acc, curr) => {
                    return acc + curr.Value["RelativeShare"];
                }, 0);
                return { domain, totalShare };
            })
            .sort((a, b) => (a.totalShare > b.totalShare ? -1 : 1));
        return orderedData.map((record) => {
            return record.domain;
        });
    }

    private mergeSubdomains(data) {
        const webSource = this.getWidgetModel().webSource;
        const mainDomains = this.getMainDomains(data);
        mainDomains.forEach((mainDomain, i) => {
            Object.keys(data).forEach((domain) => {
                if (domain !== mainDomain && domain.indexOf(mainDomain) > 0) {
                    this.mergeDomainsData(data[mainDomain], data[domain], webSource);
                    delete data[domain];
                }
            });
        });
        return data;
    }

    private getMainDomains(data) {
        return Object.keys(data).map((domain) => {
            const domainString: string = Object.keys(domain)[0];
            if (domainString.split(".").length === 1) {
                return domain;
            } else {
                return undefined;
            }
        });
    }

    private mergeDomainsData(mainDomain, subdomain, webSource) {
        mainDomain[webSource][0].forEach((dataPoint) => {
            dataPoint.Value[this.shareType] += (_.find(subdomain[webSource][0], {
                Key: dataPoint.Key,
            }) as any).Value[this.shareType];
        });
    }
}

KeywordsGraphDashboardWidget.register();
