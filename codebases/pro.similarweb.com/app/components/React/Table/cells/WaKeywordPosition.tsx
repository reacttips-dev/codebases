import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const RightAlignCell = styled.div`
    text-align: right;
`;

export const WaKeywordPosition: StatelessComponent<ITableCellProps> = ({ row, field }) => {
    let value = row[field][0].Value;
    return (
        <RightAlignCell className="cell-innerText WaKeywordPosition">
            {value == -1 ? "-" : value}
        </RightAlignCell>
    );
};
WaKeywordPosition.displayName = "WaKeywordPosition";
