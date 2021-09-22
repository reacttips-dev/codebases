import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import styled from "styled-components";

export const SidebarDropDownItem = styled.div`
    display: flex;
    align-items: center;
    color: ${colorsPalettes.carbon["500"]};
    font-size: 14px;
    height: 48px;
    padding: 0 15px;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover {
        background-color: rgba(42, 62, 82, 0.05);
    }
    ${SWReactIcons} {
        margin-right: 8px;
    }
`;
SidebarDropDownItem.displayName = "SidebarDropDownItem";

export const SidebarDropDownLink: any = styled.a`
    text-decoration: none;
    height: 100%;
    display: flex;
    align-items: center;
    color: inherit;
    flex-grow: 1;
`;
SidebarDropDownLink.displayName = "SidebarDropDownLink";

export const WorkspacesDropDownItem = styled(SidebarDropDownItem)``;
WorkspacesDropDownItem.displayName = "WorkspacesDropDownItem";

export const WorkspacesDropDownLink = styled(SidebarDropDownLink)``;
WorkspacesDropDownLink.displayName = "WorkspacesDropDownLink";
