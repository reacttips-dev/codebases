import React from "react";
import ReactDOMServer from "react-dom/server";
import { colorsPalettes } from "@similarweb/styles";
import { percentageFilter, minVisitsAbbrFilter, i18nFilter } from "filters/ngFilters";
import { ChangeTooltip } from "@similarweb/ui-components/dist/chartTooltips";
import { TooltipContainer } from "./StyledComponents";

export const getChartConfig = (chartData, sitesOrder) => ({
    plotOptions: {
        venn: {
            borderColor: "white",
        },
        series: {
            cursor: "pointer",
            animation: false,
        },
    },
    series: [
        {
            data: chartData,
        },
    ],
    chart: {
        backgroundColor: "#F4F5F6",
    },
    tooltip: {
        shared: true,
        outside: true,
        useHTML: true,
        style: {
            fontFamily: "Roboto",
            margin: 0,
        },
        borderWidth: 0,
        borderRadius: "6px",
        boxShadow: `0 4px 4px 0 ${colorsPalettes.carbon[200]}`,
        formatter: (args) => {
            const { chart } = args;
            const { hoverPoint } = chart;
            const filteredSites = sitesOrder.filter((x) => hoverPoint.options?.sets.includes(x));
            const changeTooltipProps = {
                header: `${minVisitsAbbrFilter()(hoverPoint.options.realValue)} ${i18nFilter()(
                    "audience.overlap.venn.tooltip.uniqueVisitors.title",
                )}`,
                tableHeaders: [
                    { position: 0, displayName: i18nFilter()("Domain") },
                    { position: 1, displayName: i18nFilter()("Share of site") },
                ],
                tableRows: filteredSites.map((website, idx) => {
                    const currentWebsiteData = hoverPoint.series.data.find(
                        (el) => el.sets.length === 1 && el.sets[0] === website,
                    );
                    return {
                        displayName: website,
                        value: `${percentageFilter()(
                            hoverPoint.options.realValue / currentWebsiteData.realValue,
                            1,
                        )}%`,
                        color: currentWebsiteData.color,
                    };
                }),
                showChangeColumn: false,
            };
            return ReactDOMServer.renderToString(
                <TooltipContainer>
                    <ChangeTooltip {...changeTooltipProps} />
                </TooltipContainer>,
            );
        },
    },
});
