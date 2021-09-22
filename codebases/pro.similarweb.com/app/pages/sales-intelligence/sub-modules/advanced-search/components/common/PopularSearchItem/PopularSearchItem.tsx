import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { PopularSearchTemplateIcon } from "../../../types/common";
import {
    StyledItemContainer,
    StyledItemSubtitle,
    StyledItemTitle,
    StyledIconContainer,
    StyledDefaultPlusIcon,
    StyledCustomIconContainer,
} from "./styles";

type PopularSearchItemProps = {
    title: string;
    subtitle: string;
    icon: PopularSearchTemplateIcon | null;
    onClick(): void;
};

const PopularSearchItem = (props: PopularSearchItemProps) => {
    const { title, subtitle, icon, onClick } = props;

    const renderIcon = () => {
        if (!icon) {
            return (
                <StyledIconContainer>
                    <StyledDefaultPlusIcon>
                        <SWReactIcons iconName="plus-icon" size="sm" />
                    </StyledDefaultPlusIcon>
                </StyledIconContainer>
            );
        }

        return (
            <StyledCustomIconContainer iconWidth={icon.width} iconHeight={icon.height}>
                <SWReactIcons iconName={icon.name} size="lg" />
            </StyledCustomIconContainer>
        );
    };

    return (
        <StyledItemContainer onClick={onClick} data-automation="popular-search-item">
            {renderIcon()}
            <StyledItemTitle>{title}</StyledItemTitle>
            <StyledItemSubtitle>{subtitle}</StyledItemSubtitle>
        </StyledItemContainer>
    );
};

export default PopularSearchItem;
