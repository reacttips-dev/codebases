var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { gql } from 'apollo-boost';
export var FollowUserMutation = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    mutation FollowUser($id: ID!) {\n        followUser(input: { userId: $id }) {\n            clientMutationId\n        }\n    }\n"], ["\n    mutation FollowUser($id: ID!) {\n        followUser(input: { userId: $id }) {\n            clientMutationId\n        }\n    }\n"])));
export var UnfollowUserMutation = gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    mutation UnfollowUser($id: ID!) {\n        unfollowUser(input: { userId: $id }) {\n            clientMutationId\n        }\n    }\n"], ["\n    mutation UnfollowUser($id: ID!) {\n        unfollowUser(input: { userId: $id }) {\n            clientMutationId\n        }\n    }\n"])));
var templateObject_1, templateObject_2;
//# sourceMappingURL=mutations.js.map