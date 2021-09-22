var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { gql } from 'apollo-boost';
export var MarkNotificationsAsReadMutation = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    mutation MarkNotificationsAsRead($input: MarkNotificationsAsReadInput!) {\n        markNotificationsAsRead(input: $input) {\n            notifications {\n                id\n            }\n        }\n    }\n"], ["\n    mutation MarkNotificationsAsRead($input: MarkNotificationsAsReadInput!) {\n        markNotificationsAsRead(input: $input) {\n            notifications {\n                id\n            }\n        }\n    }\n"])));
var templateObject_1;
//# sourceMappingURL=mutations.js.map