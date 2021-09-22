import React from "react";
import { StyledDomainDropdownItem } from "./styled";

type DomainDropdownItemProps = {
    label: string;
    selected: boolean;
    amount?: number;
    onClick(value?: number): void;
};

const DomainDropdownItem = (props: DomainDropdownItemProps) => {
    const { label, selected, onClick, amount } = props;

    const handleOnClick = () => {
        onClick(amount);
    };

    return (
        <StyledDomainDropdownItem onClick={handleOnClick} selected={selected}>
            {label}
        </StyledDomainDropdownItem>
    );
};

export default DomainDropdownItem;
