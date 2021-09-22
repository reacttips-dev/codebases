var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { gql } from 'apollo-boost';
export var SetSearchContextMutation = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    mutation setSearchContext($input: UpdateTagsSearchContextInput!) {\n        updateTagsSearchContext(input: $input) @client\n    }\n"], ["\n    mutation setSearchContext($input: UpdateTagsSearchContextInput!) {\n        updateTagsSearchContext(input: $input) @client\n    }\n"])));
var templateObject_1;
//# sourceMappingURL=set-search-context.js.map