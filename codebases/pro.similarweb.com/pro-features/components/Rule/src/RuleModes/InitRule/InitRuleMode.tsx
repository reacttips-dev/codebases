import { Button } from "@similarweb/ui-components/dist/button";
import { array, func, number, string, any, bool } from "prop-types";
import React, { useCallback, useMemo } from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { IRuleTypeOption } from "../EditRule/EditRuleComponents/BorderlessDropdown";
import {
    ButtonWrapperForTooltip,
    TooltipButtonWrapper,
    InitRuleContentText,
    InitRuleContainer,
} from "../../styledComponents";
import { i18nFilter } from "filters/ngFilters";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { SegmentsUpsellButton } from "pages/segments/styleComponents";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export interface IInitRuleModeProps {
    index: number;
    ruleTypeOptions: IRuleTypeOption[];
    selectedRuleTypeIndex: number;
    onAddClick: (ruleIndex: number) => void;
    onRuleTypeSelectionChange: (itemProps: any) => void;
    isDisabled: boolean;
    wordPredictionsPreview: string[];
    isMidTierUser: boolean;
}

const InitRuleMode: React.FunctionComponent<IInitRuleModeProps> = ({
    index,
    onAddClick,
    isDisabled,
    wordPredictionsPreview,
    isMidTierUser,
}) => {
    const isFirstRule = index === 0;

    // Cache the button click method according to the rule index
    const onButtonAddClick = useCallback(() => {
        onAddClick(index);
        TrackWithGuidService.trackWithGuid("segment.wizard.addRule.button", "click", {
            index: index,
        });
    }, [index]);

    // Cache the rule text, according to its status:
    // is it the first rule, and does it have any word predictions
    const ruleContentText = useMemo(() => {
        if (isFirstRule) {
            return i18nFilter()("segmentsWizard.initRule.select_string_hint");
        }

        if (!wordPredictionsPreview || wordPredictionsPreview.length <= 0) {
            return i18nFilter()("segmentsWizard.initRule.narrow_segment_empty_state");
        }

        return `${i18nFilter()("segmentsWizard.initRule.narrow_segment")} ${
            wordPredictionsPreview?.join(", ") ?? ""
        }`;
    }, [isFirstRule, wordPredictionsPreview]);

    return (
        <InitRuleContainer>
            <InitRuleContentText>{ruleContentText}</InitRuleContentText>
            <TooltipButtonWrapper>
                <PlainTooltip
                    tooltipContent={i18nFilter()("segmentsWizard.initRule.buttonTooltip")}
                    enabled={!isFirstRule}
                >
                    <ButtonWrapperForTooltip>
                        {isFirstRule || !isMidTierUser ? (
                            <Button
                                type="outlined"
                                onClick={onButtonAddClick}
                                isDisabled={isDisabled}
                                height={32}
                            >
                                {isFirstRule
                                    ? i18nFilter()("segmentsWizard.initRule.button")
                                    : i18nFilter()(
                                          "segmentsWizard.initRule.button_refine_selection",
                                      )}
                            </Button>
                        ) : (
                            <SegmentsUpsellButton
                                onClick={SegmentsUtils.openMidTierUserUpsellModal}
                                isDisabled={isDisabled}
                                height={32}
                            >
                                {i18nFilter()("segmentsWizard.initRule.button_refine_selection")}
                            </SegmentsUpsellButton>
                        )}
                    </ButtonWrapperForTooltip>
                </PlainTooltip>
            </TooltipButtonWrapper>
        </InitRuleContainer>
    );
};

InitRuleMode.propTypes = {
    index: number.isRequired,
    ruleTypeOptions: array.isRequired,
    selectedRuleTypeIndex: number.isRequired,
    onAddClick: func.isRequired,
    onRuleTypeSelectionChange: func.isRequired,
    isDisabled: bool.isRequired,
    wordPredictionsPreview: array,
};

InitRuleMode.defaultProps = {
    selectedRuleTypeIndex: 0,
};

export default InitRuleMode;
