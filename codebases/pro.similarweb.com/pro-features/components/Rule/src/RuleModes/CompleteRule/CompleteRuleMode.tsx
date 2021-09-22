import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { bool, func, number } from "prop-types";
import React from "react";
import {
    ButtonWrapperForTooltip,
    CompleteRuleContainer,
    RuleIndex,
    CompleteRuleTitleContainer,
    StyledIconButton,
    ButtonsContainer,
    RuleBody,
} from "../../styledComponents";
import { i18nFilter } from "filters/ngFilters";
import { IRule, RuleTypes } from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { QueryRuleDisplay } from "components/Rule/src/RuleModes/CompleteRule/QueryRuleDisplay";

// The rule index is 0-based, therefore we increment it
// by one before showing the number in the ui
const DISPLAY_INDEX_OFFSET = 1;

export interface ICompleteRuleModeProps {
    index: number;
    rule: IRule;
    onAddClick: () => void;
    canEdit?: boolean;
    isLoadingData: boolean;
}

const CompleteRuleMode: React.FunctionComponent<ICompleteRuleModeProps> = ({
    index,
    rule,
    onAddClick,
    canEdit,
    isLoadingData,
}) => {
    const isButtonDisabled = isLoadingData || !canEdit;
    const include = rule.type === RuleTypes.include;

    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const isMidTierUser = SegmentsUtils.isMidTierUser();

    return (
        <CompleteRuleContainer include={include}>
            <RuleIndex>{index + DISPLAY_INDEX_OFFSET}.</RuleIndex>

            <RuleBody>
                <CompleteRuleTitleContainer>
                    {services.i18n(
                        include
                            ? "segmentsWizard.complete.title_include"
                            : "segmentsWizard.complete.title_exclude",
                    )}
                    :
                </CompleteRuleTitleContainer>

                <QueryRuleDisplay rule={rule} />

                <ButtonsContainer>
                    <PlainTooltip
                        tooltipContent={services.i18n(
                            include
                                ? "segmentsWizard.complete.tooltip.include"
                                : "segmentsWizard.complete.tooltip.exclude",
                        )}
                    >
                        <ButtonWrapperForTooltip>
                            <StyledIconButton
                                type="outlined"
                                iconName="edit-icon"
                                onClick={onAddClick}
                                isDisabled={isButtonDisabled}
                                height={32}
                            >
                                {services.i18n(
                                    isMidTierUser
                                        ? "segmentsWizard.midtier.complete.button"
                                        : "segmentsWizard.complete.button",
                                )}
                            </StyledIconButton>
                        </ButtonWrapperForTooltip>
                    </PlainTooltip>
                </ButtonsContainer>
            </RuleBody>
        </CompleteRuleContainer>
    );
};

CompleteRuleMode.propTypes = {
    index: number.isRequired,
    onAddClick: func.isRequired,
    canEdit: bool,
    isLoadingData: bool,
};
CompleteRuleMode.defaultProps = {
    canEdit: false,
    isLoadingData: false,
};

export default CompleteRuleMode;
