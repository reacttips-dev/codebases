import {
    Dropdown,
    NoBorderButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import React from "react";

import { array, func, number, bool } from "prop-types";
import { RuleTypesDropdownContainer } from "../EditRuleModeStyles";

export interface IBoarderlessDropdown {
    id: number;
    ruleTypeOptions: IRuleTypeOption[];
    selectedRuleTypeIndex: number;
    onRuleTypeSelectionChange: (itemProps: any) => void;
    isDisabled?: boolean;
}

export interface IRuleTypeOption {
    id: number;
    text: string;
}

const BorderlessDropdown: React.FunctionComponent<IBoarderlessDropdown> = ({
    id,
    ruleTypeOptions,
    selectedRuleTypeIndex,
    onRuleTypeSelectionChange,
    isDisabled,
}) => {
    const dropdownItems = ruleTypeOptions.map((elm, idx) => (
        <SimpleDropdownItem key={`rule-type-dropdown-elm-${idx}`} id={idx.toString()}>
            {elm.text}
        </SimpleDropdownItem>
    ));

    const selectedIds = {};
    ruleTypeOptions.forEach((elm, idx) => {
        selectedIds[elm.id] = idx === selectedRuleTypeIndex;
    });

    return (
        <RuleTypesDropdownContainer>
            <Dropdown
                selectedIds={selectedIds}
                appendTo={"body"}
                width={250}
                dropdownPopupPlacement={"ontop-left"}
                buttonWidth={"auto"}
                onClick={onRuleTypeSelectionChange}
            >
                {[
                    <NoBorderButton
                        isPlaceholder={false}
                        key={`rule-type-dropdown-button-${id}`}
                        disabled={isDisabled}
                    >
                        {ruleTypeOptions[selectedRuleTypeIndex].text}
                    </NoBorderButton>,
                    ...dropdownItems,
                ]}
            </Dropdown>
        </RuleTypesDropdownContainer>
    );
};

BorderlessDropdown.propTypes = {
    id: number.isRequired,
    ruleTypeOptions: array.isRequired,
    selectedRuleTypeIndex: number.isRequired,
    onRuleTypeSelectionChange: func.isRequired,
    isDisabled: bool,
};

BorderlessDropdown.defaultProps = {
    isDisabled: false,
};

export default BorderlessDropdown;
