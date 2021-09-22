import { colorsPalettes } from "@similarweb/styles";
import swLog from "@similarweb/sw-log";
import angular from "angular";
import { swSettings } from "common/services/swSettings";
import _ from "lodash";
import dayjs from "dayjs";
import { reorderDedupCompareData } from "pages/website-analysis/components/dedupGraphConfig";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { ChartMarkerService } from "services/ChartMarkerService";
import { i18nFilter } from "../../../filters/ngFilters";
import { SWItem, Widget } from "./Widget";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export const dateToUTC = (dateString) => {
    const date = dateString.split("-");
    return Date.UTC(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]));
};

export abstract class ChartWidget extends Widget {
    protected _ngHighchartsConfig;
    protected _pngExportService;
    protected _$filter;
    protected mobileWebAlgoChangeDate;
    public _swSettings = swSettings;
    protected selectedTab;

    public chartConfig: any = {};
    public static $inject = ["ngHighchartsConfig", "pngExportService", "$filter"];

    public static getWidgetMetadataType() {
        return "Graph";
    }

    protected getPlotLineBaseConfig() {
        return {
            width: 1,
            dashStyle: "Dash",
            left: 12,
            label: {
                useHTML: true,
                x: -10,
                y: 3,
                rotation: 0,
                verticalAlign: "bottom",
            },
        };
    }

    protected getPlotLinePartialDataConfig() {
        return _.merge({}, this.getPlotLineBaseConfig(), {
            color: colorsPalettes.carbon["200"], // partial data tooltip
            zIndex: 5,
            id: "plotLine-partial-data",
            label: {
                text:
                    // eslint-disable-next-line max-len
                    '<i id="sw-chart-infotip-popup" class="swHeader-tooltip scss-tooltip scss-tooltip--se partial-data-infotip" data-scss-tooltip="Daily data is available starting October 2015" tooltip-trigger="click" tooltip-class="sw-chart-infotip" tooltip-placement="top" tooltip-append-to-body="true">i</i>',
            },
        });
    }

    protected getPlotLineDefaultConfig(data, date, message) {
        if (data.length === 0) {
            return {};
        }
        const tooltipMessage = message || i18nFilter()("custom.tooltip.defaultText");
        const tooltipTemplate = `
        <span class="mobileweb-algorithm-marker">
            <div
                id="custom-tooltip"
                class="mobileweb-algorithm ${`mobileweb-algorithm--${
                    this._ngHighchartsConfig.positionToolipLeftComplex(data, date)
                        ? "left"
                        : "right"
                }`}">
                    <div class="mobile-algorithm-date">${dayjs(date).format(
                        "dddd, MMM DD, YYYY",
                    )}</div>
                    <div class="mobile-algorithm-text">${tooltipMessage}</div>
            </div>
        </span>
        `;

        return _.merge({}, this.getPlotLineBaseConfig(), {
            color: colorsPalettes.carbon["100"], // Mobile web algorithm change tooltip
            id: "plotLine-mw-algochange",
            zIndex: 5,
            label: {
                text: tooltipTemplate,
            },
        });
    }

    /**
     *
     * @param {Object[]} plotLinesDates - array of dates confs
     * @param {string} plotLinesDates.date - date
     * @param {function} [plotLinesDates.tooltipCb] - tooltip function
     * @param {string} [plotLinesDates.tooltipMsg] - tooltip custom message
     * @param {*} data
     *
     * @returns {Object[]}
     */
    protected getPlotLinesConfig(plotLinesDates, data) {
        if (!plotLinesDates || !plotLinesDates.length) {
            return [];
        }

        return plotLinesDates.reduce((acc, value) => {
            acc.push(
                Object.assign(
                    {
                        // in case if we get UTC formatted
                        value: +value.date === value.date ? value.date : dateToUTC(value.date),
                    },
                    _.isFunction(value.tooltipCb)
                        ? value.tooltipCb(data, value.date, value.tooltipMsg)
                        : this.getPlotLineDefaultConfig(data, value.date, value.tooltipMsg),
                ),
            );

            return acc;
        }, []);
    }

    /**
     * The same as getPlotLinesConfig but without tooltip
     */
    protected getPlotLinesExportConfig(plotLinesDates, data) {
        return this.getPlotLinesConfig(plotLinesDates, data).map((conf) => {
            conf.label = undefined;

            return conf;
        });
    }

