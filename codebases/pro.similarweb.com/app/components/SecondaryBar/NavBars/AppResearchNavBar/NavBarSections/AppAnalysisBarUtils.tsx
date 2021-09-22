import { NavBarSimpleItem } from "@similarweb/ui-components/dist/navigation-bar";
import { INavItemBadgeType } from "@similarweb/ui-components/dist/navigation-bar/src/NavBarItems/NavBarSimpleItem/NavItemBadge/NavItemBadge";
import { RawParams } from "@uirouter/angularjs";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { isBeta, isLocked, isNew } from "components/React/SideNavComponents/SideNav.utils";
import { SecondaryBarGroupItem } from "components/SecondaryBar/Components/SecondaryBarGroupItem";
import { i18nFilter } from "filters/ngFilters";
import React from "react";

interface IAppAnalysisSectionItemsParams {
    itemsConfig: INavItem[];
    selectedItemId: string;
    urlParams: RawParams;
    onItemClick: (item: INavItem) => void;
}

export const buildAppAnalysisSectionItems = (
    sectionParams: IAppAnalysisSectionItemsParams,
): JSX.Element[] => {
    const { itemsConfig, selectedItemId, urlParams, onItemClick } = sectionParams;

    const sectionItems =
        itemsConfig?.map((item) => buildNavItem(item, selectedItemId, urlParams, onItemClick)) ??
        [];

    return sectionItems;
};

const isItemSelected = (item: INavItem, activeItemName: string, urlParams: RawParams) => {
    return item.tab
        ? activeItemName === item.state && urlParams.selectedTab === item.tab
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

    const itemChildren = item.subItems.map((child) =>
        buildSimpleNavItem(child, activeItemName, urlParams, onItemClick),
    );

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
