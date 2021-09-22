import { CoercionType } from '../../index';
import type { SetDataAdapterMethod } from './SetDataAdapterMethod';
import type { SetDataArgs } from './SetDataArgs';
import { getAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import escapeStringForHtml from '../../utils/escapeStringForHtml';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import trySanitizeHtml from '../body/trySanitizeHtml';
import hasSelectionChanged from '../selectedData/hasSelectionChanged';
import type { SelectedData } from 'owa-addins-types';
import { Browser, getBrowserInfo } from 'owa-user-agent';
import { SsoErrorCode } from 'owa-addins-sso';

export const MAX_BODY_API_LENGTH = 1000000;

export default async function setDataAsyncApiMethodBase(
    hostItemIndex: string,
    controlId: string,
    args: SetDataArgs,
    callback: ApiMethodCallback,
    setData: SetDataAdapterMethod,
    getSelectedData?: () => SelectedData
) {
    const data = !!args.appendTxt || args.appendTxt === '' ? args.appendTxt : args.data; // get AppendOnSend txt if it is there
    if (data.length > MAX_BODY_API_LENGTH) {
        callback(createErrorResult(ApiErrorCode.OoeInvalidDataFormat));
        return;
    }

    const selectedData = getSelectedData?.();

    let result: string = null;
    if (args.coercionType === CoercionType.Html) {
        result = await trySanitizeHtml(data);
        if (result == null) {
            callback(createErrorResult(ApiErrorCode.HtmlSanitizationFailure));
            return;
        }
        // add check for svg images in the content
        if (ContainsSvgImage(result)) {
            callback(createErrorResult(SsoErrorCode.OperationNotSupported));
            return;
        }
    } else {
        const adapter: MessageComposeAdapter = getAdapter(hostItemIndex) as MessageComposeAdapter;
        if (adapter.getBodyType() === 'HTML' && !args.appendOnSend) {
            // do not escape text for appendOnSend (will escape later)
            result = escapeStringForHtml(data);
        } else {
            result = data;
        }
    }
    if (!!args.appendOnSend) {
        args.appendOnSend.txt = result;
        setData(args.appendOnSend);
    } else {
        if (getSelectedData) {
            const latestSelectedData = getSelectedData();
            if (hasSelectionChanged(selectedData, latestSelectedData)) {
                callback(createErrorResult(ApiErrorCode.CursorPositionChanged));
                return;
            }
        }

        setData(result);
        if (getBrowserInfo().browser === Browser.FIREFOX) {
            (document.activeElement as HTMLElement).blur();
        }
    }

    callback(createSuccessResult());
}

function ContainsSvgImage(data): boolean {
    //Check if the input has img tag and scr attribute
    var element = new DOMParser().parseFromString(data, 'text/html');

    var imageTags = element.querySelectorAll('img');
    for (var i = 0; i < imageTags.length; i++) {
        var imgSrc = imageTags[i].getAttribute('src');
        imgSrc = decodeURIComponent(imgSrc);
        //Extract the extension of the image from the image url and check if its svg
        if (imgSrc) {
            const lastDotPositionInUrl = imgSrc.lastIndexOf('.');
            if (
                lastDotPositionInUrl !== -1 &&
                imgSrc.substring(lastDotPositionInUrl + 1).toLowerCase() === 'svg'
            ) {
                return true;
            }
        }
    }
    return false;
}
