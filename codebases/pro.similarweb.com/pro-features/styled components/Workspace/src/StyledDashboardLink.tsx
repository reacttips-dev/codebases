import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import * as React from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled, { css } from "styled-components";

export interface IDashboardLinkCreatedProps {
    active: boolean;
}

export const DashboardLinkContainerBase = styled.div<IDashboardLinkCreatedProps>`
    box-sizing: border-box;
    height: 82px;
    padding: 0 24px;
    border-radius: 6px;
    transition: background-color ease 300ms;
    background-color: ${({ active }) =>
        active ? colorsPalettes.blue[400] : colorsPalettes.carbon[0]};
    &:hover {
        background-color: ${({ active }) =>
            active ? colorsPalettes.blue[500] : colorsPalettes.carbon[25]};
    }
    border: ${({ active }) => !active && `1px solid ${colorsPalettes.carbon[50]}`};
    color: ${({ active }) => (active ? colorsPalettes.carbon[0] : colorsPalettes.carbon[500])};
    ${SWReactIcons} {
        svg {
            path {
                fill: ${({ active }) =>
                    active ? colorsPalettes.carbon[0] : colorsPalettes.blue[400]};
            }
        }
    }
`;
DashboardLinkContainerBase.displayName = "DashboardLinkContainerBase";

export const boldText = setFont({ $size: 14, $weight: 700 });

export const DashboardLinkStyled = styled.a`
    text-decoration: none;
    display: block;
    flex-grow: 1;
    flex-basis: 33.33%;
    width: 304px;
`;
DashboardLinkStyled.displayName = "DashboardLinkStyled";

export const DashboardLinkTitle = styled.div`
    ${boldText};
    margin-bottom: 8px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;
DashboardLinkTitle.displayName = "DashboardLinkTitle";

export const DashboardCreateLinkTitle = styled.div`
    ${setFont({ $size: 13, $weight: 700 })};
    margin-bottom: 2px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;
DashboardCreateLinkTitle.displayName = "DashboardCreateLinkTitle";

export const DashboardLinkCreated = styled.div`
    ${setFont({ $size: 12, $color: colorsPalettes.carbon[200] })};
`;
DashboardLinkCreated.displayName = "DashboardLinkCreated";

export const DashboardLinkDescription = styled.div`
    ${setFont({ $size: 12 })};
`;
DashboardLinkDescription.displayName = "DashboardLinkDescription";

export const DashboardCreateLinkDescription = styled.div`
    ${setFont({ $size: 12 })};
    line-height: 16px;
    max-width: 70%;
    @media screen and (-webkit-min-device-pixel-ratio: 0) {
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    @media screen and (min--moz-device-pixel-ratio: 0) {
        max-height: 35px;
    }
`;
DashboardCreateLinkDescription.displayName = "DashboardCreateLinkDescription";

export const DashboardLinkContainer = styled(DashboardLinkContainerBase)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    flex-grow: 1;
    cursor: pointer;
`;
DashboardLinkContainer.displayName = "DashboardLinkContainer";

export const Icon = styled(SWReactIcons)`
    path {
        fill: ${colorsPalettes.blue[400]};
    }
`;
Icon.displayName = "Icon";

export const DashboardLinkIcon = styled(Icon)`
    position: absolute;
    right: 8px;
    bottom: 8px;
`;
DashboardLinkIcon.displayName = "DashboardLinkIcon";

export const DashboardCreateLinkContainer = styled(DashboardLinkContainer)`
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 12px;
    width: 304px;
`;
DashboardCreateLinkContainer.displayName = "DashboardCreateLinkContainer";

export const DashboardCreateLinkIconContainer = styled.div`
    margin-right: 12px;
`;
DashboardCreateLinkIconContainer.displayName = "DashboardCreateLinkIconContainer";

export const DashboardCreateLinkContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
DashboardCreateLinkContent.displayName = "DashboardCreateLinkContent";
