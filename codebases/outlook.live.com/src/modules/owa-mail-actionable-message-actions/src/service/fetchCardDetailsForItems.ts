import type { CardDetails } from 'owa-actionable-message-v2';
import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import parseCardProperty from '../utils/parseCardProperty';
import getItem from 'owa-mail-store/lib/services/getItem';
import getExtendedPropertyValue from 'owa-mail-store/lib/utils/getExtendedPropertyValue';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import { getExtendedPropertyUri } from 'owa-service/lib/ServiceRequestUtils';
import { MESSAGE_CARD_PROPERTY_NAME, PROPERTY_SET_GUID } from '../constants';
import { Warning } from '../traceConstants';

const getExtendedPropertyUriForMessageCard = (): ExtendedPropertyUri => {
    return getExtendedPropertyUri(PROPERTY_SET_GUID, MESSAGE_CARD_PROPERTY_NAME, 'String');
};

const fetchCardDetailsForItems = async (
    itemIdList: string[],
    errorMessageList?: [string, boolean][]
): Promise<CardDetails[][]> => {
    try {
        const itemShape = itemResponseShape({
            BaseShape: 'IdOnly',
            AdditionalProperties: [getExtendedPropertyUriForMessageCard()],
        });

        // VSO 30283: Use null for shape name instead of ItemPart.
        // ItemPart is meant for GCI and hurts performance when used with GetItem.
        const itemOrError = await getItem(itemIdList, itemShape);
        if (itemOrError && !(itemOrError instanceof Error)) {
            let parsedCardPayloads: CardDetails[][] = [];
            for (const item of itemOrError) {
                const extendedPropertyValue = getExtendedPropertyValue(
                    item,
                    null /* tag */,
                    MESSAGE_CARD_PROPERTY_NAME
                );
                if (extendedPropertyValue) {
                    parsedCardPayloads.push(
                        parseCardProperty(extendedPropertyValue, errorMessageList ?? [])
                    );
                } else {
                    parsedCardPayloads.push(null);
                }
            }
            return parsedCardPayloads;
        }
    } catch (e) {
        // On a network error we just won't have a card for this item
        errorMessageList?.push([Warning.FetchCatchBlock, false]);
    }

    errorMessageList?.push([Warning.FetchNoExtProp, false]);
    return null;
};

export default fetchCardDetailsForItems;
