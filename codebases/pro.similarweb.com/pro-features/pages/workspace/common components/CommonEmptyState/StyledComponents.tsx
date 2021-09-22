import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import {
    WorkspaceEmptyStateContainer,
    WorkspaceEmptyStateContainerImage,
    WorkspaceEmptyStateSubTitle,
    WorkspaceEmptyStateTitle,
} from "../../../../components/Workspace/EmptyState/src/StyledComponent";

export const CommonEmptyStateWrapper = styled(FlexRow)`
    justify-content: center;
    margin: 110px auto 0;
    ${WorkspaceEmptyStateContainer} {
        margin: 0 64px;
    }
    ${WorkspaceEmptyStateContainerImage} {
        height: 68px;
        margin-bottom: 16px;
    }
    ${WorkspaceEmptyStateTitle} {
        font-size: 20px;
    }
    ${WorkspaceEmptyStateSubTitle} {
        margin-bottom: 24px;
        max-width: 240px;
    }
`;
CommonEmptyStateWrapper.displayName = "CommonEmptyStateWrapper";
