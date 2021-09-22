import { Legends } from "components/React/Legends/Legends";
import Chart from "components/Chart/src/Chart";
import { FC, useMemo, useState } from "react";
import dayjs from "dayjs";
import combineConfigs from "components/Chart/src/combineConfigs";
import monthlyIntervalConfig from "components/Chart/src/configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "components/Chart/src/configs/legend/noLegendConfig";
import yAxisLabelsConfig from "components/Chart/src/configs/yAxis/yAxisLabelsConfig";
import xAxisLabelsConfig from "components/Chart/src/configs/xAxis/xAxisLabelsConfig";
import xAxisCrosshair from "components/Chart/src/configs/xAxis/xAxisCrosshair";
import noAnimationConfig from "components/Chart/src/configs/animation/noAnimationConfig";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import styled from "styled-components";
import { numberFilter, percentageSignFilter } from "filters/ngFilters";
import { FORMAT_VISUAL } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/Constants";
import { rankingsDistributionTooltipFormatterCompare } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/tooltipFormatterCompare";

const CloseIcon = styled(SWReactIcons)`
    cursor: pointer;
`;

export const RankingDistributionCompareGraph: FC<any> = ({
    data,
    chosenItems,
    title,
    onCloseClick,
    tier,
}) => {
    const [legends, setLegends] = useState(
        chosenItems.map((item) => ({
            name: item.name,
            color: item.color,
            visible: true,
        })),
    );
    const graphConfig = useMemo(() => {
        const yAxisFormatter = ({ value }) => percentageSignFilter()(value, 0);
        const xAxisFormatter = ({ value }) => dayjs.utc(value).format(FORMAT_VISUAL);
        return combineConfigs({ yAxisFormatter, xAxisFormatter }, [
            monthlyIntervalConfig,
            noLegendConfig,
            yAxisLabelsConfig,
            xAxisLabelsConfig,
            xAxisCrosshair,
            noAnimationConfig,

            {
                chart: {
                    height: 295,
                    type: "line",
                    spacingTop: 10,
                    plotBackgroundColor: "transparent",
                    style: {
                        fontFamily: "Roboto",
                    },
                },
                tooltip: {
                    formatter: rankingsDistributionTooltipFormatterCompare(tier),
                    useHTML: true,
                    shared: true,
                    style: {
                        fontFamily: "Roboto",
                        margin: 0,
                    },
                    backgroundColor: null,
                    borderWidth: 0,
                    shadow: false,
                    followPointer: false,
                },
                plotOptions: {
                    line: {
                        lineWidth: 2,
                        connectNulls: true,
                    },
                    series: {
                        marker: {
                            enabled: true,
                            symbol: "circle",
                        },
                    },
                },
                yAxis: {
                    gridLineWidth: 0.5,
                    showFirstLabel: true,
                    showLastLabel: true,
                    reversed: false,
                    gridZIndex: 2,
                    reversedStacks: true,
                    tickPixelInterval: 50,
                    plotLines: [
                        {
                            color: "#656565",
                            width: 2,
                            value: 0,
                        },
                    ],
                    labels: {
                        style: {
                            textTransform: "uppercase",
                            fontSize: "11px",
                            fontFamily: "Roboto",
                        },
                    },
                },
                xAxis: {
                    type: "datetime",
                    gridLineWidth: 0,
                    gridLineDashStyle: "dash",
                    tickLength: 5,
                    labels: {
                        style: {
                            textTransform: "capitalize",
                            fontSize: "11px",
                            color: "#919191",
                            fontFamily: "Roboto",
                        },
                    },
                    minPadding: 0,
                    maxPadding: 0,
                },
            },
        ]);
    }, []);

    const graphSeries = useMemo(
        () =>
            Object.entries(data)
                .filter(
                    ([site, siteData]) =>
                        !["leader", "metric", "metricId", "tooltip"].includes(site),
                )
                .map(([site, siteData]) => {
                    const matchedLegend = legends.find(({ name }) => name === site);
                    return {
                        name: site,
                        color: matchedLegend.color,
                        data: (siteData as any).byDate,
                        visible: matchedLegend.visible,
                    };
                }),
        [legends],
    );

    const toggleSeries = (serie, state, event) => {
        event.stopPropagation();
        const newLegends = [...legends];
        const index = newLegends.findIndex(({ name }) => name === serie.name);
        newLegends[index] = {
            ...newLegends[index],
            visible: !newLegends[index].visible,
        };
        setLegends(newLegends);
    };
    return (
        <>
            <div
                style={{
                    height: 72,
                    minHeight: 72,
                    fontSize: 16,
                    fontWeight: 500,
                    display: "flex",
                    padding: "0 24px 0 29px",
                    borderBottom: `1px solid ${colorsPalettes.carbon[100]}`,
                    boxSizing: "border-box",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {title}
                <CloseIcon onclick={onCloseClick} iconName="close" size="xs" />
            </div>
            <div style={{ padding: "16px 26px" }}>
                <div style={{ marginBottom: 24 }}>
                    <Legends legendItems={legends} toggleSeries={toggleSeries} />
                </div>
                <Chart type="line" data={graphSeries} config={graphConfig} />
            </div>
        </>
    );
};
