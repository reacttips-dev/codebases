import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { InclusionEnum } from "../../../../../common-components/dropdown/InclusionDropdown/InclusionDropdown";
import { StyledRadioButton, StyledRadioContainer } from "../CommonRadioSelect/styles";
import { GlobalExcludeTooltipStyles, StyledRadioSelection } from "./styles";

type TechnologiesRadioButtonsProps = {
    isExcludeAvailable: boolean;
    selectedInclusion: InclusionEnum;
    onSelect(inclusion: InclusionEnum): void;
};

const TechnologiesRadioButtons = (props: TechnologiesRadioButtonsProps) => {
    const translate = useTranslation();
    const { selectedInclusion, isExcludeAvailable, onSelect } = props;

    return (
        <StyledRadioSelection>
            <StyledRadioContainer>
                <StyledRadioButton
                    itemSelected={selectedInclusion === InclusionEnum.includeOnly}
                    onClick={() => onSelect(InclusionEnum.includeOnly)}
                    itemLabel={translate(
                        `si.components.technologies_modal.radio.${InclusionEnum.includeOnly}`,
                    )}
                />
            </StyledRadioContainer>
            <StyledRadioContainer>
                <GlobalExcludeTooltipStyles />
                <PlainTooltip
                    enabled={!isExcludeAvailable}
                    cssClass="PlainTooltip-element exclude-radio-tooltip"
                    tooltipContent={translate(
                        `si.components.technologies_modal.radio.${InclusionEnum.excludeOnly}.disabled_tooltip`,
                    )}
                >
                    <div>
                        <StyledRadioButton
                            itemDisabled={!isExcludeAvailable}
                            itemSelected={selectedInclusion === InclusionEnum.excludeOnly}
                            onClick={() => onSelect(InclusionEnum.excludeOnly)}
                            itemLabel={translate(
                                `si.components.technologies_modal.radio.${InclusionEnum.excludeOnly}`,
                            )}
                        />
                    </div>
                </PlainTooltip>
            </StyledRadioContainer>
        </StyledRadioSelection>
    );
};

export default TechnologiesRadioButtons;
