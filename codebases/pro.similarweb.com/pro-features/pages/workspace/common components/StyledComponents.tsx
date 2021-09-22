import {
    WorkspaceGrid,
    WorkspaceGridColumn,
} from "components/Workspace/WorkspaceGrid/src/WorkspaceGrid";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

const br1 = "1270px";

export const WorkspaceContainer = styled.div`
    width: 100%;
    margin: 0 auto;
    padding: 0px 36px 0 0;
    box-sizing: border-box;
    position: relative;
    ${WorkspaceGrid} {
        width: 100%;
    }
    ${WorkspaceGridColumn} {
        width: 100%;
    }
`;
WorkspaceContainer.displayName = "WorkspaceContainer";

export const WorkspaceStrip = styled.div`
    height: 100px;
    background-color: #2f3a66;
`;
WorkspaceStrip.displayName = "WorkspaceStrip";

export const FlexCentered = styled(FlexRow)`
    justify-content: center;
    @media (max-width: ${br1}) {
        flex-wrap: wrap;
        justify-content: flex-start;
    }
`;
FlexCentered.displayName = "FlexCentered";

export const TableContainer = styled.div`
    box-sizing: content-box;
    flex-grow: 1;
    margin-right: 24px;
    min-width: 650px;
    @media (max-width: ${br1}) {
        margin-right: 0px;
    }
`;
TableContainer.displayName = "TableContainer";

export const QuickLinksContainer = styled.div``;
QuickLinksContainer.displayName = "QuickLinksContainer";

export const WorkspaceWrapper = styled(FlexRow)``;

WorkspaceWrapper.displayName = "WorkspaceWrapper";

export const WorkspaceContentContainer = styled.div`
    flex: 1 1;
    box-sizing: border-box;
    min-width: 0;
    margin-right: -1px;

    .swTable-scroll {
        &.swTable-scroll--right {
            right: 8px;
        }
    }
`;
WorkspaceContentContainer.displayName = "WorkspaceContentContainer";
