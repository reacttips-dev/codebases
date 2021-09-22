import * as React from "react";
import styled, { css } from "styled-components";
import StyledBoxSubtitle from "../../../../styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import StyledLink from "../../../../styled components/StyledLink/src/StyledLink";
import { SWReactIcons } from "@similarweb/icons";

export const ExternalLink = styled.a`
    opacity: 0;
    transition: 0.2s opacity ease-in-out;
    margin-left: 5px;
    display: inline-block;
    ${SWReactIcons} {
        display: flex;
        align-items: center;
    }
    div {
        display: inline;
        font-size: 14px;
    }
    svg {
        width: 16px;
        height: 16px;
        path {
            fill: #707070;
        }
    }
`;

// backward compatability, there are some inherit changes
export const ContentContainer = styled(FlexColumn)`
    width: 100%;
`;
ContentContainer.displayName = "ContentContainer";

export const Flex = styled(FlexRow)`
    align-items: center;
    display: inline-flex;
    height: 100%;
    :hover ${ExternalLink} {
        opacity: 1;
    }
`;
export const Container = styled(Flex)`
    width: 100%;
`;

export const Link = styled(StyledLink)`
    color: #2a3e52;
    font-family: Roboto;
    font-size: 14px;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    overflow: hidden;
    ${({ center }) =>
        center &&
        css`
            position: relative;
            top: 2px;
        `}
`;
export const InnerLink = styled(Link)`
    width: 100%;
    &:hover {
        width: 80%;
    }
    transition: width 0.3s;
`;

export const InnerLinkContainer = styled(FlexRow)`
    width: calc(100% - 5px);
`;
export const TextContainer = styled.span<{ marginLeft?: string }>`
    ${({ marginLeft = "15px" }) => `margin-left: ${marginLeft}`};
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex-grow: 1;
    overflow: hidden;
`;

export const Subtitle = styled(StyledBoxSubtitle)`
    margin-left: 15px;
`;

export const GAIconContainer = styled.span`
    position: relative;
    top: 3px;
    margin-left: 4px;
`;
