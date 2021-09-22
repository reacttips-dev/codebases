import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import CommonHeaderWithSteps from "../CommonHeaderWithSteps/CommonHeaderWithSteps";

type AdvancedSearchPageHeaderProps = {
    step: number;
    onBackClick(): void;
};

const AdvancedSearchPageHeader = (props: AdvancedSearchPageHeaderProps) => {
    const translate = useTranslation();
    const { step, onBackClick } = props;
    const steps = React.useMemo(() => {
        return [
            translate("si.components.steps.step.define_criteria"),
            translate("si.components.steps.step.select_leads"),
        ];
    }, [translate]);

    return <CommonHeaderWithSteps steps={steps} currentStep={step} onBackClick={onBackClick} />;
};

export default AdvancedSearchPageHeader;
