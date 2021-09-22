import {SectionItemTypes, LinkEventType, ResponsiveImageType} from "models";
import {linkEventParser, responsiveImageParser} from "../componentParsers";
import {isObject, guardType} from "utils/typeGuards";
import {CategoryIconListProps} from "components/CategoryIconList";
import {CategoryIconProps} from "components/CategoryIconList/components/CategoryIcon";

export interface CategoryIconListSchema {
    type: SectionItemTypes.categoryIconList;
    categoryList?: CategoryIconSchema[];
}

export interface CategoryIconSchema {
    type: SectionItemTypes.categoryIcon;
    text?: string;
    alternateText?: string;
    image?: ResponsiveImageType;
    event?: LinkEventType;
}

export const categoryIconListParser = (data: Partial<CategoryIconListSchema>): CategoryIconListProps | null => {
    if (!isObject(data)) {
        return null;
    }

    const categories = data.categoryList && Array.isArray(data.categoryList) ? data.categoryList : [];

    return {
        categoryList: categories.map((category: CategoryIconSchema) => categoryIconParser(category)),
    };
};

const categoryIconParser = (data: Partial<CategoryIconSchema>): CategoryIconProps | null => {
    if (!isObject(data)) {
        return null;
    }

    return {
        text: guardType(data?.text, "string"),
        description: guardType(data?.alternateText, "string"),
        image: responsiveImageParser(data?.image),
        event: linkEventParser(data?.event),
    };
};
