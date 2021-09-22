import { Box } from "@similarweb/ui-components/dist/box";
import { Flex } from "pages/Leading Folders/src/LeadingFoldersInfoPanel";
import * as React from "react";
import styled from "styled-components";
import StyledLink from "../../../../../../styled components/StyledLink/src/StyledLink";
import { StyledHeader } from "../../StyledComponents";

const br0 = "380px";

export const HeaderWithLinkContainer: any = styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-right: 12px;
    width: 100%;
    height: 92px;
    box-sizing: border-box;
    margin-top: 24px;
    font-family: Roboto;
    ${StyledHeader} {
        border-bottom: none;
    }
    @media (max-width: ${br0}) {
        height: 114px;
    }
`;
HeaderWithLinkContainer.displayName = "HeaderWithLinkContainer";

export const CompareLink: any = styled(StyledLink)`
    font-size: 14px;
    align-self: center;
`;
CompareLink.displayName = "CompareLink";
