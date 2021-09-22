import ApiEventResponseCode from '../schema/ApiEventResponseCode';
import type { ApiEvent } from '../schema/ApiEvent';
import { ApiEventResult, getSuccessResult } from '../schema/ApiEventResult';
import {
    defaultEventRegistrationHandler,
    defaultEventUnregistrationHandler,
} from './defaultEventHandlers';

export interface DialogEventRegisterArgs {
    url: string;
    height: number;
    width: number;
    displayInIframe: boolean;
}

interface MessageParentFormattedArgs {
    messageType: string;
    messageContent: string;
}

interface UnregisterFormattedArgs {
    messageType: ApiEventResponseCode;
}

export default function getIframeDialogEvent(): ApiEvent {
    return {
        register: defaultEventRegistrationHandler,
        unregister: defaultEventUnregistrationHandler,
        onTrigger,
        formatArgsForHandler: formatArgsForHandlerforIframe,
    };
}

function onTrigger(): ApiEventResult {
    return getSuccessResult();
}

function formatArgsForHandlerforIframe(args: any): any {
    if (args) {
        return constructMessageParentArgsIFrame(args);
    } else {
        return constructUnregisterArgs();
    }
}

function constructMessageParentArgsIFrame(args: any): MessageParentFormattedArgs {
    const OsfDialogMessageParentType = '0';
    const message = args.messageContent;
    return {
        messageType: OsfDialogMessageParentType,
        messageContent: message,
    };
}

function constructUnregisterArgs(): UnregisterFormattedArgs {
    return {
        messageType: ApiEventResponseCode.WEB_DIALOG_CLOSED,
    };
}
