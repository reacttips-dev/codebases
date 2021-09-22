import {
    SALES_RIGHT_SIDEBAR_TAB_BENCHMARKS_KEY,
    SALES_RIGHT_SIDEBAR_TAB_ABOUT_KEY,
    SALES_RIGHT_SIDEBAR_TAB_SITE_TRENDS_KEY,
} from "pages/workspace/sales/constants/constants";
import { RightBarTabs } from "./types";
import React from "react";
import { TabType } from "pages/workspace/sales/components/RightBar/Tabs/types";
import About from "pages/workspace/sales/components/RightBar/Tabs/About";
import SiteTrends from "pages/workspace/sales/components/RightBar/Tabs/SiteTrends";
import Benchmarks from "pages/workspace/sales/components/RightBar/Tabs/Benchmarks";
import Contacts from "pages/workspace/sales/components/RightBar/Tabs/Contacts";

export const TABS_NAME = {
    [RightBarTabs.About]: SALES_RIGHT_SIDEBAR_TAB_ABOUT_KEY,
    [RightBarTabs.SiteTrends]: SALES_RIGHT_SIDEBAR_TAB_SITE_TRENDS_KEY,
    [RightBarTabs.Benchmarks]: SALES_RIGHT_SIDEBAR_TAB_BENCHMARKS_KEY,
    [RightBarTabs.Contacts]: SALES_RIGHT_SIDEBAR_TAB_ABOUT_KEY,
};

export const getNameTabForTracking = (tab: number): string => {
    if (tab === RightBarTabs.About) {
        return "About";
    }

    if (tab === RightBarTabs.SiteTrends) {
        return "SiteTrends";
    }

    if (tab === RightBarTabs.Benchmarks) {
        return "Benchmarks";
    }

    return "Contacts";
};

export const tabWrapper = (Component: React.FC<TabType>) => {
    return (active: boolean, onClick: () => void): JSX.Element => (
        <Component active={active} onClick={onClick} />
    );
};

export const RIGHT_BAR_TABS = new Map([
    [RightBarTabs.About, tabWrapper(About)],
    [RightBarTabs.SiteTrends, tabWrapper(SiteTrends)],
    [RightBarTabs.Benchmarks, tabWrapper(Benchmarks)],
    [RightBarTabs.Contacts, tabWrapper(Contacts)],
]);
