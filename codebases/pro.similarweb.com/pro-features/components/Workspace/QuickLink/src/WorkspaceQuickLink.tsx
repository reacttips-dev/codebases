import * as React from "react";
import { ReactNode, StatelessComponent } from "react";
import styled from "styled-components";
import {
    Content,
    IconContainer,
    LeftIcon,
    LinkText,
    LinkTitle,
    QuickLinkContainer,
} from "styled components/Workspace/src/StyledQuickLink";

export interface IWorkspaceQuickLinkProps {
    header: string;
    title: string;
    text: string;
    href?: string;
    target?: string;
    onClick?: () => void;
    className?: string;
    iconComponent?: ReactNode;
}

export const StyledLinkText = styled(LinkText)`
    padding-right: 16px;
`;

const WorkspaceQuickLink: StatelessComponent<IWorkspaceQuickLinkProps> = ({
    header,
    title,
    text,
    href,
    onClick,
    target,
    className,
    iconComponent,
}) => {
    return (
        <QuickLinkContainer
            className={className}
            href={href}
            target={target}
            onClick={onClick}
            data-automation={`quick-link-${title.toLowerCase().replace(" ", "-")}`}
        >
            <LeftIcon>
                <IconContainer>{iconComponent}</IconContainer>
            </LeftIcon>
            <Content>
                <LinkTitle>{title}</LinkTitle>
                <StyledLinkText>{text}</StyledLinkText>
            </Content>
        </QuickLinkContainer>
    );
};
WorkspaceQuickLink.displayName = "WorkspaceQuickLink";
export default WorkspaceQuickLink;
