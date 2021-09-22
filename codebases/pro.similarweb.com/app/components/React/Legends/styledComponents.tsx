import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { StyledPill } from "styled components/StyledPill/src/StyledPill";

export type ILegendItems = Array<{
    isGAVerified?: boolean;
    isGAPrivate?: boolean;
    metric?: string;
    isWinner?: boolean;
    data?: any;
    subtitleText?: string;
    format?: string;
    visible?: boolean;
    gridRowGap?: string;
    hidden?: boolean;
    color?: string;
    showLegendData?: boolean;
    name?: string;
    isDisabled?: boolean;
    tooltip?: string;
    infoTooltip?: string;
    isBeta?: boolean;
    setOpacity?: boolean;
}>;

export interface ILegendProps {
    textMaxWidth?: string;
    legendItems: ILegendItems;
    gridColumnGap?: string;
    gridRowGap?: string;
    showLegendsData?: boolean;
    legendComponent?: FunctionComponent<any>;
    gridDirection?: string;
    legendComponentWrapper?: any;

    toggleSeries(
        legendItem: any,
        hidden: boolean,
        event: MouseEvent,
        reRenderLegendsComponent?: any,
    ): void; // to edit => remove any
}

export const GridBox = styled.div<{
    repeatAmount?: string;
    gridRowGap?: string;
    gridColumnGap?: string;
    gridDirection?: string;
}>`
    display: flex;
    flex-wrap: wrap;
    flex-direction: ${({ gridDirection }) => (gridDirection ? gridDirection : "row")};
`;

export const IconsContainer = styled.div`
    padding-top: 5px;
    padding-left: 4px;
`;

export const InfoIconContainer = styled.div`
    display: flex;
    align-items: center;
    padding-left: 4px;
`;

export const StyledPillGreen = styled(StyledPill)`
    background-color: ${colorsPalettes.mint[400]};
    margin-top: 2px;
`;
