import getItem from '../services/getItem';
import type TailoredXpData from '../store/schema/TailoredXpData';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import type Message from 'owa-service/lib/contract/Message';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';

function getTailoredXpDataResponseShape(): ItemResponseShape {
    return itemResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: [
            propertyUri({ FieldURI: 'TailoredXpEntities' }),
            propertyUri({ FieldURI: 'TailoredXpCalendarEventIds' }),
            propertyUri({ FieldURI: 'TailoredXpEntitiesStatus' }),
            propertyUri({ FieldURI: 'EntityNamesMap' }),
        ],
    });
}

export default function loadTailoredXpData(itemId: string): Promise<TailoredXpData> {
    return getItem(
        itemId,
        getTailoredXpDataResponseShape(),
        'ItemTailoredXpData',
        'Exchange2013'
    ).then(
        (responseItem): TailoredXpData => {
            if (responseItem && !(responseItem instanceof Error)) {
                const {
                    TailoredXpEntities,
                    TailoredXpCalendarEventIds,
                    TailoredXpEntitiesStatus,
                    EntityNamesMap,
                } = responseItem as Message;
                return <TailoredXpData>{
                    TailoredXpEntities: TailoredXpEntities,
                    TailoredXpCalendarEventIds: TailoredXpCalendarEventIds,
                    TailoredXpEntitiesStatus: TailoredXpEntitiesStatus,
                    EntityNamesMap: EntityNamesMap,
                };
            }
            return <TailoredXpData>{};
        }
    );
}
