var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { gql } from 'apollo-boost';
export var LikeMutation = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    mutation Like($input: LikeInput!) {\n        like(input: $input) {\n            likeable {\n                likeCount\n            }\n        }\n    }\n"], ["\n    mutation Like($input: LikeInput!) {\n        like(input: $input) {\n            likeable {\n                likeCount\n            }\n        }\n    }\n"])));
export var UnlikeMutation = gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    mutation Unlike($input: UnlikeInput!) {\n        unlike(input: $input) {\n            likeable {\n                likeCount\n            }\n        }\n    }\n"], ["\n    mutation Unlike($input: UnlikeInput!) {\n        unlike(input: $input) {\n            likeable {\n                likeCount\n            }\n        }\n    }\n"])));
var templateObject_1, templateObject_2;
//# sourceMappingURL=mutation.js.map