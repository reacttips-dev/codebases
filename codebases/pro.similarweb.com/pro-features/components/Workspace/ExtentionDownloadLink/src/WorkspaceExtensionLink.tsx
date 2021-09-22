import * as React from "react";
import { ReactNode, StatelessComponent } from "react";
import {
    Content,
    DownloadLeftIcon,
    IconContainer,
    LinkText,
    LinkTitle,
    QuickLinkContainer,
} from "../../../../styled components/Workspace/src/StyledQuickLink";

export interface IWorkspaceExtensionLinkProps {
    downloadText: string;
    title: string;
    text: string;
    href?: string;
    target?: string;
    onClick?: () => void;
    className?: string;
    iconComponent?: ReactNode;
}

const WorkspaceExtensionLink: StatelessComponent<IWorkspaceExtensionLinkProps> = ({
    title,
    text,
    downloadText,
    href,
    onClick,
    target,
    className,
    iconComponent,
}) => {
    return (
        <QuickLinkContainer className={className} href={href} target={target} onClick={onClick}>
            <DownloadLeftIcon>
                <IconContainer>{iconComponent}</IconContainer>
            </DownloadLeftIcon>
            <Content>
                <LinkTitle>{title}</LinkTitle>
                <LinkText>{text}</LinkText>
            </Content>
        </QuickLinkContainer>
    );
};
WorkspaceExtensionLink.displayName = "WorkspaceExtensionLink";
export default WorkspaceExtensionLink;
