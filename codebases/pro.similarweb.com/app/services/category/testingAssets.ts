import { ICustomCategories } from "services/category/userCustomCategoryService";

export const emptyUserData = {
    customIndustries: [],
};

export const userData: { customIndustries: ICustomCategories } = {
    customIndustries: [
        {
            id: "0123abcd",
            name: "industryName",
            domains: ["domain 1", "domain 2"],
            addedTime: new Date(),
            lastUpdated: new Date(),
            userId: 0,
            categoryHash: "1234567890",
        },
    ],
};

export const windowMock = { similarweb: { config: { userData: {} } } };
