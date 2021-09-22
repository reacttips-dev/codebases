import React, { useEffect, useState } from "react";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { TableWrap } from "pages/keyword-analysis/keyword-generator-tool/styledComponents";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import AmazonKeywordGeneratorRelatedTable from "pages/keyword-analysis/amazon-keyword-generator/AmazonKeywordGeneratorRelatedTable";
import AmazonKeywordGeneratorPhrasesTable from "pages/keyword-analysis/amazon-keyword-generator/AmazonKeywordGeneratorPhrasesTable";

const TABS = {
    phrase: { index: 0, totalRecordsFiled: "totalPhraseRecords" },
    related: { index: 1, totalRecordsFiled: "totalRelatedRecords" },
};
export const AmazonKeywordGeneratorTables = (props) => {
    const { selectedTab = 0 } = props;
    const [titleData, setTitleData] = useState({
        totalPhraseRecords: -1,
        totalRelatedRecords: -1,
    });

    const onTabSelect = (index: number) => {
        if (index === 1) {
            // If selected tab is Related Keywords
            TrackWithGuidService.trackWithGuid(
                "keyword.research.related.keywords.amazon.tab.click",
                "click",
            );
        } else {
            // If selected tab is Phrase Match
            TrackWithGuidService.trackWithGuid(
                "keyword.research.phrase.match.amazon.tab.click",
                "click",
            );
        }
        props.onTabSelect && props.onTabSelect(index);
    };
    const createDataCallback = (tab) => (totalRecords) => {
        setTitleData({ ...titleData, [tab]: totalRecords });
    };
    const onDataError = (tab, err) => {
        setTitleData({ ...titleData, [tab]: null });
    };
    const getDataCallbackPhrase = (totalRecords) => {
        createDataCallback(TABS.phrase.totalRecordsFiled)(totalRecords);
    };
    const getDataCallbackRelated = (totalRecords) => {
        createDataCallback(TABS.related.totalRecordsFiled)(totalRecords);
    };
    const onDataErrorPhrase = (err) => onDataError(TABS.phrase.totalRecordsFiled, err);
    const onDataErrorRelated = (err) => onDataError(TABS.related.totalRecordsFiled, err);

    const getTabTitle = (id, stateParam) => {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                {i18nFilter()(`amazon.keyword.generator.tab.${id}.title`, {
                    total:
                        titleData[stateParam] > 0
                            ? `(${numberFilter()(titleData[stateParam])})`
                            : "",
                })}
                {titleData[stateParam] === -1 && ( //Show loader until data call back returns
                    <div style={{ marginLeft: "55px" }}>
                        <DotsLoader />
                    </div>
                )}
            </div>
        );
    };

    return (
        <TableWrap>
            <Tabs onSelect={onTabSelect} forceRenderTabPanel={true} defaultIndex={selectedTab}>
                <TabList>
                    <Tab
                        className="firstTab"
                        tooltipText={i18nFilter()(
                            "amazon.keyword.generator.page.tab.phrase.tooltip",
                        )}
                        key="tab-0"
                    >
                        {getTabTitle("phrase", TABS.phrase.totalRecordsFiled)}
                    </Tab>
                    <Tab
                        className="secondTab"
                        tooltipText={i18nFilter()(
                            "amazon.keyword.generator.page.tab.related.tooltip",
                        )}
                        key="tab-1"
                    >
                        {getTabTitle("related", TABS.related.totalRecordsFiled)}
                    </Tab>
                </TabList>
                <TabPanel className="firstTab">
                    <AmazonKeywordGeneratorPhrasesTable
                        preventCountTracking={selectedTab !== 0}
                        totalRecords={titleData[TABS.phrase.totalRecordsFiled]}
                        getDataCallback={getDataCallbackPhrase}
                        onDataError={onDataErrorPhrase}
                    />
                </TabPanel>
                <TabPanel className="secondTab">
                    <AmazonKeywordGeneratorRelatedTable
                        preventCountTracking={selectedTab !== 1}
                        totalRecords={titleData[TABS.related.totalRecordsFiled]}
                        getDataCallback={getDataCallbackRelated}
                        onDataError={onDataErrorRelated}
                    />
                </TabPanel>
            </Tabs>
        </TableWrap>
    );
};
