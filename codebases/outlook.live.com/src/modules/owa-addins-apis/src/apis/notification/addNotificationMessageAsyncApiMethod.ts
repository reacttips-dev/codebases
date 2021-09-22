import addOrReplaceNotificationMessage from './addOrReplaceNotificationMessage';
import type { ApiMethodCallback } from '../ApiMethod';
import type {
    NotificationMessageArgs,
    NotificationMessageWithCustomBar,
} from './ExtensibilityNotification';
import { getAdapter } from 'owa-addins-adapters';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { createErrorResult } from '../ApiMethodResponseCreator';
import {
    getAddinCommandForControl,
    getEntryPointForControl,
    getScenarioFromHostItemIndex,
    IAddinCommand,
} from 'owa-addins-store';
import { getCommandWithGivenId } from '../../utils/getCommandWithGivenId';
import { ApiErrorCode } from '../ApiErrorCode';
import WebExtNotificationTypeType from 'owa-service/lib/contract/WebExtNotificationTypeType';
import { logUsage } from 'owa-analytics';
import ApiError from '../ApiError';
import { getCompliantAppId } from 'owa-addins-analytics';

export default async function addNotificationMessageAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: NotificationMessageArgs,
    callback: ApiMethodCallback
): Promise<void> {
    let CustomButtonAddinCommand: IAddinCommand;
    let NotificationData: NotificationMessageWithCustomBar;
    let isClickableInfobar: boolean = false;
    const adapter = getAdapter(hostItemIndex);
    const mode = adapter.mode;
    if (data.type === WebExtNotificationTypeType.InsightMessage && !data.actions) {
        callback(createErrorResult(ApiErrorCode.InvalidParameterValueError));
        return;
    }

    if (data.type === WebExtNotificationTypeType.InsightMessage && data.actions) {
        isClickableInfobar = true;
        const addInCommandForCurrentAddinWindow = getAddinCommandForControl(controlId);
        const addinId = addInCommandForCurrentAddinWindow.extension.Id;
        switch (mode) {
            case ExtensibilityModeEnum.MessageRead:
            case ExtensibilityModeEnum.AppointmentAttendee:
                {
                    callback(createErrorResult(ApiErrorCode.OperationNotSupported));
                    return;
                }
                break;
            case ExtensibilityModeEnum.MessageCompose:
            case ExtensibilityModeEnum.AppointmentOrganizer: {
                CustomButtonAddinCommand = getCommandWithGivenId(
                    addinId,
                    data.actions[0].commandId,
                    mode
                );

                if (!CustomButtonAddinCommand) {
                    callback(createErrorResult(ApiErrorCode.InvalidParameterValueError));
                    return;
                }

                NotificationData = {
                    NotificationActionData: data.actions[0],
                    CustomButtonAction: CustomButtonAddinCommand,
                    CustomButtonIcon: CustomButtonAddinCommand.get_Size16Icon(),
                };
            }
        }
    }
    const result = await addOrReplaceNotificationMessage(
        hostItemIndex,
        controlId,
        data.persistent,
        data.key,
        data.type,
        data.message,
        data.icon,
        true /* noDupes */,
        NotificationData
    );

    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);

    logUsage('ShowNotificationBar', {
        Id: getCompliantAppId(addinCommand.extension),
        DisplayName: addinCommand.extension.DisplayName,
        Scenario: getScenarioFromHostItemIndex(hostItemIndex),
        extPoint: getEntryPointForControl(controlId),
        IsClickableInfobar: isClickableInfobar,
        error: result instanceof ApiError ? JSON.stringify(result) : '',
        mode: mode,
    });
    callback(result);
}
