import getDatapointOptions from '../getDatapointOptions';
import {
    AddinCommand,
    InvokeAppAddinCommandStatusCode,
    ExtensionEventResult,
} from 'owa-addins-store';
import { getApp } from 'owa-config';
import { ItemSendEventReason } from '../enums/ItemSendEventReason';
import { PerformanceDatapoint } from 'owa-analytics';
import { getCompliantAppId } from './getCompliantAppId';

// 15 minute timeout for ItemSend
const ITEMSEND_TIMEOUT_IN_MS = 900000;

export function createItemSendEventDatapoint() {
    const options = getDatapointOptions();
    options.timeout = ITEMSEND_TIMEOUT_IN_MS;
    return new PerformanceDatapoint('ExtItemSendEvent', options);
}

export function endItemSendEventWithReason(
    datapoint: PerformanceDatapoint,
    reason: ItemSendEventReason
) {
    datapoint.addCustomData({ owa_1: reason });
    datapoint.end();
}

export function endItemSendEventDatpoint(
    datapoint: PerformanceDatapoint,
    result: ExtensionEventResult,
    addinCommand: AddinCommand
) {
    datapoint.addCustomData({
        reason: getReason(result),
        id: getCompliantAppId(addinCommand.extension),
        name: addinCommand.extension.DisplayName,
        module: getApp(),
    });
    datapoint.end();
}

function getReason(result: ExtensionEventResult) {
    if (result.status === InvokeAppAddinCommandStatusCode.Success) {
        return result.allowEvent
            ? ItemSendEventReason.AllowEventTrue
            : ItemSendEventReason.AllowEventFalse;
    } else {
        switch (result.status) {
            case InvokeAppAddinCommandStatusCode.TimedOut:
                return ItemSendEventReason.FunctionTimedOut;
            case InvokeAppAddinCommandStatusCode.FunctionNotFound:
                return ItemSendEventReason.FunctionNotFound;
            default:
                return ItemSendEventReason.Unknown;
        }
    }
}
