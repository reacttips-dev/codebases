import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

export const transformData = (rawData) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const params = swNavigator.getParams();
    return {
        ...rawData,
        records: rawData.Data.map((record) => {
            const { SearchTerm: searchTerm, Favicon: favicon } = record;
            const url = swNavigator.href("marketresearch_keywordmarketanalysis_total", {
                keyword: searchTerm,
                ...params,
            });
            return {
                ...record,
                url,
                favicon,
            };
        }),
    };
};
