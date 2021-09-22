import setBizBarUpsellState from '../mutators/setBizBarUpsellState';
import { makeArcCall } from '../service/makeArcCalls';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getBrowserInfo, Browser, getOsInfo, OperatingSystem } from 'owa-user-agent';
import { appendUserUpsellFlights } from '../utils/irisUtils';

const InternalPlacement_Id = '88000453';
const ExternalPlacement_Id = '88000452';
const osInfo = getOsInfo();

const browserToCodeMap: { [key in Browser]?: string } = {
    [Browser.EDGE]: '1',
    [Browser.CHROME]: '2',
    [Browser.MSIE]: '3',
    [Browser.FIREFOX]: '4',
    [Browser.SAFARI]: '5',
    [Browser.EDGE_CHROMIUM]: '6',
    [Browser.OPERA]: '7',
    [Browser.ELECTRON]: '8',
    [Browser.SKYPE_SHELL]: '9',
    [Browser.PHANTOMJS]: '10',
};

const windowsOSVersionToCodeMap: { [key: string]: string } = {
    ['XP']: 'WINXP',
    ['7']: 'WIN7',
    ['8']: 'WIN8',
    ['8.1']: 'WIN81',
    ['10']: 'WIN10',
};

const operatingSystemToCodeMap: { [key in OperatingSystem]?: string } = {
    [OperatingSystem.CHROMIUMOS]: 'CHROMIUMOS',
    [OperatingSystem.IOS]: 'IOS',
    [OperatingSystem.ANDROID]: 'ANDROID',
    [OperatingSystem.LINUX]: 'LINUX',
    [OperatingSystem.MACOSX]: 'MAC',
    [OperatingSystem.WINDOWS]: windowsOSVersionToCodeMap[osInfo.osVersion] || 'WIN',
};

export default async function initializeUpsellBarState() {
    if (
        isFeatureEnabled('edge-iris-upsell-experiment') ||
        isFeatureEnabled('iris-commercial-bizbar')
    ) {
        // We need to set the internalPlacementIfd when the test flag is enabled otherwise return the external placementId
        const placementId = isFeatureEnabled('edge-iris-upsell-testExperiment')
            ? InternalPlacement_Id
            : ExternalPlacement_Id;
        let extraParams = `&OPSYS=${getOSCode()}&browser=${getBrowserCode()}&${appendUserUpsellFlights()}`;
        let bizBarIrisDetails = await makeArcCall(placementId, extraParams);
        if (bizBarIrisDetails) {
            setBizBarUpsellState(bizBarIrisDetails);
        }
    }
}

function getBrowserCode() {
    return browserToCodeMap[getBrowserInfo().browser] || '11';
}

function getOSCode() {
    return operatingSystemToCodeMap[osInfo.os] || 'UNKNOWN';
}
