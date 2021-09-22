import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { IndustryItemWrapper, TextWrapper } from "./styles";

type IndustryItemProps = {
    text: string;
    icon: string;
    onClick(): void;
};

export function IndustryItem({ text, onClick, icon }: IndustryItemProps) {
    return (
        <IndustryItemWrapper onClick={onClick}>
            <SWReactIcons iconName={icon} size="sm" />
            <TextWrapper>{text}</TextWrapper>
        </IndustryItemWrapper>
    );
}
