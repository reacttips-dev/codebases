import styled from "styled-components";
import { RightAlignedCell } from "components/React/Table/cells/RankCell";
import React from "react";

const PositionCellArrow = styled.div`
    margin: 0 6px;
`;
const PositionCellTarget = styled.b``;
const Container = styled(RightAlignedCell)`
    display: flex;
    text-align: center;
    justify-content: flex-end;
`;
export const PositionChangeCell = ({ row }) => {
    const { PreviousPosition, CurrentPosition } = row;
    if (Number.isInteger(PreviousPosition)) {
        return (
            <Container>
                {PreviousPosition}
                <PositionCellArrow>&#8594;</PositionCellArrow>
                <PositionCellTarget>{CurrentPosition}</PositionCellTarget>
            </Container>
        );
    } else {
        return (
            <Container>
                <PositionCellTarget>{CurrentPosition}</PositionCellTarget>
            </Container>
        );
    }
};
