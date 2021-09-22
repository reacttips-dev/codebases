var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { gql } from 'apollo-boost';
export var GetSearchContextQuery = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    query GetSearchContext {\n        searchContext @client {\n            query\n            pageSize\n            activeSuggestionIndex\n            inputFocused\n            isBackspace\n        }\n    }\n"], ["\n    query GetSearchContext {\n        searchContext @client {\n            query\n            pageSize\n            activeSuggestionIndex\n            inputFocused\n            isBackspace\n        }\n    }\n"])));
var templateObject_1;
//# sourceMappingURL=get-search-context.js.map