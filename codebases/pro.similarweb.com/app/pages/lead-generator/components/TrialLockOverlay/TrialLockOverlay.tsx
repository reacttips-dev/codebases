import React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    StyledLeadGeneratorLockContainer,
    StyledLeadGeneratorLockIcon,
} from "pages/lead-generator/components/elements";
import { useTranslation } from "components/WithTranslation/src/I18n";

type TrialLockOverlayProps = {
    className?: string;
    onUnlockClick(): void;
};

const TrialLockOverlay: React.FC<TrialLockOverlayProps> = ({ className = null, onUnlockClick }) => {
    const translate = useTranslation();

    return (
        <>
            <StyledLeadGeneratorLockIcon />
            <StyledLeadGeneratorLockContainer className={className}>
                <Button
                    type="trial"
                    onClick={onUnlockClick}
                    label={translate("grow.lead_generator.box_base.hook.button")}
                />
            </StyledLeadGeneratorLockContainer>
        </>
    );
};

export default TrialLockOverlay;
