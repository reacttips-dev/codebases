import * as LRU from "lru-cache";
const maxAge = Number(process.env.API_CACHE_MAX_AGE) || 1000 * 60;
export default new LRU({ max: 1000, maxAge });
//# sourceMappingURL=menuContentCache.js.map