import { colorsPalettes } from "@similarweb/styles";
import { FC } from "react";
import combineConfigs from "components/Chart/src/combineConfigs";
import trendConfig from "components/Chart/src/configs/trendConfig";
import noXAxisConfig from "components/Chart/src/configs/xAxis/noXAxisConfig";
import noMarginConfig from "components/Chart/src/configs/margin/noMarginConfig";
import noAnimationConfig from "components/Chart/src/configs/animation/noAnimationConfig";
import Chart from "components/Chart/src/Chart";
import dayjs from "dayjs";
import ReactDOMServer from "react-dom/server";
import { BoldText, TooltipContentWrapper, TooltipWrapper, ValueWrapper } from "./StyledComponents";
import { minVisitsAbbrFilter } from "filters/ngFilters";

export const TrendGraph: FC<any> = ({ traffic }) => {
    const config = {
        chart: {
            marginTop: 5,
            marginRight: 5,
            marginBottom: 5,
            marginLeft: 5,
            zoomType: null,
            height: 36,
            width: 86,
        },
        plotOptions: {
            series: {
                lineColor: colorsPalettes.blue[400],
                lineWidth: 3,
                marker: {
                    enabled: true,
                    fillColor: colorsPalettes.blue[400],
                    radius: 3,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 4,
                        },
                    },
                },
                states: {
                    hover: {
                        halo: {
                            size: 0,
                        },
                    },
                },
                fillColor: "none",
                point: {
                    events: {
                        mouseOut() {
                            this.series.chart.tooltip.destroy();
                        },
                    },
                },
            },
        },
        tooltip: {
            enabled: true,
            backgroundColor: "none",
            borderWidth: 0,
            outside: true,
            useHTML: true,
            shared: true,
            shadow: false,
            formatter() {
                const getTooltipContent = () => {
                    const to = dayjs.utc(this.x);
                    const from = to.clone();
                    const fromWeek = from.subtract(6, "days");

                    return (
                        <TooltipWrapper>
                            <TooltipContentWrapper>
                                {fromWeek.format("MMM DD")} - {to.format("MMM DD")}
                                <ValueWrapper>
                                    <BoldText>{minVisitsAbbrFilter()(this.y)}</BoldText>
                                </ValueWrapper>
                            </TooltipContentWrapper>
                        </TooltipWrapper>
                    );
                };
                return ReactDOMServer.renderToString(getTooltipContent());
            },
        },
    };
    const configObj = combineConfigs({}, [
        trendConfig,
        noXAxisConfig,
        noMarginConfig,
        noAnimationConfig,
        config,
    ]);
    return <Chart type="area" data={[{ data: traffic, name: "name" }]} config={configObj} />;
};
