import React, { FC, useContext, useMemo } from "react";
import { ITrackerWizardServices } from "pages/competitive-tracking/wizard/CompetitiveTrackingWizardTypes";
import {
    ContentContainer,
    TopContainer,
} from "pages/competitive-tracking/wizard/wizardSteps/WizardStepStyles";
import { AutocompleteTrackerWizard } from "components/AutocompleteTrackerWizard/AutocompleteTrackerWizard";
import { AutocompleteContainer } from "./DefineMainAssetStepStyles";
import { CompetitiveTrackingWizardContext } from "pages/competitive-tracking/wizard/CompetitiveTrackingWizardContext";
import { WizardNextButton, WizardStepHeader } from "../stepCommonComponents";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";

interface IDefineMainAssetStepProps {
    selectedAsset: ITrackerAsset;
    onSelectMainAsset: (asset: ITrackerAsset) => void;
    services: ITrackerWizardServices;
}

export const DefineMainAssetStep: FC<IDefineMainAssetStepProps> = (props) => {
    const { selectedAsset, onSelectMainAsset, services } = props;
    const { onNextStepClick } = useContext(CompetitiveTrackingWizardContext);

    const headerTexts = useMemo(() => {
        return {
            title: services.translate("competitive.tracker.wizard.define.main.property"),
            subtitle: services.translate(
                "competitive.tracker.wizard.define.main.property.subtitle",
            ),
        };
    }, [services]);

    return (
        <ContentContainer>
            <TopContainer>
                <WizardStepHeader
                    maxWidth={472}
                    titleText={headerTexts.title}
                    subtitleText={headerTexts.subtitle}
                />
                <AutocompleteContainer>
                    <AutocompleteTrackerWizard
                        selectedValue={selectedAsset}
                        onSelect={onSelectMainAsset}
                    />
                </AutocompleteContainer>
            </TopContainer>

            <WizardNextButton
                text={services.translate("common.next")}
                isDisabled={!selectedAsset}
                onNextStepClick={onNextStepClick}
                icon={"arrow-right"}
            />
        </ContentContainer>
    );
};
