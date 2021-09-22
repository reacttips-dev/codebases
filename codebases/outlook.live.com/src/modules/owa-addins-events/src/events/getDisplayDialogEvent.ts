import ApiEventResponseCode from '../schema/ApiEventResponseCode';
import checkUrlWithAppDomains from '../utils/checkUrlWithAppDomains';
import triggerApiEvent from '../triggerApiEvent';
import type { ApiEvent } from '../schema/ApiEvent';
import { getGuid } from 'owa-guid';
import { OutlookEventDispId } from '../schema/OutlookEventDispId';
import {
    ApiEventResult,
    getUrlNotInAppDomainsResult,
    getSuccessResult,
    getDialogAlreadyOpenResult,
} from '../schema/ApiEventResult';
import {
    ActiveDialogType,
    getAddinCommandForControl,
    isUilessAddinRunning,
    ActiveDialog,
    getHostItemIndex,
    setActiveDialog,
    isAnyDialogOpen,
} from 'owa-addins-store';

export interface DialogEventRegisterArgs {
    url: string;
    height: number;
    width: number;
    displayInIframe: boolean;
}

export interface DialogMessageParentArgs {
    messageToParent: string;
}

interface MessageParentFormattedArgs {
    messageType: string;
    messageContent: string;
}

interface UnregisterFormattedArgs {
    messageType: ApiEventResponseCode;
}

export default function getDisplayDialogEvent(): ApiEvent {
    return {
        register,
        unregister,
        onTrigger,
        formatArgsForHandler,
    };
}

function register(controlId: string, args: DialogEventRegisterArgs): ApiEventResult {
    const hostItemIndex = getHostItemIndex(controlId);
    if (isAnyDialogOpen(hostItemIndex)) {
        return getDialogAlreadyOpenResult();
    }
    if (!isUrlAllowed(controlId, args)) {
        return getUrlNotInAppDomainsResult();
    }

    let dialog: ActiveDialog = createDialog(controlId, args, true /*isOpen*/);
    setActiveDialog(dialog, hostItemIndex);
    return getSuccessResult();
}

function unregister(controlId: string): ApiEventResult {
    const hostItemIndex = getHostItemIndex(controlId);
    setActiveDialog(null, hostItemIndex);
    triggerApiEvent(
        OutlookEventDispId.DISPLAY_DIALOG_DISPID,
        controlId,
        null /* args unnecessary for WebDialogClosed */
    );
    return getSuccessResult();
}

function onTrigger(args: DialogMessageParentArgs, controlId?: string): ApiEventResult {
    return getSuccessResult();
}

function formatArgsForHandler(args: any): any {
    if (isArgsMessageParentArgs(args)) {
        return constructMessageParentArgs(args as DialogMessageParentArgs);
    } else {
        return constructUnregisterArgs();
    }
}

function createDialog(
    controlId: string,
    args: DialogEventRegisterArgs,
    isOpen: boolean
): ActiveDialog {
    const hostItemIndex = getHostItemIndex(controlId);
    if (args && args.displayInIframe == true) {
        return {
            controlId: getGuid(),
            dialogType: ActiveDialogType.IFrameable,
            url: args.url,
            heightInPercentage: args.height,
            widthInPercentage: args.width,
            parentControlId: controlId,
            isOpen: isOpen,
            hostItemIndex: hostItemIndex,
        };
    } else if (isUilessAddinRunning(controlId)) {
        // NonIFrameable is supported only for UiLess
        return {
            controlId: getGuid(),
            dialogType: ActiveDialogType.NonIFrameable,
            parentControlId: controlId,
            isOpen: isOpen,
            hostItemIndex: hostItemIndex,
        };
    } else {
        // No op for NonIFrameable, Non-UiLess addins (e.g. Task pane)
        return null;
    }
}

function constructMessageParentArgs(args: DialogMessageParentArgs): MessageParentFormattedArgs {
    const OsfDialogMessageParentType = '0';
    const message = args.messageToParent;
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

function isArgsMessageParentArgs(args: DialogMessageParentArgs): args is DialogMessageParentArgs {
    return args != null && (<DialogMessageParentArgs>args).messageToParent !== undefined;
}

function isUrlAllowed(controlId: string, args: DialogEventRegisterArgs): boolean {
    // We want to do this check only for IFrameable Dialog
    if (args && args.displayInIframe == true) {
        const appdomains: string[] = getAddinCommandForControl(controlId).extension.AppDomains;
        return checkUrlWithAppDomains(appdomains, args.url);
    }
    return true;
}
