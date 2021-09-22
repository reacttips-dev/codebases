import React, { FC } from "react";
import styled from "styled-components";
import { colorsPalettes, rgba, mixins } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";

interface IGroupDropdownMenuItemProps {
    id: string;
    iconName: string;
    title: string;
    description: string;
    isDisabled?: boolean;
    className?: string;
    onClick?: () => void;
}

const GroupContainer = styled.div<{ disabled?: boolean }>`
    padding: 11px 15px;
    min-height: 86px;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    background-color: ${colorsPalettes.carbon[0]};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

    &:hover {
        background-color: ${rgba(colorsPalettes.carbon[500], 0.05)};
    }
`;

const Icon = styled(SWReactIcons).attrs({ size: "sm" })`
    margin-right: 7px;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 259px;
`;

const Title = styled.div`
    margin-bottom: 6px;
    color: ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
`;

const Descritpion = styled.div`
    color: ${mixins.setFont({ $size: 12, $color: rgba(colorsPalettes.carbon[500], 0.6) })};
    line-height: 16px;
`;

export const GroupDropdownMenuItem: FC<IGroupDropdownMenuItemProps> = (props) => {
    const { id, className, onClick, isDisabled, iconName, title, description } = props;

    return (
        <GroupContainer id={id} className={className} onClick={onClick} disabled={isDisabled}>
            <Icon iconName={iconName} />
            <Content>
                <Title>{title}</Title>
                <Descritpion>{description}</Descritpion>
            </Content>
        </GroupContainer>
    );
};
