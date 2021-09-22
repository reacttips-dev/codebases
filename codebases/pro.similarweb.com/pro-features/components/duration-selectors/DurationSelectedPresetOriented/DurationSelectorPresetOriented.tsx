import { FC, ReactNode, useCallback, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
    CLOSE_DURATION_FILTER,
    OPEN_DURATION_FILTER,
} from "action_types/website_analysis_action-types";
import DropdownStep from "components/duration-selectors/DurationSelectedPresetOriented/steps/DropdownStep/DropdownStep";
import CalendarStep from "components/duration-selectors/DurationSelectedPresetOriented/steps/CalendarStep/CalendarStep";
import { DurationSelectorButton } from "components/duration-selectors/DurationSelectorButton";
import ConnectedPopup from "pages/website-analysis/ConnectedPopup";
import { IPopupConfig } from "@similarweb/ui-components/dist/popup";
import { convertInitialPresetToDuration } from "pages/website-analysis/DurationSelectorUtils";
import { Presets } from "./types";

enum Steps {
    DROPDOWN = "DROPDOWN",
    CALENDAR = "CALENDAR",
}

interface IDurationSelectorPresetOriented {
    onSubmit: (duration: any, comparedDuration: any) => void;
    minDate: Dayjs;
    maxDate: Dayjs;
    height?: number;
    isDisabled?: boolean;
    presets: Presets;
    initialComparedDuration?: string | boolean;
    appendTo?: string;
    initialPreset: string;
    children?: ReactNode;
}

export const DurationSelectorPresetOriented: FC<IDurationSelectorPresetOriented> = ({
    isDisabled = false,
    height = 60,
    appendTo = "body",
    minDate,
    maxDate,
    initialPreset,
    presets,
    onSubmit,
    children,
}) => {
    const [step, setStep] = useState(Steps.DROPDOWN);
    const toDropdownStep = useCallback(() => setStep(Steps.DROPDOWN), []);
    const toCalendarStep = useCallback(() => setStep(Steps.CALENDAR), []);

    const [selectedPreset, setSelectedPreset] = useState<string>(
        initialPreset.indexOf("-") !== -1 ? null : initialPreset,
    );
    const availablePresets = presets.filter((p) => !p.locked && !p.disabled);
    const initialDuration = convertInitialPresetToDuration(initialPreset, [...availablePresets]);

    const config: IPopupConfig = {
        placement: "bottom-right",
        growsTo: "left",
        animationDelay: 0,
        autoPlacement: false,
        cssClassContainer: `DropdownButton-popup-container DurationSelector-popup-container`,
        enabled: !isDisabled,
    };

    const onPresetSelect = useCallback(
        (id: string) => {
            onSubmit(id, false);
            setSelectedPreset(id);
        },
        [onSubmit, setSelectedPreset],
    );

    const onCustomRangeSubmit = useCallback(
        (duration: any) => {
            onSubmit(duration, false);
            setSelectedPreset(null);
        },
        [onSubmit, setSelectedPreset],
    );

    const content = () => {
        switch (step) {
            case Steps.DROPDOWN:
                return (
                    <DropdownStep
                        onPresetSelect={onPresetSelect}
                        onCustomDuration={toCalendarStep}
                        presets={availablePresets}
                        selectedPreset={selectedPreset}
                        selectedCustomDuration={selectedPreset ? null : initialDuration}
                    />
                );
            case Steps.CALENDAR:
                return (
                    <CalendarStep
                        onBack={toDropdownStep}
                        onSubmit={onCustomRangeSubmit}
                        minDate={minDate}
                        maxDate={maxDate}
                        initialDuration={initialDuration}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <ConnectedPopup
            stateKey="WebsiteAnalysisFilters.durationFilter"
            appendTo={appendTo}
            config={config}
            content={content}
            openAction={{ type: OPEN_DURATION_FILTER }}
            closeAction={{ type: CLOSE_DURATION_FILTER }}
            onClose={toDropdownStep}
        >
            <div>
                {children || (
                    <DurationSelectorButton
                        isDisabled={isDisabled}
                        height={height}
                        presets={availablePresets}
                        initialPreset={initialPreset}
                    />
                )}
            </div>
        </ConnectedPopup>
    );
};
