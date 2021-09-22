import { get } from '@pipedrive/fetch';

const SEARCH_URL = '/v1/itemSearch/web';
const RECENT_ITEMS_URL = '/recent-items/v1/recent-items';

export const searchQuery = (queryParams) => get(SEARCH_URL, { queryParams });

export const recentItemsQuery = () => get(RECENT_ITEMS_URL);
