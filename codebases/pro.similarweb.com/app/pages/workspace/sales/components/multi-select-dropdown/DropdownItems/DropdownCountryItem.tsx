import React from "react";
import { CheckboxIcon } from "@similarweb/ui-components/dist/dropdown";
import { StyledPercent, Container } from "./styles";
import { StyledIcon } from "../styles";

type DropdownCountryItemProps = {
    id: number;
    selected: boolean;
    text: string;
    onClick?: () => void;
    active: boolean;
    onMouseHover(): void;
    showIcon: boolean;
    percent?: number;
    halfSelected?: boolean;
};

const DropdownCountryItem: React.FC<DropdownCountryItemProps> = ({
    selected,
    text,
    id,
    onClick,
    onMouseHover,
    active,
    showIcon = true,
    percent,
    halfSelected = false,
}) => {
    return (
        <Container
            onClick={onClick}
            onMouseEnter={onMouseHover}
            data-automation={"dd-item"}
            data-automation-selected={selected}
            active={active}
            showIcon={showIcon}
        >
            {showIcon && <StyledIcon marginRight={10} className={`country-icon-${id}`} />}
            <span>{text}</span>
            {percent && <StyledPercent>{percent}</StyledPercent>}
            <CheckboxIcon selected={selected} halfSelected={halfSelected} />
        </Container>
    );
};

export default DropdownCountryItem;
