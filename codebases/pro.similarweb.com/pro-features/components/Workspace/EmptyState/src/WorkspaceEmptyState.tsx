import * as React from "react";
import { ReactNode, StatelessComponent } from "react";
import {
    WorkspaceEmptyStateContainer,
    WorkspaceEmptyStateContainerImage,
    WorkspaceEmptyStateSubTitle,
    WorkspaceEmptyStateTitle,
} from "./StyledComponent";

interface IWorkspaceEmptyStateProps {
    className?: string;
    title: string;
    subTitle?: string;
    image?: ReactNode;
    button?: ReactNode;
}

export const WorkspaceEmptyState: StatelessComponent<IWorkspaceEmptyStateProps> = ({
    className,
    title,
    subTitle,
    image,
    button,
}) => {
    return (
        <WorkspaceEmptyStateContainer className={className}>
            {image && (
                <WorkspaceEmptyStateContainerImage>{image}</WorkspaceEmptyStateContainerImage>
            )}
            <WorkspaceEmptyStateTitle>{title}</WorkspaceEmptyStateTitle>
            {subTitle && <WorkspaceEmptyStateSubTitle>{subTitle}</WorkspaceEmptyStateSubTitle>}
            {button}
        </WorkspaceEmptyStateContainer>
    );
};

WorkspaceEmptyState.displayName = "WorkspaceEmptyState";
WorkspaceEmptyState.defaultProps = {
    title: "",
};
