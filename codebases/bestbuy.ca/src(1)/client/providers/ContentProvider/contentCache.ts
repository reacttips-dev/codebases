import * as LRU from "lru-cache";

const maxAge = Number(process.env.API_CACHE_MAX_AGE) || 1000 * 60;
export default LRU<string, any>({ max: 1000, maxAge });
