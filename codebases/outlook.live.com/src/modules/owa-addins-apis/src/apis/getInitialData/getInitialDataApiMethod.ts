import getInitialData from '../getInitialData/getInitialData';
import type { ApiMethodCallback } from '../ApiMethod';
import { logAddinUsage } from 'owa-addins-analytics';
import {
    getAddinCommandForControl,
    getEntryPointForControl,
    getUilessAddinCommandTelemetry,
} from 'owa-addins-store';

export default async function getInitialDataApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: any,
    callback: ApiMethodCallback
) {
    const returnData = await getInitialData(controlId, hostItemIndex);
    logAddinUsage(
        true /* success */,
        getAddinCommandForControl(controlId),
        hostItemIndex,
        getEntryPointForControl(controlId),
        getUilessAddinCommandTelemetry(hostItemIndex, controlId),
        controlId
    );
    callback(returnData);
}
