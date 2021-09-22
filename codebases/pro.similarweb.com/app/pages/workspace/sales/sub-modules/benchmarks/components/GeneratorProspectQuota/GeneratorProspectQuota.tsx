import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import GeneratorQuota from "../GeneratorQuota/GeneratorQuota";
import GeneratorUpgradeButton from "../GeneratorUpgradeButton/GeneratorUpgradeButton";
import { BENCHMARKS_PROSPECT_QUOTA_THRESHOLD } from "../../constants";
import {
    StyledTipText,
    StyledTopContainer,
    StyledBottomContainer,
    StyledGeneratorProspectQuota,
} from "./styles";

type GeneratorProspectQuotaProps = {
    remainingViews: number;
    onContinueClick(): void;
    onUpgradeClick(): void;
};

const GeneratorProspectQuota = (props: GeneratorProspectQuotaProps) => {
    const translate = useTranslation();
    const { remainingViews, onContinueClick, onUpgradeClick } = props;

    return (
        <StyledGeneratorProspectQuota>
            <StyledTopContainer>
                <GeneratorQuota onContinueClick={onContinueClick} remainingViews={remainingViews} />
            </StyledTopContainer>
            {remainingViews <= BENCHMARKS_PROSPECT_QUOTA_THRESHOLD && (
                <StyledBottomContainer>
                    <StyledTipText>
                        {translate("si.insights.quota.prospect.upgrade_tip")}
                    </StyledTipText>
                    <GeneratorUpgradeButton onClick={onUpgradeClick} />
                </StyledBottomContainer>
            )}
        </StyledGeneratorProspectQuota>
    );
};

export default GeneratorProspectQuota;
