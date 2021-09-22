import * as React from "react";
import { FC } from "react";
import styled from "styled-components";
import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";
import { RelevancyScore } from "components/RelevancyScore/src/RelevancyScore";
import { CenteredWrapper } from "pages/website-analysis/incoming-traffic/StyledComponents";
import { i18nFilter } from "filters/ngFilters";

const CellWrapper = styled.div`
    margin: 5px auto 0 auto;
    max-width: 60px;
`;
export const RelevancySingleCell: FC<ITableCellProps> = ({ value, row }) => {
    return row.parent && !value ? (
        <CenteredWrapper>-</CenteredWrapper>
    ) : value ? (
        <CellWrapper>
            <RelevancyScore maxBullets={5} bullets={value} />
        </CellWrapper>
    ) : (
        <CenteredWrapper>
            {i18nFilter()("incoming-traffic.engagement-score.traffic-is-too-low")}
        </CenteredWrapper>
    );
};
