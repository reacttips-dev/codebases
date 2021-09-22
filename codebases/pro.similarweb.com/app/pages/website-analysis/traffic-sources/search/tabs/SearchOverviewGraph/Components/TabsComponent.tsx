import { Tabs } from "@similarweb/ui-components/dist/tabs";
import I18n from "components/React/Filters/I18n";
import React from "react";
import { CompareTabsStyle, CompareTabStyle, TabIconStyle } from "./StyledComponents";

export const TabsComponent = ({ selectedTab, tabs, setSelected, children }) => {
    return (
        <Tabs
            onSelect={(index) => setSelected(tabs[index])}
            selectedIndex={tabs.findIndex((tab) => tab.name === selectedTab.name)}
        >
            <CompareTabsStyle>
                {tabs.map((tab) => (
                    <CompareTabStyle key={tab.id}>
                        <TabIconStyle size="xs" type="inline" iconName={tab.iconName} />
                        <I18n>{tab.title}</I18n>
                    </CompareTabStyle>
                ))}
            </CompareTabsStyle>
            {children}
        </Tabs>
    );
};
