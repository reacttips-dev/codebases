import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledSearchResultHeader, StyledSearchResultsTitle } from "../styles";

const NotSavedSearchHeader = () => {
    const translate = useTranslation();

    return (
        <StyledSearchResultHeader>
            <StyledSearchResultsTitle>
                <span>{translate("si.pages.search_result.title")}</span>
            </StyledSearchResultsTitle>
        </StyledSearchResultHeader>
    );
};

export default React.memo(NotSavedSearchHeader);
