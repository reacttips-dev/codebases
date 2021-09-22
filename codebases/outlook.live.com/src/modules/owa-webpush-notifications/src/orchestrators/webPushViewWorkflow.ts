import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { orchestrator } from 'satcheljs';
import { lazyLoadWebPushOptions, lazyUserInitiatedWebPushSetupWorkflow } from '../index';
import { completeWebPushSecondChanceCallout } from '../actions/secondChanceCalloutActions';
import { completeWebPushLightningCallout } from '../actions/lightningCalloutActions';
import { logEnableStart, logLightningIgnored, logWorkFlowEnd } from '../optics/webpushOptics';
import {
    lazyCreateOrUpdateOptionsForFeature,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';
import { default as updateWebPushOptions } from '../actions/updateWebPushOptions';

export const requestPermissionsAfterLightning = orchestrator(
    completeWebPushLightningCallout,
    ({ enabled }) => {
        if (enabled) {
            logEnableStart('lightning');
        } else {
            logLightningIgnored();
        }
        startUserInitiatedWebpushSetup(enabled, true);
    }
);

export const requestPermissionsAfterSecondChance = orchestrator(
    completeWebPushSecondChanceCallout,
    ({ tryAgain }) => startUserInitiatedWebpushSetup(tryAgain, false)
);

const startUserInitiatedWebpushSetup = async (shouldStart: boolean, hasSecondChance: boolean) => {
    if (shouldStart) {
        const userInitiatedWebPushSetupWorkflow = await lazyUserInitiatedWebPushSetupWorkflow.import();
        const loadWebPushOptions = await lazyLoadWebPushOptions.import();
        let webPushOptions = await loadWebPushOptions();

        // Work around until options code is moved to controls package, duplicating the code to update server
        if (!webPushOptions.enabled) {
            updateWebPushOptions(true, Date.now().toString());
            await lazyCreateOrUpdateOptionsForFeature.importAndExecute(
                OwsOptionsFeatureType.WebPushNotifications,
                webPushOptions
            );
        }

        // Explicitly disallow a second chance now that the second chance callout has shown
        let enabled = await userInitiatedWebPushSetupWorkflow(
            window,
            webPushOptions,
            getUserConfiguration().SessionSettings.MailboxGuid,
            hasSecondChance
        );
        logWorkFlowEnd(enabled);
    }
};
