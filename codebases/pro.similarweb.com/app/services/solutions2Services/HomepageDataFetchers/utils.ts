import * as _ from "lodash";

export interface ISerializable {
    data: { mainItem: string; comparedItems: string[] };
}

export const serializeItems = (value): string => {
    if (value.data?.comparedItems?.length > 0) {
        const normalizedMainItem = value.data?.mainItem?.toLowerCase();
        const normalizedComparedItems = value.data?.comparedItems
            ?.map((item) => item.toLowerCase())
            .sort();
        const serializedItems = _.join([
            normalizedMainItem,
            ...(normalizedComparedItems ? normalizedComparedItems : []),
        ]);
        return serializedItems;
    } else {
        return value.data?.mainItem?.toLowerCase();
    }
};

export const dedupRecent = (recentWebsite: ISerializable[]): any => {
    return _.uniqBy<ISerializable>(recentWebsite, serializeItems);
};
