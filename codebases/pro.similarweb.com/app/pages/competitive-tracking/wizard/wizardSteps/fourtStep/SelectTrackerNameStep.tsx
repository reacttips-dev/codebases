import React, { FC, useContext, useMemo, useState } from "react";
import { ITrackerWizardServices } from "pages/competitive-tracking/wizard/CompetitiveTrackingWizardTypes";
import { ICountry } from "components/filters-bar/country-filter/CountryFilterTypes";
import { ICategory } from "common/services/categoryService.types";
import { ContentContainer, TopContainer } from "../WizardStepStyles";
import { AssetsService } from "services/AssetsService";
import { SelectedAssetsList } from "./SelectedAssetsList";
import { WizardNextButton, WizardStepHeader } from "../stepCommonComponents";
import { validateTrackerName } from "../../wizardHelper";
import { SwLog } from "@similarweb/sw-log";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";
import { TrackerNameInput } from "pages/competitive-tracking/common/components/TrackerNameInput/TrackerNameInput";
import { OveviewContainer, WizardCompleteImage } from "./SelectTrackerNameStepStyles";
import { TrackerNameContainer } from "pages/competitive-tracking/wizard/wizardSteps/fourtStep/styled";
import { CompetitiveTrackingWizardContext } from "../../CompetitiveTrackingWizardContext";

interface ISelectTrackerNameStepProps {
    selectedAsset: ITrackerAsset;
    selectedCompetitors: ITrackerAsset[];
    selectedCountry: ICountry;
    selectedIndustry?: ICategory;
    trackerName?: string;
    onSetTrackerName: (name: string) => void;
    services: ITrackerWizardServices;
}

export const SelectTrackerNameStep: FC<ISelectTrackerNameStepProps> = (props) => {
    const {
        trackerName,
        onSetTrackerName,
        selectedAsset,
        selectedCompetitors,
        selectedCountry,
        selectedIndustry,
        services,
    } = props;

    const [hasErrorWithTrackerName, setHasErrorWithTrackerName] = useState(false);
    const [trackerNameErrorMsg, setTrackerNameErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { onNextStepClick } = useContext(CompetitiveTrackingWizardContext);

    const imageUrl = useMemo(() => {
        return AssetsService.assetUrl("/images/competitive-tracking/wizard-done.svg");
    }, []);

    const handleTrackerNameChange = (updatedName: string) => {
        onSetTrackerName(updatedName);
        const nameValidationResult = validateTrackerName(updatedName);
        setHasErrorWithTrackerName(!nameValidationResult.isValid);
        setTrackerNameErrorMsg(nameValidationResult.errorMessage ?? "");
    };

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            await onNextStepClick();
        } catch (e) {
            SwLog.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ContentContainer minWidth={700} minHeight={480}>
            <div style={{ width: "100%" }}>
                <TopContainer>
                    <WizardStepHeader
                        titleText={services.translate("competitive.tracker.wizard.done")}
                    />
                    <WizardCompleteImage imageUrl={imageUrl} />
                </TopContainer>
                <OveviewContainer>
                    <TrackerNameContainer>
                        <TrackerNameInput
                            hasError={hasErrorWithTrackerName}
                            errorMessage={trackerNameErrorMsg}
                            placeHolder={services.translate(
                                "competitive.tracker.wizard.tracker.name",
                            )}
                            onChange={handleTrackerNameChange}
                            defaultValue={trackerName}
                        />
                    </TrackerNameContainer>
                    <SelectedAssetsList
                        selectedMainAsset={selectedAsset}
                        selectedCompetitors={selectedCompetitors}
                        amountOfCompetitorsToShow={4}
                        selectedCountry={selectedCountry}
                        selectedIndustry={selectedIndustry}
                    />
                </OveviewContainer>
            </div>
            <WizardNextButton
                text={services.translate("competitive.tracker.wizard.create.tracker")}
                isDisabled={!trackerName || hasErrorWithTrackerName || isLoading}
                onNextStepClick={onSubmit}
                isLoading={isLoading}
            />
        </ContentContainer>
    );
};
