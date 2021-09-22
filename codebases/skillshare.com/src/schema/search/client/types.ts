var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { gql } from 'apollo-boost';
export var SearchTypes = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    input UpdateTagsSearchContextInput {\n        query: String\n    }\n\n    type UpdateTagsSearchContextPayload {\n        query: String\n    }\n\n    extend type Mutation {\n        updateTagsSearchContext(input: UpdateTagsSearchContextInput): UpdateTagsSearchContextPayload!\n    }\n"], ["\n    input UpdateTagsSearchContextInput {\n        query: String\n    }\n\n    type UpdateTagsSearchContextPayload {\n        query: String\n    }\n\n    extend type Mutation {\n        updateTagsSearchContext(input: UpdateTagsSearchContextInput): UpdateTagsSearchContextPayload!\n    }\n"])));
var templateObject_1;
//# sourceMappingURL=types.js.map