import * as React from "react";
import DurationService from "services/DurationService";
import { DurationSelectorWithState } from "./DurationSelectorWithState";
import { Injector } from "common/ioc/Injector";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import I18n from "components/React/Filters/I18n";

const DashboardWizardDuration: React.StatelessComponent<any> = ({
    customDashboard,
    changeDuration,
}) => {
    return (
        <div className="duration">
            <h5>
                <I18n>home.dashboards.wizard.duration.title</I18n>
            </h5>
            <DurationSelectorWithState
                key="durationFilter"
                customDashboardState={customDashboard}
                minDate={customDashboard.minDate}
                maxDate={customDashboard.maxDate}
                isDisabled={customDashboard.disableDatepicker}
                presets={preparePresets(customDashboard.availableDurations, true)}
                initialPreset={customDashboard.widget.duration}
                initialComparedDuration={customDashboard.widget.comparedDuration || false}
                onSubmit={(duration, comparedDuration) => {
                    changeDuration(duration, customDashboard, comparedDuration);
                }}
                compactMode={true}
            />
        </div>
    );
};
SWReactRootComponent(DashboardWizardDuration, "DashboardWizardDuration");

export default DashboardWizardDuration;

export const preparePresets = (
    availableDurations,
    dashboard?: boolean,
    overridePresets?: string[],
) => {
    if (!overridePresets) {
        const swNavigatorCurrent = Injector.get<any>("swNavigator").current();
        overridePresets = swNavigatorCurrent.overrideDatepickerPreset;
    }
    const availablePresets = availableDurations.map((duration) => {
        if (overridePresets) {
            if (overridePresets.indexOf(duration.value) === -1) {
                return {
                    id: duration.value,
                    text: duration.buttonText,
                    disabled: true,
                    value: DurationService.getDurationData(duration.value).raw,
                    displayText: duration.displayText,
                };
            }
        }
        return {
            id: duration.value,
            text: duration.buttonText,
            disabled: !duration.enabled,
            locked: duration.locked,
            value: DurationService.getDurationData(duration.value).raw,
            displayText: duration.displayText,
        };
    });
    if (dashboard) {
        availablePresets.push({
            id: null,
            text: "Custom range",
            disabled: false,
            value: DurationService.getDurationData("3m").raw,
            displayText: "Custom range",
        });
    }
    return availablePresets;
};
