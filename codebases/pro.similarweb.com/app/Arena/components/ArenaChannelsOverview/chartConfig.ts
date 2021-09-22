import { colorsPalettes } from "@similarweb/styles";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import * as numeral from "numeral";
import combineConfigs from "../../../../.pro-features/components/Chart/src/combineConfigs";
import yAxisLabelsConfig from "../../../../.pro-features/components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import { i18nFilter } from "../../../filters/ngFilters";
import { tooltipPositioner } from "../../../services/HighchartsPositioner";
import { displayType } from "./ArenaChannelsOverview";
import noAnimationConfig from "components/Chart/src/configs/animation/noAnimationConfig";

export const getChartConfig = (
    data,
    isBenchmarked,
    primaryDomain,
    currentDisplayType,
    linkParams,
) => {
    const yAxisFormatter = ({ value }) =>
        currentDisplayType === displayType.number
            ? numeral(value).format("0[.]0a").toUpperCase()
            : numeral(value).format("0%").toUpperCase();
    const link = (state, params) => Injector.get<SwNavigator>("swNavigator").href(state, params);
    const isMobileWeb = linkParams.webSource === "MobileWeb";
    const config: any = combineConfigs({ yAxisFormatter }, [
        noAnimationConfig,
        yAxisLabelsConfig,
        {
            legend: { enabled: false },
            xAxis: {
                categories: [
                    i18nFilter()("traffic.channel.dashboard.wizard.direct"),
                    i18nFilter()("traffic.channel.dashboard.wizard.mail"),
                    `<a href="${link("websites-trafficReferrals", linkParams)}">${i18nFilter()(
                        "traffic.channel.dashboard.wizard.referrals",
                    )}</a>`,
                    `<a href="${link("websites-trafficSocial", linkParams)}">${i18nFilter()(
                        "traffic.channel.dashboard.wizard.social",
                    )}</a>`,
                    ...(isMobileWeb
                        ? [
                              `<a href="${link(
                                  "websites-trafficDisplay-overview",
                                  linkParams,
                              )}">${i18nFilter()(
                                  "traffic.channel.dashboard.wizard.display.ads",
                              )}</a>`,
                              `<a href="${link(
                                  "websites-trafficSearch",
                                  linkParams,
                              )}">${i18nFilter()("utils.search")}</a>`,
                          ]
                        : [
                              `<a href="${link("websites-trafficSearch", {
                                  ...linkParams,
                                  Keywords_filters: "OP;==;0",
                              })}">${i18nFilter()(
                                  "traffic.channel.dashboard.wizard.organic.search",
                              )}</a>`,
                              `<a href="${link("websites-trafficSearch", {
                                  ...linkParams,
                                  Keywords_filters: "OP;==;1",
                              })}">${i18nFilter()(
                                  "traffic.channel.dashboard.wizard.paid.search",
                              )}</a>`,
                              `<a href="${link(
                                  "websites-trafficDisplay-overview",
                                  linkParams,
                              )}">${i18nFilter()(
                                  "traffic.channel.dashboard.wizard.display.ads",
                              )}</a>`,
                          ]),
                ],
                labels: {
                    useHTML: true,
                    style: {
                        textTransform: "capitalize",
                        fontSize: "11px",
                        fontFamily: `'Roboto', Tahoma, sans-serif`,
                        color: colorsPalettes.carbon["500"],
                    },
                },
            },
            tooltip: {
                enabled: true,
                shared: true,
                positioner: tooltipPositioner,
                pointFormatter() {
                    const pointFormat = (value) =>
                        currentDisplayType === displayType.number
                            ? numeral(value).format("0[.]0a").toUpperCase()
                            : numeral(value).format("0.00%").toUpperCase();

                    return `
                    <span style="color:${this.color}; font-family: Roboto;">\u25CF </span>${
                        this.series.name
                    }:
                     <span style="font-weight: bold;color:${this.color};">${pointFormat(
                        this.y,
                    )}</span><br/>
                `;
                },
            },
            plotOptions: {
                series: {
                    pointWidth: 13,
                },
            },
        },
    ]);
    if (isBenchmarked) {
        config.yAxis.labels = {
            useHTML: true,
            formatter() {
                if (this.value === 0) {
                    return `
                        <span
                            style="transform: translate(2px, 3px);display:flex;border-radius:6px;justify-content:center;align-items:center;
                            width: 24px;height: 24px;flex-shrink: 0;border:1px solid #d6dbe1;"><img style="vertical-align: middle;border-radius: 3px;
                            max-width: 18px; height: 18px;"
                            src="${primaryDomain.favicon}" /></span>`;
                }
                return yAxisFormatter(this);
            },
        };
    }
    return config;
};
