import { RawParams } from "@uirouter/angularjs";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { isBeta, isNew } from "components/React/SideNavComponents/SideNav.utils";
import { NavBarSimpleItem } from "@similarweb/ui-components/dist/navigation-bar";
import { INavItemBadgeType } from "@similarweb/ui-components/dist/navigation-bar/src/NavBarItems/NavBarSimpleItem/NavItemBadge/NavItemBadge";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { abortAllPendingRequests } from "services/fetchService";

const defaultItemClickHandler = (item: INavItem) => {
    const { state, name: page } = item;
    if (state && page) {
        TrackWithGuidService.trackWithGuid("common.navigation.page.inner.click", "click", {
            page,
        });
    }
};

export const createSideNavHierarchy = (
    itemsConfig: INavItem[],
    selectedItemId: string,
    urlParams: RawParams,
    swNavigator,
    onItemClick = defaultItemClickHandler,
    depth = 0,
): React.ReactNode[] => {
    const translate = i18nFilter();
    if (!itemsConfig || !Array.isArray(itemsConfig) || itemsConfig.length === 0) {
        return null;
    }

    let childItems = null;
    const elements = [];
    for (const item of itemsConfig) {
        if (item.hidden) {
            continue;
        }

        childItems = null;
        if (item.subItems && Array.isArray(item.subItems) && item.subItems.length > 0) {
            childItems = createSideNavHierarchy(
                item.subItems,
                selectedItemId,
                urlParams,
                swNavigator,
                onItemClick,
                depth + 1,
            );
        }

        let componentType = item.menuItemComponentFactory?.(
            depth,
            selectedItemId,
            item.state === selectedItemId,
            isDescendantState(item.subItems, selectedItemId),
        );

        if (!componentType) {
            componentType = item.menuItemComponent ?? NavBarSimpleItem;
        }

        const hasActiveChildren = isDescendantState(item.subItems, selectedItemId);

        let itemSelected;
        if (item.permanentlyClosed) {
            // if the item has the permanently closed behavior
            // we want it to be selected when it's in it's own state
            // or if one of it's children is selected
            itemSelected = item.state === selectedItemId || hasActiveChildren;
        } else {
            // if not, we want it to only be selected if it's in it's own state
            itemSelected = isItemSelected(item, selectedItemId, urlParams);
        }

        // if the item has the hideIfNoSubItems prop set to true
        // and we don't have any children, then continue without pushing the item
        if (item.hideIfNoSubItems && (!childItems || childItems.length === 0)) {
            continue;
        }
        let hasSelectedSibling = false;
        if (item.closeWhenSiblingIsOpen) {
            for (const indexOfItem in itemsConfig) {
                if (isDescendantState(itemsConfig[indexOfItem].subItems, selectedItemId)) {
                    hasSelectedSibling = true;
                    break;
                }
            }
        }
        const isOpened =
            ((itemSelected && item.openWhenSelected) ||
                (item.openByDefault && !hasSelectedSibling) ||
                hasActiveChildren) &&
            !item.permanentlyClosed;
        const innerLink =
            item.state && swNavigator.href(item.state, swNavigator.getItemParams(item));
        elements.push(
            React.createElement(
                componentType,
                {
                    href: innerLink,
                    id: item.id ?? item.state ?? item.title ?? item.name,
                    key: `market-research-nav-bar-${item.id ?? item.state ?? item.name}-${
                        item.title
                    }`,
                    text: translate(item.title),
                    isSelected: itemSelected,
                    hasActiveChild: hasActiveChildren,
                    isLocked: item.lockIcon,
                    badgeType: resolveItemBadge(item, urlParams),
                    onClick: () => onItemClick(item),
                    isOpened: isOpened,
                    isClickable: item.isClickable && item.isClickable,
                    ...item.menuItemComponentProps,
                },
                childItems,
            ),
        );
    }

    return elements;
};

export const isDescendantState = (navItems: INavItem[], currState: string): boolean => {
    if (!currState) {
        return false;
    }
    if (!navItems || !Array.isArray(navItems) || navItems.length === 0) {
        return false;
    }

    for (const item of navItems) {
        if (item.state === currState) {
            return true;
        }

        if ("subItems" in item) {
            if (isDescendantState(item.subItems, currState)) {
                return true;
            }
        }
    }

    return false;
};

const isItemSelected = (item: INavItem, activeItemName: string, urlParams: RawParams): boolean => {
    const currentActiveTab = urlParams?.selectedTab || urlParams?.tab;

    return item.tab
        ? activeItemName === item.state && currentActiveTab === item.tab
        : activeItemName === item.state;
};

const resolveItemBadge = (item: INavItem, urlParams: RawParams): INavItemBadgeType => {
    if (typeof item.isBeta === "function") {
        if (item.isBeta(urlParams)) {
            return "beta";
        }
    } else if (isBeta(item)) {
        return "beta";
    }

    if (isNew(item)) {
        return "new";
    }
    return "none";
};
