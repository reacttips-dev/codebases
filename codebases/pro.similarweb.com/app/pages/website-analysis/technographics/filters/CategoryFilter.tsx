import React, { useMemo } from "react";
import _ from "lodash";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { CategorySelectionContainer } from "../styles";
import { FILTER_WIDTH, CATEGORY, KEYS } from "../constants";
import { CategoryFilterProps } from "../types";

export function CategoryFilter({
    onSelect,
    category,
    rawData,
    onClear,
    appendTo,
}: CategoryFilterProps) {
    const translate = useTranslation();

    const categories = useMemo(() => {
        return _.fromPairs(
            Object.entries(_.countBy(rawData, CATEGORY)).sort(([key1], [key2]) =>
                key1.toLowerCase() < key2.toLowerCase()
                    ? -1
                    : key1.toLowerCase() === key2.toLocaleLowerCase()
                    ? 0
                    : 1,
            ),
        );
    }, [rawData]);

    return (
        <CategorySelectionContainer>
            <ChipDownContainer
                appendTo={appendTo}
                onClick={onSelect}
                selectedIds={category ? { [category]: true } : {}}
                selectedText={category ?? ""}
                buttonText={translate(KEYS.categoryFilterBtnText)}
                searchPlaceHolder={translate(KEYS.categoryFilterBtnPlaceholder)}
                onCloseItem={onClear}
                hasSearch
                width={FILTER_WIDTH}
                tooltipDisabled
            >
                {Object.entries(categories).map(([name, count]) => (
                    <EllipsisDropdownItem key={name} id={name} text={name}>
                        {`${name} (${count})`}
                    </EllipsisDropdownItem>
                ))}
            </ChipDownContainer>
        </CategorySelectionContainer>
    );
}
