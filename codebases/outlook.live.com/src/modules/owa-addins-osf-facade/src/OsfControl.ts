import { CommonAdapter, getAdapter } from 'owa-addins-adapters';
import { getUserTypeString } from 'owa-addins-wrapper-utils';
import { getScenarioFromHostItemIndex, IAddinCommand } from 'owa-addins-store';
import { getApp, getClientId, getClientVersion, getLogicalRing } from 'owa-config';
import { isFeatureEnabled } from 'owa-feature-flags';

export interface OsfControl {
    addinCommand: IAddinCommand;
    controlId: string;
    isDialog?: boolean;
    sourceLocation?: string;
}

export function createDictionaryFromOsfControl(
    hostItemIndex: string,
    osfControl: OsfControl,
    extensionContainer: HTMLDivElement
) {
    const { addinCommand, controlId, isDialog } = osfControl;
    const settings = !!addinCommand.extension.Settings
        ? JSON.parse(addinCommand.extension.Settings)
        : {};
    const hostCustomMessage = createHostCustomMessage(addinCommand, hostItemIndex);

    let iFrameHostInfoFlags = 0;
    if (!isDialog && isFeatureEnabled('addin-isPrivateAddin')) {
        // TODO (sagaikwa)
        // osfruntime.js need to have 'PublicAddin' constant defined in OSF.HostInfoFlags
        // for following to work correctly. For now, hardcoding value of 'PublicAddin' (16)
        // to mitigate ongoing Incident.
        // iFrameHostInfoFlags = iFrameHostInfoFlags | OSF.HostInfoFlags.PublicAddin;
        // TODO (sagaikwa)
        // IsPrivateAddin from osfruntime has some bugs. WAC Team will fix and then we can
        // add following check to set iFrameHostInfoFlags appropriately.
        // if (!isPrivateAddin(addinCommand.extension)) {
        iFrameHostInfoFlags = iFrameHostInfoFlags | 16;
    }

    return {
        div: extensionContainer,
        id: controlId,
        marketplaceID: !isDialog ? addinCommand.extension.Id : controlId,
        marketplaceVersion: addinCommand.extension.Version,
        settings: settings,
        store: '',
        storeType: OSF.StoreType.Exchange,
        hostCustomMessage: hostCustomMessage,
        isDialog: isDialog,
        isVirtualOsfControl: false,
        hostInfoFlags: iFrameHostInfoFlags,
    };
}

/*
    hostCustomMessage:
    {
        userType: office365|outlookCom|enterprise
        userId: [clientId] ("7969A331813045F8B87BD957D6149945")
        extensionType: Default|PrivateCatalog|MarketplacePrivateCatalog|Marketplace|Private|Preinstalled
        module: Mail|Calendar
        scenario: Read|Compose
        deployment: DSDF|DWW|GALLATIN|SDF|SDFV2|SIP|WW
        clientVersion: [scriptVersion] ("20180126009")
        isPinned: true|false
        react: true
    }
*/
function createHostCustomMessage(addinCommand: IAddinCommand, hostItemIndex: string): string {
    const adapter = getAdapter(hostItemIndex) as CommonAdapter;

    return JSON.stringify({
        userType: getUserTypeString(),
        userId: getClientId(),
        extensionType: addinCommand.extension.TypeString,
        module: getApp(),
        deployment: getLogicalRing(),
        scenario: getScenarioFromHostItemIndex(hostItemIndex),
        clientVersion: getClientVersion(),
        isPinned: adapter?.isAddinPinned?.(addinCommand.extension.Id),
        react: true,
        disableLogging: false,
    });
}
