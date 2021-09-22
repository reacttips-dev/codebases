import { mutatorAction } from 'satcheljs';
import { CommandingViewMode } from 'owa-outlook-service-option-store/lib/store/schema/options/CommandingOptions';
import { getStore } from '../store/store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { OwsOptionsFeatureType } from 'owa-outlook-service-options';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { saveCommandingViewModeOption } from 'owa-commanding-option';

/**
 * This function gets the default CommandingViewMode to render with
 * at boot. The value will either be from OWS' settings or the default values (in
 * the case where the user hasn't modified this preference yet, or the service
 * returns an unknown value).
 *
 * Note that we're getting these values from the UserConfiguration object instead
 * of from the "owa-outlook-service-options" package for boot bundle size health.
 */
const getDefaultCommandingViewModeOnBoot = (
    primeBootSettingsOptions: any[]
): CommandingViewMode | undefined => {
    const primeCommandingOptions: any[] = primeBootSettingsOptions.filter(
        item => item?.feature == OwsOptionsFeatureType.Commanding
    );

    // viewMode can be const when mon-ribbon flight is removed
    let viewMode = primeCommandingOptions[0]?.viewMode;

    // Validate server is returning a client-supported value
    const validViewModes = [
        undefined,
        CommandingViewMode.CommandBar,
        CommandingViewMode.SingleLineRibbon,
        CommandingViewMode.MultiLineRibbon,
    ];
    if (validViewModes.includes(viewMode)) {
        return viewMode;
    }

    // viewMode is an unknown value or the wrong type. Returning
    // undefined ensures our default value logic will be used.
    return undefined;
};

/**
 * Initializes owa-command-ribbon-store's viewMode using either OWS'
 * settings or the default values.
 */
export const initializeCommandingViewMode = mutatorAction(
    'initializeCommandingViewMode',
    (primeBootSettingsOptions: any[]) => {
        let viewMode = isFeatureEnabled('mon-ribbon')
            ? getDefaultCommandingViewModeOnBoot(primeBootSettingsOptions)
            : CommandingViewMode.CommandBar;

        if (viewMode === undefined) {
            // No persisted viewMode, or invalid response from server. Fallback to client default
            viewMode = isHostAppFeatureEnabled('ribbonDefaultToSLR')
                ? CommandingViewMode.SingleLineRibbon
                : CommandingViewMode.CommandBar;

            if (isHostAppFeatureEnabled('ribbonPersistDefault')) {
                saveCommandingViewModeOption(viewMode);
            }
        }

        getStore().viewMode = viewMode;
    }
);
