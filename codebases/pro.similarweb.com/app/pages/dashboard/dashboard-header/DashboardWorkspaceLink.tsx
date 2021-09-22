import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { IArena } from "../../../services/marketingWorkspaceApiService";

interface IWorkspaceConnections {
    workspaceFriendlyName: string;
    workspaceId: string;
    workspaceType: string;
}

interface IMarketingWorkspaceConnections extends IWorkspaceConnections {
    arenaIds: Array<IArena>;
}

export interface IDashboardWorkspaceLink {
    dashboardId: string;
    relatedWorkspace: {
        investorsLinks: IWorkspaceConnections[];
        marketingLinks: IMarketingWorkspaceConnections[];
        salesLinks: IWorkspaceConnections[];
    };
    translate: any;
    track: any;
    getLink: any;
}

const DashboardWorkspaceLink: StatelessComponent<IDashboardWorkspaceLink> = ({
    dashboardId,
    relatedWorkspace,
    translate,
    track,
    getLink,
}) => {
    const { investorsLinks, marketingLinks, salesLinks } = relatedWorkspace;
    let params;
    let workspaceType;
    let state;
    if (investorsLinks.length > 0) {
        workspaceType = "Investors";
        params = {
            workspaceId: investorsLinks[0].workspaceId,
        };
        state = "investorsWorkspace";
    } else if (salesLinks.length > 0) {
        workspaceType = "Sales";
        params = {
            workspaceId: salesLinks[0].workspaceId,
        };
        state = "salesWorkspace";
    } else if (marketingLinks.length > 0) {
        workspaceType = "Marketing";
        params = {
            workspaceId: marketingLinks[0].workspaceId,
            arenaId: marketingLinks[0].arenaIds[0].id,
        };
        state = "marketingWorkspace-arena";
    }
    // incase of dashboard without connected workspace, do not render anything
    if (!workspaceType) {
        return null;
    }
    const generateLink = () => getLink(state, params);
    const clickTrack = () => {
        track("internal link", "click", `Workspaces/${workspaceType}`);
    };
    return (
        <DashboardWorkspaceLinkContainer>
            <WorkspaceLink target="_self" href={generateLink()} onClick={clickTrack}>
                <SWReactIcons iconName="arrow-left" size="sm" />
                <span>{translate("dashboards.header.link.myworkspaces")}</span>
            </WorkspaceLink>
        </DashboardWorkspaceLinkContainer>
    );
};

DashboardWorkspaceLink.displayName = "DashboardWorkspaceLink";
SWReactRootComponent(DashboardWorkspaceLink, "DashboardWorkspaceLink");

const DashboardWorkspaceLinkContainer = styled.div`
    position: absolute;
    top: 15px;
    z-index: 11;
`;
DashboardWorkspaceLinkContainer.displayName = "DashboardWorkspaceLinkContainer";

export const WorkspaceLink = styled.a`
    display: flex;
    text-transform: uppercase;
    font-size: 14px;
    align-items: center;
    color: ${colorsPalettes.carbon["300"]};
    ${SWReactIcons} {
        margin-right: 20px;
    }
    &:hover {
        color: ${colorsPalettes.blue[400]};
        cursor: pointer;
        .SWReactIcons {
            svg {
                path {
                    fill: ${colorsPalettes.blue[400]};
                }
            }
        }
    }
`;
WorkspaceLink.displayName = "WorkspaceLink";
