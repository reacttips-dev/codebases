import React from "react";
import ConnectedQuotaContainer from "../../../../common-components/quota/QuotaContainer/QuotaContainer";
import { StyledSearchLegend, StyledSearchQuotaContainer } from "./styles";
import AdvancedSearchPageHeader from "../../../../common-components/header/AdvancedSearchPageHeader/AdvancedSearchPageHeader";

type SearchLegendProps = {
    currentStep: 0 | 1;
    quotaShown?: boolean;
    className?: string;
    onClickBack(): void;
};

const SearchLegend = (props: SearchLegendProps) => {
    const { currentStep, onClickBack, className = null, quotaShown = false } = props;

    return (
        <StyledSearchLegend className={className}>
            <AdvancedSearchPageHeader step={currentStep} onBackClick={onClickBack} />
            {quotaShown && (
                <StyledSearchQuotaContainer>
                    <ConnectedQuotaContainer />
                </StyledSearchQuotaContainer>
            )}
        </StyledSearchLegend>
    );
};

export default SearchLegend;
