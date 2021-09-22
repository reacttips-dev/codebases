import AddinActivator from './AddinActivator';
import enableAddinCommands from './enableAddinCommands';
import type ExtensibilityContext from 'owa-service/lib/contract/ExtensibilityContext';
import type Extension from 'owa-service/lib/contract/Extension';
import loadExtensibilityContext from './loadExtensibilityContext';
import { isAddinComplianceVerificationEnabled } from 'owa-addins-feature-flags';
import { isFeatureEnabled } from 'owa-feature-flags';
import {
    AddinCommandFactory,
    AddinFactory,
    setExtensibilityContext,
    setExtensibilityStateIsDirty,
    isExtensibilityContextInitialized,
    isExtensibilityStateDirty,
    whenExtensibilityContextInitialized,
    setCompliance,
    getExtensibilityContext,
} from 'owa-addins-store';
import * as trace from 'owa-trace';
import {
    findNewAdminInstalledAddinsExp,
    pinNewAdminInstalledAddinsExp,
    findUnpinnedAdminInstalledAddins,
} from 'owa-addins-exp';
import shouldNewAdminInstalledAddinsExpActivate from './utils/shouldNewAdminInstalledAddinsExpActivate';

let isInLoading = false;

function getEnabledAddins(context: ExtensibilityContext): Extension[] {
    return context?.Extensions
        ? context.Extensions.filter(extension => {
              return extension.Enabled && extension.ExtensionPointCollection != null;
          })
        : [];
}

export default function initializeExtensibilityContext(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        if ((isLoading() || isExtensibilityContextInitialized()) && !isExtensibilityStateDirty()) {
            whenExtensibilityContextInitialized(resolve);
            return;
        }

        setExtensibilityStateIsDirty(false);
        setLoading(true);
        let enabledAddins = [];
        const addinActivator = new AddinActivator(new AddinFactory(new AddinCommandFactory()));
        let context: ExtensibilityContext = null;
        try {
            context = await loadExtensibilityContext();
        } catch (error) {
            trace.errorThatWillCauseAlert(error);
        }
        setExtensibilityContext(context);
        context = getExtensibilityContext();
        if (context !== null && isAddinComplianceVerificationEnabled()) {
            setCompliance(context.GenericInfo);
        }
        enabledAddins = getEnabledAddins(context);
        if (
            shouldNewAdminInstalledAddinsExpActivate() &&
            (isFeatureEnabled('addin-exp-findNewAdminAddins') ||
                isFeatureEnabled('addin-exp-pinNewAdminAddins') ||
                isFeatureEnabled('addin-exp-pinNewAdminAddinsFRECallout'))
        ) {
            // Control part of experiment. Find newly installed admin addins and log telemetry.
            let newAdminInstalledAddins = findNewAdminInstalledAddinsExp(enabledAddins);

            if (
                isFeatureEnabled('addin-exp-pinNewAdminAddins') ||
                isFeatureEnabled('addin-exp-pinNewAdminAddinsFRECallout')
            ) {
                // One of the treatment in experiment to pin newly installed admin addins.
                pinNewAdminInstalledAddinsExp(enabledAddins, newAdminInstalledAddins);
            }
        }

        if (
            shouldNewAdminInstalledAddinsExpActivate() &&
            (isFeatureEnabled('addin-exp-awarenessNudge') ||
                isFeatureEnabled('addin-exp-awarenessNudgeCusBtn') ||
                isFeatureEnabled('addin-exp-awarenessNudgeWaterDropNudge'))
        ) {
            // This will find and store unpinned admin add-ins in Ext Store
            findUnpinnedAdminInstalledAddins(enabledAddins);
        }

        await enableAddinCommands(enabledAddins, addinActivator);
        setLoading(false);
        resolve();
    });
}

export function setLoading(isLoading: boolean): void {
    isInLoading = isLoading;
}

export function isLoading(): boolean {
    return isInLoading;
}
