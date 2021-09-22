import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { RelevancyScore } from "../../../../../.pro-features/components/RelevancyScore/src/RelevancyScore";
import { ITableCellProps } from "../interfaces/ITableCellProps";

const CellWrapper = styled.div`
    margin: 5px auto 0 auto;
    max-width: 60px;
`;
export const RelevancyCell: StatelessComponent<ITableCellProps> = ({ value }) => {
    return (
        <CellWrapper>
            <RelevancyScore maxBullets={5} bullets={value} />
        </CellWrapper>
    );
};

RelevancyCell.displayName = "RelevancyCell";
