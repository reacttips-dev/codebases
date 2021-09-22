import {
    ChipDownContainer,
    CollapsibleDropdownItem,
    IDropdownChild,
    EllipsisDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { IWizardCountries, IWizardMarkets } from "pages/conversion/wizard/CustomGroupWizard";
import React from "react";

export interface IWizardMarketsDropdownProps {
    markets: IWizardMarkets;
    selectedMarketId: string;
    defaultMarketId: string;
    availabileMarkets: string[];
    searchPlaceholder: string;
    buttonPlaceholder: string;
    onSelectedItemsChange: (items: object[]) => void;
}

interface IWizardGroupItem {
    text: string;
    id: string;
    countries: IWizardCountries;
    creationType?: string;
    iid?: string;
    gid?: string;
}

/**
 * Marks the supported group types
 * within the funnel analysis custom groups dropdown
 * as of the moment - we're looking to support:
 * SW - SimilarWeb generated groups
 * Custom - User custom groups
 */
type WizardGroupCreationType = "SW" | "Custom";

/**
 * TypeGuard for WizardGroupCreationType type.
 * checks if the given creationType string is supported.
 */
const isSupportedGroupCreationType = (
    creationType?: string,
): creationType is WizardGroupCreationType => {
    return creationType === "SW" || creationType === "Custom";
};

/**
 * Maps the group creation type to its corresponding display name on the website
 */
const resolveGroupTypeName = (creationType: WizardGroupCreationType) => {
    switch (creationType) {
        case "Custom":
            return "MY CUSTOM GROUPS";
        case "SW":
            return "SECTORS";
    }
};

export const WizardGroupsDropdown: React.FunctionComponent<IWizardMarketsDropdownProps> = ({
    markets,
    availabileMarkets,
    defaultMarketId,
    selectedMarketId,
    searchPlaceholder,
    buttonPlaceholder,
    onSelectedItemsChange,
}) => {
    // In case no market was found - behave is if the default market item was selected.
    const selectedMarket = getSelectedMarketById(markets, selectedMarketId);
    const isDefaultSelection = !selectedMarket || selectedMarket.id === defaultMarketId;

    // if the default market item was selected - do not inject any data into the dropdown
    // so that it'll be "clear" of any selection in the UI
    const selectedIds = isDefaultSelection ? {} : { [selectedMarket.id]: true };
    const selectedText = isDefaultSelection ? "" : selectedMarket.text;

    // Group all items by their creation type. as of the moment - this can either be
    // a user created group (custom group) or SimilarWeb created group (SW data)
    const sortedMarkets = sortMarketsByName(markets);
    const groupedMarkets = groupMarketsByCreationType(sortedMarkets);

    // Built nested (categorized) dropdown items for each of the group items
    const dropdownItemsForGroups = buildNestedDropdownItemsForGroups(
        groupedMarkets,
        availabileMarkets,
    );

    // Sort the groups by the order that PM wanted to show the items
    // and filter out groups that don't have any items (otherwise all hell will break loose :( )
    const itemsToRender: IDropdownChild[] = [
        dropdownItemsForGroups.get("Custom"),
        dropdownItemsForGroups.get("SW"),
    ].filter((x) => !!x);

    // Update the state with the newly selected market item
    const handleSelectedItemClick = (item) => {
        const newItem = {
            ...item,
            ...markets[item.id],
        };
        onSelectedItemsChange(newItem);
    };

    // Reset the currently selected market, by simulating a click
    // on the default selection market item
    const handleSelectedItemReset = () => {
        const defaultMarket = getSelectedMarketById(markets, defaultMarketId);
        handleSelectedItemClick(defaultMarket);
    };

    return (
        <ChipDownContainer
            hasSearch={true}
            selectedIds={selectedIds}
            selectedText={selectedText}
            buttonText={buttonPlaceholder}
            searchPlaceHolder={searchPlaceholder}
            onClick={handleSelectedItemClick}
            onCloseItem={handleSelectedItemReset}
            width={320}
            dropdownPopupHeight={389}
        >
            {itemsToRender}
        </ChipDownContainer>
    );
};

const getSelectedMarketById = (items: IWizardMarkets, targetId: string) => {
    const targetItem = items[targetId];
    return targetItem;
};

const sortMarketsByName = (markets: IWizardMarkets): IWizardGroupItem[] => {
    const sortedIdsByItemName = Object.keys(markets).sort((thisId: string, otherId: string) => {
        return markets[thisId].text >= markets[otherId].text ? 1 : -1;
    });

    const sortedItems = sortedIdsByItemName.map((x) => {
        return { ...markets[x] } as IWizardGroupItem;
    });

    return sortedItems;
};

/**
 * Groups the given list of market items by their group creation type and returns
 * a mapping between the group creation type and its market items.
 */
const groupMarketsByCreationType = (
    marketItems: IWizardGroupItem[],
): Map<WizardGroupCreationType, IWizardGroupItem[]> => {
    const groupedByCreationType = marketItems.reduce((map, item) => {
        const groupType = item.creationType;

        // Check if the item's creation type is supported, in case it's not - we skip it
        if (isSupportedGroupCreationType(groupType)) {
            // Create a new key in the mapping in case this is the first item of its kind
            if (!map.has(groupType)) {
                map.set(groupType, []);
            }
            const groupItems = map.get(groupType);
            groupItems.push(item);
        }

        return map;
    }, new Map<WizardGroupCreationType, IWizardGroupItem[]>());

    return groupedByCreationType;
};

/**
 * Builds a list of simple IDropdownChildren using the given list of market items.
 */
const buildEllipsisDropdownItems = (
    marketItems: Array<{ id: string; text: string }>,
    availableMarkets: string[],
): IDropdownChild[] => {
    const dropdownItems = marketItems.map((item) => {
        const { id, text } = item;
        const isAvailable = availableMarkets.includes(id);

        return (
            <EllipsisDropdownItem
                key={`${id}_${text}`}
                id={`${id}`}
                className={isAvailable ? "" : "DropdownItem--unavailable"}
                textIndent={true}
            >
                {text}
            </EllipsisDropdownItem>
        );
    });

    return dropdownItems;
};

/**
 * Builds a nested collapsible dropdown item
 * that contains all items of the given group type as its dropdown children
 * @param groupType The group creation type to use as children for the newly built nested item
 * @param allGroups A mapping between all group creation types and their market items
 */
const buildNestedDropdownItemForGroup = (
    groupType: WizardGroupCreationType,
    groupItems: IWizardGroupItem[],
    availableMarkets: string[],
): IDropdownChild => {
    const groupName = resolveGroupTypeName(groupType);
    const dropdownItems = buildEllipsisDropdownItems(groupItems, availableMarkets);

    const nestedDropdownChild = (
        <CollapsibleDropdownItem
            collapsibleToggleText={groupName.toUpperCase().trim()}
            isCollapsed={true}
            isFullView={true}
            childrenNumWhenLimited={100}
        >
            {dropdownItems}
        </CollapsibleDropdownItem>
    );

    return nestedDropdownChild;
};

/**
 * converts each of the given grouped items to a nested dropdown,
 * where the group items are the nested dropdown items and the group name is the collapsible toggle name.
 */
const buildNestedDropdownItemsForGroups = (
    allGroups: Map<WizardGroupCreationType, IWizardGroupItem[]>,
    availableMarkets: string[],
) => {
    const dropdownItems = Array.from(allGroups).reduce((map, [groupType, groupItems]) => {
        const groupDropdownItem = buildNestedDropdownItemForGroup(
            groupType,
            groupItems,
            availableMarkets,
        );

        map.set(groupType, groupDropdownItem);
        return map;
    }, new Map<WizardGroupCreationType, IDropdownChild>());

    return dropdownItems;
};
