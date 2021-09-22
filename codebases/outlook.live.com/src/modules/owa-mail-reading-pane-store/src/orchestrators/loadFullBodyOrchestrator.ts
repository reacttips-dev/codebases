import { loadFullBody } from '../actions/loadFullBody';
import { updateCachedItemBodies, updateIsLoadingFullBody } from '../mutators/loadFullBodyMutators';
import getItem from 'owa-mail-store/lib/services/getItem';
import mailStore from 'owa-mail-store/lib/store/Store';
import { getBaseItemResponseShape } from 'owa-mail-store/lib/utils/getBaseItemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import { orchestrator } from 'satcheljs';

export default orchestrator(loadFullBody, async actionMessage => {
    const { viewState } = actionMessage;
    const itemId = viewState.itemId;
    updateIsLoadingFullBody(viewState, true);

    const item = mailStore.items.get(itemId);

    const itemShape = getBaseItemResponseShape();

    // Plan to fetch UniqueBody for an itemPart.
    let shapeName = 'ItemPart';

    if (!item.UniqueBody) {
        // If we don't have a UniqueBody, change the shapeName to get the NormalizedBody instead.
        shapeName = 'ItemNormalizedBody';
    } else if (item.NormalizedBody) {
        // If we have both, request NormalizedBody as an additionalProperty.
        itemShape.AdditionalProperties.push(propertyUri({ FieldURI: 'NormalizedBody' }));
    }

    itemShape.MaximumBodySize = 0;

    const responseItem = await getItem(itemId, itemShape, shapeName);
    if (responseItem && !(responseItem instanceof Error)) {
        updateCachedItemBodies(item, responseItem);

        updateIsLoadingFullBody(viewState, false);
    }
});
