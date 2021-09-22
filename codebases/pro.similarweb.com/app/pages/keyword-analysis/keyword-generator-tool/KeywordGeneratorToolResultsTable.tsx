import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import KeywordGeneratorToolPageQuestionsTable from "pages/keyword-analysis/keyword-generator-tool/KeywordGeneratorToolPageQuestionsTable";
import KeywordGeneratorToolPageRelatedTable from "pages/keyword-analysis/keyword-generator-tool/KeywordGeneratorToolPageRelatedTable";
import KeywordGeneratorToolPageTable from "pages/keyword-analysis/keyword-generator-tool/KeywordGeneratorToolPageTable";
import KeywordGeneratorToolPageTrendingTable from "pages/keyword-analysis/keyword-generator-tool/KeywordGeneratorToolPageTrendingTable";
import { TableWrap } from "pages/keyword-analysis/keyword-generator-tool/styledComponents";
import React, { useState } from "react";
import { allTrackers } from "services/track/track";
import { ETableTabDefaultIndex } from "./types";

export const KeywordGeneratorToolResultsTable = (props) => {
    const [titleData, setTitleData] = useState({
        totalRows: -1,
        totalRelatedRows: -1,
        totalTrendingRows: -1,
        totalQuestionsRows: -1,
    });
    const { onKeywordsAddedToGroup = () => null, notify = false, defaultIndex = 0 } = props;
    const i18n = i18nFilter();

    const onTabSelect = (index: ETableTabDefaultIndex) => {
        let tab = "";
        switch (index) {
            case ETableTabDefaultIndex.relatedKeywords:
                tab = "RELATED KEYWORDS";
                break;
            case ETableTabDefaultIndex.trending:
                tab = "TRENDING KEYWORDS";
                break;
            case ETableTabDefaultIndex.questions:
                tab = "QUESTION QUERIES";
                break;
            case ETableTabDefaultIndex.PhraseMatch:
            default:
                tab = "PHRASE-MATCH";
                break;
        }

        allTrackers.trackEvent("Tab", "Switch", tab);
        props.onTabSelect && props.onTabSelect(index);
    };
    const createDataCallback = (tab) => ({ totalRecords }) => {
        setTitleData({ ...titleData, [tab]: totalRecords });
    };
    const onDataError = (tab, err) => {
        setTitleData({ ...titleData, [tab]: null });
    };
    const getDataCallback = createDataCallback("totalRows");
    const getDataCallbackRelated = createDataCallback("totalRelatedRows");
    const getDataCallbackTrending = createDataCallback("totalTrendingRows");
    const getDataCallbackQuestions = createDataCallback("totalQuestionsRows");

    const getTabTitle = (id, stateParam) => {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                {i18n(`keyword.generator.tool.page.tab.${id}.title`, {
                    total:
                        titleData[stateParam] > 0
                            ? `(${numberFilter()(titleData[stateParam])})`
                            : "",
                })}
                {titleData[stateParam] === -1 && (
                    <div style={{ marginLeft: "55px" }}>
                        <DotsLoader />
                    </div>
                )}
            </div>
        );
    };

    return (
        <TableWrap>
            <Tabs onSelect={onTabSelect} forceRenderTabPanel={true} defaultIndex={defaultIndex}>
                <TabList>
                    <Tab
                        className="firstTab"
                        tooltipText={i18n("keyword.generator.tool.page.tab.phrase.tooltip")}
                        key="tab-0"
                    >
                        {getTabTitle("phrase", "totalRows")}
                    </Tab>
                    <Tab
                        className="secondTab"
                        tooltipText={i18n("keyword.generator.tool.page.tab.related.tooltip")}
                        key="tab-1"
                    >
                        {getTabTitle("related", "totalRelatedRows")}
                    </Tab>
                    <Tab
                        tooltipText={i18n("keyword.generator.tool.page.tab.trending.tooltip")}
                        key="tab-2"
                    >
                        {getTabTitle("trending", "totalTrendingRows")}
                    </Tab>
                    <Tab
                        tooltipText={i18n("keyword.generator.tool.page.tab.questions.tooltip")}
                        key="tab-3"
                    >
                        {getTabTitle("questions", "totalQuestionsRows")}
                    </Tab>
                </TabList>
                <TabPanel className="firstTab">
                    <KeywordGeneratorToolPageTable
                        preventCountTracking={+defaultIndex !== ETableTabDefaultIndex.PhraseMatch}
                        onDataError={(err) => onDataError("totalRows", err)}
                        getDataCallback={getDataCallback}
                        onKeywordsAddedToGroup={onKeywordsAddedToGroup}
                        notify={notify}
                    />
                </TabPanel>
                <TabPanel className="secondTab">
                    <KeywordGeneratorToolPageRelatedTable
                        preventCountTracking={
                            +defaultIndex !== ETableTabDefaultIndex.relatedKeywords
                        }
                        onDataError={(err) => onDataError("totalRelatedRows", err)}
                        getDataCallback={getDataCallbackRelated}
                        onKeywordsAddedToGroup={onKeywordsAddedToGroup}
                        notify={notify}
                    />
                </TabPanel>
                <TabPanel className="thirdTab">
                    <KeywordGeneratorToolPageTrendingTable
                        preventCountTracking={+defaultIndex !== ETableTabDefaultIndex.trending}
                        onDataError={(err) => onDataError("totalTrendingRows", err)}
                        getDataCallback={getDataCallbackTrending}
                        onKeywordsAddedToGroup={onKeywordsAddedToGroup}
                        notify={notify}
                    />
                </TabPanel>
                <TabPanel className="fourthTab">
                    <KeywordGeneratorToolPageQuestionsTable
                        preventCountTracking={+defaultIndex !== ETableTabDefaultIndex.questions}
                        onDataError={(err) => onDataError("totalQuestionsRows", err)}
                        getDataCallback={getDataCallbackQuestions}
                        onKeywordsAddedToGroup={onKeywordsAddedToGroup}
                        notify={notify}
                    />
                </TabPanel>
            </Tabs>
        </TableWrap>
    );
};
