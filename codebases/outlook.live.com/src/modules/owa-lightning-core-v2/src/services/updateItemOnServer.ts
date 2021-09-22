import { makePutRequest } from 'owa-ows-gateway';
import type ActionType from '../store/schema/ActionType';

const UPDATE_ITEM_URL: string = 'ows/v1.0/lightning/items';

export function updateItemOnServer(id: string, actionType: ActionType = 'Primary'): Promise<void> {
    return makePutRequest(`${UPDATE_ITEM_URL}/${id}?actionType=${actionType}`, { id: id });
}
