import { colorsPalettes, rgba } from "@similarweb/styles";
import { Tab, TabList, Tabs } from "@similarweb/ui-components/dist/tabs";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import styled from "styled-components";
import { NavItemBadge } from "@similarweb/ui-components/dist/navigation-bar/src/NavBarItems/NavBarSimpleItem/NavItemBadge/NavItemBadge";

const tabs = [
    {
        name: "TopKeywords",
        title: "digitalMarketing.findKeywords.byIndustry.topKeywords.tab",
        index: 0,
    },
    {
        name: "SeasonalTrends",
        title: "digitalMarketing.findKeywords.byIndustry.seasonalTrends.tab",
        index: 1,
        isNew: true,
        ToolTipKey: i18nFilter()("findKeyword.byIndustry.seasonalTrends.Tooltip"),
    },
];

const SectionTabs = styled(Tabs)`
    width: 450px;
    margin: auto;
`;

const SectionTabsTabList = styled(TabList)`
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
`;
const SectionTab = styled(Tab)`
    width: 224px;
    padding: 0px 24px 12px 24px;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;
const Text = styled.div``;
const FindKeywordsByIndustrySectionTabs = (props) => {
    const selectedTab = tabs.find((tab) => tab.name === props.section);
    return (
        <SectionTabs selectedIndex={selectedTab.index} onSelect={props.onChange}>
            <SectionTabsTabList>
                {tabs.map((tab) => (
                    <SectionTab tooltipText={tab.ToolTipKey}>
                        <Text>{i18nFilter()(tab.title)}</Text>
                        {tab.isNew && <NavItemBadge type={"new"} />}
                    </SectionTab>
                ))}
            </SectionTabsTabList>
        </SectionTabs>
    );
};

export default SWReactRootComponent(
    FindKeywordsByIndustrySectionTabs,
    "FindKeywordsByIndustrySectionTabs",
);
