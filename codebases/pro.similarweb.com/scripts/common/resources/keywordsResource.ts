import { DefaultFetchService } from "services/fetchService";

const fetchService = DefaultFetchService.getInstance();

export interface IPlayStoreCategory {
    id: string;
    text: string;
    children: Array<this>;
}

export interface IKeywordsResource {
    getCategories: () => Promise<Array<IPlayStoreCategory>>;
}

export const getCategories = async (): Promise<Array<IPlayStoreCategory>> => {
    const response: any = await fetchService.get("/api/GooglePlayKeywords/Categories");
    return response.Categories;
};

export const KeywordsResource: IKeywordsResource = {
    getCategories,
};
