import React, { FC, useEffect, useState } from "react";
import { i18nFilter, minAbbrNumberFilter, percentageSignFilter } from "filters/ngFilters";
import { colorsPalettes, rgba } from "@similarweb/styles";
import styled from "styled-components";
import {
    CenteredFlexRow,
    FlexColumn,
    FlexRow,
    RightFlexRow,
} from "styled components/StyledFlex/src/StyledFlex";
import Chart from "components/Chart/src/Chart";
import combineConfigs from "components/Chart/src/combineConfigs";
import noMarginConfig from "components/Chart/src/configs/margin/noMarginConfig";
import * as _ from "lodash";
import { Legends } from "components/React/Legends/Legends";
import { Injector } from "common/ioc/Injector";
import ReactDOMServer from "react-dom/server";
import { ClosableItemColorMarker } from "components/compare/StyledComponent";
import { IDataType } from "components/React/GraphTypeSwitcher/GraphTypeSwitcher";
import { percents } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/helpers/DisplayAdsGraphConstants";
import { LegendWithOneLineCheckboxFlex } from "@similarweb/ui-components/dist/legend";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export type PieChartDataItemType = {
    color: string;
    displayName?: string;
    name: string;
    percent: number;
    y: number;
    searchTotal: number;
};

type LegendType = {
    name: string;
    color: string;
    visible: boolean;
    isDisabled: boolean;
    data: object;
};

interface IPieChartProps {
    pieChartData: PieChartDataItemType[];
    chartType: IDataType;
}

const PieLegend = styled(FlexColumn)<{ itemsCount: number }>`
    min-height: ${({ itemsCount }) => itemsCount * 30}px;
    justify-content: center;
    margin-right: 24px;
    width: 232px;
`;

const PieChartContainer = styled(CenteredFlexRow)`
    height: 100%;
`;

const StyledLegendWrapper = styled.span`
    width: 100%;
    margin-bottom: 8px;

    .winnerIcon {
        padding-top: 0;
    }
`;

const TableCellStyle = styled(RightFlexRow)`
    width: 90px;
    padding: 4px 16px 4px 16px;

    &:nth-child(1) {
        width: 176px;
        justify-content: flex-start;
    }

    &:nth-child(2),
    &:nth-child(3) {
        width: 60px;
        border-right: 1px solid ${colorsPalettes.carbon[50]};
    }

    &:last-child {
        border-right: none;
    }
`;

const TableHeadersStyle = styled(FlexRow)`
    font-size: 12px;
    font-style: normal;
    line-height: 16px;
    font-weight: 400;
    opacity: 0.8;
`;

const TableRowStyle = styled(FlexRow)`
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    letter-spacing: 0.6px;
    line-height: 24px;
`;

const TableCellDomainMarker = styled(ClosableItemColorMarker)<{ background: string }>`
    position: static;
    background-color: ${(p) => p.background};
    margin: 0 8px 0 0;
    flex-shrink: 0;
    width: 10px;
    height: 10px;
`;

