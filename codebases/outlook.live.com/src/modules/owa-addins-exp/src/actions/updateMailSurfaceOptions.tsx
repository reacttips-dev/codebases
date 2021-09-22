import { action, mutator } from 'satcheljs';
import {
    OwsOptionsFeatureType,
    SurfaceActionsOptions,
    lazyCreateOrUpdateOptionsForFeature,
} from 'owa-outlook-service-options';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { logAppPinningTelemetry } from 'owa-addins-analytics';

let updateMailSurfaceOptions = action(
    'updateMailSurfaceOptions',
    (
        mailOptions: SurfaceActionsOptions,
        mailReadSurfaceAddinsToPin: Array<string>,
        mailComposeSurfaceAddinsToPin: Array<string>
    ) => ({
        mailOptions,
        mailReadSurfaceAddinsToPin,
        mailComposeSurfaceAddinsToPin,
    })
);

mutator(updateMailSurfaceOptions, actionMessage => {
    for (const addinKey of actionMessage.mailReadSurfaceAddinsToPin) {
        actionMessage.mailOptions.readSurfaceAddins.push(addinKey);

        // Log 'AppPining' telemetry event for addin pinned.
        logAppPinningTelemetry(addinKey, true /* isPinned */, ExtensibilityModeEnum.MessageRead);
    }

    for (const addinKey of actionMessage.mailComposeSurfaceAddinsToPin) {
        actionMessage.mailOptions.composeSurfaceAddins.push(addinKey);

        // Log 'AppPining' telemetry event for addin pinned.
        logAppPinningTelemetry(addinKey, true /* isPinned */, ExtensibilityModeEnum.MessageCompose);
    }

    lazyCreateOrUpdateOptionsForFeature.importAndExecute(
        OwsOptionsFeatureType.SurfaceActions,
        actionMessage.mailOptions
    );
});

export default updateMailSurfaceOptions;
