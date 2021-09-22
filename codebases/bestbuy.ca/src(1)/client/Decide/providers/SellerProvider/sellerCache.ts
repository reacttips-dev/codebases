import * as LRU from "lru-cache";

import {Seller, SellerReviews, Rating} from "models";

const maxAge = Number(process.env.API_CACHE_MAX_AGE) || 1000 * 60;
export default LRU<string, Seller | SellerReviews | Rating>({max: 1000, maxAge});
