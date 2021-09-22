import * as LRU from "lru-cache";
import { Category } from "../../models";

const maxAge = Number(process.env.API_CACHE_MAX_AGE) || 1000 * 60;
export default LRU<string, Category>({ max: 1000, maxAge });
