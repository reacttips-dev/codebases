import { useState } from "react";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { TableWrap } from "pages/keyword-analysis/keyword-generator-tool/styledComponents";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import YoutubeKeywordGeneratorTabTable from "./YoutubeKeywordGeneratorTabTable";
import { ETabs } from "./constants";

const TABS = {
    [ETabs.PHRASE_MATCH]: {
        index: ETabs.PHRASE_MATCH,
        totalRecordsFiled: "totalPhraseRecords",
        trackingId: "keyword.research.phrase.match.youtube.tab.click",
    },
    [ETabs.RELATED_KEYWORDS]: {
        index: ETabs.RELATED_KEYWORDS,
        totalRecordsFiled: "totalRelatedRecords",
        trackingId: "keyword.research.related.keywords.youtube.tab.click",
    },
};

interface IYoutubeKeywordGeneratorTablesProps {
    onTabSelect: (tab: ETabs) => void;
    selectedTab: ETabs;
}

export const YoutubeKeywordGeneratorTables: React.FC<IYoutubeKeywordGeneratorTablesProps> = ({
    selectedTab = ETabs.PHRASE_MATCH,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onTabSelect = () => {},
}) => {
    const [titleData, setTitleData] = useState({
        totalPhraseRecords: -1,
        totalRelatedRecords: -1,
    });

    const handleTabSelect = (tab: ETabs) => {
        TrackWithGuidService.trackWithGuid(TABS[tab].trackingId, "click");
        onTabSelect(tab);
    };
    const createDataCallback = (tab) => (totalRecords) => {
        setTitleData({ ...titleData, [tab]: totalRecords });
    };
    const onDataError = (tab, err) => {
        setTitleData({ ...titleData, [tab]: null });
    };
    const getDataCallbackPhrase = (totalRecords) => {
        createDataCallback(TABS[ETabs.PHRASE_MATCH].totalRecordsFiled)(totalRecords);
    };
    const getDataCallbackRelated = (totalRecords) => {
        createDataCallback(TABS[ETabs.RELATED_KEYWORDS].totalRecordsFiled)(totalRecords);
    };
    const onDataErrorPhrase = (err) => onDataError(TABS[ETabs.PHRASE_MATCH].totalRecordsFiled, err);
    const onDataErrorRelated = (err) =>
        onDataError(TABS[ETabs.RELATED_KEYWORDS].totalRecordsFiled, err);

    const getTabTitle = (id, stateParam) => {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                {i18nFilter()(`youtube.keyword.generator.tab.${id}.title`, {
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
            <Tabs onSelect={handleTabSelect} forceRenderTabPanel={true} defaultIndex={selectedTab}>
                <TabList>
                    <Tab
                        tooltipText={i18nFilter()(
                            "youtube.keyword.generator.page.tab.phrase.tooltip",
                        )}
                    >
                        {getTabTitle("phrase", TABS[ETabs.PHRASE_MATCH].totalRecordsFiled)}
                    </Tab>
                    <Tab
                        tooltipText={i18nFilter()(
                            "youtube.keyword.generator.page.tab.related.tooltip",
                        )}
                    >
                        {getTabTitle("related", TABS[ETabs.RELATED_KEYWORDS].totalRecordsFiled)}
                    </Tab>
                </TabList>
                <TabPanel>
                    <YoutubeKeywordGeneratorTabTable
                        tab={ETabs.PHRASE_MATCH}
                        preventCountTracking={selectedTab !== ETabs.PHRASE_MATCH}
                        totalRecords={titleData[TABS[ETabs.PHRASE_MATCH].totalRecordsFiled]}
                        getDataCallback={getDataCallbackPhrase}
                        onDataError={onDataErrorPhrase}
                    />
                </TabPanel>
                <TabPanel>
                    <YoutubeKeywordGeneratorTabTable
                        tab={ETabs.RELATED_KEYWORDS}
                        preventCountTracking={selectedTab !== ETabs.RELATED_KEYWORDS}
                        totalRecords={titleData[TABS[ETabs.RELATED_KEYWORDS].totalRecordsFiled]}
                        getDataCallback={getDataCallbackRelated}
                        onDataError={onDataErrorRelated}
                    />
                </TabPanel>
            </Tabs>
        </TableWrap>
    );
};
