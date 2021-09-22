import React from "react";
import ConnectedQuotaContainer from "../../../../common-components/quota/QuotaContainer/QuotaContainer";
import { StyledSavedSearchInfoSection } from "../styles";

const DynamicListInfoSection = () => {
    return (
        <StyledSavedSearchInfoSection>
            <ConnectedQuotaContainer />
        </StyledSavedSearchInfoSection>
    );
};

export default React.memo(DynamicListInfoSection);
