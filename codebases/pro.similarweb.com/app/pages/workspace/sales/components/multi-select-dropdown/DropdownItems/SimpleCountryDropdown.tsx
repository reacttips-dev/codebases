import React from "react";
import { StyledPercent, Container } from "./styles";
import { StyledIcon } from "../styles";

type SimpleCountryDropdownProps = {
    id: number;
    selected: boolean;
    text: string;
    onClick?: () => void;
    active: boolean;
    onMouseHover(): void;
    showIcon: boolean;
    percent?: number;
};

const SimpleCountryDropdown: React.FC<SimpleCountryDropdownProps> = ({
    selected,
    text,
    id,
    onClick,
    onMouseHover,
    active,
    showIcon = true,
    percent,
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
        </Container>
    );
};

export default SimpleCountryDropdown;
