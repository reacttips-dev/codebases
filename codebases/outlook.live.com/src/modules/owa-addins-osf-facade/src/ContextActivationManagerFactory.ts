import { getOfficeJSVersion, setupFacade } from './AppSpecificSetup';
import 'owa-addins-osfruntime';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * dataLocale, hostControl, localizedScriptsUrl, and docUrl are all required parameters but not used by OWA
 */
export function createContextActivationManager(
    userCulture: string,
    notifyHostDelegate: (controlId: string, action: OSF.AgaveHostAction, data: any) => void
): OSF.ContextActivationManager {
    OSF.AppSpecificSetup._setupFacade = setupFacade;
    return new OSF.ContextActivationManager({
        appName: OSF.AppName.OutlookWebApp,
        appVersion: getOfficeJSVersion(),
        clientMode: OSF.ClientMode.ReadWrite,
        appUILocale: userCulture,
        lcid: userCulture,
        notifyHost: notifyHostDelegate,
        dataLocale: '',
        hostControl: {},
        localizedScriptsUrl: OSF.getLocalizedStringsFilePath(),
        docUrl: '',
        /* This, in turn, will make CheckOriginFlag true in outlook-web.js"*/
        appSettings: {
            flightingTreatmentVariables: {
                'Microsoft.Office.SharedOnline.IsPrivateAddin': isFeatureEnabled(
                    'addin-isPrivateAddin'
                ),
                'Microsoft.Office.SharedOnline.UpdateChangeForLaunchEvent': isFeatureEnabled(
                    'addin-updateChangeForLaunchEvent'
                ),
                'Microsoft.Office.SharedOnline.AllowStorageAccessByUserActivationOnIFrame': true,
            },
        },
    });
}
