import * as LRU from "lru-cache";
import {MediaApiResponse} from "../../../models";

const maxAge = Number(process.env.API_CACHE_MAX_AGE) || 1000 * 60;
export default LRU<string, MediaApiResponse>({max: 1000, maxAge});
