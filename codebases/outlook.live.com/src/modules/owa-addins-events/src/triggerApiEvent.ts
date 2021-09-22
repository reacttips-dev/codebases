import invokeCallback from './utils/invokeCallback';
import selectEventByDispId from './utils/selectEventByDispId';
import type { ApiEvent } from './schema/ApiEvent';
import type { ApiEventCallback } from './schema/ApiEventCallback';
import { getApiEventHandler } from './storage/ActiveApiEvents';
import type { OutlookEventDispId } from './schema/OutlookEventDispId';
import {
    getHandlerNotRegisteredResult,
    getSuccessResult,
    ApiEventResult,
    isSuccess,
} from './schema/ApiEventResult';
import { logUsage } from 'owa-analytics';
import {
    getAddinCommandForControl,
    IAddinCommand,
    getEntryPointForControl,
    getScenarioFromHostItemIndex,
} from 'owa-addins-store';
import { getApp } from 'owa-config';
import { getCompliantAppId } from 'owa-addins-analytics';

export default function triggerApiEvent(
    dispId: OutlookEventDispId,
    controlId: string,
    args: any,
    callback?: ApiEventCallback,
    hostItemIndex?: string
) {
    const apiEvent = selectEventByDispId(dispId);
    let result = apiEvent.onTrigger(args, controlId);
    if (isSuccess(result)) {
        result = invokeHandler(controlId, dispId, apiEvent, args);
    }
    invokeCallback(callback, result);
    if (hostItemIndex) {
        const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
        const EventResponseCode = result.EventResponseCode;
        logUsage('ExecuteEvent', {
            dispId,
            Id: getCompliantAppId(addinCommand.extension),
            DisplayName: addinCommand.extension.DisplayName,
            owa_1: getApp(),
            owa_2: getScenarioFromHostItemIndex(hostItemIndex),
            extPoint: getEntryPointForControl(controlId),
            owa_4: addinCommand.extension.Type,
            EventResponseCode,
        });
    }
}

function invokeHandler(
    controlId: string,
    dispId: OutlookEventDispId,
    apiEvent: ApiEvent,
    args: any
): ApiEventResult {
    const handler = getApiEventHandler(controlId, dispId);
    if (!handler) {
        return getHandlerNotRegisteredResult();
    }

    const formattedArgs = apiEvent.formatArgsForHandler(args);
    handler(formattedArgs);
    return getSuccessResult();
}
