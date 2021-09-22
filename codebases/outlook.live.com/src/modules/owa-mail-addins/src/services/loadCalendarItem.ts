import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import type SingleResponseMessage from 'owa-service/lib/contract/SingleResponseMessage';
import getCalendarEventRequest from 'owa-service/lib/factory/getCalendarEventRequest';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import getCalendarEventOperation from 'owa-service/lib/operation/getCalendarEventOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import checkIfResponseSuccess from 'owa-service-utils/lib/checkIfResponseSuccess';

function getCalendarItemResponseShape(): ItemResponseShape {
    return itemResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: [
            propertyUri({ FieldURI: 'calendar:Recurrence' }),
            propertyUri({ FieldURI: 'calendar:SeriesMasterItemId' }),
        ],
    });
}

export default function loadCalendarItem(itemId: ItemId): Promise<CalendarItem> {
    return getCalendarItem(itemId).then(responseMessage => {
        if (checkIfResponseSuccess(responseMessage[0])) {
            const responseItem = responseMessage[0] as ItemInfoResponseMessage;
            const calendarItem = responseItem.Items[0] as CalendarItem;
            return {
                SeriesMasterItemId: calendarItem.SeriesMasterItemId,
                Recurrence: calendarItem.Recurrence,
            };
        }
        return null;
    });
}

async function getCalendarItem(itemId: ItemId): Promise<SingleResponseMessage[]> {
    const response = await getCalendarEventOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getCalendarEventRequest({
                EventIds: [itemId],
                ItemShape: getCalendarItemResponseShape(),
            }),
        },
        /*options*/ null
    );
    return response.Body.ResponseMessages.Items;
}
