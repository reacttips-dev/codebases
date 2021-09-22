import BaseFilter from "../base/BaseFilter";
import { getUniqueId } from "pages/sales-intelligence/helpers/common";
import {
    conditionMatchesGivenType,
    toCategoryEntry,
    toEntryName,
    toSubCategoryEntry,
    toTechnologyEntry,
} from "../../helpers/filters";
import {
    CategoryListItemType,
    CommonTechnologyFilter,
    SubCategoryListItemType,
    TechnologiesConditionTypeEnum,
    TechnologiesFilterDeps,
    TechnologiesFilterDto,
    TechnologiesFilterValue,
    TechnologyListItemType,
} from "./types";

export default class TechnologyFilter extends BaseFilter<TechnologiesFilterValue>
    implements CommonTechnologyFilter {
    readonly technologies: readonly TechnologyListItemType[];
    readonly categories: readonly CategoryListItemType[];
    readonly subCategories: readonly SubCategoryListItemType[];

    constructor(deps: TechnologiesFilterDeps) {
        super(deps);

        this.categories = deps.categories;
        this.technologies = deps.technologies;
        this.subCategories = deps.subCategories;
    }

    fromDto(dto: TechnologiesFilterDto[]) {
        const value: TechnologiesFilterValue = dto.map((item) => {
            const parentCategoriesEntries = (item.parentCategories ?? []).map(toCategoryEntry);
            const categoriesEntries = (item.categories ?? []).map(toSubCategoryEntry);
            const technologiesEntries = (item.technologies ?? []).map(toTechnologyEntry);

            return {
                id: getUniqueId(),
                inclusion: item.inclusion,
                entries: parentCategoriesEntries
                    .concat(categoriesEntries)
                    .concat(technologiesEntries),
            };
        });

        return this.setValue(value);
    }

    toDto(): { [key: string]: TechnologiesFilterDto[] } {
        return {
            [this.key]: this.getValue().map((condition) => ({
                inclusion: condition.inclusion,
                parentCategories: condition.entries
                    .filter(conditionMatchesGivenType(TechnologiesConditionTypeEnum.Category))
                    .map(toEntryName),
                categories: condition.entries
                    .filter(conditionMatchesGivenType(TechnologiesConditionTypeEnum.SubCategory))
                    .map(toEntryName),
                technologies: condition.entries
                    .filter(conditionMatchesGivenType(TechnologiesConditionTypeEnum.Technology))
                    .map(toEntryName),
            })),
        };
    }

    compareValueWithDto(dto: TechnologiesFilterDto[]) {
        if (dto.length !== this.getValue().length) {
            return false;
        }

        const currentValueDto = this.toDto()[this.key];

        return !dto.some((dtoCondition, index) => {
            const condition = currentValueDto[index];

            // Simplified check. Will not work with different order of technology conditions.
            return !(
                dtoCondition.inclusion === condition.inclusion &&
                JSON.stringify(dtoCondition.technologies) ===
                    JSON.stringify(condition.technologies) &&
                JSON.stringify(dtoCondition.categories) === JSON.stringify(condition.categories) &&
                JSON.stringify(dtoCondition.parentCategories) ===
                    JSON.stringify(condition.parentCategories)
            );
        });
    }

    protected getSummaryValue() {
        const summaryStrings = this.getValue().map((c) => {
            const entries = c.entries.map(toEntryName);

            return `${this.translate(
                `si.components.inclusion_dd.${c.inclusion}.text`,
            )}: ${entries.join(` ${this.translate("si.common.or").toUpperCase()} `)}`;
        });

        return summaryStrings.join(` ${this.translate("si.common.and").toUpperCase()} `);
    }
}
