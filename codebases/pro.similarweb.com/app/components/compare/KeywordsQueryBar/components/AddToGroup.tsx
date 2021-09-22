import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ButtonContainer } from "../KeywordsQueryBarStyles";
import { ADD_TO_GROUP_TOOLTIP } from "../constants";
import { ServicesType } from "./KeywordsQueryBarItem";
import KeywordsAddToGroupDropdown from "./KeywordsAddToGroupDropdown";

export const AddToGroupButton = ({
    isDropdownOpen,
    keyword,
    services,
    setIsDropdownOpen,
}: {
    isDropdownOpen: boolean;
    keyword: string;
    services: ServicesType;
    setIsDropdownOpen(isOpen: boolean): void;
}) => {
    const translate = useTranslation();

    return (
        <PlainTooltip
            placement="bottom"
            tooltipContent={translate(ADD_TO_GROUP_TOOLTIP)}
            enabled={!isDropdownOpen}
        >
            <ButtonContainer>
                <KeywordsAddToGroupDropdown
                    keywordToAdd={keyword}
                    buttonIcon="add-to-group"
                    services={services}
                    onDropdownToggle={(isOpen: boolean) => setIsDropdownOpen(isOpen)}
                />
            </ButtonContainer>
        </PlainTooltip>
    );
};
