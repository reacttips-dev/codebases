import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { findParentByClass } from "@similarweb/ui-components/dist/utils/index";
import { swSettings } from "common/services/swSettings";
import { IIndustryAnalysisQueryBarProps } from "./IndustryAnalysisQueryBarTypes";
import { QueryBarItem } from "components/compare/QueryBarItem";
import { QueryBarGroupItem } from "@similarweb/ui-components/dist/query-bar/src/QueryBarItems/QueryBarGroupItem";
import {
    findSelectedCategory,
    getCategoriesData,
    getCategoryDisplayDetails,
} from "./IndustryAnalysisQueryBarHelper";
import {
    CategoryItemWrapper,
    CategorySearchContainer,
    ItemContainer,
    QueryBarContainer,
} from "pages/industry-analysis/IndustryAnalysisQueryBarStyles";
import { AutocompleteWebCategories } from "components/AutocompleteWebCategories/AutocompleteWebCategories";
import { EditButtonContainer } from "pages/industry-analysis/IndustryAnalysisQueryBarStyles";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { CustomCategoriesWizard } from "components/customCategoriesWizard/CustomCategoriesWizard";
import categoryService from "common/services/categoryService";

const IndustryAnalysisQueryBarComponent: FC<IIndustryAnalysisQueryBarProps> = (props) => {
    const {
        category,
        showOnlyCategories,
        showOnlyCustom,
        onItemClick,
        placeholder,
        showEditButton = true,
        categoryModalProps,
        getCategoryDetails,
        isPartnerPage,
        customResolveItemIcon,
    } = props;

    const [showCustomCategoriesWizard, setShowCustomCategoriesWizard] = useState(false);

    const services = useMemo(() => {
        return {
            $rootScope: Injector.get<any>("$rootScope"),
            navigator: Injector.get<SwNavigator>("swNavigator"),
            categoryService,
            $modal: Injector.get<any>("$modal"),
            swSettings: swSettings,
        };
    }, []);

    const [categoriesData, setCategoriesData] = useState(() =>
        getCategoriesData(category, services.categoryService),
    );
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    /**
     * Makes sure that we close the search upon clicking outside of the search area
     */
    const handleBodyClick = useCallback(
        (e) => {
            if (
                !findParentByClass(e.target, "QueryBarAutoComplete") &&
                !findParentByClass(e.target, "customCategoriesWizardWindow")
            ) {
                setIsSearchOpen(false);
            }
        },
        [setIsSearchOpen],
    );

    /**
     * Runs upon clicking any item in the autocomplete
     */
    const handleSearchItemClick = useCallback(
        (item) => {
            if (onItemClick) {
                setIsSearchOpen(false);
                onItemClick(item);
            } else {
                const { swSettings, navigator } = services;
                const currPageState = navigator.current();
                const currPageDefaultParams =
                    swSettings.current.defaultParams ??
                    swSettings.getCurrentComponent().defaultParams;

                setIsSearchOpen(false);
                navigator.go(currPageState, {
                    ...currPageDefaultParams,
                    category: item.forUrl,
                });
            }
        },
        [setIsSearchOpen, services],
    );

    useEffect(() => {
        document.body.addEventListener("click", handleBodyClick, { capture: true });

        return () => {
            document.body.removeEventListener("click", handleBodyClick, { capture: true });
        };
    }, [handleBodyClick]);

    useEffect(() => {
        const updatedCategoriesData = getCategoriesData(category, services.categoryService);
        setCategoriesData(updatedCategoriesData);
    }, [services, category]);

    if (!categoriesData.selectedCategoryId) {
        return null;
    }

    const selectedCategory = findSelectedCategory(
        categoriesData.selectedCategoryId,
        categoriesData.categories,
        categoriesData.customCategories,
    );

    const categoryDisplay = getCategoryDetails
        ? getCategoryDetails(selectedCategory)
        : getCategoryDisplayDetails(selectedCategory);

    const EditCategoryButton = (
        <PlainTooltip placement={"bottom"} tooltipContent={"Edit Category"}>
            <EditButtonContainer>
                <IconButton
                    type="flat"
                    iconName="edit-group"
                    onClick={() => {
                        setShowCustomCategoriesWizard(true);
                    }}
                />
            </EditButtonContainer>
        </PlainTooltip>
    );

    const itemComponent = (
        <ItemContainer>
            <CategoryItemWrapper>
                <QueryBarGroupItem
                    text={categoryDisplay.text}
                    secondaryText={categoryDisplay.secondaryText}
                    icon={categoryDisplay.icon}
                    onItemClick={() => setIsSearchOpen(true)}
                />
            </CategoryItemWrapper>
            {selectedCategory?.isCustomCategory && showEditButton && EditCategoryButton}
        </ItemContainer>
    );

    const searchComponent = (
        <CategorySearchContainer>
            <AutocompleteWebCategories
                customResolveItemIcon={customResolveItemIcon}
                className={"QueryBarAutoComplete"}
                onClick={handleSearchItemClick}
                showOnlyCategories={showOnlyCategories}
                autocompleteProps={{
                    placeholder: placeholder
                        ? placeholder
                        : "Search for an industry or a custom industry",
                    isFocused: true,
                    autoFocus: true,
                }}
                defaultSelectedTab={
                    selectedCategory?.isCustomCategory ? "custom categories" : "categories"
                }
                showOnlyCustom={showOnlyCustom}
                categoryModalProps={categoryModalProps}
                isPartnerPage={isPartnerPage}
                onCloseCustomCategoriesModal={() => {
                    setIsSearchOpen(false);
                }}
            />
        </CategorySearchContainer>
    );

    return (
        <QueryBarContainer>
            <QueryBarItem
                id={categoriesData.selectedCategoryId}
                isLoading={false}
                activeItem={isSearchOpen ? categoriesData.selectedCategoryId : null}
                renderComponent={itemComponent}
                searchComponent={searchComponent}
            />
            <CustomCategoriesWizard
                isOpen={showCustomCategoriesWizard}
                onClose={() => {
                    setShowCustomCategoriesWizard(false);
                }}
                wizardProps={{
                    customCategoryName: selectedCategory?.text,
                }}
            />
        </QueryBarContainer>
    );
};

const mapDispatchToProps = ({ routing }) => {
    return {
        category: get(routing, "params.category") || routing.params.partnerListId,
    };
};

export const IndustryAnalysisQueryBar = connect(
    mapDispatchToProps,
    null,
)(IndustryAnalysisQueryBarComponent);
