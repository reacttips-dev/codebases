import { makeGetRequest } from 'owa-ows-gateway';

const GET_UNSEEN_ITEMS_URL: string = 'ows/v1.0/lightning/items/unseen';

export function getUnseenItemsFromServer(): Promise<any> {
    return makeGetRequest(GET_UNSEEN_ITEMS_URL);
}
