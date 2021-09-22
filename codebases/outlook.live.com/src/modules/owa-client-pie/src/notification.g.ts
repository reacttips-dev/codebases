// This file was automatically generated from notification.schema.d.ts
// and contains types and methods for calling PIE

import * as PIEBridge from '@microsoft/pie.sharedbridge';

export function GetPIEScriptVersion(): number {
    return 0.4;
}

export enum NotificationDisplayType {
    TwoActionNotificationWithImage = 'TwoActionNotificationWithImage',
    ThreeActionNotificationWithImage = 'ThreeActionNotificationWithImage',
    ThreeActionNotificationWithDropdown = 'ThreeActionNotificationWithDropdown',
}

export enum ActionType {
    ButtonAction = 'ButtonAction',
    DropdownAction = 'DropdownAction',
}

export interface ButtonProperty {
    buttonId: string;
    iconUrl?: string;
    displayText?: string;
}

export interface NotificationAction {
    actionType: ActionType;
    button: ButtonProperty;
}

export interface ActionProperty extends ButtonProperty {
    items?: DropdownAction[];
}

export interface NotificationCustomAction extends NotificationAction {
    action?: ActionProperty;
}

export interface DropdownAction {
    displayContent: string;
    id: string;
}

export interface NotificationContext {
    bringAppToForeground: boolean;
    itemId: string;
    isFutureNotification?: boolean;
    isSilent?: boolean;
    notificationActions: NotificationCustomAction[];
    notificationDisplayType: NotificationDisplayType;
    notificationType: string;
    originName: string;
    originSmtpEmailAddress: string;
    originDisplayImageUrl: string;
    scheduledTime?: Date;
    text: string[];
    upn: string;
    personaImage?: number[];
}

export interface UserInteraction {
    notificationType: string;
    buttonId: string;
    itemId: string;
    upn: string;
    sender: string;
    selectedActionId?: string;
}

export interface RaiseNotificationParams {
    context: NotificationContext;
}

export interface HandleUserActionOnNotificationParams {
    action: UserInteraction;
}

export class JsonPostProcessing {
    public static ArrayOfDropdownActionValue(json: any): DropdownAction[] {
        for (let index = 0; index < json.length; index++) {
            json[index] = JsonPostProcessing.DropdownActionValue(json[index]);
        }

        return json;
    }

    public static ArrayOfNotificationCustomActionValue(json: any): NotificationCustomAction[] {
        for (let index = 0; index < json.length; index++) {
            json[index] = JsonPostProcessing.NotificationCustomActionValue(json[index]);
        }

        return json;
    }

    public static ArrayOfStringValue(json: any): string[] {
        return json;
    }

    public static ArrayOfByteValue(json: any): number[] {
        return json;
    }

    public static NotificationDisplayTypeValue(json: string): NotificationDisplayType {
        return json as NotificationDisplayType;
    }

    public static ActionTypeValue(json: string): ActionType {
        return json as ActionType;
    }

    public static ButtonPropertyValue(json: any): ButtonProperty {
        const value = json as ButtonProperty;
        return value;
    }

    public static NotificationActionValue(json: any): NotificationAction {
        const value = json as NotificationAction;
        value.actionType = JsonPostProcessing.ActionTypeValue(value.actionType);
        value.button = JsonPostProcessing.ButtonPropertyValue(value.button);
        return value;
    }

    public static ActionPropertyValue(json: any): ActionProperty {
        const value = json as ActionProperty;
        if (value.items !== undefined) {
            value.items = JsonPostProcessing.ArrayOfDropdownActionValue(value.items);
        }

        JsonPostProcessing.ButtonPropertyValue(json);
        return value;
    }

    public static NotificationCustomActionValue(json: any): NotificationCustomAction {
        const value = json as NotificationCustomAction;
        if (value.action !== undefined) {
            value.action = JsonPostProcessing.ActionPropertyValue(value.action);
        }

        JsonPostProcessing.NotificationActionValue(json);
        return value;
    }

    public static DropdownActionValue(json: any): DropdownAction {
        const value = json as DropdownAction;
        return value;
    }

    public static NotificationContextValue(json: any): NotificationContext {
        const value = json as NotificationContext;
        value.notificationActions = JsonPostProcessing.ArrayOfNotificationCustomActionValue(
            value.notificationActions
        );
        value.notificationDisplayType = JsonPostProcessing.NotificationDisplayTypeValue(
            value.notificationDisplayType
        );
        if (value.scheduledTime !== undefined) {
            value.scheduledTime = new Date(value.scheduledTime);
        }
        return value;
    }

    public static UserInteractionValue(json: any): UserInteraction {
        const value = json as UserInteraction;
        return value;
    }

    public static RaiseNotificationParamsValue(json: any): RaiseNotificationParams {
        const value = json as RaiseNotificationParams;
        value.context = JsonPostProcessing.NotificationContextValue(value.context);
        return value;
    }

    public static HandleUserActionOnNotificationParamsValue(
        json: any
    ): HandleUserActionOnNotificationParams {
        const value = json as HandleUserActionOnNotificationParams;
        value.action = JsonPostProcessing.UserInteractionValue(value.action);
        return value;
    }
}

export async function raiseNotification(context: NotificationContext): Promise<void> {
    await PIEBridge.throwIfVersionIsNotSupported('Notification', 0.2);
    const args = { context: context } as RaiseNotificationParams;
    return PIEBridge.HostBridge.invokeHost('Notification.raiseNotification', args, undefined);
}

// Registers for the specified event
export function registerForHandleUserActionOnNotification(
    callback: (action: UserInteraction) => void
): PIEBridge.DisposeEventRegistration {
    const callbackHandler: (jsonObject: any) => void = function (jsonObject: any) {
        if (jsonObject) {
            const eventArgs: HandleUserActionOnNotificationParams = JsonPostProcessing.HandleUserActionOnNotificationParamsValue(
                jsonObject
            );
            callback(eventArgs.action);
        }
    };

    return PIEBridge.HostBridge.registerForEvent(
        'Notification.handleUserActionOnNotification',
        callbackHandler
    );
}
