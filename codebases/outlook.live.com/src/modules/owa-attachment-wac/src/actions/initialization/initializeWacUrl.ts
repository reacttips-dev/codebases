import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import type { ClientAttachmentId } from 'owa-client-ids';
import {
    isServiceFetchError,
    logResponseDataForOwaServerCalls,
    logServerCallErrorMessage,
} from 'owa-server-call-logging/lib/owaServerCallLogging';
import WacAttachmentStatus from 'owa-service/lib/contract/WacAttachmentStatus';
import type WacAttachmentType from 'owa-service/lib/contract/WacAttachmentType';
import getWacAttachmentInfo from '../../services/getWacAttachmentInfo';
import { getMailboxRequestOptions } from 'owa-request-options-types';

type WacUrlCacheType = {
    [key: string]: {
        expireTime: number;
        value: WacAttachmentType;
    };
};

type InitializeWacUrlQueueType = {
    attachmentId: ClientAttachmentId;
    isEdit: boolean;
    actionSource: string | null;
    datapoint: PerformanceDatapoint;
    resolve: (value?: WacAttachmentType | PromiseLike<WacAttachmentType>) => void;
    reject: (reason?: any) => void;
};

const wacViewInfoCache: WacUrlCacheType = {};
const wacEditInfoCache: WacUrlCacheType = {};
const initializeWacUrlQueue: InitializeWacUrlQueueType[] = [];
let activeGetWacAttachmentInfo = 0;
const maxActiveGetWacInfoOperation = 2;

export default async function initializeWacUrl(
    attachmentId: ClientAttachmentId,
    isEdit: boolean,
    actionSource?: string,
    skipQueue?: boolean
): Promise<WacAttachmentType> {
    const datapoint = new PerformanceDatapoint('InitializeWacUrl');
    if (actionSource) {
        datapoint.addCustomProperty('actionSource', actionSource);
    }

    const cacheInfo = CheckCache(attachmentId, isEdit, datapoint);
    if (cacheInfo) {
        return cacheInfo;
    }

    // tslint:disable-next-line:promise-must-complete
    return new Promise<WacAttachmentType>((resolve, reject) => {
        const queueObject: InitializeWacUrlQueueType = {
            attachmentId,
            isEdit,
            actionSource,
            datapoint,
            resolve,
            reject,
        };

        if (skipQueue) {
            forceProcessQueue(queueObject);
        } else {
            initializeWacUrlQueue.push(queueObject);
            tryProcessQueue();
        }
    });
}

async function tryProcessQueue() {
    if (!initializeWacUrlQueue.length) {
        return;
    }

    if (activeGetWacAttachmentInfo >= maxActiveGetWacInfoOperation) {
        return;
    }

    const queueObject = initializeWacUrlQueue.shift();
    activeGetWacAttachmentInfo++;

    try {
        await forceProcessQueue(queueObject);
    } finally {
        activeGetWacAttachmentInfo--;
        tryProcessQueue();
    }
}

async function forceProcessQueue(queueObject: InitializeWacUrlQueueType) {
    const { attachmentId, isEdit, actionSource, datapoint, resolve, reject } = queueObject;
    const cacheInfo = CheckCache(attachmentId, isEdit, datapoint);
    if (cacheInfo) {
        resolve(cacheInfo);
        return;
    }

    let wacAttachmentTypeResponse: WacAttachmentType;
    datapoint.addCustomProperty('ReturnFromCache', false);
    try {
        wacAttachmentTypeResponse = await getWacAttachmentInfo(
            attachmentId.Id,
            isEdit,
            null,
            getMailboxRequestOptions(attachmentId.mailboxInfo),
            actionSource
        );

        if (wacAttachmentTypeResponse.Status === WacAttachmentStatus.Success) {
            const cache = isEdit ? wacEditInfoCache : wacViewInfoCache;
            cache[attachmentId.Id] = {
                expireTime: new Date().getTime() + 60 * 60 * 1000, // expire in an hour
                value: wacAttachmentTypeResponse,
            };
        }

        if (!wacAttachmentTypeResponse.WacUrl) {
            datapoint.addCustomProperty('WacUrlIsEmpty', true);
        }

        datapoint.addCustomProperty(
            'WacAttachmentResponseStatus',
            wacAttachmentTypeResponse.Status?.toString()
        );
        datapoint.end();

        resolve(wacAttachmentTypeResponse);
    } catch (error) {
        if (isServiceFetchError(error)) {
            logResponseDataForOwaServerCalls(datapoint, error.response);
        }

        logServerCallErrorMessage(datapoint, error.toString());
        datapoint.endWithError(DatapointStatus.ServerError);
        reject(error);
    }
}

function CheckCache(
    attachmentId: ClientAttachmentId,
    isEdit: boolean,
    datapoint: PerformanceDatapoint
): WacAttachmentType | null {
    const cache = isEdit ? wacEditInfoCache : wacViewInfoCache;
    const cacheInfo = cache[attachmentId.Id];

    if (cacheInfo) {
        if (cacheInfo.expireTime >= new Date().getTime()) {
            datapoint.addCustomProperty('ReturnFromCache', true);
            datapoint.end();
            return cacheInfo.value;
        } else {
            delete cache[attachmentId.Id];
        }
    }

    return null;
}
