import React from "react";
import { colorsPalettes } from "@similarweb/styles";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { CHART_COLORS } from "../constants/ChartColors";
import angular from "angular";
import { ISWBarChart } from "./Bar";
import * as _ from "lodash";
import utils, {
    orderedTrafficSources,
    trafficSources as trafficSourcesDefinitons,
} from "Shared/utils";
import { colorsSets } from "@similarweb/styles";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { isAvailable } from "common/services/pageClaims";
import { swSettings } from "common/services/swSettings";
import { getWidgetCTATarget } from "components/widget/widgetUtils";
import { hasAccessToPackage } from "common/services/solutions2Helper";

angular
    .module("sw.charts")
    .factory(
        "MmxTrafficSourcesBar",
        (
            chosenSites,
            i18nFilter,
            channelTranslationService,
            Bar: new (...args: any[]) => ISWBarChart,
            swNavigator,
            $window,
        ) => {
            return class extends Bar implements ISWBarChart {
                private domains: string[];
                protected isCompare: boolean;
                private chartItemsInfo = $window["similarweb"].utils.volumesAndSharesSplited;
                private packageToTitle = {
                    digitalmarketing: "aquisitionintelligence.navbar.header",
                };

                constructor(private widget: any, options, data, dataFormat) {
                    super(
                        options,
                        utils.fillMissingTrafficSources(
                            data,
                            swNavigator.getParams().webSource === devicesTypes.MOBILE,
                        ),
                        dataFormat,
                    );
                    this.domains = this.widget.apiParams.keys.split(",");
                    this.isCompare = chosenSites.isCompare();
                }

                getColors() {
                    return Object.values(CHART_COLORS.trafficSourcesColorsBySourceMMX);
                }

                getCategories() {
                    // we don't care about overriding category values. we just want to make sure we have all the keys
                    const categoriesKeys = Array.from(
                        Object.values<any>(this.data).reduce((acc, current) => {
                            Object.keys(current.trafficSources).forEach((k) => acc.add(k));
                            return acc;
                        }, new Set([])),
                    );
                    const categories = categoriesKeys.map((key) => ({ key }));
                    return _.sortBy(categories, this.chartItemsInfo.sort).map(
                        (cat: { key: string }) => {
                            const key = cat.key;
                            const item = this.chartItemsInfo.order[key];
                            return {
                                key,
                                item,
                                title: i18nFilter(item?.title) || key,
                            };
                        },
                    );
                }

                private getRenderCategoryLabel() {
                    const options = this.options;
                    const webSource = this.webSource;
                    const packageToTitle = this.packageToTitle;

                    return function () {
                        const { key, item, title } = this.value;
                        let categoryHTML = title;

                        if (
                            item?.state &&
                            options.linkParams &&
                            !_.result(options, "viewOptions.disableLinks") == true
                        ) {
                            const packageName = swNavigator.getPackageName(swNavigator.current());
                            const [itemState, isSamePackage] = getWidgetCTATarget(
                                item.title === "utils.paidSearch" && packageName !== "legacy"
                                    ? "competitiveanalysis_website_paid_search_overview"
                                    : item.state,
                                [packageName],
                                swNavigator,
                            );
                            let href = `${swNavigator.href(
                                itemState,
                                options.linkParams,
                            )}?webSource=${swNavigator.getParams().webSource || webSource}`;
                            const itemPackage = swNavigator.getPackageName(itemState);
                            const itemStateConfigId = swNavigator.getConfigId(
                                itemState,
                                options.linkParams,
                            );
                            const itemLinkAvailable =
                                hasAccessToPackage(itemPackage) &&
                                isAvailable(swSettings.components[itemStateConfigId]);
                            if (item?.queryParams) {
                                href = `${href}&${item.queryParams}`;
                            }
                            const chosenTitle = i18nFilter((item && item.title) || key);
                            if (itemLinkAvailable) {
                                categoryHTML = ReactDOMServer.renderToString(
                                    <ChartLabelOpenNewWindowWrapper>
                                        <a
                                            href={href}
                                            data-ts-category={key}
                                            title={chosenTitle}
                                            {...(!isSamePackage && { target: "_blank" })}
                                        >
                                            {categoryHTML}
                                            {!isSamePackage && (
                                                <OpenNewWindowIcon iconName="open-new-window" />
                                            )}
                                        </a>
                                        {!isSamePackage && (
                                            <div className="PlainTooltip-element top chart-tooltip">
                                                <div className="Popup-content PlainTooltip-content">
                                                    {i18nFilter("widgets.chart.bar.label.openIn", {
                                                        title: i18nFilter(
                                                            packageToTitle[itemPackage],
                                                        ),
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </ChartLabelOpenNewWindowWrapper>,
                                );
                            }
                        }
                        return categoryHTML;
                    };
                }

                translateSourceText(source) {
                    return i18nFilter(trafficSourcesDefinitons[source].title);
                }

                getPointY(pointValue = 0, totalVisits) {
                    switch (this.dataFormat) {
                        case "percent":
                            if (!totalVisits) {
                                return null;
                            } else {
                                return 100 * (pointValue / totalVisits);
                            }
                        default:
                            return pointValue;
                    }
                }

                getSiteDataPoints = (domainName) => {
                    const { trafficSources, totalVisits } = this.data[domainName];

                    return {
                        name: domainName,
                        data: orderedTrafficSources
                            .filter((source) => trafficSources.hasOwnProperty(source))
                            .map((sourceName) => ({
                                key: this.translateSourceText(sourceName),
                                y: this.getPointY(trafficSources[sourceName], totalVisits),
                                color: chosenSites.isCompare()
                                    ? chosenSites.getSiteColor(domainName)
                                    : CHART_COLORS.trafficSourcesColorsBySourceMMX[sourceName],
                            })),
                    };
                };

                getCategoryDataPoints() {
                    const { text, id, trafficSources, totalVisits } = this.data.category;
                    if (_.isEmpty(trafficSources)) {
                        return [];
                    } else {
                        return [
                            {
                                name: i18nFilter(
                                    "workspace.marketing.arena.channels.overview.benchmark",
                                    { category: text.toString() },
                                ),
                                isCategorySeries: true,
                                id,
                                grouping: false,
                                zIndex: -1,
                                pointWidth: null,
                                pointRange: this.widget.getCategoryBarPointRange(),
                                pointPadding: 0.15,
                                maxPointWidth: null,
                                dataLabels: {
                                    enabled: false,
                                },
                                data: orderedTrafficSources
                                    .filter((source) => trafficSources.hasOwnProperty(source))
                                    .map((sourceName) => ({
                                        key: this.translateSourceText(sourceName),
                                        y: this.getPointY(trafficSources[sourceName], totalVisits),
                                        color: colorsSets.b3.toArray()[0],
                                        pointTooltipColor: "gray",
                                    })),
                            },
                        ];
                    }
                }

                getSeries(dataMode): any {
                    const sitesDataPoints = this.domains.map(this.getSiteDataPoints);
                    const categoryDataPoints = this.getCategoryDataPoints();
                    return [...sitesDataPoints, ...categoryDataPoints];
                }

                getChartConfig() {
                    const chartConfig = super.getChartConfig();

                    chartConfig.options.xAxis.labels.formatter = this.getRenderCategoryLabel();
                    chartConfig.options.tooltip.headerFormat =
                        "<span>{point.key.title}</span><br />";

                    if (chartConfig.series.length === 1) {
                        chartConfig.options.plotOptions.column.dataLabels.enabled = true;
                        chartConfig.options.tooltip.enabled = false;
                    } else {
                        chartConfig.options.plotOptions.column.dataLabels.enabled = false;
                        chartConfig.options.tooltip.enabled = true;
                    }

                    return chartConfig;
                }
            };
        },
    );

const ChartLabelOpenNewWindowWrapper = styled.div.attrs({
    className: "PlainTooltip-container",
})`
    .PlainTooltip-element {
        left: 50%;
        transform: translateX(-50%);
        min-width: 150px;
        max-width: 220px;
    }
`;

export const OpenNewWindowIcon = styled(SWReactIcons)`
    width: 1em;
    height: 1em;
    margin-left: 0.25em;
    display: inline-block;

    svg {
        fill: ${colorsPalettes.sky[500]};
    }
`;

export const htmlOpenNewWindowIcon = ReactDOMServer.renderToString(
    <OpenNewWindowIcon iconName="open-new-window" />,
);
