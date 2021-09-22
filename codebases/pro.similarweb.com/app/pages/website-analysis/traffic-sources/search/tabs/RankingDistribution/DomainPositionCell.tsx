import { DomainCell } from "components/React/Table/cells";
import styled from "styled-components";
import { WinnerIcon } from "components/React/Table/cells/LeaderDefaultCell";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import React from "react";
import { SortComponent } from "components/React/Table/headerCells/DefaultCellHeader";

const StyledFlex = styled(FlexRow)`
    overflow: hidden;
    .headerCell-sortDirection {
        margin-left: 0;
    }
`;

export const DomainPositionCellHeader = (domain) => (props) => {
    return (
        <StyledFlex alignItems="center">
            {props.sortable && <SortComponent sortDirection={props.sortDirection} />}
            <DomainCell {...props} field={domain} />
        </StyledFlex>
    );
};
const WinnerIconStyled = styled(WinnerIcon)`
    transform: translateY(-1px);
`;

const DomainPositionCellText = styled.span<{ isLeader?: boolean }>`
    font-weight: ${({ isLeader }) => (isLeader ? 500 : 400)};
    margin-left: ${({ isLeader }) => (isLeader ? 5 : 0)}px;
`;
export const DomainPositionCell = (domain) => ({ row }) => {
    const value = row.SiteData[domain].CurrentPosition || "-";
    const isLeader = row.PositionLeader.domain === domain;
    return (
        <FlexRow alignItems="center" justifyContent="flex-end">
            {isLeader && <WinnerIconStyled iconName="winner" />}
            <DomainPositionCellText isLeader={isLeader}>{value}</DomainPositionCellText>
        </FlexRow>
    );
};
