import * as React from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import StyledLink from "../../../../styled components/StyledLink/src/StyledLink";
import { StyledPrimaryTitle } from "../../../../styled components/StyledBoxTitle/src/StyledBoxTitle";

export enum Type {
    App = "app",
    Website = "website",
}

const br0 = "320px";

export const AppPerformanceContainer: any = styled.div.attrs({
    className: "app-performance-container",
})`
    display: flex;
    flex-direction: column;
    font-family: Roboto;
    @media (max-width: ${br0}) {
        margin: 40px 8px 0 8px;
    }
`;
AppPerformanceContainer.displayName = "AppPerformanceContainer";

export const StyledHeader: any = styled(FlexColumn)`
    height: 70px;
    padding-top: 24px;
    padding-left: 24px;
    border-bottom: 1px solid #e0e0e0;
`;
StyledHeader.displayName = "StyledHeader";

export const StyledHeaderNoBorder: any = styled(StyledHeader)`
    border-bottom: 0px;
`;
StyledHeader.displayName = "StyledHeaderNoBorder";

export const LoadingHeader: any = styled(FlexColumn)`
    padding-top: 24px;
    .px-lod1 {
        padding-left: 24px;
        margin-bottom: 8px;
    }
    .px-lod2 {
        padding-left: 24px;
        margin-bottom: 24px;
    }
`;
LoadingHeader.displayName = "LoadingHeader";

export const StyledHeaderTitle: any = styled(StyledPrimaryTitle)`
    margin-bottom: 8px;
`;
StyledHeaderTitle.displayName = "StyledHeaderTitle";

export const FooterLayout: any = styled(FlexRow)`
    height: 65px;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
    border-top: 1px solid #e0e0e0;
`;
FooterLayout.displayName = "FooterLayout";

export const LearnMore: any = styled(StyledLink)`
    font-size: 14px;
`;
LearnMore.displayName = "LearnMore";
