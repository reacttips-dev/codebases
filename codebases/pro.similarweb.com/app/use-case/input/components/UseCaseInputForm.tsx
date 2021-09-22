import { usePrevious } from "components/hooks/usePrevious";
import { useTrack } from "components/WithTrack/src/useTrack";
import { createWizardStep } from "components/Workspace/Wizard/src/steps/createStep";
import { Wizard } from "components/Workspace/Wizard/src/Wizard";
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import useCaseService from "use-case/common/services/useCaseService/useCaseService";
import { ChooseSite } from "use-case/input/components/ChooseSite/ChooseSite";
import {
    fetchAutoCompleteSuggestions,
    ISiteSuggestion,
} from "use-case/input/components/fetchAutocompleteSuggestions";
import { InputScreenParams } from "use-case/common/types";
import ChooseCompetitors from "../components/ChooseCompetitors/ChooseCompetitors";

export interface IUseCaseInputFormValues {
    website: string;
    competitors: string[] | null;
}

interface IUseCaseInputForm {
    onSubmit: (values: IUseCaseInputFormValues) => void;
    requireCompetitors: boolean;
    onGoBack: () => void;
    textConfig: InputScreenParams;
}

export const UseCaseInputForm: FC<IUseCaseInputForm> = ({
    onSubmit,
    requireCompetitors,
    onGoBack,
    textConfig,
}) => {
    const [competitors, setCompetitors] = useState<ISiteSuggestion[]>([]);
    const [selectedSite, setSelectedSite] = useState<ISiteSuggestion>(null);

    const { trackSuccessfulSubmit } = useInputCaseFormTracking(selectedSite, competitors);

    const getWebsiteSuggestions = useCallback(
        (query: string) => fetchAutoCompleteSuggestions(query, selectedSite),
        [selectedSite],
    );

    const siteStep = createWizardStep(
        textConfig?.website?.title || "workspaces.marketing.wizard.legends.enter_a_website",
        (p) => (
            <ChooseSite
                {...p}
                selectedSite={selectedSite}
                onSelectMainSite={setSelectedSite}
                getWebsitesSuggestions={getWebsiteSuggestions}
                title={textConfig?.website?.title}
                subtitle={textConfig?.website?.subtitle}
                submitButtonText={textConfig?.website?.cta}
            />
        ),
    );

    const competitorsStep = createWizardStep(
        "workspaces.marketing.wizard.legends.select_competitors",
        (p) => (
            <ChooseCompetitors
                {...p}
                getAutoComplete={getWebsiteSuggestions}
                selectedSite={selectedSite}
                onCompetitorsUpdate={setCompetitors}
                title={textConfig?.competitors?.title}
                subtitle={textConfig?.competitors?.subtitle}
                submitButtonText={textConfig?.competitors?.cta}
            />
        ),
    );

    const steps = requireCompetitors ? [siteStep, competitorsStep] : [siteStep];

    const onNextStep = useCallback(
        (nextStep: number) => {
            if (nextStep >= steps.length) {
                onSubmit({ website: toName(selectedSite), competitors: competitors.map(toName) });
                trackSuccessfulSubmit();
            }
        },
        [selectedSite, competitors, onSubmit, trackSuccessfulSubmit],
    );

    const onClickBack = useCallback((nextStep: number, moveSuccess: boolean) => {
        if (!moveSuccess) {
            onGoBack();
        }
    }, []);

    return (
        <>
            <Wizard
                steps={steps}
                showStepsLegends={steps.length > 1}
                onNextStep={onNextStep}
                showBackButton={functionThatReturnsTrue}
                onClickBack={onClickBack}
            />
        </>
    );
};

// Helpers

const functionThatReturnsTrue = () => true;
const toName = (x: { name: string }) => x?.name;

// Tracking

interface IInputFormTrackingEvents {
    trackSuccessfulSubmit: () => void;
}

const useSubSubName = () => (useCaseService.isOnboarding() ? "onboarding" : "return");

const useInputCaseFormTracking = (
    selectedSite: ISiteSuggestion | null,
    competitors: ISiteSuggestion[],
): IInputFormTrackingEvents => {
    const [track] = useTrack();
    const subSubName = useSubSubName();

    // Website
    useEffect(() => {
        if (selectedSite) {
            track("use case screen", "value-ok", `main website//${subSubName}`);
        }
    }, [selectedSite]);

    // Competitors
    const previousCompetitors = usePrevious(competitors);
    useEffect(() => {
        if (previousCompetitors?.length < competitors?.length) {
            track("use case screen", "value-ok", `competitor//${subSubName}`);
        }
    }, [competitors?.length]);

    // Events
    const trackSuccessfulSubmit = useCallback(() => {
        track("use case screen", "submit-ok", `continue//${subSubName}`);
    }, [track]);

    return { trackSuccessfulSubmit };
};
