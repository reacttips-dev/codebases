import {
    ECOMMERCE_SEARCHES,
    ADVERTISERS_SEARCHES,
    PUBLISHERS_SEARCHES,
    ALL_SITES_SEARCHES,
} from "../configuration/popular-searches";
import { PopularSearchKey } from "../types/common";
import { PopularSearchesService } from "../types/services";
import { objectKeys } from "pages/workspace/sales/helpers";

const createPopularSearchesService = (): PopularSearchesService => {
    const CONFIG = {
        [PopularSearchKey.any]: {
            order: 0,
            key: PopularSearchKey.any,
            searches: ALL_SITES_SEARCHES,
        },
        [PopularSearchKey.ecommerce]: {
            order: 1,
            key: PopularSearchKey.ecommerce,
            searches: ECOMMERCE_SEARCHES,
        },
        [PopularSearchKey.advertisers]: {
            order: 2,
            key: PopularSearchKey.advertisers,
            searches: ADVERTISERS_SEARCHES,
        },
        [PopularSearchKey.publishers]: {
            order: 3,
            key: PopularSearchKey.publishers,
            searches: PUBLISHERS_SEARCHES,
        },
    };

    return {
        getTabByKey(key: PopularSearchKey) {
            return CONFIG[key];
        },
        getAllTabs() {
            return objectKeys(CONFIG)
                .map((key) => CONFIG[key])
                .sort((a, b) => a.order - b.order);
        },
    };
};

export default createPopularSearchesService;
