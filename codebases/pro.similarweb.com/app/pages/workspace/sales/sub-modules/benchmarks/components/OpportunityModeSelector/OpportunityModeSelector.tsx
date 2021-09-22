import React from "react";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { OpportunityMode } from "../../constants";
import { objectKeys } from "pages/workspace/sales/helpers";
import { StyledSelectorItem, StyledOpportunityModeSelector, StyledSelectorButton } from "./styles";

type OpportunityModeSelectorProps = {
    id: string;
    isDisabled: boolean;
    selectedMode: OpportunityMode;
    onModeSelect(mode: OpportunityMode): void;
};

const OpportunityModeSelector = (props: OpportunityModeSelectorProps) => {
    const translate = useTranslation();
    const { id, selectedMode, isDisabled, onModeSelect } = props;

    const handleSelection = (item: { id: OpportunityMode }) => {
        onModeSelect(item.id);
    };

    return (
        <StyledOpportunityModeSelector id={id} disabled={isDisabled}>
            <Dropdown
                width={260}
                appendTo={`#${id}`}
                disabled={isDisabled}
                onClick={handleSelection}
                dropdownPopupPlacement="ontop-left"
                selectedIds={{ [selectedMode]: true }}
            >
                {[
                    <StyledSelectorButton key="selected-mode" disabled={isDisabled}>
                        {translate(`si.insights.opportunity_mode.${selectedMode}`)}
                    </StyledSelectorButton>,
                ].concat(
                    objectKeys(OpportunityMode).map((mode) => {
                        const lowerCased = mode.toLowerCase();

                        return (
                            <StyledSelectorItem key={`mode-${lowerCased}`} id={mode}>
                                {translate(`si.insights.opportunity_mode.${lowerCased}`)}
                            </StyledSelectorItem>
                        );
                    }),
                )}
            </Dropdown>
        </StyledOpportunityModeSelector>
    );
};

export default OpportunityModeSelector;
