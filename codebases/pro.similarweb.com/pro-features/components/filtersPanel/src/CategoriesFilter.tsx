import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { ListItemIndustry } from "@similarweb/ui-components/dist/list-item";
import { TabPanel, TabList, Tab, Tabs } from "@similarweb/ui-components/dist/tabs";
import styled from "styled-components";
import { Textfield } from "@similarweb/ui-components/dist/textfield";
import { colorsPalettes } from "@similarweb/styles";

const CategoriesFilterContainer = styled.div``;

const SearchInput = styled(Textfield)`
    padding: 7px 0px;
    margin: 0px 4px;
    border-bottom: 1px solid ${colorsPalettes.blue[400]};
`;

const TabPanelsContainer = styled.div`
    max-height: 300px;
    overflow-y: auto;
`;

const ListItemIndustryContainer = styled.div`
    cursor: pointer;
`;

const createListItem = (onClickCallback, query) => (item) => {
    const { getText, text, parentItem, icon, id, count, sons } = item;
    const enforceIcon = false;
    const isChild = !enforceIcon && item.isChild;
    const displayText = isChild ? text : getText ? getText() : text;
    return (
        <ListItemIndustryContainer>
            <ListItemIndustry
                iconClassName={enforceIcon && item.isChild ? parentItem.icon : icon}
                key={id}
                onClick={onClickCallback(item)}
                text={displayText + (count && ` (${count})`)}
                isChildren={isChild}
                isParent={!item.isChild}
            />
        </ListItemIndustryContainer>
    );
};

const defaultFilter = (query) => (item) => item.text.toLowerCase().includes(query.toLocaleString());

interface ICategoryItem {
    text: string;
    icon?: string;
    id?: string;
    sons?: ICategoryItem[];
}

interface ICategoriesFilterProps {
    tabList: { common: ICategoryItem[]; custom: ICategoryItem[] };
    onItemClickCallback: (ICategoryItem) => void;

    rightTabTitle?: string;
    leftTabTitle?: string;
    searchIcon?: string;
    searchPlaceholder?: string;
    categoriesFilterClassName?: string;
    categoriesFilterTabsPanelClassName?: string;
}

export const CategoriesFilter: React.FunctionComponent<ICategoriesFilterProps> = (props) => {
    const {
        searchIcon,
        searchPlaceholder,
        categoriesFilterClassName,
        categoriesFilterTabsPanelClassName,
        tabList,
        leftTabTitle,
        rightTabTitle,
        onItemClickCallback,
    } = props;
    const [selectedTabIndex, setSelectedTabIndex] = React.useState(Number());
    const [searchInputValue, setSearchInputValue] = React.useState(String());
    const onTabSelected = (index) => setSelectedTabIndex(index);
    const onClickCallback = (item) => () => onItemClickCallback(item);
    const { common, custom } = tabList;
    const commonCategories = common.filter(defaultFilter(searchInputValue));
    const customCategories = custom.filter(defaultFilter(searchInputValue));
    return (
        <CategoriesFilterContainer className={categoriesFilterClassName}>
            <SearchInput
                inputFocusParameters={{ preventScroll: true }}
                isFocused={true}
                hideBorder={true}
                iconName={searchIcon}
                placeholder={searchPlaceholder}
                onChange={setSearchInputValue}
            />
            <Tabs selectedIndex={selectedTabIndex} onSelect={onTabSelected}>
                <TabList>
                    <Tab>{leftTabTitle + ` (${commonCategories.length})`}</Tab>
                    <Tab>{rightTabTitle + ` (${customCategories.length})`}</Tab>
                </TabList>
                <TabPanelsContainer className={categoriesFilterTabsPanelClassName}>
                    <TabPanel>
                        {commonCategories.map(createListItem(onClickCallback, searchInputValue))}
                    </TabPanel>
                    <TabPanel>
                        {customCategories.map(createListItem(onClickCallback, searchInputValue))}
                    </TabPanel>
                </TabPanelsContainer>
            </Tabs>
        </CategoriesFilterContainer>
    );
};

const i18n = i18nFilter();

CategoriesFilter.defaultProps = {
    searchIcon: "search",
    categoriesFilterClassName: "categories-filter-container",
    categoriesFilterTabsPanelClassName: "categories-filter-tab-panels-container",
    searchPlaceholder: i18n("dropdown.category.search.placeholder"),
    leftTabTitle: i18n("common.auto.complete.industries"),
    rightTabTitle: i18n("common.auto.complete.custom.industries"),
};
