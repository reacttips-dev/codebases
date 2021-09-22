import * as fetch from "isomorphic-fetch";
import * as url from "url";
import { convertLocaleToLang } from "../../models/";
export class ApiSearchSuggestionsProvider {
    constructor(searchSuggestionsApiUrl, locale, exp) {
        this.searchSuggestionsApiUrl = searchSuggestionsApiUrl;
        this.locale = locale;
        this.exp = exp;
    }
    static translateLegacyApiJson(apiJson) {
        const result = this.emptyResponse();
        if (apiJson && apiJson.suggestions) {
            result.suggestions = apiJson.suggestions.map((suggestion) => ({ name: suggestion.name, path: suggestion.path, categoryName: suggestion.categoryName }));
        }
        return Promise.resolve(result);
    }
    static emptyResponse() {
        const response = {
            suggestions: [],
        };
        return response;
    }
    getSearchSuggestions(query) {
        const formattedUrl = url.parse(this.searchSuggestionsApiUrl, true);
        formattedUrl.query = {
            query,
            lang: convertLocaleToLang(this.locale),
            exp: this.exp,
        };
        return fetch(url.format(formattedUrl).toLowerCase())
            .then((response) => response.json())
            .then((responseJson) => ApiSearchSuggestionsProvider.translateLegacyApiJson(responseJson))
            .catch(() => ApiSearchSuggestionsProvider.emptyResponse());
    }
}
//# sourceMappingURL=ApiSearchSuggestionsProvider.js.map