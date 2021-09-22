import React from "react";
import { connect } from "react-redux";
import SegmentsApiService from "services/segments/segmentsApiService";
import {
    setChangePrefUseAdvanced,
    setUpdatingChangePrefUseAdvanced,
} from "actions/segmentsModuleActions";
import { showSuccessToast } from "actions/toast_actions";
import { i18nFilter } from "filters/ngFilters";
import { ENABLE_FIREBOLT } from "services/segments/SegmentsUtils";
import { SwTrack } from "services/SwTrack";

export interface IUseAdvancedPref {
    value: boolean;
    isUpdating: boolean;
    changePref: (useAdvanced: boolean, trackingPlace?: string) => any;
    togglePref: (trackingPlace?: string) => any;
}

export interface IWithUseAdvancedPref {
    useAdvancedPref: IUseAdvancedPref;
}

export const withUseAdvancedPref = (Component: React.ComponentType<IWithUseAdvancedPref>) => {
    const ComponentWithUseAdvancedPrefComponent: React.FC<{
        prefUseAdvanced: { value: boolean; isUpdating: boolean };
        setChangePrefUseAdvanced: (useAdvanced: boolean) => void;
        setUpdatingChangePrefUseAdvanced: (isUpdating: boolean) => void;
        showSuccessToast: (text?: any) => void;
    }> = ({
        prefUseAdvanced,
        setChangePrefUseAdvanced,
        setUpdatingChangePrefUseAdvanced,
        showSuccessToast,
        ...restProps
    }) => {
        const { segmentsApiService } = React.useMemo(
            () => ({
                segmentsApiService: SegmentsApiService.getInstance(),
            }),
            [],
        );

        // const useAdvancedValue =
        //     ENABLE_FIREBOLT && (prefUseAdvanced.value ?? segmentsApiService.getPrefUseAdvanced());
        const useAdvancedValue = true;
        const useAdvancedIsUpdating = prefUseAdvanced.isUpdating;

        const useAdvancedChangePref = React.useCallback(
            // resolves with boolean whether updated successfully
            async (newUseAdvanced: boolean, trackingPlace = "Unknown"): Promise<boolean> => {
                if (useAdvancedIsUpdating) {
                    return false;
                }

                // immediately change value, and after that save to user pref
                setUpdatingChangePrefUseAdvanced(true);
                setChangePrefUseAdvanced(newUseAdvanced);
                await segmentsApiService.updatePrefUseAdvanced(newUseAdvanced);
                setUpdatingChangePrefUseAdvanced(false);

                // show success toast message when opt-in
                if (newUseAdvanced) {
                    showSuccessToast(i18nFilter()("custom.segments.use.advanced.optin.toast"));
                }

                // track changing of opt-in pref
                SwTrack.all.trackEvent(
                    "Switch Item",
                    "switch",
                    `Segments Firebolt opt-in/${newUseAdvanced ? "Yes" : "No"}/${trackingPlace}`,
                );

                return true;
            },
            [useAdvancedIsUpdating],
        );

        const useAdvancedTogglePref = React.useCallback(
            async (trackingPlace?: string) =>
                await useAdvancedChangePref(!useAdvancedValue, trackingPlace),
            [useAdvancedChangePref, useAdvancedValue],
        );

        const useAdvancedPref = React.useMemo<IUseAdvancedPref>(
            () => ({
                value: useAdvancedValue,
                isUpdating: useAdvancedIsUpdating,
                changePref: useAdvancedChangePref,
                togglePref: useAdvancedTogglePref,
            }),
            [useAdvancedValue, useAdvancedIsUpdating, useAdvancedChangePref, useAdvancedTogglePref],
        );

        return <Component useAdvancedPref={useAdvancedPref} {...restProps} />;
    };
    ComponentWithUseAdvancedPrefComponent.displayName =
        (Component.displayName ?? "Component") + "WithUseAdvancedPref";

    return connect((store) => ({ prefUseAdvanced: store.segmentsModule.prefUseAdvanced }), {
        setChangePrefUseAdvanced,
        setUpdatingChangePrefUseAdvanced,
        showSuccessToast,
    })(ComponentWithUseAdvancedPrefComponent);
};
