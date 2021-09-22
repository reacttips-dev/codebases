import { AutocompleteKeywords } from "components/AutocompleteKeywords/AutocompleteKeywords";
import { AutocompleteKeywordGroups } from "components/AutocompleteKeywords/AutocompleteKeywordsGroups";
import { i18nFilter } from "filters/ngFilters";
import React, { FC, useMemo } from "react";
import { KeywordSearchContainer } from "../KeywordsQueryBarStyles";

interface IKeywordsQueryBarAutocompleteProps {
    onItemClick: (item) => void;
    selectedValue: string;
    isKeywordMode: boolean;
    className: string;
    showKeywordGroups: boolean;
    onGroupShareModalOpened?: () => void;
    onGroupShareModalClosed?: () => void;
    onGroupEditorModalClosed?: () => void;
    onGroupDelete?: (deletedGroup: { Id: string }) => void;
    showKeywords?: boolean;
}

export const KeywordsQueryBarAutocomplete: FC<IKeywordsQueryBarAutocompleteProps> = (props) => {
    const translate = i18nFilter();
    const {
        onItemClick,
        selectedValue,
        className,
        isKeywordMode,
        showKeywordGroups,
        onGroupShareModalOpened,
        onGroupShareModalClosed,
        onGroupEditorModalClosed,
        onGroupDelete,
        showKeywords = true,
    } = props;

    const AutocompleteComponent = showKeywordGroups
        ? AutocompleteKeywordGroups
        : AutocompleteKeywords;

    const placeholderText = useMemo(() => {
        if (!showKeywordGroups) {
            return translate("keyword.query.bar.autocomplete.placeholder.text");
        } else {
            return showKeywords
                ? i18nFilter()("keyword.and.keyword.list.query.bar.autocomplete.placeholder.text")
                : i18nFilter()("keyword.list.query.bar.autocomplete.placeholder.text");
        }
    }, [showKeywordGroups, showKeywords]);

    return (
        <KeywordSearchContainer className={className}>
            <AutocompleteComponent
                showKeywords={showKeywords}
                onClick={onItemClick}
                autocompleteProps={{
                    placeholder: placeholderText,
                    isFocused: true,
                    autoFocus: true,
                    autoSelectInputOnFocus: true,
                    autoTruncateResultsOnCloseClick: true,
                    onCloseClick: onGroupShareModalClosed,
                }}
                forceResultsView={false}
                selectedValue={selectedValue}
                defaultSelectedTab={isKeywordMode ? "keywords" : "keyword groups"}
                onGroupShareModalOpened={onGroupShareModalOpened}
                onGroupShareModalClosed={onGroupShareModalClosed}
                onGroupEditorModalClosed={onGroupEditorModalClosed}
                onGroupDelete={onGroupDelete}
            />
        </KeywordSearchContainer>
    );
};
