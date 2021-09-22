import React from "react";
import GeneratorQuota from "../GeneratorQuota/GeneratorQuota";
import GeneratorUpgradeButton from "../GeneratorUpgradeButton/GeneratorUpgradeButton";
import { StyledUpgradeButtonContainer, StyledGeneratorStarterQuota } from "./styles";

type GeneratorStarterQuotaProps = {
    onUpgradeClick(): void;
};

const GeneratorStarterQuota = (props: GeneratorStarterQuotaProps) => {
    return (
        <StyledGeneratorStarterQuota>
            <GeneratorQuota imagePath="/images/sales-intelligence/insights-generator-unlock.svg" />
            <StyledUpgradeButtonContainer>
                <GeneratorUpgradeButton onClick={props.onUpgradeClick} />
            </StyledUpgradeButtonContainer>
        </StyledGeneratorStarterQuota>
    );
};

export default GeneratorStarterQuota;
