import {
    getLogicalRing,
    getBackend,
    getForest,
    getClientId,
    getSessionId,
    getLayout,
    getHostValue,
} from 'owa-config';
import { getPhysicalRing, getVariantEnvironment } from 'owa-metatags';
import { getUserConfiguration } from 'owa-session-store';
import getUserType from './getUserType';
import type { InternalAnalyticOptions } from '../types/InternalAnalyticOptions';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
interface PropertiesPlugin {
    setProperty(name: string, value: string | number | boolean): void;
}

function addProperty(
    propertyManger: PropertiesPlugin,
    key: string,
    value: string | undefined | null
) {
    if (value) {
        propertyManger.setProperty(key, value);
    }
}

export default function addCommonProperties(
    propertyManager: PropertiesPlugin,
    analyticsOptions?: InternalAnalyticOptions
) {
    const sessionSettings = getUserConfiguration().SessionSettings || {};

    addProperty(propertyManager, 'BEServer', getBackend());
    addProperty(propertyManager, 'MBXGuid', sessionSettings.MailboxGuid);
    addProperty(propertyManager, 'Forest', getForest());
    addProperty(propertyManager, 'Puid', sessionSettings.UserPuid);

    addProperty(propertyManager, 'ClientId', getClientId());
    addProperty(propertyManager, 'Ring', getLogicalRing());
    addProperty(propertyManager, 'UserType', getUserType(!!analyticsOptions?.isEdu));
    addProperty(propertyManager, 'Layout', getLayout());
    addProperty(propertyManager, 'TenantGuid', sessionSettings.ExternalDirectoryTenantGuid);
    addProperty(propertyManager, 'Session.Id', getSessionId());
    addProperty(propertyManager, 'PhysicalRing', getPhysicalRing());
    addProperty(propertyManager, 'VariantEnv', getVariantEnvironment());
    addProperty(propertyManager, 'Host', getHostValue());

    const opxSessionInfo = analyticsOptions?.opxSessionInfo;
    if (opxSessionInfo) {
        addProperty(propertyManager, 'HostedScenario', opxSessionInfo.hostedScenario);
    }
    if (!!analyticsOptions?.shouldIncludeUserInfoId) {
        addProperty(propertyManager, 'UserInfo.Id', sessionSettings.UserPuid);
        addProperty(propertyManager, 'UserInfo.IdType', isConsumer() ? 'MSAPUID' : 'OrgIdPuid');
    }
}
