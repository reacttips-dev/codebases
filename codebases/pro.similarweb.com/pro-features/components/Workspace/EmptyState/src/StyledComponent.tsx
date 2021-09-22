import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

export const WorkspaceEmptyStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 110px auto 0;
    text-align: center;
`;
WorkspaceEmptyStateContainer.displayName = "WorkspaceEmptyStateContainer";

export const WorkspaceEmptyStateTitle = styled.div`
    ${setFont({ $color: colorsPalettes.carbon[500], $size: 32, $weight: 500 })};
    margin-bottom: 16px;
`;
WorkspaceEmptyStateTitle.displayName = "WorkspaceEmptyStateTitle";

export const WorkspaceEmptyStateSubTitle = styled.div`
    ${setFont({ $color: colorsPalettes.carbon[400], $size: 14 })};
    margin-bottom: 35px;
    max-width: 340px;
`;
WorkspaceEmptyStateSubTitle.displayName = "WorkspaceEmptyStateSubTitle";

export const WorkspaceEmptyStateContainerImage = styled.div`
    margin-bottom: 52px;
`;
WorkspaceEmptyStateContainerImage.displayName = "WorkspaceEmptyStateContainerImage";
