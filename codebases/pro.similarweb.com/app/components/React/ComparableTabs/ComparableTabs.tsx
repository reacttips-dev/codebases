import { TabList, Tabs } from "@similarweb/ui-components/dist/tabs";
import I18n from "components/React/Filters/I18n";
import React from "react";
import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Tab } from "@similarweb/ui-components/dist/tabs/src/..";
import { BetaLabel } from "components/BetaLabel/BetaLabel";

const ComparableTabStyle = styled(Tab)`
    ${setFont({ $size: 13 })};
    height: 48px;
    .SWReactIcons svg path {
        fill-opacity: 1;
    }
    &.selected {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.blue[400]};
        }
    }
    &:hover {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.carbon[500]};
        }
    }
`;

const TabIconStyle = styled(SWReactIcons)`
    margin-right: 8px;
`;

export const ComparableTabs = ({ selectedTab, tabs, setSelected, children }) => {
    return (
        <Tabs
            defaultIndex={tabs.findIndex((tab) => tab.name === selectedTab.name)}
            onSelect={(index) => setSelected(tabs[index])}
        >
            <TabList>
                {tabs.map((tab) => (
                    <ComparableTabStyle key={tab.id}>
                        <TabIconStyle size="xs" type="inline" iconName={tab.iconName} />
                        <I18n>{tab.title}</I18n>
                        {tab?.beta && <BetaLabel />}
                    </ComparableTabStyle>
                ))}
            </TabList>
            {children}
        </Tabs>
    );
};
