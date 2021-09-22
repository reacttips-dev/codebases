import { StatelessComponent } from "react";
import * as React from "react";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../../../styled components/StyledFlex/src/StyledFlex";
import BoxTitle from "../../../../BoxTitle/src/BoxTitle";

const PointTitle = styled(FlexRow)`
    font-size: 16px;
    color: #2a3e52;
`;
PointTitle.displayName = "PointTitle";

const PointInfoVertical = styled(FlexColumn)`
    margin: auto;
`;
PointInfoVertical.displayName = "PointInfoVertical";

const PointInfo: StatelessComponent<any> = ({ title, tooltip, children }) => {
    return (
        <PointInfoVertical data-automation-point-info-big={true}>
            <PointTitle>
                <BoxTitle tooltip={tooltip}>{title}</BoxTitle>
            </PointTitle>
            {children}
        </PointInfoVertical>
    );
};
PointInfo.displayName = "PointInfo";
export default PointInfo;
