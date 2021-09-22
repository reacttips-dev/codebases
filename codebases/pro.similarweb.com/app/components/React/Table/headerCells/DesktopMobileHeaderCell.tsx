import * as React from "react";
import { StatelessComponent } from "react";
import { ITableHeaderCellProps } from "../interfaces/ITableCellProps";
import styled from "styled-components";

export const HeaderCell = styled.div`
    width: 100%;
`;

export const DesktopMobileText = styled.div`
    width: 100%;

    padding-top: 20px;
`;

export const DesktopMobileHeaderCell: StatelessComponent<ITableHeaderCellProps> = ({
    displayName,
}) => {
    return (
        <HeaderCell className="headerCell">
            <DesktopMobileText className="desktopMobile-text">{displayName}</DesktopMobileText>
            <div className="desktopMobile-icon">
                <i className="sw-icon-desktop--thin"></i>
                <i className="sw-icon-mobile--thin"></i>
            </div>
        </HeaderCell>
    );
};
DesktopMobileHeaderCell.displayName = "DesktopMobileHeaderCell";
