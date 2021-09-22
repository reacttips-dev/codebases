import { SWReactIcons } from "@similarweb/icons";
import { NoResultsContainer } from "components/AutocompleteKeywords/styles/AutocompleteKeywordStyles";
import { i18nFilter } from "filters/ngFilters";
import { getPartnerTypeLists } from "pages/digital-marketing/monitor-lists/utils";
import React, { FunctionComponent, useRef, useState } from "react";
import { ListItemMarket } from "@similarweb/ui-components/dist/list-item";
import { TabPanel, TabList, Tab, Tabs } from "@similarweb/ui-components/dist/tabs";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import categoryService from "common/services/categoryService";
import {
    ECategoryType,
    ICategory,
    IFlattenedCategory,
} from "common/services/categoryService.types";
import classNames from "classnames";
import {
    AutocompleteStyled,
    ButtonWrapper,
    EmptyStateContainer,
    IconWrapper,
    Text,
} from "./styles";
import { CustomCategoriesWizard } from "components/customCategoriesWizard/CustomCategoriesWizard";
import {
    renderItemCreator,
    renderItemsClick as createRenderItemsClick,
    useAutoCompleteClick,
    ScrollAreaWrap,
} from "components/AutocompleteWebCategories/utils";

const i18n = i18nFilter();
const NoResultTitle = "query.bar.no.result.title";

export const NoCategoriesResults = (props: { title: string }) => {
    return (
        <NoResultsContainer>
            <SWReactIcons iconName={"no-search-results"} size={"sm"} />
            <span>{props.title}</span>
        </NoResultsContainer>
    );
};

interface IAutocompleteWebCategoriesProps {
    children?: React.ReactNode;
    selectedValue?: ICategory;
    onClick: (selectedValue: ICategory) => void;
    autocompleteProps: any;
    className?: string;
    /**
     * Forces focus on the selected result tab. if no value is provided, then the categories tab will be opened by default
     */
    defaultSelectedTab?: "categories" | "custom categories";
    showCustomCategoryEmptyState?: boolean;
    onCreateCustomCategoryClick?: () => void;
    onClearSearch?: () => void;
    showOnlyCategories?: boolean;
    showOnlyCustom?: boolean;
    categoryModalProps?: {
        isCategoryTypeDisabled?: boolean;
        categoryType?: ECategoryType | string;
    };
    isPartnerPage?: boolean;
    onCloseCustomCategoriesModal?: VoidFunction;
    customResolveItemIcon?: (item: ICategory, isChild: boolean) => string;
}

