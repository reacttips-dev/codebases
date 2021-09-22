import { SWReactIcons } from "@similarweb/icons";
import { ListItemKeyword } from "@similarweb/ui-components/dist/list-item";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { findParentByClass } from "@similarweb/ui-components/dist/utils/index";
import classNames from "classnames";
import {
    AutocompleteStyled,
    ScrollAreaWrap,
    TabStyled,
} from "components/AutocompleteAppategories/AutocompleteAppCategoriesStyles";
import {
    IAppCategory,
    IAutocompleteAppCategoriesProps,
} from "components/AutocompleteAppategories/AutocompleteAppCategoriesTypes";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { fetchAppCategoriesData } from "components/AutocompleteAppategories/AutocompleteAppCategoriesHelper";
import { AppCategoryStore } from "components/AutocompleteAppategories/AutocompleteAppCategoriesTypes";

export const AutocompleteAppCategories: FunctionComponent<IAutocompleteAppCategoriesProps> = ({
    selectedValue,
    onClick,
    autocompleteProps = {},
    className,
    defaultSelectedTab = "google store",
    categoriesData,
}) => {
    const autocompleteRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(() => {
        switch (defaultSelectedTab) {
            case "apple store":
                return 1;

            case "google store":
            default:
                return 0;
        }
    });
    const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(false);
    const [allCategories, setAllCategories] = useState(categoriesData || []);
    const storeIcons = { Apple: "i-tunes", Google: "google-play" };

    const handleBodyClick = (e) => {
        if (!findParentByClass(e.target, "AutocompleteWithTabs")) {
            autocompleteRef.current.truncateResults(true);
        }
    };

    useEffect(() => {
        async function fetchResources() {
            setIsAutocompleteLoading(true);
            const categories = await fetchAppCategoriesData();
            setIsAutocompleteLoading(false);
            setAllCategories(categories);
        }

        // In case no categories data was provided externally (via the props)
        // then the autocomplete should fetch categories on its own.
        if (!categoriesData || categoriesData.length === 0) {
            fetchResources();
        }

        document.body.addEventListener("click", handleBodyClick, { capture: true });
        return () => {
            document.body.removeEventListener("click", handleBodyClick, { capture: true });
        };
    }, []);

    const onTabSelected = (index: number) => {
        setSelectedIndex(index);
    };
    const renderItemsClick = (item: IAppCategory) => () => {
        autocompleteRef.current.truncateResults(true);
        autocompleteRef.current.textFieldRef.clearValue();
        onClick(item);
    };
    const renderItemCreator = (item) => {
        return { ...item, props: { onClick: renderItemsClick(item) } };
    };
    const getDataRenderItemsTabs = (query: string) => {
        if (typeof query === "string" && query !== "") {
            return allCategories
                .filter((item) => item.id.toLowerCase().includes(query))
                .map(renderItemCreator);
        } else {
            return allCategories.map(renderItemCreator);
        }
    };
    const createListItem = (selectedIndex, store) => (item, index) => {
        return (
            <ListItemKeyword
                isActive={false}
                iconName={storeIcons[item.store]}
                key={`${item.id}_${store}_${index}`}
                onClick={renderItemsClick(item)}
                text={item.getText ? item.getText() : item.id}
            />
        );
    };

    const renderItemsTabs = ({ selectedItemId, listItems }) => {
        const className = listItems.length > 0 ? "ListItemsContainer" : "";
        const tabList: any = { apple: [], google: [] };
        let tabPanels = null;
        listItems.forEach((listItem: { store: AppCategoryStore }) => {
            if (listItem.store === "Google") {
                tabList.google.push(listItem);
            } else {
                tabList.apple.push(listItem);
            }
        });
        if (listItems.length > 0) {
            tabPanels = (
                <>
                    <TabPanel>
                        <ScrollAreaWrap>
                            {tabList.google.map(createListItem(selectedItemId, "google"))}
                        </ScrollAreaWrap>
                    </TabPanel>
                    <TabPanel>
                        <ScrollAreaWrap>
                            {tabList.apple.map(createListItem(selectedItemId, "apple"))}
                        </ScrollAreaWrap>
                    </TabPanel>
                </>
            );
        }
        return (
            <div className={className}>
                {listItems.length > 0 ? (
                    <Tabs selectedIndex={selectedIndex} onSelect={onTabSelected}>
                        <TabList>
                            <TabStyled>
                                <SWReactIcons iconName={storeIcons.Google} size={"xs"} /> Google (
                                {tabList.google.length})
                            </TabStyled>
                            <TabStyled>
                                <SWReactIcons iconName={storeIcons.Apple} size={"xs"} />
                                Apple ({tabList.apple.length})
                            </TabStyled>
                        </TabList>
                        {tabPanels}
                    </Tabs>
                ) : (
                    false
                )}
            </div>
        );
    };

    return (
        <AutocompleteStyled
            className={classNames("AutocompleteWithTabs", className)}
            getListItems={getDataRenderItemsTabs}
            renderItems={renderItemsTabs}
            preventTruncateUnlessForced={true}
            ref={autocompleteRef}
            loadingComponent={<DotsLoader />}
            floating={true}
            debounce={250}
            isLoading={isAutocompleteLoading}
            placeholder={autocompleteProps.placeholder || "Start typing here..."}
            selectedValue={selectedValue?.text}
            {...autocompleteProps}
        />
    );
};
