import * as React from "react";
import { connect } from "react-redux";
import {
    KeywordGeneratorToolPageTableBase,
    mapDispatchToPropsBase,
    mapStateToPropsBase,
} from "./KeywordGeneratorToolPageBase";
import { RelatedTableSettings } from "./RelatedTableSettings";

class KeywordGeneratorToolPageRelatedTable extends KeywordGeneratorToolPageTableBase {
    protected tableSettings = RelatedTableSettings;
    protected tableApiUrl = `/api/recommendations/keywords/related/10`;
    protected tableApiExcelUrl = `/api/recommendations/keywords/related/10/excel`;
    protected tableStorageKey = "KeywordGeneratorToolRelatedTable";
    protected dropdownAppendTo = ".secondTab .swReactTable-header-wrapper";
    protected groupsData = [
        {
            key: "keywordGeneratorToolRelated",
            displayName: this.i18nFilter("keyword.generator.tool.table.group"),
        },
    ];

    protected transformData = (data) => {
        const maxScore = data.maxScore;
        return {
            ...data,
            records: data.records.map((keywordGroupDetail) => {
                return {
                    ...keywordGroupDetail,
                    url: this.getUrlForKeyWord(keywordGroupDetail.keyword),
                    country: this.props.country,
                    web_source: this.props.webSource,
                    score: Math.sqrt(Math.min(1, keywordGroupDetail.score / maxScore)) * 5,
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
)(KeywordGeneratorToolPageRelatedTable);
