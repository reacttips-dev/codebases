import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import QuotaExceeded from "pages/sales-intelligence/common-components/quota/QuotaExceeded/QuotaExceeded";
import GeneratorUpgradeButton from "../GeneratorUpgradeButton/GeneratorUpgradeButton";
import {
    StyledGeneratorProspectQuotaExceeded,
    StyledGeneratorProspectUpgradeSection,
    StyledGeneratorProspectUpgradeTip,
} from "./styles";

type GeneratorProspectQuotaExceededProps = {
    onUpgradeClick(): void;
};

const GeneratorProspectQuotaExceeded = (props: GeneratorProspectQuotaExceededProps) => {
    const translate = useTranslation();

    return (
        <StyledGeneratorProspectQuotaExceeded>
            <QuotaExceeded
                title={translate("si.insights.quota_reached.prospect.title")}
                subtitle={translate("si.insights.quota_reached.prospect.subtitle")}
            />
            <StyledGeneratorProspectUpgradeSection>
                <GeneratorUpgradeButton onClick={props.onUpgradeClick} />
                <StyledGeneratorProspectUpgradeTip>
                    {translate("si.insights.quota_reached.prospect.upgrade_tip")}
                </StyledGeneratorProspectUpgradeTip>
            </StyledGeneratorProspectUpgradeSection>
        </StyledGeneratorProspectQuotaExceeded>
    );
};

export default GeneratorProspectQuotaExceeded;
