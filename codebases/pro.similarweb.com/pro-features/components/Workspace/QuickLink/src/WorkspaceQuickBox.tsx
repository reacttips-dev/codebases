import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import React, { FC, ReactNode } from "react";
import {
    Content,
    IconContainer,
    LeftIcon,
    LinkText,
    LinkTitle,
    QuickLinkContainer,
} from "styled components/Workspace/src/StyledQuickLink";
import styled from "styled-components";

export interface IWorkspaceQuickLinkProps {
    title: string;
    text: string;
    onClick?: () => void;
    iconComponent?: ReactNode;
}

export const StyledLinkTitle = styled(LinkTitle)`
    ${setFont({ $size: 16, $color: colorsPalettes.carbon[0], $weight: 500 })};
    letter-spacing: 0.5px;
    margin: 8px 0;
    padding-right: 16px;
`;

export const StyledLinkText = styled(LinkText)`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[0], $weight: "normal" })};
    margin-bottom: 5px;
    line-height: 1.43;
    letter-spacing: 0.5px;
`;

const WorkspaceQuickBox: FC<IWorkspaceQuickLinkProps> = ({
    title,
    text,
    onClick,
    iconComponent,
}) => {
    return (
        <QuickLinkContainer
            onClick={onClick}
            data-automation={`quick-link-${title.toLowerCase().replace(" ", "-")}`}
        >
            <LeftIcon>
                <IconContainer>{iconComponent}</IconContainer>
            </LeftIcon>
            <Content>
                <StyledLinkTitle>{title}</StyledLinkTitle>
                <StyledLinkText>{text}</StyledLinkText>
            </Content>
        </QuickLinkContainer>
    );
};
WorkspaceQuickBox.displayName = "WorkspaceQuickBox";
export default WorkspaceQuickBox;
