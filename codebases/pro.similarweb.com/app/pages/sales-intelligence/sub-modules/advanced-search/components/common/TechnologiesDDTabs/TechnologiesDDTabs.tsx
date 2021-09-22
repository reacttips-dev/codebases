import React from "react";
import classNames from "classnames";
import { TabPanel, TabList, Tab, Tabs } from "@similarweb/ui-components/dist/tabs";
import { TechnologiesDDItemType } from "../../../filters/technology/types";
import TechnologiesDDTabPanel from "../TechnologiesDDTabPanel/TechnologiesDDTabPanel";
import withTechnologySmartTabs from "../../../hoc/withTechnologySmartTabs";

export type TechnologiesDDTabsProps = {
    selectedTabIndex: number;
    tabs: { id: string; name: string; isDisabled?: boolean; items: TechnologiesDDItemType[] }[];
    onItemClick(item: TechnologiesDDItemType): void;
    onTabSelect(index: number): void;
};

const TechnologiesDDTabs = (props: TechnologiesDDTabsProps) => {
    const { selectedTabIndex, tabs, onTabSelect, onItemClick } = props;

    return (
        <Tabs
            onSelect={onTabSelect}
            selectedIndex={selectedTabIndex}
            className="technologies-filter-dd-tabs"
        >
            <TabList>
                {tabs.map((tab) => (
                    <Tab
                        key={`tab-item-${tab.id}`}
                        disabled={tab.isDisabled}
                        data-automation={`tab-item-${tab.id}`}
                    >
                        {tab.name}
                    </Tab>
                ))}
            </TabList>
            {tabs.map((tab, i) => (
                <TabPanel
                    key={`tab-panel-item-${tab.id}`}
                    className={classNames({ ["selected-tab"]: selectedTabIndex === i })}
                >
                    <TechnologiesDDTabPanel tab={tab} onItemClick={onItemClick} />
                </TabPanel>
            ))}
        </Tabs>
    );
};

export const TechnologiesDDSmartTabs = withTechnologySmartTabs(TechnologiesDDTabs);
export default TechnologiesDDTabs;
