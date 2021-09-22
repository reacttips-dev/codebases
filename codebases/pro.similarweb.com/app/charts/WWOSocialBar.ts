import angular, { IFilterService, IWindowService } from "angular";
import * as _ from "lodash";
import { CHART_COLORS } from "constants/ChartColors";

export interface ISWBarChart {
    data: any;
    options: any;
    colors: any;
    isCompare: boolean;
    getChartConfig(): any;
}

export interface mainSite {
    name: string;
    favicon?: string;
}

angular
    .module("sw.charts")
    .factory(
        "WWOSocialBar",
        (
            $filter: IFilterService,
            $window: IWindowService,
            Bar: new (options: any, data: any) => ISWBarChart,
        ) => {
            return class WWOSocialBar extends Bar {
                constructor(
                    public options: any = {},
                    public data: any = [],
                    private keys: string[],
                ) {
                    super(options, data);
                    this.isCompare = keys.length > 1;
                }

                protected getColors() {
                    if (this.isCompare) {
                        return CHART_COLORS.compareMainColors.slice();
                    } else {
                        return CHART_COLORS.chartMainColors.slice();
                    }
                }

                protected getSeries() {
                    let allData = [];
                    let self = this;
                    let mainSocialSites = this.getMainSocialSites();
                    //iterate for each compared site
                    _.forEach(this.keys, (key, i: number) => {
                        let siteData: any = _.find(self.data, { name: key });
                        let siteDataSeries = [];
                        if (siteData) {
                            let { data, name } = siteData;
                            let shareSum: number = 0;
                            let colorsIterator: number = 0;
                            //adding site name to every data item
                            let normalizedData: Array<Partial<{ name: string }>> = _.map(
                                data,
                                (item: any, siteName: string) => {
                                    return { ...item, name: siteName };
                                },
                            );

                            //evaluating data against the social dimensions of the main domain
                            _.forEach(mainSocialSites, (mainSite: mainSite) => {
                                let itemValue: number = null;
                                let dataForMainSiteInComparedSite = _.find(normalizedData, {
                                    name: mainSite.name,
                                });
                                if (dataForMainSiteInComparedSite) {
                                    itemValue = dataForMainSiteInComparedSite["Share"] * 100;
                                    shareSum += itemValue;
                                }
                                //others comes as the last item
                                if (mainSite.name !== "Others") {
                                    siteDataSeries.push({
                                        name: mainSite.name,
                                        favicon: mainSite.favicon,
                                        key: mainSite.name,
                                        y: itemValue,
                                        color: self.isCompare
                                            ? CHART_COLORS.compareMainColors[i]
                                            : CHART_COLORS.chartMainColors[colorsIterator++],
                                    });
                                } else {
                                    siteDataSeries.push({
                                        name: "Others",
                                        key: "Others",
                                        y: 100 - shareSum,
                                        color: CHART_COLORS.compareMainColors[i],
                                    });
                                }
                            });
                            allData.push({ name: name, data: siteDataSeries });
                        }
                    });
                    return allData;
                }

                private getMainSocialSites() {
                    let sites;
                    let mainDomain = this.keys[0];
                    let mainSiteData: any = _.find(this.data, { name: mainDomain });
                    if (mainSiteData) {
                        let { data } = mainSiteData;
                        sites = _.map(data, (item: any, siteName) => {
                            return { name: siteName, favicon: item.Favicon };
                        });
                        //order is important
                        sites.push({ name: "Others" });
                    }
                    return sites;
                }

                public getChartConfig() {
                    return _.merge(super.getChartConfig(), {
                        options: {
                            chart: {
                                marginLeft: 0,
                            },
                            yAxis: {
                                visible: false,
                            },
                        },
                    });
                }

                protected getCategories() {
                    let categories = _.map(this.getMainSocialSites(), (sites: any) => {
                        if (sites.name === "Others") {
                            return `<span class="widget-wwo-social website">${sites.name}</span>`;
                        } else {
                            return `<img src="${sites.favicon}" /><span class="widget-wwo-social website">${sites.name}</span>`;
                        }
                    });
                    return categories;
                }
            };
        },
    );
