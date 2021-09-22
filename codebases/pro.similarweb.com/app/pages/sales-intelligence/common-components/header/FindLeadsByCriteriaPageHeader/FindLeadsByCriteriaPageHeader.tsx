import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import CommonHeaderWithSteps from "../CommonHeaderWithSteps/CommonHeaderWithSteps";
import { StyledFindLeadsByCriteriaPageHeader } from "./styles";

type FindLeadsByCriteriaPageHeaderProps = {
    step: number;
    onBackClick(): void;
};

const FindLeadsByCriteriaPageHeader = (props: FindLeadsByCriteriaPageHeaderProps) => {
    const translate = useTranslation();
    const { step, onBackClick } = props;
    const steps = React.useMemo(() => {
        return [
            translate("si.components.steps.step.criteria"),
            translate("si.components.steps.step.review_results"),
        ];
    }, [translate]);

    return (
        <StyledFindLeadsByCriteriaPageHeader step={step}>
            <CommonHeaderWithSteps steps={steps} currentStep={step} onBackClick={onBackClick} />
        </StyledFindLeadsByCriteriaPageHeader>
    );
};

export default FindLeadsByCriteriaPageHeader;
