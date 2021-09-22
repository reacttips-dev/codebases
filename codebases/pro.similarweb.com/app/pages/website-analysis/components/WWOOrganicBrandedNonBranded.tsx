import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { WidgetSubtitle } from "components/React/Widgets/WidgetsSubtitle";
import { TitleContainer } from "components/React/Widgets/WidgetsTop";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import ColorStack from "components/colorsStack/ColorStack";
import { WidgetFooter } from "components/widget/WidgetFooter";
import { CHART_COLORS } from "constants/ChartColors";
import { abbrNumberFilter, i18nFilter } from "filters/ngFilters";
import Chart from "components/Chart/src/Chart";
import * as _ from "lodash";
import {
    NoData,
    TableLoader,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import React, { useState } from "react";
import { ChartMarkerService } from "services/ChartMarkerService";
import { DefaultFetchService } from "services/fetchService";
import styled from "styled-components";

export const ComponentContainer = styled.div`
    padding: 24px;
`;

const EndPoint = "widgetApi/TrafficSourcesSearch/SearchBrandedKeywords/PieChart";
const TitleKey = "wwo.searchTraffic.organic.brandedVsNotBranded.title";
const MonthlyTimeGranularity = "Monthly";
const ToolTipKey = "wwo.searchTraffic.organic.brandedVsNotBranded.title.tooltip";
const mainColors = new ColorStack(CHART_COLORS.mobileWeb);
const CtaButtonText = "wwo.searchTraffic.organic.brandedVsNotBranded.cta.button";
const ButtonTrackingText = "wwo search traffic/branded non branded/ organic";

const pie = function (options, data) {
    const format = abbrNumberFilter(),
        innerSize = "60%",
        size = "85%";
    let timeoutId = null;

    return {
        series: data,
        options: {
            credits: { enabled: false },
            chart: {
                type: "pie",
                animation: true,
                spacing: [0, 0, 0, 0],
                marginBottom: 0,
                marginTop: 10,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                backgroundColor: "transparent",
                height: 180,
                isDirtyLegend: true,
                isDirtyBox: true,
                events: {
                    // enable data labels on export: workaround for https://github.com/highslide-software/highcharts.com/issues/1562
                    load() {
                        if (this.options.chart.forExport) {
                            _.each(this.series, function (series) {
                                series.update(
                                    {
                                        dataLabels: {
                                            enabled: true,
                                        },
                                    },
                                    false,
                                );
                            });
                            this.redraw();
                        }
                        setTimeout(() => {
                            //fix for chart width
                            try {
                                this.reflow();
                            } catch (e) {}
                        }, 1000);
                    },
                },
            },
            title: { text: null },
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle",
                symbolWidth: 0,
                symbolRadius: 0,
                symbolHeight: 0,
                squareSymbol: false,
                itemMarginTop: 2,
                itemMarginBottom: 2,
                padding: 0,
                margin: 0,
                useHTML: true,
                itemStyle: {
                    cursor: "text",
                    color: "#2b3d52",
                    fontFamily: "Roboto, sans-serif",
                    zIndex: -1,
                    textOverflow: null,
                },
                x: -50,
                y: 0,
                labelFormatter() {
                    let itemMarkerClass;
                    itemMarkerClass = `item-marker-mobileweb ${this.iconClass}`;
                    return `<div class="pieChart-legend" title="${this.name}">
                                            <span class="legend-text">
                                                <span class="item-marker" style="background-image: ${
                                                    ChartMarkerService.createMarkerStyle(this.color)
                                                        .background
                                                };"></span>
                                                <span class="legend-name-branded">${
                                                    this.name
                                                }</span>
                                            </span>&nbsp<span class="legend-value">${
                                                options.format && options.format === "number"
                                                    ? abbrNumberFilter()(this.y, true)
                                                    : format(this.percentage, 2) + "%"
                                            }</span>
                                        </div>`;
                },
            },
            exporting: {
                enabled: false,
                chartOptions: {
                    chart: {
                        margin: [80, 150, 80, 150],
                        spacing: 10,
                    },
                    legend: {
                        enabled: true,
                        margin: 50,
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: true,
                            },
                        },
                    },
                },
            },
            tooltip: {
                formatter(): any {
                    if (options.format && options.format === "number") {
                        return this.key + "<br /><b>" + abbrNumberFilter()(this.y, true) + "</b>";
                    } else {
                        return this.key + "<br /><b>" + format(this.percentage, 2) + "%</b>";
                    }
                },
            },
            plotOptions: {
                pie: {
                    animation: true,
                    showInLegend: true,
                    allowPointSelect: true,
                    innerSize,
                    size,
                    shadow: false,
                    cursor: "pointer",
                    slicedOffset: 2,
                    dataLabels: {
                        enabled: false,
                        color: "#000000",
                        connectorColor: "#000000",
                        formatter() {
                            return (
                                "<b>" +
                                this.point.name +
                                "</b>: " +
                                format(this.percentage, 2) +
                                " %"
                            );
                        },
                    },
                    states: {
                        hover: {
                            halo: {
                                size: 7,
                                opacity: 0.25,
                            },
                        },
                    },
                },
                series: {
                    events: {
                        mouseOut() {
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                            }
                            timeoutId = setTimeout(function () {
                                $(".pieChart-legend").removeClass("front1 front2 back1 back2");
                            }, 500);
                        },
                    },
                },
            },
        }, // allow overriding any chart config setting.
    };
};

