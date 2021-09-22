import { CommonAdapter, getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult } from '../ApiMethodResponseCreator';
import { AppendOnSend, CoercionType } from '../../index';
import type { SetDataAdapterMethod } from '../setData/SetDataAdapterMethod';
import type { SetDataArgs } from '../setData/SetDataArgs';
import setDataAsyncApiMethodBase from '../setData/setDataAsyncApiMethodBase';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';
import { getExtensionId, getAddinCommandForControl } from 'owa-addins-store';
import isItemSendEvent from 'owa-addins-store/lib/store/isItemSendEvent';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { isFeatureEnabled } from 'owa-feature-flags';

export const MAX_BODY_API_LENGTH_FOR_APPEND_ON_SEND = 5000;

export default async function appendOnSendAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    args: SetDataArgs,
    callback: ApiMethodCallback
) {
    const addInCommand = getAddinCommandForControl(controlId);
    if (addInCommand?.extension) {
        var lowerCaseExtendedPermissions = addInCommand.extension.ExtendedPermissions
            ? addInCommand.extension.ExtendedPermissions.map(function (value) {
                  return value.toLowerCase();
              })
            : [];
        if (lowerCaseExtendedPermissions.indexOf('appendonsend') <= -1) {
            callback(createErrorResult(ApiErrorCode.MissingExtendedPermissionsForAPIError));
            return;
        }
    } else {
        callback(createErrorResult(ApiErrorCode.GenericResponseError));
        return;
    }

    const adapter: CommonAdapter = getAdapter(hostItemIndex);
    const mode = adapter.mode;

    if (
        !isFeatureEnabled('rp-appendOnSend') ||
        mode == ExtensibilityModeEnum.MessageRead ||
        mode == ExtensibilityModeEnum.AppointmentAttendee
    ) {
        callback(createErrorResult(ApiErrorCode.OperationNotSupported));
        return;
    }
    const data = args.appendTxt;
    // null strings were set to be empty string in API layer, so data should not be null
    if (!!data && data.length > MAX_BODY_API_LENGTH_FOR_APPEND_ON_SEND) {
        callback(createErrorResult(ApiErrorCode.OoeInvalidDataFormat));
        return;
    }

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    if (
        args.coercionType === CoercionType.Html &&
        (adapter as MessageComposeAdapter).getBodyType() === 'Text'
    ) {
        callback(createErrorResult(ApiErrorCode.OoeInvalidDataFormat));
        return;
    }

    const extensionId = getExtensionId(controlId);
    if (extensionId == null || isItemSendEvent(extensionId, controlId)) {
        callback(createErrorResult(ApiErrorCode.ApiCallNotSupportedByExtensionPoint));
        return;
    }
    let appendOnSend: AppendOnSend = {
        id: extensionId,
        typ: args.coercionType,
        txt: data, // unsanitized text
    };
    args.appendOnSend = appendOnSend;

    await setDataAsyncApiMethodBase(
        hostItemIndex,
        controlId,
        args,
        callback,
        adapter.appendOnSend as SetDataAdapterMethod
    );
}
