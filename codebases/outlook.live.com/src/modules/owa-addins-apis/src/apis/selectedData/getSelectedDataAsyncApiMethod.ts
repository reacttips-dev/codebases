import convertHtmlToPlainText from '../../utils/convertHtmlToPlainText';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { CoercionType } from '../../index';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';

export interface GetSelectedDataArgs {
    coercionType: CoercionType;
}

export default function getSelectedDataAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: GetSelectedDataArgs,
    callback: ApiMethodCallback
): void {
    const adapter = getAdapter(hostItemIndex);
    const selectedData = (adapter as MessageComposeAdapter).getSelectedData();

    if (!selectedData) {
        callback(createErrorResult(ApiErrorCode.InvalidSelection));
        return;
    }

    if (data.coercionType == CoercionType.Text) {
        selectedData.data = convertHtmlToPlainText(selectedData.data);
    }

    callback(createSuccessResult(selectedData));
}
