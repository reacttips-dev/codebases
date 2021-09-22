import * as LRU from "lru-cache";
import {CarrierMetaDataApiResponse} from "../../../models";

const maxAge = Number(process.env.API_CACHE_MAX_AGE) || 1000 * 60;
export default LRU<string, CarrierMetaDataApiResponse>({max: 1000, maxAge});
