import { requestParams } from "services/fetchService";
import { StateObjectType } from "userdata";

export const RECENTS = [
    {
        id: "df7f930ced4f43dd0a44a0051367eff0",
        data: {
            type: "keyword" as StateObjectType,
            mainItem: "tasty",
        },
        isFavorite: false,
        updatedTime: "2021-04-01T15:19:49",
    },
    {
        id: "8e1b86809d2e733232847bc1d509c540",
        data: {
            type: "keyword" as StateObjectType,
            mainItem: "bitt",
        },
        isFavorite: false,
        updatedTime: "2021-04-01T15:19:40",
    },
    {
        id: "58cb8ce6ea8d6e71d334489970a3ab66",
        data: {
            type: "keyword" as StateObjectType,
            mainItem: "b12",
        },
        isFavorite: false,
        updatedTime: "2021-04-01T11:12:12",
    },
];

export const RECENT = {
    type: "keyword",
    mainItem: "monkey",
    category: null,
    keyword: "monkey",
    duration: "3m",
    country: 999,
    pageId: {
        section: "keywordAnalysis",
        subSection: "overview",
    },
};

export const RecentsTestsFetchService = {
    requestParams,
    post: (url: string, payload: string) => {
        return new Promise((resolve) => {
            const newRecent = {
                id: "58cb8ce6ea8d6e71d334489970a3ab66ds",
                isFavorite: false,
                updatedTime: "2021-04-01T11:12:12",
                data: payload,
            };
            resolve([newRecent, ...RECENTS]);
        });
    },
};
