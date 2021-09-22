import type InitialData from './InitialData';
import ShouldRunNewCodeForFlags from './ShouldRunNewCodeForFlags';
import type { CommonAdapter } from 'owa-addins-adapters';
import { getUserTypeString } from 'owa-addins-wrapper-utils';
import { ExtensibilityHostItem, getExtensibilityContext, IAddinCommand } from 'owa-addins-store';
import { getDefaultTimeZoneOffsets } from 'owa-datetime-store';
import RequestedCapabilities from 'owa-service/lib/contract/RequestedCapabilities';
import { getUserDisplayName, getUserEmailAddress, getUserTimeZone } from 'owa-session-store';
import { getClientVersion } from 'owa-config';

export default function getInitialCommonData(
    adapter: CommonAdapter,
    addInCommand: IAddinCommand,
    hostItem: ExtensibilityHostItem,
    data: InitialData
): InitialData {
    data = loadCommonAddInData(addInCommand, data);
    data = loadCommonOwaData(adapter, data);

    if (addInCommand.extension.RequestedCapabilities != RequestedCapabilities.Restricted) {
        data = loadCommonDataForCapabilitiesAboveRestricted(adapter, data);
    }

    if (adapter.isSharedItem && adapter.getSharedProperties) {
        data.isFromSharedFolder = adapter.isSharedItem();
    }

    data.shouldRunNewCodeForFlags |= ShouldRunNewCodeForFlags.SaveCustomProperties;

    return data;
}

function loadCommonAddInData(addInCommand: IAddinCommand, data: InitialData): InitialData {
    const { extension } = addInCommand;
    data.extensionId = extension.Id;
    data.marketplaceContentMarket = extension.MarketplaceContentMarket;
    data.permissionLevel = extension.RequestedCapabilities;
    data.marketplaceAssetId = extension.MarketplaceAssetID;
    data.entryPointUrl = addInCommand.get_EntryPoint();
    data.consentMetadata = extension.ConsentMetadata;
    data.endNodeUrl = extension.EndNodeUrl;
    return data;
}

function loadCommonOwaData(adapter: CommonAdapter, data: InitialData): InitialData {
    data.hostVersion = getClientVersion() || 'debug';
    data.owaView = 'mouse';
    data.timeZoneOffsets = getDefaultTimeZoneOffsets();
    return data;
}

function loadCommonDataForCapabilitiesAboveRestricted(
    adapter: CommonAdapter,
    data: InitialData
): InitialData {
    data.userDisplayName = getUserDisplayName();
    data.userEmailAddress = getUserEmailAddress();
    data.userTimeZone = getUserTimeZone();
    data.userProfileType = getUserTypeString();
    data.ewsUrl = getExtensibilityContext().EwsUrl;
    data.restUrl = getExtensibilityContext().RestUrl;

    return data;
}
