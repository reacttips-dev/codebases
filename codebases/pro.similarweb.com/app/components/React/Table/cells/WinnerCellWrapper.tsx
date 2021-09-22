import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import React from "react";
import styled from "styled-components";

const WinnerIcon = styled(SWReactIcons).attrs({
    iconName: "winner",
})`
    position: relative;
    margin-right: 0.8em;
    svg {
        width: 1em;
        height: 1em;
        path {
            fill: ${(props) =>
                props.bold ? colorsPalettes.yellow[400] : colorsPalettes.carbon[500]};
        }
    }
`;
WinnerIcon.displayName = "WinnerIcon";

interface IWinnerWrapperDiv {
    isWinner: boolean;
    align: string;
}
const WinnerWrapperDiv = styled.div<IWinnerWrapperDiv>`
    display: flex;
    flex-direction: row;
    ${(props) => (props.isWinner ? "font-weight: bold;" : "")}
    justify-content: ${(props) =>
        ({
            left: "flex-start",
            center: "center",
            right: "flex-end",
        }[props.align])};
`;
WinnerWrapperDiv.displayName = "AnalyzeButton";

export const WinnerCellWrapper = (props: any) => {
    const {
        cellComponent: CellComponent,
        isWinner = false,
        winnerCellAlign = "left",
        winnerCellBold = true,
        ...restProps
    } = props;

    return (
        <WinnerWrapperDiv isWinner={isWinner} align={winnerCellAlign}>
            {isWinner && <WinnerIcon bold={winnerCellBold} />}
            <CellComponent {...restProps} />
        </WinnerWrapperDiv>
    );
};
WinnerCellWrapper.displayName = "WinnerCellWrapper";
