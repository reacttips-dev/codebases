import { percentageFilter, suffixFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { ITableCellProps } from "../interfaces/ITableCellProps";

const StyledBounceRate = styled.div`
    text-align: right;
`;

export const BounceRate: StatelessComponent<ITableCellProps> = ({ value }) => {
    return (
        <StyledBounceRate>
            <span className="value">{suffixFilter()(percentageFilter()(value, 2, "-"), "%")}</span>
        </StyledBounceRate>
    );
};
BounceRate.displayName = "BounceRate";
