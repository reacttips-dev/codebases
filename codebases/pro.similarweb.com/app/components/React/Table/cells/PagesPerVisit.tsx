import { swNumberFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { RightAlignedCell } from "./RankCell";

export const PagesPerVisit: StatelessComponent<ITableCellProps> = ({ value }) => {
    return (
        <RightAlignedCell>
            <span className="value">{swNumberFilter()(value || 0, 2)}</span>
        </RightAlignedCell>
    );
};
PagesPerVisit.displayName = "PagesPerVisit";
