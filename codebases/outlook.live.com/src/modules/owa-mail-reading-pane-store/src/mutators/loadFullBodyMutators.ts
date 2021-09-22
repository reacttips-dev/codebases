import type ItemViewState from '../store/schema/ItemViewState';
import type Item from 'owa-service/lib/contract/Item';
import { mutatorAction } from 'satcheljs';

export const updateIsLoadingFullBody = mutatorAction(
    'updateIsLoadingFullBody',
    function (viewState: ItemViewState, isLoading: boolean) {
        viewState.isLoadingFullBody = isLoading;
    }
);

export const updateCachedItemBodies = mutatorAction(
    'updateCachedItemBodies',
    function (cachedItem: Item, responseItem: Item) {
        if (responseItem.UniqueBody) {
            cachedItem.UniqueBody = responseItem.UniqueBody;
        }
        if (responseItem.NormalizedBody) {
            cachedItem.NormalizedBody = responseItem.NormalizedBody;
        }
    }
);
