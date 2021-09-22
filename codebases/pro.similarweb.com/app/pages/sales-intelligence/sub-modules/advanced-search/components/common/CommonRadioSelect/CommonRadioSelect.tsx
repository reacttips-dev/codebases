import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import {
    StyledRadioSelectContainer,
    StyledRadioContainer,
    StyledRadioButton,
    StyledInfoIcon,
} from "./styles";

type CommonRadioSelectProps = {
    items: { id: string; text: string; tooltip?: string }[];
    selected: string;
    className?: string;
    onSelect(id: string): void;
};

const CommonRadioSelect = (props: CommonRadioSelectProps) => {
    const { items, selected, className = null, onSelect } = props;

    return (
        <StyledRadioSelectContainer className={className}>
            {items.map((item) => (
                <StyledRadioContainer key={item.id}>
                    <StyledRadioButton
                        itemLabel={item.text}
                        onClick={() => onSelect(item.id)}
                        itemSelected={item.id === selected}
                    />
                    {item.tooltip && (
                        <PlainTooltip tooltipContent={item.tooltip}>
                            <StyledInfoIcon>
                                <SWReactIcons iconName="info" size="xs" />
                            </StyledInfoIcon>
                        </PlainTooltip>
                    )}
                </StyledRadioContainer>
            ))}
        </StyledRadioSelectContainer>
    );
};

export default CommonRadioSelect;
