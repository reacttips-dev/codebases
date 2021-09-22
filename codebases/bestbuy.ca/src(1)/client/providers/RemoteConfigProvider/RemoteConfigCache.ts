import * as LRU from "lru-cache";
import { RemoteConfig } from "../../models";

const maxAge = Number(process.env.API_CACHE_MAX_AGE) || 1000 * 60;
export default LRU<string, RemoteConfig>({ max: 1000, maxAge });
