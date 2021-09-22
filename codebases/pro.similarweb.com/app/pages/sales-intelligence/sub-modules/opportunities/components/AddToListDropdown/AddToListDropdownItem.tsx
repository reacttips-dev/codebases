import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { StyledAddToListDropdownItem, StyledAddToListDropdownItemText, StyledName } from "./styles";
import * as classNames from "classnames";
import { AddToListDropdownItemProps } from "./types";

const AddToListDropdownItem = ({
    list,
    onClick,
    iconName = "list-icon",
    disabled = false,
}: AddToListDropdownItemProps) => {
    const handleClick = ({ currentTarget }: React.SyntheticEvent<HTMLDivElement>) => {
        // Workaround because active css selector not work in this case #SIM-34922
        if (!currentTarget.classList.contains("disabled")) {
            currentTarget.classList.add("visited");
        }
        onClick(list);
    };

    return (
        <StyledAddToListDropdownItem
            className={classNames({ disabled: disabled })}
            onClick={handleClick}
            data-automation={`add-to-list-dropdown-item-${list.opportunityListId}`}
        >
            <SWReactIcons iconName={iconName} size="xs" />
            <StyledAddToListDropdownItemText>
                <StyledName>{list.friendlyName}</StyledName>
            </StyledAddToListDropdownItemText>
        </StyledAddToListDropdownItem>
    );
};

export default AddToListDropdownItem;