const TableCellDomainName = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const TooltipContainer = styled.div`
    padding: 16px 0;
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.carbon[200], 0.5)};
    border-radius: 5px;
    margin: 12px 0 8px 0;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;

export const PieChart: FC<IPieChartProps> = ({ pieChartData, chartType }) => {
    const [data, setData] = useState<PieChartDataItemType[]>(pieChartData);
    const [legendItems, setLegendItems] = useState<LegendType[]>([]);
    const [unselectedLegendsArr, setUnselectedLegends] = useState<string[]>([]);
    const chosenSitesService = Injector.get("chosenSites") as any;
    const getSiteColor = chosenSitesService.getSiteColor;

    useEffect(() => {
        setLegendItems(transformLegendsData(data));
    }, [unselectedLegendsArr, chartType]);

    const transformLegendsData = (data) => {
        const getWinner = () => {
            if (data.length > 0) {
                return _.maxBy(data, (item: PieChartDataItemType) => {
                    return chartType.value === percents ? item.percent : item.searchTotal;
                });
            } else {
                return "";
            }
        };
        return data.reduce((acc, legendObject) => {
            const currentLegendValue = formattedPoint(legendObject);
            acc.push({
                name: legendObject.name,
                color: getSiteColor(legendObject.name),
                visible: currentLegendValue !== "N/A" ? legendObject.visible : false,
                isDisabled: currentLegendValue === "N/A",
                data: currentLegendValue,
                get isWinner() {
                    return acc.length > 1 && legendObject.name === getWinner().toString();
                },
            });
            return acc;
        }, []);
    };

    const formattedPoint = (point) => {
        const numberFormatter = (value) => minAbbrNumberFilter()(value);
        const percentageFormatter = (value) => percentageSignFilter()(value, 2);
        const rawValue = chartType.value === percents ? point.y : point.searchTotal;
        const formattedValue = (rawValue) =>
            chartType.value === percents
                ? percentageFormatter(rawValue)
                : numberFormatter(rawValue);
        return rawValue && rawValue > 0 ? formattedValue(rawValue) : "N/A";
    };

    const transformToPieChartObject = (data) => [
        {
            data: data,
            type: "pie",
        },
    ];

    const getPieChartTooltip = ({ point }) => {
        const i18n = i18nFilter();
        const currentPointValue = formattedPoint(point);
        const TableHeaders = () => {
            const headersList = ["Domain", i18n("wa.ao.graph.trafficshare")];
            const headerItems = headersList.map((header) => (
                <TableCellStyle key={header}>{header}</TableCellStyle>
            ));
            return <TableHeadersStyle> {headerItems} </TableHeadersStyle>;
        };

        return ReactDOMServer.renderToString(
            <TooltipContainer>
                <TableHeaders />
                <TableRowStyle>
                    <TableCellStyle>
                        <TableCellDomainMarker background={point.color} />
                        <TableCellDomainName>{point.name}</TableCellDomainName>
                    </TableCellStyle>
                    <TableCellStyle>{currentPointValue}</TableCellStyle>
                </TableRowStyle>
            </TooltipContainer>,
        );
    };

    const getPieChartConfig = () => {
        return combineConfigs({}, [
            noMarginConfig,
            {
                chart: {
                    type: "pie",
                    plotBackgroundColor: "transparent",
                    events: {},
                },
                plotOptions: {
                    pie: {
                        innerSize: "60%",
                        dataLabels: true,
                    },
                },
                legend: {
                    enabled: false,
                },
                tooltip: {
                    followPointer: false,
                    shared: true,
                    useHTML: true,
                    backgroundColor: undefined,
                    borderWidth: 0,
                    style: {
                        fontFamily: "Roboto",
                        margin: 0,
                    },
                    formatter: function () {
                        return getPieChartTooltip({
                            point: this.point,
                        });
                    },
                },
            },
        ]);
    };

    const toggleSeries = (legend) => {
        const { name } = legend;
        const legendItemIndex = unselectedLegendsArr.indexOf(name);
        const action = legendItemIndex >= 0 ? "add" : "remove";
        TrackWithGuidService.trackWithGuid("display_ads.overview.pie-chart.legend", "click", {
            site: name,
            action,
        });
        let updatedUnselectedLegendsArr;
        if (legendItemIndex === -1) {
            // targetLegend is not found in the array - need to add it (deselect)
            updatedUnselectedLegendsArr = [...unselectedLegendsArr, name];
        } else {
            updatedUnselectedLegendsArr = unselectedLegendsArr.filter((name) => name !== name);
        }
        const modifiedData = data.map((item) => {
            return { ...item, visible: updatedUnselectedLegendsArr.indexOf(item.name) === -1 };
        });
        setData(modifiedData);
        setUnselectedLegends(updatedUnselectedLegendsArr);
    };

    return (
        <PieChartContainer>
            <Chart
                type={"pie"}
                config={getPieChartConfig()}
                data={transformToPieChartObject(data)}
                domProps={{ style: { height: "160px", flexGrow: 1 } }}
            />
            <PieLegend data-automation="pie-chart-legends" itemsCount={data.length}>
                <Legends
                    legendComponent={LegendWithOneLineCheckboxFlex}
                    legendComponentWrapper={StyledLegendWrapper}
                    legendItems={legendItems}
                    toggleSeries={toggleSeries}
                    gridDirection="column"
                    textMaxWidth={
                        window.innerWidth < 1680
                            ? window.innerWidth > 1366
                                ? "125px"
                                : "100px"
                            : "150px"
                    }
                />
            </PieLegend>
        </PieChartContainer>
    );
};
