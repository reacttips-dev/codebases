import { PerformanceDatapoint } from './datapoints/PerformanceDatapoint';
import type SigsBody from './types/SigsBody';
import type SigsOptionalParams from './types/SigsOptionalParams';
import type { SigsSignalType } from './types/SigsSignalTypes';
import { getClientVersion } from 'owa-config';
import { getCurrentCulture } from 'owa-localize';
import { makePostRequest } from 'owa-ows-gateway';
import { getUserConfiguration } from 'owa-session-store';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

const DEFAULT_COMPLIANCE = 'EUII';

export default function logSigsDatapoint(eventName: SigsSignalType, options?: SigsOptionalParams) {
    const userConfig = getUserConfiguration();
    const sessionSettings = userConfig?.SessionSettings;
    const customProperties = options?.customProperties ? options.customProperties : {};

    // We're using PUID for the actor id, so that means we need different behaviour based on whether or not this is an AAD or MSA account:
    //  - For AAD users, the default is OID, so no prefix needed. PUID is a supported alternative and the prefix is required.
    //  - For MSA users, the default is PUID, the prefix is not required (and is also not supported, you will get a HTTP 400 if you post with PUID prefix for MSA user). CID is a supported alternative and the prefix is required.
    const body: SigsBody = {
        SignalType: eventName,
        Locale: getCurrentCulture(),
        Compliance: options?.compliance || DEFAULT_COMPLIANCE,
        StartTime: (options?.start || new Date()).toISOString(),
        EndTime: new Date().toISOString(),
        Application: {
            AadAppId: '00000002-0000-0ff1-ce00-000000000000',
            AppName: 'OWA',
            AppVer: getClientVersion(),
            Workload: 'EXO',
        },
        Actor: {
            AadTenantId: sessionSettings?.ExternalDirectoryTenantGuid,
            ActorIdType: isConsumer() ? 'MSA' : 'AAD',
            ActorId: sessionSettings && (isConsumer() ? '' : 'PUID:') + sessionSettings.UserPuid,
            ActorType: 'User',
        },
        Device: {},
        CustomProperties: customProperties,
    };

    if (options?.itemId) {
        body.Item = {
            ItemType: 'Message',
            ItemId: options.itemId,
        };
    }

    let customHeaders = {
        Prefer:
            'exchange.behavior="SignalAccessV2,OpenComplexTypeExtensions,EhamJitProvisioning",outlook.data-source="Substrate"',
    };

    if (options?.instanceId) {
        customHeaders['X-SignalInstanceId'] = options.instanceId;
    }

    const datapoint = new PerformanceDatapoint('LogSigs');
    makePostRequest(
        '/api/v2.0/me/signals',
        body,
        undefined,
        false, // return full response
        customHeaders,
        false, // throw service error
        true, // send payload as body
        true, // include credentials
        'SigsUpload',
        {
            customData: {
                Type: eventName,
            },
        }
    ).then(() => {
        datapoint.addCustomData({
            instanceId: options?.instanceId,
        });
        datapoint.end();
    });
}
