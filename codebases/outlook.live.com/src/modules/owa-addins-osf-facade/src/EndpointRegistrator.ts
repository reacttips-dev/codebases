import { executeApiMethod, ExtApiParams, OsfExtApiParams } from 'owa-addins-apis';
import 'owa-addins-osfruntime';
import { getExtensibilityState } from 'owa-addins-store';
import {
    ApiEventHandler,
    ApiEventCallback,
    registerApiEvent,
    ApiEventRegisterArgs,
    unregisterApiEvent,
    OutlookEventDispId,
} from 'owa-addins-events';

interface RegistratorMethod {
    name: string;
    isBlocking: boolean;
    action: (hostItemIndex: string) => (data: any, responseMethod: any) => void;
}

interface EventRegistrationFunction {
    (
        eventHandler: ApiEventHandler | XdmEventHandler,
        callback: ApiEventCallback | XdmEventCallback,
        args: ApiEventRegisterArgs | any
    ): void;
}

interface RegistratorEvent {
    name: string;
    registerAction: EventRegistrationFunction;
    unregisterAction: EventRegistrationFunction;
}

const executeMethodCommon = (hostItemIndex: string) => (
    data: ExtApiParams,
    responseMethod: any
) => {
    if (data) {
        const apiParams = data.ApiParams;
        const controlId = getControlId(data.MethodData.ControlId);
        const dispatchId = data.MethodData.DispatchId;
        executeApiMethod(hostItemIndex, dispatchId, controlId, apiParams, responseMethod);
    }
};

const executeMethodOsf = (hostItemIndex: string) => (
    data: OsfExtApiParams,
    responseMethod: any
) => {
    if (data) {
        const controlId = getControlId(data.DdaMethod.ControlId);
        const dispatchId = data.DdaMethod.DispatchId;
        executeApiMethod(hostItemIndex, dispatchId, controlId, data, responseMethod);
    }
};

const eventRegisterAction = (
    eventHandler: ApiEventHandler,
    callback: ApiEventCallback,
    args: ApiEventRegisterArgs
) => {
    registerApiEvent(eventHandler, args, callback);
};

const eventUnregisterAction = (
    eventHandler: ApiEventHandler,
    callback: ApiEventCallback,
    args: ApiEventRegisterArgs
) => {
    args.controlId = getControlId(args.controlId);
    args.eventDispId = getDispId(args.eventDispId);
    unregisterApiEvent(args, callback);
};

const asyncMethods: RegistratorMethod[] = [
    { name: 'GetInitialData', isBlocking: true, action: executeMethodCommon },
    {
        name: 'executeMethod',
        isBlocking: false,
        action: executeMethodOsf,
    } /* used to call OSF APIs from Office.js */,
    { name: 'ExecuteMethod', isBlocking: false, action: executeMethodCommon },
];

function getEvents(hostItemIndex: string): RegistratorEvent[] {
    return [
        {
            name: 'appCommandInvoked',
            registerAction: OfficeExt.AddinCommandsRuntimeManager.registerEvent,
            unregisterAction: OfficeExt.AddinCommandsRuntimeManager.unregisterEvent,
        },
        {
            name: 'dialogMessageReceived',
            registerAction: eventRegisterAction,
            unregisterAction: eventUnregisterAction,
        },
        {
            name: 'dialogParentMessageReceived',
            registerAction: eventRegisterAction,
            unregisterAction: eventUnregisterAction,
        },
        {
            name: 'dialogNotificationShown',
            registerAction: eventRegisterAction,
            unregisterAction: eventUnregisterAction,
        },
        {
            name: 'olkItemSelectedChanged',
            registerAction: eventRegisterAction,
            unregisterAction: eventUnregisterAction,
        },
        {
            name: 'olkAppointmentTimeChanged',
            registerAction: eventRegisterAction,
            unregisterAction: eventUnregisterAction,
        },
        {
            name: 'olkRecipientsChanged',
            registerAction: eventRegisterAction,
            unregisterAction: eventUnregisterAction,
        },
        {
            name: 'olkRecurrenceChanged',
            registerAction: eventRegisterAction,
            unregisterAction: eventUnregisterAction,
        },
        {
            name: 'olkEnhancedLocationsChanged',
            registerAction: eventRegisterAction,
            unregisterAction: eventUnregisterAction,
        },
        {
            name: 'olkAttachmentsChanged',
            registerAction: eventRegisterAction,
            unregisterAction: eventUnregisterAction,
        },
    ];
}

export function registerEndpoints(hostItemIndex: string, endpoint: OSF.ServiceEndpoint) {
    asyncMethods.forEach(method => {
        endpoint.registerMethod(
            method.name,
            method.action(hostItemIndex),
            Microsoft.Office.Common.InvokeType.async,
            method.isBlocking
        );
    });

    getEvents(hostItemIndex).forEach(event => {
        endpoint.registerEventEx(
            event.name,
            event.registerAction,
            Microsoft.Office.Common.InvokeType.asyncRegisterEvent,
            event.unregisterAction,
            Microsoft.Office.Common.InvokeType.asyncUnregisterEvent
        );
    });
}

export function unregisterEndpoints(hostItemIndex: string, endpoint: OSF.ServiceEndpoint) {
    asyncMethods.forEach(method => endpoint.unregisterMethod(method.name));
    getEvents(hostItemIndex).forEach(event => endpoint.unregisterEvent(event.name));
}

function getControlId(controlId: string): string {
    const { activeDialogs } = getExtensibilityState();
    for (let activeDialog of activeDialogs.values()) {
        if (activeDialog && activeDialog.controlId === controlId) {
            return activeDialog.parentControlId;
        }
    }
    return controlId;
}

function getDispId(dispId: OutlookEventDispId): OutlookEventDispId {
    if (dispId == OutlookEventDispId.DIALOG_NOTIFICATION_SHOWN_IN_ADDIN_DISPID) {
        return OutlookEventDispId.DISPLAY_DIALOG_DISPID;
    }
    return dispId;
}
