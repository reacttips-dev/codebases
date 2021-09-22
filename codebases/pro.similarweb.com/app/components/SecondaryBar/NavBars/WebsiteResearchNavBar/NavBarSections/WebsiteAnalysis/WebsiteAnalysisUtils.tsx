import { NavBarSimpleItem } from "@similarweb/ui-components/dist/navigation-bar";
import { INavItemBadgeType } from "@similarweb/ui-components/dist/navigation-bar/src/NavBarItems/NavBarSimpleItem/NavItemBadge/NavItemBadge";
import { RawParams } from "@uirouter/angularjs";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { isBeta, isLocked, isNew } from "components/React/SideNavComponents/SideNav.utils";
import { SecondaryBarGroupItem } from "components/SecondaryBar/Components/SecondaryBarGroupItem";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export const onItemClickDefaultFunction = (navigator) => (item: INavItem) => {
    const fromState = navigator.current().name;
    const itemParams = navigator.getItemParams(item);
    const { state: toState, name: toPage } = item;
    if (fromState === toState) {
        navigator.applyUpdateParams(itemParams);
    } else {
        navigator.go(`${toState}`, itemParams, { relative: null });
    }

    if (toState && toPage) {
        TrackWithGuidService.trackWithGuid("common.navigation.page.inner.click", "click", {
            toPage,
        });
    }
};

interface IWASectionItemsParams {
    itemsConfig: INavItem[];
    selectedItemId: string;
    urlParams: RawParams;
    onItemClick: (item: INavItem) => void;
}

export const buildWASectionItems = (sectionParams: IWASectionItemsParams): JSX.Element[] => {
    const { itemsConfig, selectedItemId, urlParams, onItemClick } = sectionParams;

    const sectionItems =
        itemsConfig?.map((item) => buildNavItem(item, selectedItemId, urlParams, onItemClick)) ??
        [];

    return sectionItems;
};

const isItemSelected = (item: INavItem, activeItemName: string, urlParams: RawParams) => {
    const hasTab = item.tab && urlParams;
    return hasTab
        ? activeItemName === item.state &&
              (urlParams.selectedTab === item.tab || urlParams.tab === item.tab)
        : activeItemName === item.state;
};

const resolveItemBadge = (item: INavItem): INavItemBadgeType => {
    if (isBeta(item)) {
        return "beta";
    }
    if (isNew(item)) {
        return "new";
    }
    return "none";
};

const buildNavItem = (
    item: INavItem,
    activeItemName: string,
    urlParams: RawParams,
    onItemClick: (item: INavItem) => void,
): React.ReactElement => {
    const hasChildren = item.subItems && item.subItems.length > 0;
    return hasChildren
        ? buildGroupNavItem(item, activeItemName, urlParams, onItemClick)
        : buildSimpleNavItem(item, activeItemName, urlParams, onItemClick);
};

const buildGroupNavItem = (
    item: INavItem,
    activeItemName: string,
    urlParams: RawParams,
    onItemClick: (item: INavItem) => void,
): React.ReactElement => {
    const hasActiveChild = item.subItems.some((subItem) =>
        isItemSelected(subItem, activeItemName, urlParams),
    );

    const itemChildren = item.subItems
        .filter((item) => !item.hidden)
        .map((child) => buildSimpleNavItem(child, activeItemName, urlParams, onItemClick));

    return (
        <SecondaryBarGroupItem
            id={item.id ?? item.name}
            text={i18nFilter()(item.title)}
            isInitiallyOpened={false}
            hasActiveChild={hasActiveChild}
            onClick={() => void 0}
        >
            {itemChildren}
        </SecondaryBarGroupItem>
    );
};

const buildSimpleNavItem = (
    item: INavItem,
    activeItemName: string,
    urlParams: RawParams,
    onClick: (item: INavItem) => void,
): React.ReactElement => {
    return (
        <NavBarSimpleItem
            id={item.id ?? item.name}
            text={i18nFilter()(item.title)}
            isSelected={isItemSelected(item, activeItemName, urlParams)}
            isLocked={isLocked(item)}
            badgeType={resolveItemBadge(item)}
            onClick={() => onClick(item)}
        />
    );
};
