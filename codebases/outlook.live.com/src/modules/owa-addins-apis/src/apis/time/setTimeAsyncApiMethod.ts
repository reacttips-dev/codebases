import TimeTypeEnum from './TimeTypeEnum';
import { getAdapter, AppointmentComposeAdapter } from 'owa-addins-adapters';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { returnErrorIfUserCannotEditItem } from '../sharedProperties/itemPermissions';

export interface SetTimeArgs {
    TimeProperty: TimeTypeEnum;
    time: number;
}

export default function setTimeAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: SetTimeArgs,
    callback: ApiMethodCallback
) {
    const adapter: AppointmentComposeAdapter = getAdapter(
        hostItemIndex
    ) as AppointmentComposeAdapter;

    if (returnErrorIfUserCannotEditItem(adapter, callback)) {
        return;
    }

    const dateTime = new Date(data.time);
    if (data.TimeProperty === TimeTypeEnum.Start) {
        adapter.setStartTime(dateTime);
    } else if (data.TimeProperty === TimeTypeEnum.End) {
        let noError = adapter.setEndTime(dateTime);
        if (!noError) {
            callback(createErrorResult(ApiErrorCode.InvalidEndTime));
            return;
        }
    }

    callback(createSuccessResult());
}
