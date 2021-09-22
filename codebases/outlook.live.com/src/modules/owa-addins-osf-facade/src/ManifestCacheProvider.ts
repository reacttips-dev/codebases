import buildConsentUrl from './utils/buildConsentUrl';
import ConsentStateType from 'owa-service/lib/contract/ConsentStateType';
import type ExtensionType from 'owa-service/lib/contract/ExtensionType';
import type { IAddinCommand } from 'owa-addins-store';
import type { OsfControl } from './OsfControl';
import 'owa-addins-osfruntime';
import { isFeatureEnabled } from 'owa-feature-flags';

export const DefaultSettingsKey: string = 'DefaultSettings';
export const DefaultDisplayNameKey: string = '0';

export interface ManifestCacheProvider {
    cache(osfControl: OsfControl, userCulture: string): void;
}

export const AddinCommandsManifestCacheProvider: ManifestCacheProvider = {
    cache: cacheManifestForAddinCommand,
};
export const DialogManifestCacheProvider: ManifestCacheProvider = { cache: cacheManifestForDialog };

function createManifestForAddinCommand(
    addinCommand: IAddinCommand,
    userCulture: string,
    defaultSettings: OSF.Manifest.ExtensionSettings
): OSF.Manifest.Manifest {
    const sourceLocation = defaultSettings._sourceLocations[userCulture];
    const manifest = new OSF.Manifest.Manifest((manifest: OSF.Manifest.Manifest) => {
        manifest._id = addinCommand.get_Id();
        manifest._version = addinCommand.extension.Version;
        manifest._extensionSettings = {};
        manifest._displayNames = {};
        manifest._defaultLocale = '';
        manifest._displayNames[DefaultDisplayNameKey] = addinCommand.extension.DisplayName;
        manifest._extensionSettings[DefaultSettingsKey] = defaultSettings;
        if (!isFeatureEnabled('addin-appDomainsDuplicateRemove')) {
            manifest._appDomains = [...addinCommand.extension.AppDomains, sourceLocation];
        } else {
            const appDomainsFromManifest = [...addinCommand.extension.AppDomains];
            manifest._appDomains = parseAppDomains(appDomainsFromManifest, sourceLocation);
        }
    });

    return manifest;
}

function parseAppDomains(appDomainsFromManifest: any, sourceLocation: string): any {
    const appDomainsFromManifestList = Object.entries(appDomainsFromManifest);
    const appDomainsFromManifestMap: Map<string, boolean> = new Map(
        appDomainsFromManifestList.map(key =>
            key[1].indexOf('//') !== -1 ? [key[1].split('//')[1], true] : [key[1], true]
        )
    );
    let sourceLocationDomain =
        sourceLocation.indexOf('//') !== -1
            ? sourceLocation.split('//')[1].split('/')[0]
            : sourceLocation.split('/')[0];
    if (appDomainsFromManifestMap.has(sourceLocationDomain)) {
        return appDomainsFromManifest;
    }
    appDomainsFromManifest.push(sourceLocation);
    return appDomainsFromManifest;
}

function cacheManifestForAddinCommand(osfControl: OsfControl, userCulture: string): void {
    const { addinCommand } = osfControl;
    const { extension } = addinCommand;
    let manifest: OSF.Manifest.Manifest;
    let defaultExtensionSettings: OSF.Manifest.ExtensionSettings;

    const sourceLocation: string =
        extension.TypeString === ('Preinstalled' as ExtensionType) &&
        extension.ConsentState !== ConsentStateType.Consented
            ? buildConsentUrl(extension.RequestedCapabilities)
            : addinCommand.get_EntryPoint();

    defaultExtensionSettings = createDefaultExtensionSettings(sourceLocation, userCulture);
    manifest = createManifestForAddinCommand(addinCommand, userCulture, defaultExtensionSettings);
    OSF.OsfManifestManager.cacheManifest(
        addinCommand.extension.Id,
        addinCommand.extension.Version,
        manifest
    );
}

function createManifestForDialog(
    addinCommand: IAddinCommand,
    controlId: string,
    userCulture: string,
    sourceLocation: string
): OSF.Manifest.Manifest {
    const parentManifest = OSF.OsfManifestManager.getCachedManifest(
        addinCommand.extension.Id,
        addinCommand.extension.Version
    );
    const dialogManifest = OfficeExt.AddinCommandsManifestManager.createManifestForAddinAction(
        parentManifest,
        sourceLocation,
        /*title*/ null,
        controlId
    );
    dialogManifest._extensionSettings = {};
    dialogManifest._extensionSettings[DefaultSettingsKey] = createDefaultExtensionSettings(
        sourceLocation,
        userCulture
    );

    return dialogManifest;
}

function cacheManifestForDialog(osfControl: OsfControl, userCulture: string): void {
    const { addinCommand, controlId, sourceLocation } = osfControl;
    const dialogManifest = createManifestForDialog(
        addinCommand,
        controlId,
        userCulture,
        sourceLocation
    );
    OfficeExt.AddinCommandsManifestManager.cacheManifestForAction(
        dialogManifest,
        controlId,
        addinCommand.extension.Version
    );
}

function createDefaultExtensionSettings(
    sourceLocation: string,
    userCulture: string
): OSF.Manifest.ExtensionSettings {
    const defaultSettings = new OSF.Manifest.ExtensionSettings();
    defaultSettings._sourceLocations = {};
    defaultSettings._sourceLocations[userCulture] = sourceLocation;
    return defaultSettings;
}
