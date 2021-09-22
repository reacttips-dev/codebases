import { connect } from "react-redux";
import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { TableWrap } from "./StyledComponents";
import { i18nFilter } from "filters/ngFilters";
import KeywordByIndustryTabTable from "./KeywordByIndustryTabTable";
import { useState, useCallback } from "react";
import { ETopKeywordsTable } from "./widgets/IndustryAnalysisTopKeywordsAll";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

type Tab = { title: string; index: number; name: string; className: string };
type Tabs = Record<string, Tab>;

export const tabs: Tabs = {
    all: {
        title: "category.search.tabs.all",
        index: 0,
        name: "all",
        className: "tab-0",
    },
    organic: {
        title: "category.search.tabs.organic",
        index: 1,
        name: "organic",
        className: "tab-1",
    },
    paid: {
        title: "category.search.tabs.paid",
        index: 2,
        name: "paid",
        className: "tab-2",
    },
};

const KeywordByIndustryTables = ({ params }) => {
    const i18n = i18nFilter();
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const [currentTab, setCurrentTab] = useState<Tab>(tabs[params.tab] || tabs.all);

    const onTabSelect = useCallback((index: number) => {
        const newTab = Object.values(tabs).find((tab) => tab.index === index);
        setCurrentTab(newTab);
        swNavigator.applyUpdateParams({ tab: newTab.name });
    }, []);

    const shouldTableRender = useCallback(
        (tab: ETopKeywordsTable): boolean => currentTab.index === tab,
        [currentTab.index],
    );

    return (
        <TableWrap>
            <Tabs onSelect={onTabSelect} forceRenderTabPanel defaultIndex={currentTab.index}>
                <TabList>
                    {Object.values(tabs).map((tab) => (
                        <Tab className={tab.className} key={tab.className}>
                            {i18n(tab.title)}
                        </Tab>
                    ))}
                </TabList>
                <TabPanel className={tabs.all.className}>
                    {shouldTableRender(ETopKeywordsTable.all) && (
                        <KeywordByIndustryTabTable tab={ETopKeywordsTable.all} />
                    )}
                </TabPanel>
                <TabPanel className={tabs.organic.className}>
                    {shouldTableRender(ETopKeywordsTable.organic) && (
                        <KeywordByIndustryTabTable
                            overrideFilterParams="OP;==;0"
                            tab={ETopKeywordsTable.organic}
                        />
                    )}
                </TabPanel>
                <TabPanel className={tabs.paid.className}>
                    {shouldTableRender(ETopKeywordsTable.paid) && (
                        <KeywordByIndustryTabTable
                            overrideFilterParams="OP;==;1"
                            tab={ETopKeywordsTable.paid}
                        />
                    )}
                </TabPanel>
            </Tabs>
        </TableWrap>
    );
};

const mapStateToProps = ({ routing }) => {
    const { params } = routing;
    return {
        params,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {};
};
const connected = connect(mapStateToProps, mapDispatchToProps)(KeywordByIndustryTables);

export default SWReactRootComponent(connected, "KeywordByIndustryTables");
