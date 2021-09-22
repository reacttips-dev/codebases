import { Injector } from "common/ioc/Injector";
import React from "react";
import { BooleanSearchWithBothKeywordsAndWebsite } from "./BooleanSearchWithBothKeywordsAndWebsite";
import { EBooleanSearchActionsTypes } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";

const DEFAULT_API_SEPARATOR = ",";
const filterByAction = (action) => (items) =>
    items
        .filter((item) => item.action === action)
        .map((item) => item.text)
        .join(DEFAULT_API_SEPARATOR);
const getInitialItemArray = (action) => (item) =>
    item
        ? item.split(DEFAULT_API_SEPARATOR).map((text) => ({ text, action, id: Math.random() }))
        : [];

export const BooleanSearchWithBothKeywordsAndWebsiteWrapper = (props) => {
    const swNavigator = Injector.get<any>("swNavigator");

    const onChange = (items) => {
        const excludeTerms = filterByAction(EBooleanSearchActionsTypes.excludeKeyword)(items);
        const excludeUrls = filterByAction(EBooleanSearchActionsTypes.excludeUrl)(items);
        const includeTerms = filterByAction(EBooleanSearchActionsTypes.includeKeyword)(items);
        const includeUrls = filterByAction(EBooleanSearchActionsTypes.includeUrl)(items);
        const booleanSearchParams = {
            ExcludeTerms: excludeTerms,
            ExcludeUrls: excludeUrls,
            IncludeTerms: includeTerms,
            IncludeUrls: includeUrls,
        };

        swNavigator.applyUpdateParams(booleanSearchParams);
        // calling props.onApplyChanges in order to enable the parent component to act after the url has been changed
        // (relevant when the state is with reloadOnSearch=false)
        props?.onApplyChanges?.(booleanSearchParams);
    };

    const getInitialItems = () => {
        // if we don't get filters in props we take it from the URL params
        const {
            ExcludeTerms: excludeTerms,
            ExcludeUrls: excludeUrls,
            IncludeTerms: includeTerms,
            IncludeUrls: includeUrls,
        } = props.filters ? props.filters : swNavigator.getParams();
        const excludeTermsArray = getInitialItemArray(EBooleanSearchActionsTypes.excludeKeyword)(
            excludeTerms,
        );
        const excludeUrlsArray = getInitialItemArray(EBooleanSearchActionsTypes.excludeUrl)(
            excludeUrls,
        );
        const includeTermsArray = getInitialItemArray(EBooleanSearchActionsTypes.includeKeyword)(
            includeTerms,
        );
        const includeUrlsArray = getInitialItemArray(EBooleanSearchActionsTypes.includeUrl)(
            includeUrls,
        );
        const logicalSeparator = {
            text: "AND",
            action: "logicalSeparator",
            id: "logicalSeparator",
        };
        return [
            ...includeTermsArray,
            includeTermsArray.length > 0 && excludeTermsArray.length > 0 && logicalSeparator,
            ...excludeTermsArray,
            ...includeUrlsArray,
            includeUrlsArray.length > 0 && excludeUrlsArray.length > 0 && logicalSeparator,
            ...excludeUrlsArray,
        ];
    };

    return (
        <BooleanSearchWithBothKeywordsAndWebsite
            onChange={onChange}
            chips={getInitialItems()}
            {...props}
        />
    );
};
BooleanSearchWithBothKeywordsAndWebsiteWrapper.defaultProps = {
    onApplyChanges: () => null,
};
