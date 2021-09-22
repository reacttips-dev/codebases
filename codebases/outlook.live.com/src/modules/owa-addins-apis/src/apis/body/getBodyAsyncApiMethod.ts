import convertHtmlToPlainText from '../../utils/convertHtmlToPlainText';
import getItem from '../../services/getItem';
import type Item from 'owa-service/lib/contract/Item';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import { getAdapter, MessageReadAdapter, MessageComposeAdapter } from 'owa-addins-adapters';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import { ApiErrorCode } from '../ApiErrorCode';
import type { ApiMethodCallback } from '../ApiMethod';
import { CoercionType } from '../../index';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { isFeatureEnabled } from 'owa-feature-flags';

export interface GetBodyArgs {
    coercionType: CoercionType;
}

export default async function getBodyAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: GetBodyArgs,
    callback: ApiMethodCallback
): Promise<void> {
    const adapter = getAdapter(hostItemIndex);
    const mode = adapter.mode;
    let content: string = null;
    if (
        mode == ExtensibilityModeEnum.MessageRead ||
        mode == ExtensibilityModeEnum.AppointmentAttendee
    ) {
        try {
            content = await getBodyFromItem(await (adapter as MessageReadAdapter).getItem());
        } catch (err) {
            callback(createErrorResult(ApiErrorCode.GenericResponseError));
            return;
        }
    } else if (
        mode == ExtensibilityModeEnum.MessageCompose ||
        mode == ExtensibilityModeEnum.AppointmentOrganizer
    ) {
        content = (adapter as MessageComposeAdapter).getBody();
    }

    if (data.coercionType == CoercionType.Text) {
        content = convertHtmlToPlainText(content);
    }

    callback(createSuccessResult(content));
}

async function getBodyFromItem(item: Pick<Item, 'NormalizedBody' | 'ItemId'>): Promise<string> {
    if (!isFeatureEnabled('addin-getBodyAsyncApi-update-fix')) {
        if (!item.NormalizedBody) {
            const response: Item = await getItem(
                [item.ItemId.Id],
                getNormalizedBodyResponseShape(),
                'ItemNormalizedBody'
            );
            item.NormalizedBody = response.NormalizedBody;
        }
        return item.NormalizedBody.Value;
    }
    const response: Item = await getItem(
        [item.ItemId.Id],
        getNormalizedBodyResponseShape(),
        'ItemNormalizedBody'
    );
    return response.NormalizedBody.Value;
}

function getNormalizedBodyResponseShape(): ItemResponseShape {
    return itemResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: [propertyUri({ FieldURI: 'NormalizedBody' })],
    });
}
