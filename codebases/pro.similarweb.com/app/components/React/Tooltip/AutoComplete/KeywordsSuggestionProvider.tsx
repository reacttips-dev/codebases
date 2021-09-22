import angular from "angular";
import * as React from "react";
import * as _ from "lodash";
import { IAutoCompleteKeywordItem } from "autocomplete";
import { ISuggestionProvider, SuggestionPromise } from "./AutoComplete";
export class KeywordsSuggestionProvider implements ISuggestionProvider {
    constructor(private autoCompleteService: any) {}

    getSuggestions(query: string, includeGroups: boolean = true): SuggestionPromise {
        const includeGroupsParams = includeGroups ? [] : ["", 10, [], true];
        return this.autoCompleteService
            .getAutoCompleteSuggestions(query, "keywords", ...includeGroupsParams)
            .promise.then((res: IAutoCompleteKeywordItem[]) => {
                let keywords = _.isArray(res) ? res.map((k) => k.name) : [];
                keywords["query"] = query;
                return keywords;
            });
    }
}

angular.module("sw.common").service("keywordsSuggestionProvider", function (autoCompleteService) {
    return new KeywordsSuggestionProvider(autoCompleteService);
});
