import * as React from "react";
import * as _ from "lodash";
import { ISuggestionProvider, SuggestionPromise } from "./AutoComplete";

export class StaticSuggestionProvider implements ISuggestionProvider {
    constructor(private items: string[]) {}
    getSuggestions(query: string): SuggestionPromise {
        let res = query ? _.filter(this.items, (item) => item.indexOf(query) > -1) : [];

        return {
            then: function (resolved, rejected) {
                resolved(res);
            },
        };
    }
}
