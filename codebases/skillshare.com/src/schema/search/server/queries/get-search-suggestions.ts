var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { gql } from 'apollo-boost';
export var GetSearchSuggestionsQuery = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    query searchSuggestions($query: String!, $options: SearchOptions) {\n        skills(query: $query, options: $options) {\n            id\n            name\n            classes\n            followers\n            isApproved\n            slug\n            isNew\n        }\n        teachers(query: $query, options: $options) {\n            id\n            name\n            avatar\n            followers\n            url\n        }\n    }\n"], ["\n    query searchSuggestions($query: String!, $options: SearchOptions) {\n        skills(query: $query, options: $options) {\n            id\n            name\n            classes\n            followers\n            isApproved\n            slug\n            isNew\n        }\n        teachers(query: $query, options: $options) {\n            id\n            name\n            avatar\n            followers\n            url\n        }\n    }\n"])));
var templateObject_1;
//# sourceMappingURL=get-search-suggestions.js.map