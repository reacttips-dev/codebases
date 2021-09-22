import React from "react";
import {
    StyledDomainBottom,
    StyledDomainNumber,
    StyledDomainsList,
    StyledListDropdownContent,
    StyledSelectDomainsDropdown,
    StyledText,
} from "./styled";
import DomainDropdownItem from "./DomainsDropdownItem";
import { SWReactIcons } from "@similarweb/icons";
import DropdownButton from "../Dropdowns/Button/DropdownButton";
import { useOnOutsideClick } from "pages/sales-intelligence/hooks/useOnOutsideClick";
import {
    DropdownListItem,
    TypeOfListItem,
} from "pages/sales-intelligence/common-components/MultiSelector/types";
import { useMultiSelectorContext } from "pages/sales-intelligence/context/MultiSelectorContext";

type SelectDomainsDropdownProps = {
    handleClickDomainItem(amount: number, index: number): void;
    handleClickManuallyDomainItem(index: number): void;
    buttonLabel: string;
    total: number;
    listOfRange: DropdownListItem[];
    className?: string;
    hideDropdownBottom?: boolean;
    bottomText?: string;
    selected?: number;
};

const SelectDomainsDropdown: React.FC<SelectDomainsDropdownProps> = (props) => {
    const {
        selected,
        handleClickDomainItem,
        handleClickManuallyDomainItem,
        buttonLabel,
        total,
        listOfRange,
        hideDropdownBottom = false,
        bottomText,
        className = "select-domains-dropdown",
    } = props;

    const [isOpen, setIsOpen] = React.useState(false);
    const { onCloseRightSideBar } = useMultiSelectorContext();

    const openDropdown = () => {
        onCloseRightSideBar();
        setIsOpen(true);
    };
    const closeDropdown = () => {
        setIsOpen(false);
    };

    useOnOutsideClick(className, closeDropdown);

    const onClickItem = (index: number) => (amount: number) => {
        closeDropdown();
        handleClickDomainItem(amount, index);
    };

    const onClickManuallyItem = (index: number) => () => {
        closeDropdown();
        handleClickManuallyDomainItem(index);
    };

    const itemsList = () => {
        return listOfRange.map(({ type, value, label }, index) => {
            if (type === TypeOfListItem.MANUAL) {
                return (
                    <DomainDropdownItem
                        key={"manual"}
                        selected={index === selected}
                        label={label}
                        onClick={onClickManuallyItem(index)}
                    />
                );
            }

            return (
                <DomainDropdownItem
                    selected={index === selected}
                    key={value}
                    amount={value}
                    label={label}
                    onClick={onClickItem(index)}
                />
            );
        });
    };

    const renderDropdownBottom = () => (
        <StyledDomainBottom>
            <SWReactIcons iconName="info-full" size="xs" />
            <StyledText>{bottomText}</StyledText>
            <StyledDomainNumber>{total}</StyledDomainNumber>
        </StyledDomainBottom>
    );

    return (
        <StyledSelectDomainsDropdown className={className}>
            <DropdownButton title={buttonLabel} onClick={openDropdown} />
            <StyledListDropdownContent open={isOpen}>
                <StyledDomainsList>{itemsList()}</StyledDomainsList>
                {!hideDropdownBottom && renderDropdownBottom()}
            </StyledListDropdownContent>
        </StyledSelectDomainsDropdown>
    );
};

export default SelectDomainsDropdown;
