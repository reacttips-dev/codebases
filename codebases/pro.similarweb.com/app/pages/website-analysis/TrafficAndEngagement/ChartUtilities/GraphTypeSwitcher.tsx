import { colorsPalettes } from "@similarweb/styles";
import { CircleSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import {
    GraphTypeSwitcherContainer,
    StyledSWReactIcons,
} from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import React from "react";

export const GraphTypeSwitcher = ({ onItemClick, selectedIndex, icons }) => (
    <GraphTypeSwitcherContainer selectedIndex={selectedIndex} onItemClick={onItemClick}>
        {icons.map(({ size, name, disabled = false }, index) => (
            <CircleSwitcherItem key={index} disabled={disabled}>
                <StyledSWReactIcons
                    size={size}
                    iconName={name}
                    color={index === selectedIndex ? colorsPalettes.blue[400] : undefined}
                />
            </CircleSwitcherItem>
        ))}
    </GraphTypeSwitcherContainer>
);