export const AutocompleteWebCategories: FunctionComponent<IAutocompleteWebCategoriesProps> = ({
    selectedValue,
    onClick,
    autocompleteProps = {},
    className,
    defaultSelectedTab = "categories",
    showCustomCategoryEmptyState,
    onCreateCustomCategoryClick,
    onClearSearch,
    showOnlyCategories = false,
    showOnlyCustom = false,
    categoryModalProps,
    isPartnerPage,
    onCloseCustomCategoriesModal,
    customResolveItemIcon,
}) => {
    const autocompleteRef = useRef(null);
    useAutoCompleteClick(autocompleteRef);
    const [showCustomCategoriesWizard, setShowCustomCategoriesWizard] = useState(false);
    const [customCategoryName, setCustomCategoryName] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(() => {
        switch (defaultSelectedTab) {
            case "custom categories":
                return 1;

            case "categories":
            default:
                return 0;
        }
    });

    const allCategories: IFlattenedCategory[] = categoryService.getFlattenedCategoriesList();

    const EmptyStateForCustomCategories = () => {
        return (
            <EmptyStateContainer>
                <IconWrapper>
                    <SWReactIcons iconName={"empty-state-categories"} />
                </IconWrapper>
                <Text>{i18n("digital.marketing.find.by.industry.empty.state.text")}</Text>
                <ButtonWrapper type="outlined" onClick={onCreateCustomCategoryClick}>
                    {i18n("digital.marketing.find.by.industry.empty.state.button")}
                </ButtonWrapper>
            </EmptyStateContainer>
        );
    };

    const onTabSelected = (index: number) => {
        setSelectedIndex(index);
    };

    const renderItemsClick = createRenderItemsClick(autocompleteRef, onClick);

    const getDataRenderItemsTabs = (query: string) => {
        const hasQuery = typeof query === "string" && query !== "";
        if (!hasQuery && selectedValue) {
            onClearSearch();
        }
        const queryResults = hasQuery
            ? allCategories.filter(({ text, id }) => {
                  const lowerCaseQuery = query.trim().toLowerCase();
                  const textAndId = `${text}${id} `.toLowerCase();
                  return (
                      textAndId.includes(lowerCaseQuery) ||
                      textAndId.replace(/_/g, " ").includes(lowerCaseQuery)
                  );
              })
            : allCategories;

        return queryResults.map(renderItemCreator(renderItemsClick));
    };

    const resolveItemText = (
        item: ICategory & { getText?: () => string; getChildrenText?: () => string },
        isChild: boolean,
    ) => {
        const text = item.getText ? item.getText() : item.text;
        return isChild ? text.split(">").slice(-1)[0].trim() : text;
    };

    const resolveItemIcon = (item: ICategory, isChild: boolean) => {
        if (isChild) {
            return null;
        }

        return item.isCustomCategory ? "category" : "market";
    };

    const createListItem = (selectedIndex, enforceIcon = false) => (item) => {
        // if enforceIcon is true, It mean we should treat this item as a parent To ignore the left indentation
        const isChild = !enforceIcon && item.isChild;

        return (
            <ListItemMarket
                key={item.id}
                isActive={false}
                text={resolveItemText(item, isChild)}
                iconName={
                    customResolveItemIcon
                        ? customResolveItemIcon(item, isChild)
                        : resolveItemIcon(item, isChild)
                }
                onClick={renderItemsClick(item)}
                onEditButtonClick={
                    item.isCustomCategory
                        ? () => {
                              setCustomCategoryName(item.text);
                              setShowCustomCategoriesWizard(true);
                          }
                        : null
                }
            />
        );
    };

    const renderWithoutTabs = ({ selectedItemId, listItems, query }) => {
        let list = listItems;

        if (list.length === 0 && query?.length > 0 && !selectedValue) {
            return <NoCategoriesResults title={i18n(NoResultTitle)} />;
        }

        if (isPartnerPage) {
            list = getPartnerTypeLists(listItems);
        }

        if (showOnlyCategories && query?.length >= 0) {
            const categories: ICategory[] = list
                .filter((listItem) => !listItem.domains)
                .map(createListItem(selectedItemId, query?.length > 0));
            return categories.length === 0 ? null : (
                <div className="ListItemsContainer">
                    <ScrollAreaWrap>{categories}</ScrollAreaWrap>
                </div>
            );
        }

        if (showOnlyCustom) {
            const customCategories: ICategory[] = list
                .filter((listItem) => listItem.domains)
                .map(createListItem(selectedItemId, query?.length > 0));
            return customCategories.length === 0 ? (
                <NoCategoriesResults title={i18n(NoResultTitle)} />
            ) : (
                <div className="ListItemsContainer">
                    <ScrollAreaWrap>{customCategories}</ScrollAreaWrap>
                </div>
            );
        }
    };

    const renderItemsTabs = ({ selectedItemId, listItems, query }) => {
        const className = listItems.length > 0 ? "ListItemsContainer" : "";
        const showCustomCategories = categoryService.hasCustomCategoriesPermission();
        const tabList: any = { custom: [], common: [] };
        let tabPanels = null;
        listItems.forEach((listItem) => {
            if (listItem.domains) {
                tabList.custom.push(listItem);
            } else {
                tabList.common.push(listItem);
            }
        });
        tabPanels = (
            <>
                <TabPanel>
                    <ScrollAreaWrap>
                        {tabList.common.map(createListItem(selectedItemId, query?.length > 0))}
                    </ScrollAreaWrap>
                </TabPanel>
                <TabPanel>
                    {showCustomCategories &&
                    tabList.custom.length === 0 &&
                    showCustomCategoryEmptyState ? (
                        <EmptyStateForCustomCategories />
                    ) : (
                        <ScrollAreaWrap>
                            {tabList.custom.map(createListItem(selectedItemId))}
                        </ScrollAreaWrap>
                    )}
                </TabPanel>
            </>
        );
        return (
            <div className={className}>
                {listItems.length > 0 ? (
                    <Tabs selectedIndex={selectedIndex} onSelect={onTabSelected}>
                        <TabList>
                            <Tab>{`${i18n("common.auto.complete.industries")} (${
                                tabList.common.length
                            })`}</Tab>
                            {showCustomCategories && (
                                <Tab>{`${i18n("common.auto.complete.custom.industries")} (${
                                    tabList.custom.length
                                })`}</Tab>
                            )}
                        </TabList>
                        {tabPanels}
                    </Tabs>
                ) : (
                    false
                )}
            </div>
        );
    };

    const renderItems = showOnlyCategories || showOnlyCustom ? renderWithoutTabs : renderItemsTabs;

    return (
        <>
            <AutocompleteStyled
                className={classNames("AutocompleteWithTabs", className)}
                getListItems={getDataRenderItemsTabs}
                renderItems={renderItems}
                preventTruncateUnlessForced={true}
                ref={autocompleteRef}
                loadingComponent={<DotsLoader />}
                floating={true}
                debounce={250}
                placeholder="Start typing here..."
                selectedValue={selectedValue?.text}
                {...autocompleteProps}
            />
            <CustomCategoriesWizard
                isOpen={showCustomCategoriesWizard}
                onClose={() => {
                    setShowCustomCategoriesWizard(false);
                    onCloseCustomCategoriesModal();
                }}
                wizardProps={{
                    isCategoryTypeDisabled: categoryModalProps?.isCategoryTypeDisabled,
                    initialCategoryType: categoryModalProps?.categoryType as ECategoryType,
                    customCategoryName: customCategoryName,
                    onSave: () => {
                        setShowCustomCategoriesWizard(false);
                    },
                }}
            />
        </>
    );
};

AutocompleteWebCategories.defaultProps = {
    showCustomCategoryEmptyState: false,
    onCloseCustomCategoriesModal: () => null,
};
