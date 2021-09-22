import React, { FunctionComponent } from "react";
import ReactDOMServer from "react-dom/server";
import styled, { css } from "styled-components";

import { colorsPalettes } from "@similarweb/styles";

const TooltipContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-family: Roboto;
`;

const TooltipMarkerName = styled.span<{ marginRight?: number }>`
    ${({ marginRight }) =>
        marginRight &&
        css`
            margin-right: ${marginRight}px;
        `};
    color: ${colorsPalettes.carbon[500]};
`;

const TooltipMarker = styled.span<{ backgroundColor: string }>`
    flex-shrink: 0;
    background: ${({ backgroundColor }) => backgroundColor};
    border-radius: 100%;
    height: 12px;
    width: 12px;
    margin-right: 14px;
`;

const PieChartTooltipContent = (props: { color: string; name: string; value: string }) => {
    return (
        <TooltipContainer>
            <TooltipMarker backgroundColor={props.color} />
            <TooltipMarkerName marginRight={48}>{props.name}</TooltipMarkerName>
            <TooltipMarkerName>{props.value}</TooltipMarkerName>
        </TooltipContainer>
    );
};

export default ({ yAxisFormatter }) => {
    return {
        tooltip: {
            enabled: true,
            followPointer: false,
            borderWidth: 0,
            borderRadius: 8,
            outside: true,
            backgroundColor: colorsPalettes.carbon[0],
            headerFormat: ``,
            useHTML: true,
            padding: 13,
            distance: 65,
            pointFormatter() {
                const genderName = this.name;
                const genderColor = this.color;
                const genderPercent = yAxisFormatter({ value: this.y });
                return ReactDOMServer.renderToString(
                    <PieChartTooltipContent
                        name={genderName}
                        color={genderColor}
                        value={genderPercent}
                    />,
                );
            },
        },
    };
};
