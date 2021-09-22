import React, { useContext, useMemo } from "react";
import { ITrackerWizardServices } from "pages/competitive-tracking/wizard/CompetitiveTrackingWizardTypes";
import { TopContainer } from "pages/competitive-tracking/wizard/wizardSteps/WizardStepStyles";
import {
    ContentContainer,
    CounterTextContainer,
} from "pages/competitive-tracking/wizard/wizardSteps/WizardStepStyles";
import { TrackerAssetChipItem } from "@similarweb/ui-components/dist/chip";
import {
    AutocompleteTrackerWizardMultiSelectContainer,
    InputLineContainer,
    SeparatorText,
} from "pages/competitive-tracking/wizard/wizardSteps/secondStep/DefineCompetitorsStepStyles";
import { CompetitiveTrackingWizardContext } from "../../CompetitiveTrackingWizardContext";
import { AutocompleteTrackerWizardMultiSelect } from "components/AutocompleteTrackerWizard/AutocompleteTrackerWizardMultiSelect";
import { WizardNextButton, WizardStepHeader } from "../stepCommonComponents";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";
import { ETrackerAssetType } from "services/competitiveTracker/types";
import { SegmentChipItemStyled } from "@similarweb/ui-components/dist/dropdown/src/SegmentsChipDownContainer";

interface IDefineCompetitorsStepProps {
    selectedAsset: ITrackerAsset;
    selectedCompetitors: ITrackerAsset[];
    maxSupportedCompetitors: number;
    onSelectCompetitors: (competitors: ITrackerAsset[]) => void;
    services: ITrackerWizardServices;
}

export const DefineCompetitorsStep: React.FunctionComponent<IDefineCompetitorsStepProps> = (
    props,
) => {
    const {
        selectedAsset,
        selectedCompetitors,
        maxSupportedCompetitors,
        onSelectCompetitors,
        services,
    } = props;

    const { onNextStepClick } = useContext(CompetitiveTrackingWizardContext);

    const selectedCompetitorsText = useMemo(() => {
        return `${selectedCompetitors.length}/${maxSupportedCompetitors} ${services.translate(
            "common.competitors",
        )}`;
    }, [selectedCompetitors, maxSupportedCompetitors, services]);

    const headerTexts = useMemo(() => {
        return {
            title: services.translate("competitive.tracker.wizard.define.competitive"),
            subtitle: services.translate("competitive.tracker.wizard.define.competitive.subtitle"),
        };
    }, [services]);

    return (
        <ContentContainer minHeight={314}>
            <TopContainer>
                <WizardStepHeader
                    titleText={headerTexts.title}
                    subtitleText={headerTexts.subtitle}
                />
                <InputLineContainer>
                    {selectedAsset.type === ETrackerAssetType.Segment ? (
                        <SegmentChipItemStyled
                            key="firstItem"
                            segmentName={selectedAsset.name}
                            domainName={selectedAsset.displayText}
                            image={selectedAsset.image}
                        />
                    ) : (
                        <TrackerAssetChipItem
                            className={"chipItem"}
                            text={selectedAsset.displayText}
                            image={selectedAsset.image}
                        />
                    )}

                    <SeparatorText>vs</SeparatorText>
                    <AutocompleteTrackerWizardMultiSelectContainer>
                        <AutocompleteTrackerWizardMultiSelect
                            selectedValues={selectedCompetitors}
                            onSelect={onSelectCompetitors}
                            selectedAsset={selectedAsset}
                            maxSupportedCompetitors={maxSupportedCompetitors}
                        />
                    </AutocompleteTrackerWizardMultiSelectContainer>
                </InputLineContainer>
                <CounterTextContainer>{selectedCompetitorsText}</CounterTextContainer>
            </TopContainer>
            <WizardNextButton
                text={services.translate("common.next")}
                isDisabled={selectedCompetitors.length <= 0}
                onNextStepClick={onNextStepClick}
                icon={"arrow-right"}
            />
        </ContentContainer>
    );
};
