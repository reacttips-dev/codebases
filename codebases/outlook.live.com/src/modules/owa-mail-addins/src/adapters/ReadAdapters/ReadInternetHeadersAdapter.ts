import type Item from 'owa-service/lib/contract/Item';
import { tryGetAllHeaders } from '../../utils/InternetHeaderUtils';

export const getAllInternetHeaders = (item: Item) => (): Promise<String> => {
    return tryGetAllHeaders(item.ItemId.Id);
};
