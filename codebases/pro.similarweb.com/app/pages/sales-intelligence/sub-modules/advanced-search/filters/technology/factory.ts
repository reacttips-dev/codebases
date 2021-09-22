import { TranslateFunction } from "app/@types/I18nInterfaces";
import { FiltersConfigResponseDto } from "../../types/common";
import { SupportedFilterKey } from "../../types/filters";
import { compareNamesAsc } from "../../helpers/filters";
import TechnologyFilter from "./TechnologyFilter";
import {
    CommonTechnologyFilter,
    CategoryListItemType,
    SubCategoryListItemType,
    TechnologiesConditionTypeEnum,
    TechnologiesFilterValue,
    TechnologyListItemType,
} from "./types";

export default function createTechnologyFilter(
    translate: TranslateFunction,
    key: SupportedFilterKey,
    technologyData: FiltersConfigResponseDto["technologies"],
): CommonTechnologyFilter {
    const { categories, subCategories, technologies } = technologyData.reduce<{
        categories: CategoryListItemType[];
        subCategories: SubCategoryListItemType[];
        technologies: TechnologyListItemType[];
    }>(
        (acc, c) => {
            const { subCategories, technologies } = c.categories.reduce<{
                subCategories: SubCategoryListItemType[];
                technologies: TechnologyListItemType[];
            }>(
                (acc, subC) => {
                    const technologies = subC.technologies.map((t) => ({
                        ...t,
                        secondaryName: subC.name,
                        type: TechnologiesConditionTypeEnum.Technology,
                    }));

                    return {
                        subCategories: acc.subCategories.concat({
                            name: subC.name,
                            secondaryName: c.name,
                            technologiesCount: technologies.length,
                            type: TechnologiesConditionTypeEnum.SubCategory,
                        }),
                        technologies: acc.technologies.concat(technologies),
                    };
                },
                {
                    subCategories: [],
                    technologies: [],
                },
            );
            const category = {
                name: c.name,
                technologiesCount: technologies.length,
                type: TechnologiesConditionTypeEnum.Category,
            };

            return {
                categories: acc.categories.concat(category),
                subCategories: acc.subCategories.concat(subCategories),
                technologies: acc.technologies.concat(technologies),
            };
        },
        {
            categories: [],
            subCategories: [],
            technologies: [],
        },
    );
    const initialValue: TechnologiesFilterValue = [];

    return new TechnologyFilter({
        key,
        translate,
        categories,
        initialValue,
        technologies: technologies.sort(compareNamesAsc),
        subCategories: subCategories.sort(compareNamesAsc),
    });
}
