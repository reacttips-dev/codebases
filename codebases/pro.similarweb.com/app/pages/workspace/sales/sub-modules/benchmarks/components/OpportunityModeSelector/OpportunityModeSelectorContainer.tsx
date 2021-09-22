import React from "react";
import { OpportunityMode } from "../../constants";
import { StyledOpportunityModeSelectorContainer } from "./styles";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import OpportunityModeSelector from "./OpportunityModeSelector";

type OpportunityModeSelectorContainerProps = {
    isDisabled: boolean;
    selectedMode: OpportunityMode;
    onModeSelect(mode: OpportunityMode): void;
};

const OpportunityModeSelectorContainer = (props: OpportunityModeSelectorContainerProps) => {
    const { benchmarkItemService } = React.useContext(BenchmarkItemContext);
    const { selectedMode, onModeSelect, isDisabled } = props;

    return (
        <StyledOpportunityModeSelectorContainer>
            <OpportunityModeSelector
                isDisabled={isDisabled}
                selectedMode={selectedMode}
                onModeSelect={onModeSelect}
                id={`mode-selector-${benchmarkItemService.id}`}
            />
        </StyledOpportunityModeSelectorContainer>
    );
};

export default OpportunityModeSelectorContainer;
