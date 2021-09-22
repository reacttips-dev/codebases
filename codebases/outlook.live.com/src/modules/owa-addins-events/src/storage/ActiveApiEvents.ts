import type ApiEventHandler from '../schema/ApiEventHandler';
import { OutlookEventDispId } from '../schema/OutlookEventDispId';

export type ActiveApiEvents = {
    [controlId: string]: { [dispId: number]: ApiEventHandler };
};

export type ActiveApiEventsForIframe = {
    [dispId: number]: string;
};

const allActiveApiEvents: ActiveApiEvents = {};
const allActiveApiEventsforIframe: ActiveApiEventsForIframe = {};

export function getApiEventHandler(controlId: string, dispId: OutlookEventDispId): ApiEventHandler {
    /* For events registered in iFrame from taskpane */
    switch (dispId) {
        case OutlookEventDispId.DIALOG_PARENT_MESSAGE_RECEIVED:
            let iFrameControlId: string = allActiveApiEventsforIframe[dispId];
            if (allActiveApiEvents[iFrameControlId]?.[dispId]) {
                return allActiveApiEvents[iFrameControlId][dispId];
            }
    }
    if (allActiveApiEvents[controlId]?.[dispId]) {
        return allActiveApiEvents[controlId][dispId];
    }
    return null;
}

export function setApiEventHandler(
    controlId: string,
    dispId: OutlookEventDispId,
    newHandler: ApiEventHandler
): void {
    if (!allActiveApiEvents[controlId]) {
        allActiveApiEvents[controlId] = {};
        allActiveApiEventsforIframe[
            dispId
        ] = controlId; /* Required for events registered in iFrame */
    }
    allActiveApiEvents[controlId][dispId] = newHandler;
}

export function deleteApiEventHandler(controlId: string, dispId: OutlookEventDispId): void {
    if (allActiveApiEvents[controlId]?.[dispId]) {
        delete allActiveApiEvents[controlId][dispId];
    }
}

export function deleteAllApiEventHandlers(controlId: string): void {
    delete allActiveApiEvents[controlId];
}

export function isControlRegistered(controlId: string, dispId: OutlookEventDispId): boolean {
    return !!getApiEventHandler(controlId, dispId);
}
