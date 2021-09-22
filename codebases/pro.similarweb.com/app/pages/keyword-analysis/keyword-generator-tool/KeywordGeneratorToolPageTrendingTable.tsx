import * as React from "react";
import { connect } from "react-redux";
import {
    KeywordGeneratorToolPageTableBase,
    mapDispatchToPropsBase,
    mapStateToPropsBase,
} from "./KeywordGeneratorToolPageBase";
import { CommonTableSettings } from "./CommonTableSettings";

class KeywordGeneratorToolPageTrendingTable extends KeywordGeneratorToolPageTableBase {
    protected tableSettings = CommonTableSettings;
    protected pageName = "TrendingTable";
    protected tableApiUrl = `/api/recommendations/keywords/similarTrending/10`;
    protected tableApiExcelUrl = `/api/recommendations/keywords/similarTrending/10/excel`;
    protected tableStorageKey = "KeywordGeneratorToolRelatedTable";
    protected dropdownAppendTo = ".thirdTab .swReactTable-header-wrapper";
    protected groupsData = [
        {
            key: "keywordGeneratorToolTrending",
            displayName: this.i18nFilter("keyword.generator.tool.table.group"),
        },
    ];

    protected transformData = (data) => {
        return {
            ...data,
            records: data.records.map((keywordGroupDetail) => {
                return {
                    ...keywordGroupDetail,
                    url: this.getUrlForKeyWord(keywordGroupDetail.keyword),
                    country: this.props.country,
                    web_source: this.props.webSource,
                    organicShare:
                        keywordGroupDetail.paidShare === 0 ? 1 : keywordGroupDetail.organicShare,
                };
            }),
        };
    };
}

export default connect(
    mapStateToPropsBase,
    mapDispatchToPropsBase,
)(KeywordGeneratorToolPageTrendingTable);
