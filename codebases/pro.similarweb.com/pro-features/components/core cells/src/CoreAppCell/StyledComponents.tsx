import { SWReactIcons } from "@similarweb/icons";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import * as React from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";

export const AppRow: any = styled(FlexRow)`
    width: 100%;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    color: ${({ bold }) => (bold ? "#2A3D53" : "rgba(42,61,83,0.8)")};
    font-family: Roboto;
`;
AppRow.displayName = "AppRow";

export const AppIcon: any = styled(ItemIcon)`
    margin-right: 8px;
    width: 24px;
    height: 24px;

    .ItemIcon-img {
        width: 18px;
        height: 18px;
    }
`;
AppIcon.displayName = "AppIcon";

export const Icon: any = styled(SWReactIcons)`
    position: relative;
    top: 2px;
    margin-left: 8px;
    svg {
        width: 1em;
        height: 1em;
        path {
            fill: ${({ bold }) => (bold ? "#2A3D53" : "rgba(42,61,83,0.8)")};
        }
    }
`;
Icon.displayName = "Icon";

export const HoverIcon: any = styled(Icon)`
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    cursor: pointer;
`;
HoverIcon.displayName = "HoverIcon";

export const AppContent: any = styled(FlexRow)`
    width: ${({ hasStore, hasLeader, hasExternalLink }) =>
        `calc(100%${hasStore ? " - 22px" : ""}${hasLeader ? " - 22px" : ""}${
            hasExternalLink ? " - 22px" : ""
        } - 18px)`};
    align-items: center;
    :hover {
        ${HoverIcon} {
            opacity: 1;
        }
    }
    .CoreAppCell-app-text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .CoreAppCell-link {
        color: #4e8cf9;
        text-decoration: none;
    }
`;
AppContent.displayName = "AppContent";
