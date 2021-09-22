import * as React from "react";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";
import { colorsPalettes, colorsSets } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { percents } from "../../../pages/app performance/src/page/single/usage section/formatters";
import { SWReactIcons } from "@similarweb/icons";
import { DefaultCell } from "./DefaultCell";
import { NumberCell } from "./NumberCell";

const green = colorsSets.verdics["green s100"];
const red = colorsSets.verdics["red s100"];
const StyledIcon = styled(SWReactIcons)`
    margin-right: 6px;
    display: flex;
`;

const ArrowUp = ({ className = null }) => {
    return <StyledIcon className={className} iconName="arrow-up" />;
};

const ArrowDown = ({ className = null }) => {
    return <StyledIcon className={className} iconName="arrow-down" />;
};

const ChangeCellStyled = styled(NumberCell)`
    display: flex;
    align-items: center;
    ${setFont({ $family: "'Roboto'", $size: 14 })};
`;

const PositiveChange = styled(ChangeCellStyled)`
    color: ${green};
    ${StyledIcon} {
        path {
            fill: ${green};
        }
    }
`;

const NegativeChange = styled(ChangeCellStyled)`
    color: ${red};
    ${StyledIcon} {
        path {
            fill: ${red};
        }
    }
`;

export const ChangeCell = ({ value }) => {
    if (typeof value !== "number") {
        return <ChangeCellStyled>--</ChangeCellStyled>;
    }
    if (value > 0) {
        return (
            <PositiveChange>
                <ArrowUp />
                {percents({ value })}
            </PositiveChange>
        );
    } else if (value < 0) {
        return (
            <NegativeChange>
                <ArrowDown />
                {percents({ value })}
            </NegativeChange>
        );
    } else if (value == 0) {
        return <ChangeCellStyled>0</ChangeCellStyled>;
    }
};
