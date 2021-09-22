import React from "react";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";
import dayjs from "dayjs";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { SWReactIcons } from "@similarweb/icons";
import { CenteredFlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const algoChangeDateConfig = (algoChangeDateUTC: number, options) => ({ data }) => {
    const { showTooltip, description, iconName, MarkerComponent, showDateTitle } = Object.assign(
        {
            showTooltip: false,
            iconName: "alerts",
            MarkerComponent: Marker,
            showDateTitle: true,
            overwriteDateRange: false,
        },
        options,
    );

    const setDateRange = () => {
        const { overwriteDateRange } = options;

        if (!overwriteDateRange) {
            return data.reduce((acc, { data: points }) => {
                const datesArr = points.map((p) => p.x);
                return [
                    Math.min(acc[0] ?? datesArr[0], ...datesArr),
                    Math.max(acc[1] ?? datesArr[0], ...datesArr),
                ];
            }, []);
        } else {
            const datesArr = data.map((p) => p[0]);
            return [Math.min(...datesArr), Math.max(...datesArr)];
        }
    };

    const datesRange = setDateRange();
    const dateAvg = (datesRange[1] + datesRange[0]) / 2;
    const tooltipSide = algoChangeDateUTC < dateAvg ? "right" : "left";
    return {
        xAxis: {
            plotLines: [
                {
                    color: "#7F8B97",
                    width: 1,
                    dashStyle: "Dash",
                    value: algoChangeDateUTC,
                    left: 11,
                    zIndex: 1,
                    label: {
                        text: ReactDOMServer.renderToString(
                            <MarkerComponent>
                                <MarkerIcon iconName={iconName} />
                                {showTooltip && (
                                    <MarkerTooltip side={tooltipSide}>
                                        {showDateTitle && (
                                            <MarkerTooltipTitle>
                                                {dayjs(algoChangeDateUTC).format(
                                                    "dddd, MMM DD, YYYY",
                                                )}
                                            </MarkerTooltipTitle>
                                        )}
                                        <MarkerTooltipDescription>
                                            {description}
                                        </MarkerTooltipDescription>
                                    </MarkerTooltip>
                                )}
                            </MarkerComponent>,
                        ),
                        useHTML: true,
                        x: -10,
                        y: 0,
                        rotation: 0,
                        verticalAlign: "bottom",
                    },
                },
            ],
        },
    };
};

export const Marker = styled(CenteredFlexRow).attrs({
    className: "PlainTooltip-container",
})`
    top: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${colorsPalettes.blue[400]};
`;

const MarkerIcon = styled(SWReactIcons)`
    path {
        fill: white;
    }

    height: 12px;
    width: 12px;
`;

export const MarkerTooltip = styled.div.attrs({
    className: "PlainTooltip-element",
})<{ side: string }>`
    width: 200px;
    padding: 12px;
    opacity: 0.9;
    bottom: 20px;
    display: none;

    &:before,
    &:after {
        display: none;
    }

    ${({ side }) => {
        switch (side) {
            case "left":
                return `right: 20px;`;
            case "right":
                return `left: 20px;`;
        }
    }}
`;

export const MarkerTooltipTitle = styled.div`
    ${setFont({ $size: "16px", $weight: "600", $color: colorsPalettes.carbon[50] })};
    margin-bottom: 10px;
`;

export const MarkerTooltipDescription = styled.div`
    word-wrap: normal;
    white-space: normal;
    line-height: 20px;
    ${setFont({ $size: "14px", $weight: "300", $color: colorsPalettes.carbon[50] })};
`;
