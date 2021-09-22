import React from "react";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import styled from "styled-components";

const ScoreBarCellContainer = styled.div.attrs({
    className: "swTable-progressBar",
})`
    .sw-progress-bar {
        border-radius: 1px;
    }
`;

const ScoreBarValueContainer = styled.span`
    min-width: 30px;
`;

export const ScoreBarCell = (props: ITableCellProps) => {
    const { value } = props;
    const score = value ? Math.round(value) : 0;

    return (
        <ScoreBarCellContainer>
            <ScoreBarValueContainer>{score}</ScoreBarValueContainer>
            <ProgressBar width={score} height={8} />
        </ScoreBarCellContainer>
    );
};
ScoreBarCell.displayName = "ScoreBarCell";
