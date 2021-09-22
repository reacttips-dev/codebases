import React from "react";
import FindLeadsSubNavBase from "../../../../common-components/sub-nav/FindLeadsSubNavBase/FindLeadsSubNavBase";
import { KeywordsQueryBar } from "components/compare/KeywordsQueryBar/KeywordsQueryBar";
import { KeywordAnalysisFilters } from "pages/keyword-analysis/KeywordAnalysisFilters";
import { SubHeaderPropsType } from "../../types";

export const SubHeader = ({
    keyword,
    preparedKeywordGroups,
    onSelectKeyword,
    isLoading = false,
}: SubHeaderPropsType): JSX.Element => {
    // Check if keyword or group
    const isKeywordMode = !keyword.startsWith("*");

    return (
        <FindLeadsSubNavBase
            leftComponent={
                <KeywordsQueryBar
                    keywordGroups={preparedKeywordGroups}
                    selectedKeywordGroupId={keyword}
                    selectedKeyword={keyword}
                    onSearchItemClick={onSelectKeyword}
                    isKeywordMode={isKeywordMode}
                    isLoading={isLoading}
                />
            }
            rightComponent={<KeywordAnalysisFilters />}
        />
    );
};
