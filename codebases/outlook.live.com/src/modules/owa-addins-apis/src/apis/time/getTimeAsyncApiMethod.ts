import TimeTypeEnum from './TimeTypeEnum';
import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, AppointmentComposeAdapter } from 'owa-addins-adapters';

export interface GetTimeArgs {
    TimeProperty: TimeTypeEnum;
}

export default function getTimeAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: GetTimeArgs,
    callback: ApiMethodCallback
) {
    const adapter: AppointmentComposeAdapter = getAdapter(
        hostItemIndex
    ) as AppointmentComposeAdapter;
    let time: Date = null;
    if (data.TimeProperty === TimeTypeEnum.Start) {
        time = adapter.getStartTime();
    } else if (data.TimeProperty === TimeTypeEnum.End) {
        time = adapter.getEndTime();
    }

    callback(createSuccessResult(time));
}
