import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import React from "react";
import { StyledPill } from "styled components/StyledPill/src/StyledPill";
import styled from "styled-components";

const GridRow = styled.div`
    //display: grid;
    //grid-template-columns: 40% 25% 35%;
    //grid-template-rows: 18px 15px;
    margin-top: 12px;
`;
const GridItem = styled.div`
    text-align: left;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;
const GridItemRightAlignment = styled.div`
    text-align: right;
`;
const Text = styled.div<{ marginRight?: string }>`
    cursor: default;
    ${setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 1) })}
`;
const Pill = styled(StyledPill)<{ isBeta?: boolean }>`
    text-align: left;
    width: auto;
    margin-left: 10px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: none;
    height: 13px;
    ${setFont({ $size: 12 })}
    ${({ isBeta }) =>
        isBeta
            ? `background-color: ${colorsPalettes.green.s100}`
            : `background-color: ${colorsPalettes.red.s100}`};
`;
const ChartLabelTooltipContainer = styled.div<{ tooltipWidth?: number | string }>`
    width: ${({ tooltipWidth }) => tooltipWidth};
    background-color: white;
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 6px 6px 0 ${colorsPalettes.carbon[200]};
`;
const Header = styled.h1`
    margin-bottom: 10px;
    ${setFont({ $size: 14.5, $color: rgba(colorsPalettes.carbon[500], 1) })}
`;

const flipColor = (positiveAvg, vertical) => {
    if (vertical.id === "BounceRate") {
        return !positiveAvg;
    }
    return positiveAvg;
};

export const ChartLabelTooltip = ({
    chart,
    getAverageForBenchmark,
    xVertical,
    yVertical,
    aboveAvgText,
    belowAvgText,
    tooltipWidth,
}) => {
    const xAboveAvg = chart.hoverPoint.x > getAverageForBenchmark(xVertical);
    const yAboveAvg = chart.hoverPoint.y > getAverageForBenchmark(yVertical);
    return (
        <ChartLabelTooltipContainer tooltipWidth={tooltipWidth}>
            <Header>{chart.hoverSeries.name}</Header>
            <GridRow style={{ display: "flex", alignItems: "center" }}>
                <GridItem style={{ flex: "0 0 40%", marginRight: 10 }}>
                    <Text>{xVertical.name}</Text>
                </GridItem>
                <GridItemRightAlignment style={{ flex: "0 0 25%", flexShrink: 0 }}>
                    <Text>{xVertical.formatter(chart.hoverPoint.x)}</Text>
                </GridItemRightAlignment>

                <GridItemRightAlignment
                    style={{ flex: "0 1 35%", flexShrink: 0, overflow: "hidden" }}
                >
                    {!xVertical.hidePill && (
                        <Text>
                            <Pill isBeta={flipColor(xAboveAvg, xVertical)}>
                                {xAboveAvg ? aboveAvgText : belowAvgText}
                            </Pill>
                        </Text>
                    )}
                </GridItemRightAlignment>
            </GridRow>
            <GridRow style={{ display: "flex", alignItems: "center" }}>
                <GridItem style={{ flex: "0 0 40%", marginRight: 10 }}>
                    <Text>{yVertical.name}</Text>
                </GridItem>
                <GridItemRightAlignment style={{ flex: "0 0 25%", flexShrink: 0 }}>
                    <Text>{yVertical.formatter(chart.hoverPoint.y)}</Text>
                </GridItemRightAlignment>

                <GridItemRightAlignment
                    style={{ flex: "0 1 35%", flexShrink: 0, overflow: "hidden" }}
                >
                    {!yVertical.hidePill && (
                        <Text>
                            <Pill isBeta={flipColor(yAboveAvg, yVertical)}>
                                {yAboveAvg ? aboveAvgText : belowAvgText}
                            </Pill>
                        </Text>
                    )}
                </GridItemRightAlignment>
            </GridRow>
        </ChartLabelTooltipContainer>
    );
};
ChartLabelTooltip.defaultProps = {
    aboveAvgText: "Above Avg.",
    belowAvgText: "Below Avg.",
    tooltipWidth: 265,
};
