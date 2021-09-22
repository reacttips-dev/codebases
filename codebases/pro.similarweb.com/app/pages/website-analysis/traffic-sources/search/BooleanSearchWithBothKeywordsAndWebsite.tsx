import {
    EBooleanSearchActionsTypes,
    BooleanSearch,
} from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";
import { i18nFilter } from "filters/ngFilters";
import { BooleanSearchWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchUtilityWrapper";
import React from "react";

const constants = {
    DEFAULT_GLUE_VALUE: " OR ",
    icons: {
        INCLUDE_KEYWORDS: "search-keywords",
        EXCLUDE_KEYWORDS: "keywords-exclude",
        INCLUDE_URLS: "globe",
        EXCLUDE_URLS: "website-exclude",
    },
    i18nKeys: {
        INCLUDE_KEYWORDS: "common.boolean.search.drop.down.include.keywords",
        EXCLUDE_KEYWORDS: "common.boolean.search.drop.down.exclude.keywords",
        INCLUDE_URLS: "common.boolean.search.drop.down.include.url",
        EXCLUDE_URLS: "common.boolean.search.drop.down.exclude.url",
    },
    TEXT_AND_SEARCH_INPUT_SEPARATOR: " ",
};

export enum EBooleanSearchActions {
    KEYWORDS,
    WEBSITES,
    BOTH,
}

export const BooleanSearchWithBothKeywordsAndWebsite = (props) => {
    const i18n = i18nFilter();
    const { icons, i18nKeys } = constants;
    const { booleanSearchAction } = props;

    const keywordsActionListItems = [
        {
            text: i18n(i18nKeys.INCLUDE_KEYWORDS) + constants.TEXT_AND_SEARCH_INPUT_SEPARATOR,
            action: EBooleanSearchActionsTypes.includeKeyword,
            glue: constants.DEFAULT_GLUE_VALUE,
            icon: icons.INCLUDE_KEYWORDS,
        },
        {
            text: i18n(i18nKeys.EXCLUDE_KEYWORDS) + constants.TEXT_AND_SEARCH_INPUT_SEPARATOR,
            action: EBooleanSearchActionsTypes.excludeKeyword,
            glue: constants.DEFAULT_GLUE_VALUE,
            icon: icons.EXCLUDE_KEYWORDS,
        },
    ];
    const websitesActionListItems = [
        {
            text: i18n(i18nKeys.INCLUDE_URLS) + constants.TEXT_AND_SEARCH_INPUT_SEPARATOR,
            action: EBooleanSearchActionsTypes.includeUrl,
            glue: constants.DEFAULT_GLUE_VALUE,
            icon: icons.INCLUDE_URLS,
        },
        {
            text: i18n(i18nKeys.EXCLUDE_URLS) + constants.TEXT_AND_SEARCH_INPUT_SEPARATOR,
            action: EBooleanSearchActionsTypes.excludeUrl,
            glue: constants.DEFAULT_GLUE_VALUE,
            icon: icons.EXCLUDE_URLS,
        },
    ];
    const bothActionListItems = [...websitesActionListItems, ...keywordsActionListItems];

    const getActionListItems = () => {
        switch (booleanSearchAction) {
            case EBooleanSearchActions.KEYWORDS:
                return keywordsActionListItems;
            case EBooleanSearchActions.WEBSITES:
                return websitesActionListItems;
            case EBooleanSearchActions.BOTH:
                return bothActionListItems;
            default:
                return bothActionListItems;
        }
    };
    return (
        <BooleanSearchWrapper>
            <BooleanSearch {...props} actionListItems={getActionListItems()} />
        </BooleanSearchWrapper>
    );
};
