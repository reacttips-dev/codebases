import React from "react";
import { connect } from "react-redux";
import { showSuccessToast } from "actions/toast_actions";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { USE_BETA_BRANCH_DATA_PREF_KEY } from "routes/websiteStateConfig";
import { betaVsLiveSwitchToggle, betaVsLiveUpdateCompleted } from "actions/commonActions";
import { PreferencesService } from "services/preferences/preferencesService";
import { SwTrack } from "services/SwTrack";

export interface IUseBetaBranchPref {
    value: boolean;
    isUpdating: boolean;
    changePref: (useBetaBranch: boolean, trackingPlace?: string) => any;
    togglePref: (trackingPlace?: string) => any;
}

export interface IWithUseBetaBranchPref {
    useBetaBranchPref: IUseBetaBranchPref;
}

export const WithUseBetaBranchPref = (Component: React.ComponentType<IWithUseBetaBranchPref>) => {
    const ComponentWithUseBetaBranchPrefComponent: React.FC<{
        betaBranchPref: { value: boolean; isUpdating: boolean };
        betaVsLiveSwitchToggle: (value: boolean, isUpdating?: boolean) => void;
        betaVsLiveUpdateCompleted: () => void;
        showSuccessToast: (text?: any) => void;
    }> = ({
        betaBranchPref,
        betaVsLiveSwitchToggle,
        betaVsLiveUpdateCompleted,
        showSuccessToast,
        ...restProps
    }) => {
        const useBetaBranchValue =
            IS_BETA_BRANCH_ENABLED() &&
            (betaBranchPref.value ?? PreferencesService.get(USE_BETA_BRANCH_DATA_PREF_KEY));
        const useBetaBranchIsUpdating = betaBranchPref.isUpdating;

        const useBetaBranchChangePref = React.useCallback(
            // resolves with boolean whether updated successfully
            async (newUseBetaBranch: boolean, trackingPlace = "Unknown"): Promise<boolean> => {
                if (useBetaBranchIsUpdating) {
                    return false;
                }
                betaVsLiveSwitchToggle(newUseBetaBranch, true);
                await PreferencesService.add({
                    [USE_BETA_BRANCH_DATA_PREF_KEY]: newUseBetaBranch,
                });
                betaVsLiveUpdateCompleted();
                // show success toast message when opt-in
                if (newUseBetaBranch) {
                    showSuccessToast(i18nFilter()("website.analysis.use.beta.optin.toast"));
                }

                // track changing of opt-in pref
                SwTrack.all.trackEvent(
                    "Switch Item",
                    "switch",
                    `Website Analysis Use Beta opt-in/${
                        newUseBetaBranch ? "Yes" : "No"
                    }/${trackingPlace}`,
                );

                return true;
            },
            [useBetaBranchIsUpdating],
        );

        const useBetaBranchTogglePref = React.useCallback(
            async (trackingPlace?: string) =>
                await useBetaBranchChangePref(!useBetaBranchValue, trackingPlace),
            [useBetaBranchChangePref, useBetaBranchValue],
        );

        const useBetaBranchPref = React.useMemo<IUseBetaBranchPref>(
            () => ({
                value: useBetaBranchValue,
                isUpdating: useBetaBranchIsUpdating,
                changePref: useBetaBranchChangePref,
                togglePref: useBetaBranchTogglePref,
            }),
            [
                useBetaBranchValue,
                useBetaBranchIsUpdating,
                useBetaBranchChangePref,
                useBetaBranchTogglePref,
            ],
        );

        return <Component useBetaBranchPref={useBetaBranchPref} {...restProps} />;
    };
    ComponentWithUseBetaBranchPrefComponent.displayName =
        (Component.displayName ?? "Component") + "WithUseBetaBranchPref";

    return connect(
        (store) => {
            return {
                betaBranchPref: store.common.showBetaBranchData,
            };
        },
        {
            betaVsLiveSwitchToggle,
            betaVsLiveUpdateCompleted,
            showSuccessToast,
        },
    )(ComponentWithUseBetaBranchPrefComponent);
};

export const IS_BETA_BRANCH_ENABLED = () => {
    const proWindow: any = window;
    return Boolean(
        proWindow?.similarweb?.settings?.components?.AudienceOverview?.resources
            ?.IsBetaBranchEnabled,
    );
};