    protected getNewDataTooltips() {
        // to show only for mobile and all traffic
        if (this.apiParams.webSource === "Desktop") {
            return [];
        }

        const country = this._params.country;
        const component = this._swSettings.current.componentId;
        const countriesDates = _.get(
            this._swSettings,
            `components.${component}.resources.CountriesNewMobileDataDates`,
            "{}",
        );

        let newDataDates;

        try {
            newDataDates = JSON.parse(countriesDates);
        } catch (e) {
            newDataDates = {};
        }

        return newDataDates[country]
            ? newDataDates[country].map((date) => {
                  return {
                      date,
                      tooltipMsg: i18nFilter()("custom.tooltip.mobileWebdataAdd"),
                  };
              })
            : [];
    }

    protected getPlotLineIndicators() {
        this.mobileWebAlgoChangeDate = this._swSettings.getDataIndicators("MOBILE_WEB_ALGO_CHANGE");
        const apiParams = this.apiParams;
        const viewOptions = this.viewOptions;
        const hasPartialData = this.hasPartialData(viewOptions, apiParams);
        const indicators = [];

        if (viewOptions.plotLineIndicator && apiParams.webSource !== "Desktop") {
            indicators.push({
                date: this.mobileWebAlgoChangeDate,
                tooltipCb: this.getPlotLineDefaultConfig.bind(this),
            });
        }

        if (hasPartialData) {
            indicators.push({
                date: this.viewOptions.dailyDataSince,
                tooltipCb: this.getPlotLinePartialDataConfig.bind(this),
            });
        }

        return indicators.concat(this.getNewDataTooltips());
    }

    public static getWidgetResourceType() {
        return "Graph";
    }

    constructor() {
        super();
    }

    protected sortSeries(series = []) {
        return series.sort((item1, item2) => {
            const d1 = dayjs.utc(item1.Key, "YYYY-MM-DD");
            const d2 = dayjs.utc(item2.Key, "YYYY-MM-DD");
            if (d1.isValid() && d2.isValid()) {
                return d1.diff(d2);
            } else {
                return -1;
            }
        });
    }

    protected formatSeries(obj) {
        obj = Array.isArray(obj) ? this.sortSeries(obj) : obj; // fixes #SIM-15213

        return _.map(obj, (item: { Key: any; Value: any }) => {
            if (!item) {
                swLog.warn("Empty result : " + obj);
                return;
            }
            if (isNaN(parseFloat(item.Value))) {
                item.Value = null;
            }
            return [dateToUTC(item.Key), item.Value];
        });
    }

    // For UI - start graph from specific point instead of having zero value
    public static zeroToNull(arr, startDate) {
        const tempArr: any = _.cloneDeep(arr);
        for (let i = 0; i < tempArr.length; i++) {
            if (tempArr[i].Key === startDate) {
                return tempArr;
            }
            tempArr[i].Value = null;
        }
        return arr;
    }

    protected hasPartialData(widgetViewOptions, apiParams) {
        if (
            widgetViewOptions.dailyDataSince &&
            apiParams.webSource !== "Desktop" &&
            apiParams.timeGranularity === "Daily"
        ) {
            return true;
        }

        return false;
    }

    protected getSeriesName(seriesName) {
        const _metricConfigSeriesName =
            this._metricTypeConfig &&
            this._metricTypeConfig.objects &&
            this._metricTypeConfig.objects[seriesName] &&
            this._metricTypeConfig.objects[seriesName].displayName;
        if (seriesName === "Paid Referrals") {
            return "Display Ads";
        } else if (seriesName === "MobileWeb") {
            return "Mobile Web";
        } else if (_metricConfigSeriesName) {
            return _metricConfigSeriesName;
        }
        return seriesName;
    }

