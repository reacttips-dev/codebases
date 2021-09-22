import { CircleSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export interface IDataType {
    title: "#" | "%";
    value: "numbers" | "percents";
    disabled?: boolean;
}

export interface IGraphTypeSwitcherProps {
    onItemClick: (index: number) => void;
    selectedIndex: number;
    buttonsList: IDataType[];
}

const GraphTypeSwitcherContainer = styled(Switcher)`
    border-right: 1px solid ${colorsPalettes.carbon[50]};
    margin-right: 20px;
    height: fit-content;
`;

export const GraphTypeSwitcher = (props: IGraphTypeSwitcherProps) => {
    const { onItemClick, selectedIndex, buttonsList } = props;
    return (
        <GraphTypeSwitcherContainer selectedIndex={selectedIndex} onItemClick={onItemClick}>
            {buttonsList.map(({ title, value, disabled }, index) => (
                <CircleSwitcherItem key={index} disabled={disabled}>
                    {title}
                </CircleSwitcherItem>
            ))}
        </GraphTypeSwitcherContainer>
    );
};
