import React from "react";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { subCategoryFilter } from "filters/ngFilters";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { KEYS } from "../constants";
import { convertCategory } from "../utils";
import { CategoryItemContainer } from "../styles";
import { mapOnObjectKeys } from "pages/workspace/sales/utils/object";
import { allTrackers } from "services/track/track";

const subCategory = subCategoryFilter();

export type HierarchyCategoryFilterProps = {
    data: {
        technographics: { category: string; subCategory: string }[];
        subdomains: { domain: string; share: number; visits: number }[];
    };
    onSelect: (item: { id: string; isChild?: boolean }) => void;
    appendTo: string;
    width?: number;
    onClear: (trackPlace?: string, eventName?: string) => void;
    selectedCategory: string;
    trackingPlace?: string;
    topic?: string;
};

export const HierarchyCategoryFilter = ({
    data,
    onSelect,
    appendTo,
    width = 340,
    onClear,
    trackingPlace = "sidebar about",
    selectedCategory,
    topic = "",
}: HierarchyCategoryFilterProps): JSX.Element => {
    const translate = useTranslation();

    if (Object.keys(data).length === 0) {
        return null;
    }

    const trackOpening = (isOpen: boolean) => {
        isOpen && allTrackers.trackEvent(trackingPlace, "open", `open tech category/${topic}`);
    };

    const getCategoriesOptions = () => {
        const structure = data?.technographics.reduce((acc, { category, subCategory }) => {
            if (acc[category]) {
                acc[category].items[subCategory]
                    ? (acc[category].items[subCategory] += 1)
                    : (acc[category] = {
                          ...acc[category],
                          items: {
                              ...acc[category].items,
                              [subCategory]: 1,
                          },
                      });
                acc[category].num += 1;
                return acc;
            }
            acc[category] = {
                ...acc[category],
                items: { [subCategory]: 1 },
            };
            acc[category] = { ...acc[category], num: 1 };
            return acc;
        }, {});

        const structuredCategories = Object.keys(structure).reduce((acc, parentCategory) => {
            const currentCategory = structure[parentCategory];
            acc.push(convertCategory(parentCategory, false, currentCategory?.num, ""));
            acc.push(
                ...mapOnObjectKeys(currentCategory?.items, (item) => {
                    return convertCategory(
                        item,
                        true,
                        currentCategory?.items[item],
                        currentCategory,
                    );
                }),
            );
            return acc;
        }, []);

        return [
            <CategoryItemContainer
                id="allCategories"
                isChild={false}
                isCustomCategory={false}
                text={`${translate(
                    "workspace.sales.about.technologies.techFilter.AllTechCategories",
                )} (${Object.keys(data.technographics).length})`}
                icon=""
                key="customAllCategories"
            />,
            ...structuredCategories.map((item, index) => {
                return <CategoryItemContainer {...item} key={index} />;
            }),
        ];
    };

    const handleClick = (item: { id: string }): void => {
        if (item.id === "allCategories") {
            onClear("All tech categories", "clear tech category");
            return;
        }
        onSelect(item);
        return;
    };

    const selectedText = selectedCategory ? subCategory(selectedCategory) : "";
    return (
        <ChipDownContainer
            onToggle={trackOpening}
            appendTo={appendTo}
            width={width}
            onClick={handleClick}
            selectedText={selectedText}
            onCloseItem={() => onClear()}
            buttonText={translate(
                "workspace.sales.about.technologies.techFilter.AllTechCategories",
            )}
            searchPlaceHolder={translate("si.common.search")}
            tooltipDisabled
            hasSearch
        >
            {getCategoriesOptions()}
        </ChipDownContainer>
    );
};
