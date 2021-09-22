import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

export const transformData = (rawData) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const params = swNavigator.getParams();
    return {
        ...rawData,
        records: rawData.Data.map((record) => {
            const { Domain: domain } = record;
            const url = swNavigator.href("websites-worldwideOverview", {
                key: domain,
                isWWW: "*",
                ...params,
            });
            return {
                ...record,
                url,
            };
        }),
    };
};
