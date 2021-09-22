import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import * as React from "react";
import { ReactNode, StatelessComponent } from "react";
import styled from "styled-components";

interface IUserSegmentListTypeSelectorItemProps {
    title: ReactNode;
    description: ReactNode;
    onClick?: () => void;
    preventDefault?: boolean;
    closePopupOnClick?: boolean;
}

const UserListTypeSelectorItemContainer = styled.div`
    padding: 15px 15px;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    background-color: ${colorsPalettes.carbon[0]};
    cursor: pointer;
    &:hover {
        background-color: ${rgba(colorsPalettes.carbon[500], 0.05)};
    }
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 100%;
`;

const Title = styled.div`
    margin-bottom: 6px;
    color: ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
`;

const Descritpion = styled.div`
    color: ${mixins.setFont({ $size: 12, $color: rgba(colorsPalettes.carbon[500], 0.6) })};
    line-height: 16px;
`;

export const UserSegmentListTypeSelectorItem: StatelessComponent<IUserSegmentListTypeSelectorItemProps> = ({
    title,
    description,
    onClick,
}) => {
    return (
        <UserListTypeSelectorItemContainer onClick={onClick}>
            <Content>
                <Title>{title}</Title>
                <Descritpion>{description}</Descritpion>
            </Content>
        </UserListTypeSelectorItemContainer>
    );
};
