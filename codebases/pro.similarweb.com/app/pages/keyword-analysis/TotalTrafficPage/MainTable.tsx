import DomainsTable from "pages/keyword-analysis/OrganicPage/Domains/Table";
import KeywordsTable from "pages/keyword-analysis/OrganicPage/Keywords/Table";
import React, { useState } from "react";
import { TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import {
    MetricContainer,
    MetricsRow,
    MetricsRowHeader,
    StyledTab,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { onSelectedTabChange } from "pages/keyword-analysis/common/UtilityFunctions";
import { i18nFilter } from "filters/ngFilters";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import {
    EAnalysisTabName,
    DEFAULT_TABLE_TABS_HEADER_KEYS,
} from "pages/keyword-analysis/common/constants";

export const MainTable = ({
    commonProps,
    params,
    tableSelectionKey,
    tabsHeaderKeys = DEFAULT_TABLE_TABS_HEADER_KEYS,
}) => {
    const { isKeywordsGroup, GroupHash } = commonProps;
    const { tab, keyword } = params;
    const keys = isKeywordsGroup ? keyword.substring(1) : keyword;
    const [selectedTabIndex, setSelectedTabIndex] = useState(tab === "keywords" ? 1 : 0);
    const tableParams = { ...params, webSource: devicesTypes.TOTAL, GroupHash, keyword: keys };
    const i18n = i18nFilter();

    return (
        <>
            <MetricsRowHeader>{i18n("KeywordAnalysis.total.table.title")}</MetricsRowHeader>
            <MetricsRow>
                <MetricContainer width="100%" height="auto" padding="0px">
                    {isKeywordsGroup ? (
                        <Tabs
                            selectedIndex={selectedTabIndex}
                            onSelect={onSelectedTabChange(setSelectedTabIndex)}
                            forceRenderTabPanel={true}
                        >
                            <TabList>
                                {tabsHeaderKeys.map((tabsHeaderKeys) => (
                                    <StyledTab key={tabsHeaderKeys}>
                                        {i18n(tabsHeaderKeys)}
                                    </StyledTab>
                                ))}
                            </TabList>
                            <TabPanel>
                                <DomainsTable
                                    preventCountTracking={
                                        selectedTabIndex !== EAnalysisTabName.domains
                                    }
                                    params={tableParams}
                                    tableApiEndpoint="widgetApi/KeywordAnalysisOP/KeywordAnalysisTotal/Table"
                                    tableSelectionKey={tableSelectionKey}
                                    addToDashboardMetric="KeywordAnalysisTotal"
                                    excelMetric="KeywordAnalysisTotal"
                                    columnsType="organic"
                                    isKeywordsGroup={isKeywordsGroup}
                                    excludeFields={["Serp"]}
                                />
                            </TabPanel>
                            <TabPanel>
                                <KeywordsTable
                                    preventCountTracking={
                                        selectedTabIndex !== EAnalysisTabName.keywords
                                    }
                                    params={tableParams}
                                    tableApiEndpoint="widgetApi/KeywordAnalysisOP/KeywordAnalysisGroupTotal/Table"
                                    excelMetric="KeywordAnalysisGroupOrganic"
                                    excludeFields={["Cpc"]}
                                />
                            </TabPanel>
                        </Tabs>
                    ) : (
                        <DomainsTable
                            params={tableParams}
                            tableApiEndpoint="widgetApi/KeywordAnalysisOP/KeywordAnalysisTotal/Table"
                            tableSelectionKey={tableSelectionKey}
                            addToDashboardMetric="KeywordAnalysisTotal"
                            excelMetric="KeywordAnalysisTotal"
                            columnsType="organic"
                            isKeywordsGroup={isKeywordsGroup}
                        />
                    )}
                </MetricContainer>
            </MetricsRow>
        </>
    );
};
