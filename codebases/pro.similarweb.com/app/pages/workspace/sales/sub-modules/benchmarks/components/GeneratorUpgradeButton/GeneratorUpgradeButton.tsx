import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";

type GeneratorUpgradeButtonProps = {
    onClick(): void;
};

const GeneratorUpgradeButton = (props: GeneratorUpgradeButtonProps) => {
    const translate = useTranslation();

    return (
        <IconButton
            type="upsell"
            iconName="two-stars"
            onClick={props.onClick}
            dataAutomation="insights-generator-upgrade-plan-button"
        >
            {translate("si.insights.quota.button.upgrade")}
        </IconButton>
    );
};

export default GeneratorUpgradeButton;
