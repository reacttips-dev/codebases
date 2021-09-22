import * as React from "react";
import { connect } from "react-redux";
import {
    KeywordGeneratorToolPageTableBase,
    mapDispatchToPropsBase,
    mapStateToPropsBase,
} from "./KeywordGeneratorToolPageBase";

import { PhraseMatchTableSettings } from "./PhraseMatchTableSettings";

class KeywordGeneratorToolPageTable extends KeywordGeneratorToolPageTableBase {
    protected tableSettings = PhraseMatchTableSettings;
    protected tableApiUrl = `/api/recommendations/keywords/similar/10`;
    protected tableApiExcelUrl = `/api/recommendations/keywords/similar/10/excel`;
    protected tableStorageKey = "KeywordGeneratorToolTable";
    protected dropdownAppendTo = ".firstTab .swReactTable-header-wrapper";
    protected groupsData = [
        {
            key: "keywordGeneratorTool",
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

export default connect(mapStateToPropsBase, mapDispatchToPropsBase)(KeywordGeneratorToolPageTable);
