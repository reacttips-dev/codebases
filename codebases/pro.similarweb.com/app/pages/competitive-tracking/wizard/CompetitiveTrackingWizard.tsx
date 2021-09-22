import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
    ETrackerWizardStep,
    ITrackerWizardServices,
    wizardLabels,
    WizardStepToPageTrackingGuid,
} from "pages/competitive-tracking/wizard/CompetitiveTrackingWizardTypes";
import { i18nFilter } from "filters/ngFilters";
import {
    WizardContainer,
    LegendContainer,
    StepContainer,
    CancelButtonContainer,
    BackButtonContainer,
    StepsWrapper,
} from "pages/competitive-tracking/wizard/CompetitiveTrackingWizardStyles";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";
import { DefineMainAssetStep } from "pages/competitive-tracking/wizard/wizardSteps/firstStep/DefineMainAssetStep";
import { DefineCompetitorsStep } from "./wizardSteps/secondStep/DefineCompetitorsStep";
import { WizardLegend } from "@similarweb/ui-components/dist/wizard";
import { SelectMarketCriteriaStep } from "./wizardSteps/thirdStep/SelectMarketCriteriaStep";
import { getCountries } from "components/filters-bar/utils";
import { ICountry } from "components/filters-bar/country-filter/CountryFilterTypes";
import { ICategory } from "common/services/categoryService.types";
import { CompetitiveTrackingWizardContext } from "pages/competitive-tracking/wizard/CompetitiveTrackingWizardContext";
import { SelectTrackerNameStep } from "./wizardSteps/fourtStep/SelectTrackerNameStep";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { SwLog } from "@similarweb/sw-log";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";
import { CompetitiveTrackerServiceUtils } from "services/competitiveTracker/utils";
import {
    createNewTrackerFromWizard,
    navigateToNewestTrackerPage,
    validateTrackerName,
} from "pages/competitive-tracking/wizard/wizardHelper";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import _ from "lodash";

export const MAX_SUPPORTED_COMPETITORS = 25;
const DEFAULT_NAME_SUFFIX = "Competitive Set";

export const CompetitiveTrackingWizard: FC = () => {
    const [currentStep, setCurrentStep] = useState<ETrackerWizardStep>(
        ETrackerWizardStep.SelectMainAsset,
    );
    const [selectedMainAsset, setSelectedMainAsset] = useState<ITrackerAsset>(null);
    const [selectedCompetitors, setSelectedCompetitors] = useState<ITrackerAsset[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<ICountry>();
    const [selectedIndustry, setSelectedIndustry] = useState<ICategory>();
    const [trackerName, setTrackerName] = useState<string>();
    const availableCountries = useMemo(() => getCountries(true) as ICountry[], []);

    const services = useMemo<ITrackerWizardServices>(() => {
        return {
            translate: i18nFilter(),
            navigator: Injector.get<SwNavigator>("swNavigator"),
            logger: SwLog,
            tracking: TrackWithGuidService,
        };
    }, []);

    useEffect(() => {
        setSelectedCountry(availableCountries[0]);
    }, [availableCountries]);

    useEffect(() => {
        if (!selectedMainAsset) return;
        const { displayText } = selectedMainAsset;
        const domain = displayText.substr(0, displayText.indexOf("."));
        const trackerName = CompetitiveTrackerServiceUtils.generateTrackerName(
            `${_.startCase(domain)} ${DEFAULT_NAME_SUFFIX}`,
        );
        const { isValid } = validateTrackerName(trackerName);
        isValid && setTrackerName(trackerName);
    }, [selectedMainAsset]);

    const goToNextStep = async () => {
        const trackingGuid = WizardStepToPageTrackingGuid[currentStep];
        services.tracking.trackWithGuid(trackingGuid, "click");

        const isfinalStep = currentStep === ETrackerWizardStep.SelectTrackerName;
        if (isfinalStep) {
            await handleWizardSubmit();
            return;
        }

        setCurrentStep(currentStep + 1);
    };

    const goToPreviousStep = () => {
        const isFirstStep = currentStep === ETrackerWizardStep.SelectMainAsset;
        if (isFirstStep) handleWizardCancel();

        setCurrentStep(currentStep - 1);
    };

    const handleWizardSubmit = async () => {
        await createNewTrackerFromWizard(
            trackerName,
            selectedIndustry,
            selectedCountry,
            selectedMainAsset,
            selectedCompetitors,
        );

        navigateToNewestTrackerPage(services.navigator);
    };

    const handleWizardCancel = () => {
        services.navigator.go("companyresearch_competitivetracking_home");
    };

    const wizardContext = {
        onNextStepClick: goToNextStep,
        onPrevStepClick: goToPreviousStep,
        onCancelClick: handleWizardCancel,
    };

    const renderWizardStep = () => {
        switch (currentStep) {
            case ETrackerWizardStep.SelectMainAsset:
                return (
                    <DefineMainAssetStep
                        selectedAsset={selectedMainAsset}
                        onSelectMainAsset={(asset) => setSelectedMainAsset(asset)}
                        services={services}
                    />
                );
            case ETrackerWizardStep.SelectCompetitors:
                return (
                    <DefineCompetitorsStep
                        selectedAsset={selectedMainAsset}
                        selectedCompetitors={selectedCompetitors}
                        onSelectCompetitors={(competitors) => setSelectedCompetitors(competitors)}
                        maxSupportedCompetitors={MAX_SUPPORTED_COMPETITORS}
                        services={services}
                    />
                );
            case ETrackerWizardStep.SelectMarketCriteria:
                return (
                    <SelectMarketCriteriaStep
                        availableCountries={availableCountries}
                        selectedCountry={selectedCountry}
                        selectedIndustry={selectedIndustry}
                        onSelectCountry={(country) => setSelectedCountry(country)}
                        onSelectIndustry={(industry) => setSelectedIndustry(industry)}
                        services={services}
                    />
                );
            case ETrackerWizardStep.SelectTrackerName:
                return (
                    <SelectTrackerNameStep
                        selectedAsset={selectedMainAsset}
                        selectedCompetitors={selectedCompetitors}
                        selectedCountry={selectedCountry}
                        selectedIndustry={selectedIndustry}
                        trackerName={trackerName}
                        onSetTrackerName={(name) => setTrackerName(name)}
                        services={services}
                    />
                );
        }
    };

    const renderCancelButton = () => {
        return (
            <CancelButtonContainer>
                <IconButton
                    type="flat"
                    iconName={"close"}
                    onClick={handleWizardCancel}
                    iconSize={"xs"}
                />
            </CancelButtonContainer>
        );
    };

    return (
        <WizardContainer>
            <CompetitiveTrackingWizardContext.Provider value={wizardContext}>
                <BackButtonContainer>
                    <IconButton
                        iconName={"arrow-left"}
                        type={"flat"}
                        isActivated={true}
                        onClick={goToPreviousStep}
                    >
                        {services.translate("common.back")}
                    </IconButton>
                </BackButtonContainer>
                <div>
                    <LegendContainer>
                        <WizardLegend currentStep={currentStep} itemLabels={wizardLabels} />
                    </LegendContainer>
                    <StepsWrapper>
                        <StepContainer>
                            {renderCancelButton()}
                            {renderWizardStep()}
                        </StepContainer>
                    </StepsWrapper>
                </div>
            </CompetitiveTrackingWizardContext.Provider>
        </WizardContainer>
    );
};

SWReactRootComponent(CompetitiveTrackingWizard, "CompetitiveTrackingWizard");
