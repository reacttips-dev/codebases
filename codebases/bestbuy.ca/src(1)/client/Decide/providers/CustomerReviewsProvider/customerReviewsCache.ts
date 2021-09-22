import * as LRU from "lru-cache";
import {CustomerReviews} from "../../../models";

const maxAge = Number(process.env.API_CACHE_MAX_AGE) || 1000 * 60;
export default LRU<string, CustomerReviews>({max: 1000, maxAge});