    protected getChartSeries(unorderedData: any, compareItemsKeys: string[] = null): any[] {
        let series = [];
        const widgetViewData = this.viewData;
        const widgetViewOptions = this.viewOptions;

        const compare = widgetViewData.key.length > 1;
        if (this.selectedTab === "DedupUniqueUsers" && !compare) {
            widgetViewOptions.forceSetupColors = true;
            widgetViewOptions.widgetColorsFrom = "DeduplicatedAudience";
        }

        let chartColors;
        let selectionColor;
        const keysDataVerification: any = {};

        if (widgetViewOptions.forceSetupColors) {
            chartColors = this._ngHighchartsConfig.chartColors(
                widgetViewOptions.twoColorMode,
                widgetViewOptions.forceSetupColors,
                widgetViewOptions.widgetColorsFrom,
            );
        } else if (widgetViewOptions.audienceOverviewColors) {
            chartColors = this._ngHighchartsConfig.audienceOverviewColors();
        } else if (widgetViewOptions.newColorPalette) {
            chartColors = this._ngHighchartsConfig.newColorPaletteColors();
        } else {
            chartColors = this._ngHighchartsConfig.chartColors(widgetViewOptions.twoColorMode);
        }

        const isApp = widgetViewData.family === "Mobile";
        compareItemsKeys =
            compareItemsKeys ||
            _.map(widgetViewData.key, function (key: SWItem) {
                return key.isVirtual ? "*" + key.name : key.id || key.category || key.name;
            });

        const widgetMetadataType = this.getClass().getWidgetMetadataType();
        let sortByValue;

        for (let i = 0; i < compareItemsKeys.length; i++) {
            const key = compareItemsKeys[i];
            const widgetColors =
                this.viewOptions.widgetColors && !this.viewOptions.forceSetupColors
                    ? this._ngHighchartsConfig[this.viewOptions.widgetColors](
                          Object.keys(unorderedData[key]).toString(),
                      )
                    : null;
            const widgetIcons = this.viewOptions.widgetIcons
                ? this._ngHighchartsConfig[this.viewOptions.widgetIcons](
                      Object.keys(unorderedData[key]).toString(),
                  )
                : null;
            const seriesColors =
                widgetMetadataType === "BarChart"
                    ? widgetColors || angular.copy(chartColors)
                    : widgetColors || chartColors;

            const seriesIcons = widgetIcons || [];

            let dataArrays;
            if (this.selectedTab === "DedupUniqueUsers" && compare) {
                dataArrays = reorderDedupCompareData(unorderedData[key]);
            } else {
                dataArrays = unorderedData[key];
            }
            //Remove isGAVerified flag if exists.
            if (dataArrays && dataArrays.hasOwnProperty("isGAVerified")) {
                keysDataVerification[key] = dataArrays.isGAVerified;
                delete dataArrays.isGAVerified;
            }
            //Remove isGAPrivate flag if exists.
            if (dataArrays && dataArrays.hasOwnProperty("isGAPrivate")) {
                delete dataArrays.isGAPrivate;
            }
            if (!dataArrays) {
                seriesColors.shift();
            }
            selectionColor = widgetViewOptions.selectionColors
                ? _.find(this.legendItems, { id: key })["color"]
                : undefined;

            _.forEach(dataArrays, (seriesArray, seriesName) => {
                seriesName = this.getSeriesName(seriesName);
                const seriesColor = selectionColor || seriesColors.shift();
                const seriesIcon = seriesIcons.shift();
                const symbolUrl = ChartMarkerService.createMarkerStyle(seriesColor).background;
                let multipleKeys;
                if (this.selectedTab === "DedupUniqueUsers" && compare) {
                    multipleKeys = false;
                }
                // SIM-31769 - later in the code there is a condition for this, in order to minimize blast radius hardcoding it here.
                else if (this.type === "WWOTopAdNetwork") {
                    multipleKeys = true;
                } else if (Object.keys(unorderedData[key]).length > 1) {
                    multipleKeys = true;
                } else {
                    multipleKeys = false;
                }
                let siteAppName = isApp
                    ? _.result<string>(_.find(widgetViewData.key, { id: key }), "name")
                    : key;
                const zIndex = seriesName === "Desktop" ? 2 : 1;
                let optionalLegendIndex; //used to reverse legend in gender pie
                let seriesItemConfig = {};
                try {
                    seriesItemConfig =
                        (this._widgetConfig.properties.chartOptions &&
                            this._widgetConfig.properties.chartOptions.seriesItemConfig) ||
                        {};
                } catch (e) {}

                //Get custom asset name from uniqueId
                if ((this.getWidgetModel().family as string) === "Industry") {
                    if (UserCustomCategoryService.getCustomCategoryById(siteAppName as string)) {
                        siteAppName = UserCustomCategoryService.getCustomCategoryById(
                            siteAppName as string,
                        ).name;
                    }
                } else if ((this.getWidgetModel().family as string) === "Keyword") {
                    if (keywordsGroupsService.findGroupById(siteAppName)) {
                        siteAppName = keywordsGroupsService.findGroupById(siteAppName).Name;
                    }
                }

                if (_.isArray(seriesArray[0])) {
                    sortByValue = "data[0][1]";
                    angular.forEach(seriesArray, (subSeriesArray, subSeriesIndex) => {
                        const algorithm = subSeriesIndex === 0 ? "Old Algorithm" : "New Algorithm";
                        series.push(
                            angular.merge(
                                {
                                    name: `${
                                        multipleKeys
                                            ? seriesName.replace(/\b(\w)/g, (fullMatch, capture) =>
                                                  capture.toUpperCase(),
                                              )
                                            : siteAppName
                                    }`,
                                    showInLegend: subSeriesIndex === 0,
                                    color: seriesColor,
                                    seriesName,
                                    iconClass: seriesIcon,
                                    marker: {
                                        symbol: symbolUrl,
                                    },
                                    data: this.formatSeries(subSeriesArray),
                                    zIndex,
                                    isGAVerified: keysDataVerification[key],
                                },
                                seriesItemConfig,
                            ),
                        );
                    });
                } else {
                    sortByValue = "y";
                    optionalLegendIndex = this.getLegendIndex(seriesName, widgetViewOptions);
                    series.push(
                        Object.assign(
                            {
                                name: multipleKeys ? seriesName : siteAppName,
                                seriesName,
                                color: seriesColor,
                                iconClass: seriesIcon,
                                marker: {
                                    symbol: symbolUrl,
                                },
                                data: this.formatSeries(seriesArray),
                                y: seriesArray,
                                zIndex,
                                isGAVerified: keysDataVerification[key],
                            },
                            optionalLegendIndex,
                            seriesItemConfig,
                        ),
                    );
                }
            });
        }
        // sorts series for single app according to series name and restores colors
        if (widgetViewOptions.sortColors == true && compareItemsKeys.length == 1) {
            series = _.sortBy(series, "name");
            let colors = this._ngHighchartsConfig.chartColors();
            if (widgetViewOptions.forceSetupColors && widgetViewOptions.widgetColorsFrom) {
                colors = this._ngHighchartsConfig.chartColors(
                    false,
                    true,
                    widgetViewOptions.widgetColorsFrom,
                );
            }
            series.map((seriesItem, index) => {
                seriesItem.color = colors[index];
                seriesItem.marker.symbol = ChartMarkerService.createMarkerStyle(
                    seriesItem.color,
                ).background;
                return seriesItem;
            });
        }
        // Sort data - if requested (XML)
        if (widgetViewOptions.sortBy) {
            series = _.sortBy(
                series,
                widgetViewOptions.sortBy.toLowerCase() === "value"
                    ? sortByValue
                    : widgetViewOptions.sortBy,
            );
            if (!widgetViewOptions.sortAsc) {
                series = series.reverse();
            }
        }
        if (widgetMetadataType === "PieChart") {
            const seriesObj: any = {};
            seriesObj.name = compareItemsKeys[compareItemsKeys.length - 1];
            seriesObj.data = series;
            series = [];
            series.push(seriesObj);
        }
        return series;
    }

    protected getLegendIndex(seriesName, widgetViewOptions) {
        if (_.isEmpty(widgetViewOptions.legendConfig)) {
            return null;
        }
        if (_.isEmpty(widgetViewOptions.legendConfig.legendMap)) {
            return null;
        } else {
            return {
                legendIndex: _.find(widgetViewOptions.legendConfig.legendMap, (legendItem: any) => {
                    return legendItem.seriesName == seriesName;
                }).legendIndex,
            };
        }
    }

    protected validateData(data) {
        if (_.isFunction(this._widgetConfig.properties.validateData)) {
            return this._widgetConfig.properties.validateData(data);
        } else {
            return true;
        }
    }
}
