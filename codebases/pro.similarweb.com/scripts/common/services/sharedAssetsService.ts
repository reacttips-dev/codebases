import { IKeywordGroup } from "userdata";
import { ICustomCategories } from "services/category/userCustomCategoryService";

type ISharedAssets = {
    customIndustries?: ICustomCategories;
    keywordGroups?: IKeywordGroup[];
};

let sharedAssets: ISharedAssets = {};
let currentSetAssetsFetch = null;
let sharedAssetsFetched: boolean = false;

export const fetchSharedAssets = () => {
    if (currentSetAssetsFetch) return currentSetAssetsFetch;

    currentSetAssetsFetch = fetch("/api/userdata/reachable", { credentials: "include" }).then(
        (data) =>
            data.json().then((data) => {
                sharedAssets = data;
                currentSetAssetsFetch = null;
                sharedAssetsFetched = true;
            }),
    );

    return currentSetAssetsFetch;
};

export const getSharedCustomCategories = (forceFetch?: boolean) => {
    return new Promise(async (resolve) => {
        if (forceFetch || !sharedAssetsFetched) {
            await fetchSharedAssets();
        }
        resolve(sharedAssets.customIndustries);
    });
};

export const getSharedKeywordsGroups = async (forceFetch?: boolean) => {
    return new Promise(async (resolve) => {
        if (forceFetch || !sharedAssetsFetched) {
            await fetchSharedAssets();
        }
        resolve(sharedAssets.keywordGroups);
    });
};