export const OrganicBrandedNonBranded = (props) => {
    const { queryParams, noDataState, setNoDataState, routingParams } = props;
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const setData = () => {
        const fetchService = DefaultFetchService.getInstance();
        const getParams = { ...queryParams, timeGranularity: MonthlyTimeGranularity };
        const visitsDataPromise = fetchService.get(EndPoint, getParams);
        visitsDataPromise.then(({ Data }) => parseResult(Data)).finally(() => setIsLoading(false));
    };
    React.useEffect(setData, [queryParams]);

    const parseResult = (result) => {
        const items = [
            {
                name: i18nFilter()("wwo.searchTraffic.organic.pie.branded"),
                y: result[queryParams.keys].Branded,
                color: mainColors.acquire(),
            },
            {
                name: i18nFilter()("wwo.searchTraffic.organic.pie.notBranded"),
                y: result[queryParams.keys].NoneBranded,
                color: mainColors.acquire(),
            },
        ];
        const data = [{ data: items, name: `${queryParams.keys}` }];
        const config = pie("", data);
        setResponse(config);
    };

    const isNoDataState = !response || Object.values(response).length === 0;
    const href = Injector.get<SwNavigator>("swNavigator").href("websites-trafficSearch-overview", {
        ...routingParams,
    });

    React.useEffect(() => {
        if (isNoDataState !== noDataState.BrandedNonBranded) {
            setNoDataState({
                ...noDataState,
                BrandedNonBranded: isNoDataState,
            });
        }
    }, [isLoading]);
    return (
        <div>
            <ComponentContainer style={{ padding: "24px" }}>
                <TitleContainer>
                    <BoxTitle tooltip={i18nFilter()(ToolTipKey)}>{i18nFilter()(TitleKey)}</BoxTitle>
                </TitleContainer>
                {isLoading ? (
                    <TableLoader />
                ) : isNoDataState ? (
                    <NoData paddingTop={"66px"} />
                ) : (
                    <div>
                        <WidgetSubtitle webSource={"Desktop"} />
                        <Chart type="pie" data={response.series} config={response.options} />
                        <WidgetFooter
                            href={href}
                            trackingLabel={ButtonTrackingText}
                            text={CtaButtonText}
                        />
                    </div>
                )}
            </ComponentContainer>
        </div>
    );
};
