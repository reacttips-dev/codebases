import { Title } from "@similarweb/ui-components/dist/title";
import * as React from "react";
import styled from "styled-components";
import { default as BoxTitle, InfoIcon } from "../../../components/BoxTitle/src/BoxTitle";

const StyledPrimaryTitle: any = styled(Title).attrs({
    "data-automation-box-title": true,
})`
    font-size: 20px;
    color: #2a3e52;
`;

StyledPrimaryTitle.displayName = "StyledPrimaryTitle";

const StyledSecondaryTitle: any = styled(Title).attrs({
    "data-automation-box-title": true,
})`
    font-size: 16px;
    color: #2a3e52;
    ${InfoIcon} {
        line-height: 1.55;
    }
`;

StyledSecondaryTitle.displayName = "StyledSecondaryTitle";

const PrimaryBoxTitle: any = ({ children, ...props }) => (
    <StyledPrimaryTitle>
        <BoxTitle {...props}>{children}</BoxTitle>
    </StyledPrimaryTitle>
);

const SecondaryBoxTitle: any = ({ children, ...props }) => (
    <StyledSecondaryTitle>
        <BoxTitle {...props}>{children}</BoxTitle>
    </StyledSecondaryTitle>
);

export { PrimaryBoxTitle, SecondaryBoxTitle, StyledSecondaryTitle, StyledPrimaryTitle };
