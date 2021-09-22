import React from "react";
import DropdownHeaderItem from "pages/workspace/sales/components/multi-select-dropdown/DropdownHeaderItem/DropdownHeaderItem";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledHeaderItem } from "./styles";

/**
 * @date 2021-04-05
 * @param {string} firstTitle first column title key
 * @param {string} secondTitle second column title key
 * @returns {React.Node}
 */

export const SelectHeaderItem = ({
    firstTitle,
    secondTitle,
}: {
    firstTitle: string;
    secondTitle: string;
}): JSX.Element => {
    const translate = useTranslation();
    return (
        <DropdownHeaderItem isNested>
            <StyledHeaderItem>{translate(firstTitle)}</StyledHeaderItem>
            <StyledHeaderItem>{translate(secondTitle)}</StyledHeaderItem>
        </DropdownHeaderItem>
    );
};
