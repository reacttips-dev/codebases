import { updateEndpointData } from './services/updateEndpointData';
import { getClientVersion, getCookie } from 'owa-config';
import { getUserAccountType } from './utils/getUserAccountType';
import { ClientType, UserAccountType } from './schema/Enumeration';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

// only call once per session
let hasCalled = false;

export function addEndpointDataForOwa() {
    if (!hasCalled && !getUserConfiguration()?.SessionSettings?.IsExplicitLogon) {
        const accountType = getUserAccountType();
        updateEndpointData({
            clientId: getCookie('ClientId') ?? '00598a7ea3c04b2cba92422bf000c49f', // Assign a constant guid value if client id cookie can't be read
            clientType: ClientType.OWA,
            clientVersion: getClientVersion(),
            userAccountsType: [accountType], // Sending only the logged in user's account type
            paidConsumerAccountDetected: accountType === UserAccountType.PaidConsumerOutlook,
        });
        hasCalled = true;
    }
}
