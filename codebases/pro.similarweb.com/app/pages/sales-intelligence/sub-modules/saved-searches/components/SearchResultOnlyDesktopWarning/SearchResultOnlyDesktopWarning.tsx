import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledSearchResultOnlyDesktopWarning } from "./styles";

const SearchResultOnlyDesktopWarning = () => {
    const translate = useTranslation();

    return (
        <StyledSearchResultOnlyDesktopWarning>
            <SWReactIcons iconName="warning" size="sm" />
            <span>{translate("si.components.search_results.only_desktop_warning")}</span>
        </StyledSearchResultOnlyDesktopWarning>
    );
};

export default React.memo(SearchResultOnlyDesktopWarning);
