import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import * as React from "react";
import { ReactNode, StatelessComponent } from "react";
import styled from "styled-components";

interface IWebsiteListTypeSelectorItemProps {
    iconName: string;
    title: ReactNode;
    description: ReactNode;
    onClick?: () => void;
    preventDefault?: boolean;
    closePopupOnClick?: boolean;
}

const WebsiteListTypeSelectorItemContainer = styled.div`
    padding: 11px 15px;
    min-height: 86px;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    background-color: ${colorsPalettes.carbon[0]};
    cursor: pointer;
    &:hover {
        background-color: ${rgba(colorsPalettes.carbon[500], 0.05)};
    }
`;

const Icon = styled(SWReactIcons).attrs({ size: "xs" })`
    margin-right: 7px;
    flex-shrink: 0;
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

export const WebsiteListTypeSelectorItem: StatelessComponent<IWebsiteListTypeSelectorItemProps> = ({
    iconName,
    title,
    description,
    onClick,
}) => {
    return (
        <WebsiteListTypeSelectorItemContainer onClick={onClick}>
            <Icon iconName={iconName} />
            <Content>
                <Title>{title}</Title>
                <Descritpion>{description}</Descritpion>
            </Content>
        </WebsiteListTypeSelectorItemContainer>
    );
};
