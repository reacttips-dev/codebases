import { colorsPalettes, rgba } from "@similarweb/styles";
import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import { changeFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as numeral from "numeral";
import React from "react";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";
import combineConfigs from "../../combineConfigs";
import monthlyIntervalConfig from "../../configs/granularity/monthlyIntervalConfig";
import noLegendConfig from "../../configs/legend/noLegendConfig";
import xAxisCategoryConfig from "../../configs/xAxis/xAxisCategoryConfig";
import xAxisCrosshair from "../../configs/xAxis/xAxisCrosshair";
import xAxisLabelsConfig from "../../configs/xAxis/xAxisLabelsConfig";
import yAxisGridLineConfig from "../../configs/yAxis/yAxisGridLineConfig";
import yAxisLabelsConfig from "../../configs/yAxis/yAxisLabelsConfig";
import noZoomConfig from "../../configs/zoom/noZoomConfig";

const ContainerStyle = styled.div`
    font-family: Roboto;
    height: 140px;
    flex-direction: column;
    display: flex;
    width: 170px;
    box-sizing: border-box;
    padding: 8px;
`;

const HeaderRowWrapperStyle = styled.div`
    display: flex;
    margin-bottom: 8px;
    align-items: center;
`;

const HeaderRowStyle = styled.span`
    margin-right: 8px;
    font-size: 14px;
    color: ${colorsPalettes.carbon[500]};
`;

const WebsiteContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`;

const IconContainerStyle = styled.span`
    width: 24px;
    height: 24px;
`;

const IconColorStyle = styled.span<{ background: string }>`
    background-color: ${(p) => p.background};
`;

const WebsiteTextStyle = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    line-height: 16px;
    margin-left: 4px;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;

const DivStyle = styled.div`
    justify-content: space-around;
    align-items: center;
    display: flex;
`;

const VisitsStyle = styled.div`
    height: 16px;
    font-size: 16px;
    margin-bottom: 4px;
    color: ${colorsPalettes.carbon[500]};
`;

const SvgContainerStyle = styled.div`
    width: 24px;
    height: 24px;
`;

const DatesStyle = styled.div`
    line-height: 14px;
    width: 60px;
    font-size: 10px;
    margin: 3px;
    white-space: initial;
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
`;

const WebsiteTooltip = (props) => {
    const { pointsData, yFormatter } = props;
    const [point1, point2] = pointsData;
    return (
        <ContainerStyle>
            <HeaderRowWrapperStyle>
                <HeaderRowStyle> Total Visits </HeaderRowStyle>
                <ChangeValue
                    descriptionText={""}
                    isDecrease={point1.series.data[point1.x].change < 0}
                    value={numeral(point1.series.data[point1.x].change)
                        .format("0[.]00a%")
                        .toUpperCase()}
                />
            </HeaderRowWrapperStyle>
            <WebsiteContainer>
                <IconContainerStyle className="ItemIcon ItemIcon--website StyledItemIcon-VtMYa bzTXvW">
                    <img src={point1.point.image} className="ItemIcon-img ItemIcon-img--website" />
                    <IconColorStyle className="ItemIcon-color-marker" background={point2.color} />
                </IconContainerStyle>
                <WebsiteTextStyle>{point1.key}</WebsiteTextStyle>
            </WebsiteContainer>
            <DivStyle>
                <VisitsStyle>
                    {yFormatter({
                        value: point1.y,
                    })}
                </VisitsStyle>
                <SvgContainerStyle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4z"
                            fill="#B0BAC8"
                            fillRule="nonzero"
                        />
                    </svg>
                </SvgContainerStyle>
                <VisitsStyle>
                    {yFormatter({
                        value: point2.y,
                    })}
                </VisitsStyle>
            </DivStyle>
            <DivStyle>
                <DatesStyle>{point1.point.dates}</DatesStyle>
                <DatesStyle>{point2.point.dates}</DatesStyle>
            </DivStyle>
        </ContainerStyle>
    );
};

const PeriodTooltip = (props) => {
    const { pointsData, yFormatter } = props;
    const [point1, point2] = pointsData;
    return (
        <ContainerStyle>
            <HeaderRowStyle> Total Visits </HeaderRowStyle>
            <WebsiteContainer>
                <IconContainerStyle className="ItemIcon ItemIcon--website StyledItemIcon-VtMYa bzTXvW">
                    <img src={point1.image} className="ItemIcon-img ItemIcon-img--website" />
                    <IconColorStyle background={point2.color} />
                </IconContainerStyle>
                <WebsiteTextStyle>{point1.website}</WebsiteTextStyle>
            </WebsiteContainer>
            <DivStyle>
                <VisitsStyle>
                    {yFormatter({
                        value: point1.y,
                    })}
                </VisitsStyle>
                <SvgContainerStyle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4z"
                            fill="#B0BAC8"
                            fillRule="nonzero"
                        />
                    </svg>
                </SvgContainerStyle>
                <VisitsStyle>
                    {yFormatter({
                        value: point2.y,
                    })}
                </VisitsStyle>
            </DivStyle>
            <DivStyle>
                <DatesStyle>{point1.name}</DatesStyle>
                <DatesStyle>{point2.name}</DatesStyle>
            </DivStyle>
        </ContainerStyle>
    );
};

const getTallestColumn = (chart) => {
    return _.maxBy(chart.hoverPoints, (point: any) => point.y);
};

export const getWebsiteConfig = ({
    type,
    yAxisFormatter,
    xAxisFormatter,
    categoryXSeries,
    height,
    data,
}) => {
    let labels = [];
    return combineConfigs({ type, yAxisFormatter, xAxisFormatter, data }, [
        monthlyIntervalConfig,
        yAxisLabelsConfig,
        categoryXSeries ? xAxisCategoryConfig : null,
        xAxisLabelsConfig,
        type === "column" ? noZoomConfig : null,
        yAxisGridLineConfig,
        type === "column" ? null : xAxisCrosshair,
        noLegendConfig,
        {
            plotOptions: {
                series: {
                    states: {
                        hover: {
                            brightness: 0,
                        },
                    },
                    borderRadius: 3,
                    minPointLength: 3,
                },
            },
            xAxis: {
                crosshair: true,
            },
            tooltip: {
                shadow: {
                    offsetX: 0,
                },
                positioner() {
                    const topPoint = getTallestColumn(this.chart);
                    const { top } = topPoint.graphic.element.getBoundingClientRect();
                    const leftColumn = this.chart.hoverPoints[0];
                    const leftColumnElement = leftColumn.graphic.element;
                    const tooltipDimension = {
                        gap: 18,
                        height: 162,
                        width: 186,
                    };
                    return {
                        x: leftColumnElement.getBoundingClientRect().left - tooltipDimension.gap,
                        y: top - (tooltipDimension.height + tooltipDimension.gap),
                    };
                },
                shared: true,
                useHTML: true,
                style: {
                    margin: 0,
                },
                padding: 2,
                outside: true,
                backgroundColor: colorsPalettes.carbon[0],
                borderWidth: 0,
                borderColor: colorsPalettes.carbon[50],
                formatter() {
                    return ReactDOMServer.renderToString(
                        <WebsiteTooltip pointsData={this.points} yFormatter={yAxisFormatter} />,
                    );
                },
            },
            yAxis: {
                maxPadding: 0.18,
            },
            chart: {
                style: {
                    fontFamily: "Roboto",
                },
                height,
                events: {
                    load() {
                        for (let i = 0; i < this.series[0].data.length; i++) {
                            labels.push(
                                this.renderer
                                    .label(
                                        getWebsiteLabel(this.series[0], i),
                                        this.series[0].data[i].clientX + 5,
                                        13,
                                        null,
                                        null,
                                        null,
                                        true,
                                    )
                                    .add(),
                            );
                        }
                    },
                    redraw() {
                        labels.forEach((l) => l.destroy());
                        labels = [];
                        for (let i = 0; i < this.series[0].data.length; i++) {
                            labels.push(
                                this.renderer
                                    .label(
                                        getWebsiteLabel(this.series[0], i),
                                        this.series[0].data[i].clientX + 5,
                                        13,
                                        null,
                                        null,
                                        null,
                                        true,
                                    )
                                    .add(),
                            );
                        }
                    },
                },
            },
        },
    ]);
};

const winnerIcon = `
<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="Icon/Winner-16PX" stroke="none" stroke-width="1" fill="none" fillRule="evenodd">
        <path d="M9.00018797,11.8999437 L9,13 L12,13 L12,15 L4,15 L4,13 L6.999,13 L6.9988136,11.8997409 C7.32229129,11.9654854 7.65711499,12 8,12 C8.34253225,12 8.67701976,11.9655564 9.00018797,11.8999437 Z M12,1 L12,7 C12,7.07679825 11.9978357,7.153091 11.9935648,7.22882058 L12,7 C12,7.1002436 11.9963125,7.19962594 11.9890658,7.29801879 C11.985045,7.35261055 11.9799292,7.40689217 11.9737398,7.46084734 C11.9706886,7.48745193 11.9673617,7.51408598 11.9637743,7.54063735 C11.9580366,7.58311141 11.9516163,7.62546835 11.9445374,7.66760182 C11.9386656,7.70253855 11.9323819,7.73711264 11.9256568,7.77152877 C11.9223159,7.78862676 11.9188616,7.80570712 11.9152988,7.82274764 C11.9000811,7.89550747 11.8829595,7.96726858 11.863934,8.03825077 C11.8494679,8.0922441 11.8337819,8.14616373 11.8170046,8.19960023 C11.8126726,8.21340043 11.8082042,8.22736373 11.8036613,8.24129341 C11.7865065,8.29387464 11.7684501,8.34555215 11.7493758,8.39673386 C11.7371592,8.4295172 11.7244829,8.46220135 11.7113928,8.49467426 C11.1194279,9.96334185 9.68077619,11 8,11 C6.38793605,11 4.99860454,10.0463691 4.36536036,8.67246213 L4.36481174,8.6722845 L4.32365647,8.57882545 C4.3117839,8.55121637 4.30021323,8.52344683 4.28894863,8.49552098 L4.36481174,8.6722845 C4.32343736,8.58227361 4.28529459,8.490491 4.25053314,8.39708138 C4.23154987,8.34555215 4.21349352,8.29387464 4.19647979,8.24172596 C4.191644,8.22730258 4.18706307,8.2129659 4.18256088,8.19859476 C4.16756435,8.15040624 4.15333614,8.10182505 4.14001436,8.05287033 C4.11930841,7.97695926 4.1008765,7.90028786 4.08468457,7.82280061 C4.08113844,7.80570712 4.07768412,7.78862676 4.074339,7.77150732 C4.0675994,7.73710823 4.06132292,7.70255814 4.05549292,7.66785767 C4.04838367,7.62546835 4.04196341,7.58311141 4.03621281,7.54054196 C4.032636,7.514106 4.02930945,7.48746895 4.02624601,7.46075232 C4.02007082,7.40689217 4.01495498,7.35261055 4.01093459,7.29802439 C4.00984927,7.2832966 4.0088445,7.26854849 4.00791988,7.25377872 L4.00654913,7.23083097 C4.00220278,7.15444127 4,7.07747788 4,7 L4,7 L4,1 L12,1 Z M13,3 C14.6568542,3 16,4.34314575 16,6 C16,7.65685425 14.6568542,9 13,9 C12.8626209,9 12.7273985,8.99076587 12.5949198,8.97288444 C12.8187771,8.45330483 12.956489,7.88937063 12.9912667,7.29793284 L13,7 L13.1166211,6.99327227 C13.6139598,6.93550716 14,6.51283584 14,6 C14,5.48716416 13.6139598,5.06449284 13.1166211,5.00672773 L13,5 L13,3 Z M3,3 L3,5 C2.44771525,5 2,5.44771525 2,6 C2,6.51283584 2.38604019,6.93550716 2.88337887,6.99327227 L3,7 L3.00461951,7.21688962 C3.03112227,7.83785796 3.17088395,8.42949735 3.40377318,8.97167644 C3.27260146,8.99076587 3.1373791,9 3,9 C1.34314575,9 0,7.65685425 0,6 C0,4.40231912 1.24891996,3.09633912 2.82372721,3.00509269 L3,3 Z" id="Combined-Shape" fill="#FFB366" fillRule="nonzero"></path>
    </g>
</svg>
`;

const getWebsiteLabel = (series, i) => {
    const change = changeFilter()(series.data[i].change);
    const winnerChange = _.maxBy(series.data, (ob: any) => ob.change);
    const changeStyle = `color:black; font-size:14px; font-family: Roboto`;
    if (series.data[i] === winnerChange) {
        if (series.data[i].change < 0) {
            return `<div style="display: flex; align-items: center;">
                    <div style="width: 24px; height: 18px" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                    <div class="ChangeValue ChangeValue--down ">
                        <div>
                            <span class="ChangeValue-arrow ChangeValue-arrow--symbol"> </span>
                            <span style="${changeStyle}">${change}</span>
                        </div>
                    </div>
                    </div>`;
        } else if (series.data[i].change > 0) {
            return `<div style="display: flex; align-items: center;">
                    <div style="width: 24px; height: 18px;" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                    <div class="ChangeValue ChangeValue--up ">
                        <div>
                            <span class="ChangeValue-arrow ChangeValue-arrow--symbol"> </span>
                                <span style="${changeStyle}">${change}</span>
                        </div>
                    </div>
                </div>`;
        } else {
            return `<div style="display: flex; align-items: center;">
                    <div style="width: 24px; height: 18px" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                        <div>
                                <span style="${changeStyle}">${change}</span>
                        </div>
                    </div>
                </div>`;
        }
    } else {
        if (series.data[i].change < 0) {
            return `<div style="display: flex; align-items: center;">
                    <div style="width: 24px; height: 18px; visibility: hidden" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                    <div class="ChangeValue ChangeValue--down ">
                        <div>
                            <span class="ChangeValue-arrow ChangeValue-arrow--symbol"> </span>
                            <span style="${changeStyle}">${change}</span>
                        </div>
                    </div></div>`;
        } else if (series.data[i].change > 0) {
            return `<div style="display: flex; align-items: center;">
                    <div style="width: 24px; height: 18px; visibility: hidden" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                    <div class="ChangeValue ChangeValue--up ">
                        <div>
                            <span class="ChangeValue-arrow ChangeValue-arrow--symbol"> </span>
                                <span style="${changeStyle}">${change}</span>
                        </div>
                    </div>
                </div>`;
        } else {
            return `<div style="display: flex; align-items: center;">
                    <div style="width: 24px; height: 18px; visibility: hidden" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                        <div>
                                <span style="${changeStyle}">${change}</span>
                        </div>
                    </div>
                </div>`;
        }
    }
};

const getPeriodLabel = (arr, i) => {
    const maxSeriesChange = Math.max(...arr.map((series) => series.data[1].change));
    const series = arr[i];
    const change = changeFilter()(series.data[1].change);
    const changeStyle = `color:black; font-size:10px; font-family: Roboto`;
    if (series.data[1].change === maxSeriesChange) {
        if (series.data[1].change < 0) {
            return `<div style="display: flex; align-items: center;flex-direction: column;width:70px;">
                    <div style="width: 24px; height: 23px" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                    <div class="ChangeValue ChangeValue--down ">
                        <div>
                            <span class="ChangeValue-arrow ChangeValue-arrow--symbol"> </span>
                            <span style="${changeStyle}">${change}</span>
                        </div>
                    </div></div>`;
        } else if (series.data[1].change > 0) {
            return `<div style="display: flex; align-items: center;flex-direction: column;width:70px;">
                    <div style="width: 24px; height: 18px;" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                    <div class="ChangeValue ChangeValue--up ">
                        <div>
                            <span class="ChangeValue-arrow ChangeValue-arrow--symbol"> </span>
                                <span style="${changeStyle}">${change}</span>
                        </div>
                    </div>
                </div>`;
        } else {
            return `<div style="display: flex; align-items: center;flex-direction: column;width:70px;">
                    <div style="width: 24px; height: 18px" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                        <div>
                                <span style="${changeStyle}">${change}</span>
                        </div>
                    </div>
                </div>`;
        }
    } else {
        if (series.data[1].change < 0) {
            return `<div style="display: flex; align-items: center;flex-direction: column;width:70px;">
                    <div style="width: 24px; height: 18px; visibility: hidden" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                    <div class="ChangeValue ChangeValue--down ">
                        <div>
                            <span class="ChangeValue-arrow ChangeValue-arrow--symbol"> </span>
                            <span style="${changeStyle}">${change}</span>
                        </div>
                    </div></div>`;
        } else if (series.data[1].change > 0) {
            return `<div style="display: flex; align-items: center;flex-direction: column;width:70px;">
                    <div style="width: 24px; height: 18px; visibility: hidden" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                    <div class="ChangeValue ChangeValue--up ">
                        <div>
                            <span class="ChangeValue-arrow ChangeValue-arrow--symbol"> </span>
                                <span style="${changeStyle}">${change}</span>
                        </div>
                    </div>
                </div>`;
        } else {
            return `<div style="display: flex; align-items: center;flex-direction: column;width:70px;">
                    <div style="width: 24px; height: 18px; visibility: hidden" data-automation-icon-name="winner">
                        ${winnerIcon}
                    </div>
                        <div>
                                <span style="${changeStyle}">${change}</span>
                        </div>
                    </div>
                </div>`;
        }
    }
};

const getPeriodLabelX = (chart, i) => {
    return chart.series[i].data[1].barX + chart.series[i].barW - (chart.series[i].barW - 45) / 2;
};

export const getPeriodConfig = ({
    type,
    yAxisFormatter,
    xAxisFormatter,
    isStackedColumn,
    categoryXSeries,
    legendDurations,
    height,
}) => {
    let labels = [];
    return combineConfigs({ type, yAxisFormatter, xAxisFormatter }, [
        monthlyIntervalConfig,
        yAxisLabelsConfig,
        categoryXSeries ? xAxisCategoryConfig : null,
        xAxisLabelsConfig,
        type === "column" ? noZoomConfig : null,
        yAxisGridLineConfig,
        type === "column" ? null : xAxisCrosshair,
        noLegendConfig,
        {
            plotOptions: {
                series: {
                    groupPadding: 0.06,
                    borderRadius: 3,
                    minPointLength: 3,
                    states: {
                        hover: {
                            brightness: 0,
                        },
                    },
                },
            },
            tooltip: {
                shadow: {
                    offsetX: 0,
                },
                outside: true,
                shared: false,
                useHTML: true,
                style: {
                    margin: 0,
                },
                padding: 2,
                backgroundColor: colorsPalettes.carbon[0],
                borderWidth: 0,
                borderColor: colorsPalettes.carbon[50],
                formatter() {
                    return ReactDOMServer.renderToString(
                        <PeriodTooltip pointsData={this.series.data} yFormatter={yAxisFormatter} />,
                    );
                },
            },
            yAxis: {
                maxPadding: 0.09,
            },
            chart: {
                style: {
                    fontFamily: "Roboto",
                },
                height,
                events: {
                    load() {
                        for (let i = 0; i < this.series.length; i++) {
                            // eslint:disable-next-line:max-line-length
                            labels.push(
                                this.renderer
                                    .label(
                                        getPeriodLabel(this.series, i),
                                        getPeriodLabelX(this, i),
                                        this.series[i].data[1].plotY - 30,
                                        null,
                                        null,
                                        null,
                                        true,
                                    )
                                    .add(),
                            );
                        }
                    },
                    redraw() {
                        labels.forEach((l) => l.destroy());
                        labels = [];
                        for (let i = 0; i < this.series.length; i++) {
                            // eslint:disable-next-line:max-line-length
                            labels.push(
                                this.renderer
                                    .label(
                                        getPeriodLabel(this.series, i),
                                        getPeriodLabelX(this, i),
                                        this.series[i].data[1].plotY - 30,
                                        null,
                                        null,
                                        null,
                                        true,
                                    )
                                    .add(),
                            );
                        }
                    },
                },
            },
        },
    ]);
};
