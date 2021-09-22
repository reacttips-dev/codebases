import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { IAppCategoryQueryBarProps } from "./AppCategoryQueryBarTypes";
import {
    findAppCategory,
    getAppCategoryDisplayDetails,
} from "pages/app-category/AppCategoryQueryBar/AppCategoryQueryBarHelper";
import { QueryBarGroupItem } from "@similarweb/ui-components/dist/query-bar/src/QueryBarItems/QueryBarGroupItem";
import {
    CategoryItemWrapper,
    CategoryLoaderContainer,
    CategorySearchContainer,
    ItemContainer,
    QueryBarContainer,
} from "./AppCategoryQueryBarStyles";
import { QueryBarItem } from "components/compare/QueryBarItem";
import { findParentByClass } from "@similarweb/ui-components/dist/utils";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { i18nFilter } from "filters/ngFilters";
import { AutocompleteAppCategories } from "components/AutocompleteAppategories/AutocompleteAppCategories";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { IAutocompleteAppCategory } from "components/AutocompleteAppategories/AutocompleteAppCategoriesTypes";

export const AppCategoryQueryBar: FC<IAppCategoryQueryBarProps> = (props) => {
    const { selectedCategoryId, selectedStoreId, categories } = props;

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            navigator: Injector.get<SwNavigator>("swNavigator"),
            swSettings: swSettings,
        };
    }, []);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const isLoading = !categories || categories.length === 0;

    /**
     * Makes sure that we close the search upon clicking outside of the search area
     */
    const handleBodyClick = useCallback(
        (e) => {
            if (!findParentByClass(e.target, "QueryBarAutoComplete")) {
                setIsSearchOpen(false);
            }
        },
        [setIsSearchOpen],
    );

    const handleSearchItemClick = useCallback((item: IAutocompleteAppCategory) => {
        const { swSettings, navigator } = services;
        const currPageState = navigator.current();
        const currPageDefaultParams = swSettings.getCurrentComponent().defaultParams;

        setIsSearchOpen(false);
        const { id: category, store, device } = item;
        navigator.go(currPageState, { ...currPageDefaultParams, category, store, device });
    }, []);

    useEffect(() => {
        document.body.addEventListener("click", handleBodyClick, { capture: true });

        return () => {
            document.body.removeEventListener("click", handleBodyClick, { capture: true });
        };
    }, [handleBodyClick]);

    const selectedCategory = findAppCategory(categories, selectedCategoryId, selectedStoreId);
    const categoryDetails = getAppCategoryDisplayDetails(selectedCategory);

    const itemComponent = !isLoading && (
        <ItemContainer>
            <CategoryItemWrapper>
                <QueryBarGroupItem
                    text={categoryDetails.text}
                    secondaryText={categoryDetails.secondaryText}
                    icon={categoryDetails.icon}
                    onItemClick={() => setIsSearchOpen(true)}
                />
            </CategoryItemWrapper>
        </ItemContainer>
    );

    const searchComponent = (
        <CategorySearchContainer>
            <AutocompleteAppCategories
                className={"QueryBarAutoComplete"}
                onClick={handleSearchItemClick}
                autocompleteProps={{
                    placeholder: services.translate(
                        "app.categories.querybar.autocomplete.placeholder",
                    ),
                    isFocused: true,
                    autoFocus: true,
                }}
                defaultSelectedTab={selectedStoreId === "Apple" ? "apple store" : "google store"}
                categoriesData={categories}
            />
        </CategorySearchContainer>
    );

    const loadingComponent = (
        <CategoryLoaderContainer>
            <PixelPlaceholderLoader width={140} height={26} />
        </CategoryLoaderContainer>
    );

    // Logic for enabling search / loader, as used by
    // the QueryBarItem component
    const shouldEnableSearchOrLoad = isSearchOpen || isLoading;

    return (
        <QueryBarContainer>
            <QueryBarItem
                id={selectedCategoryId}
                isLoading={isLoading}
                activeItem={shouldEnableSearchOrLoad ? selectedCategoryId : null}
                renderComponent={itemComponent}
                searchComponent={searchComponent}
                loadingComponent={loadingComponent}
            />
        </QueryBarContainer>
    );
};
