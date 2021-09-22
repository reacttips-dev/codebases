import * as React from "react";
import { StatelessComponent } from "react";
import { ITableHeaderCellProps } from "../interfaces/ITableCellProps";
import styled from "styled-components";
import {
    FlexColumn,
    FlexRow,
} from "../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { i18nFilter } from "../../../../filters/ngFilters";

const ColumnsContainer = styled(FlexRow)`
    justify-content: space-between;
    width: 100%;
`;

export const TwoColumnsHeaderCell: StatelessComponent<ITableHeaderCellProps> = (props) => {
    const { leftCol, rightCol } = props;

    return (
        <ColumnsContainer>
            <div>{i18nFilter()(leftCol)}</div>
            <div>{i18nFilter()(rightCol)}</div>
        </ColumnsContainer>
    );
};
