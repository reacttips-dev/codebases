import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    StyledAddToListDropdownItem,
    StyledAddToListDropdownItemText,
    StyledCreateListItem,
} from "./styles";
import { CreateListItemProps } from "./types";

const CreateListItem = ({ clickable, onClick }: CreateListItemProps) => {
    const translate = useTranslation();

    return (
        <StyledCreateListItem clickable={clickable}>
            <StyledAddToListDropdownItem
                onClick={onClick}
                data-automation="add-to-list-dropdown-create-item"
            >
                <SWReactIcons iconName="add" size="sm" />
                <StyledAddToListDropdownItemText>
                    <span>{translate("si.components.add_to_list_dropdown.create")}</span>
                </StyledAddToListDropdownItemText>
            </StyledAddToListDropdownItem>
        </StyledCreateListItem>
    );
};

export default CreateListItem;
