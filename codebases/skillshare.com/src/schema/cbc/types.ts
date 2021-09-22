var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { gql } from 'apollo-boost';
export var CBCTypes = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    input CreateCheckoutSessionInput {\n        cancelUrl: URL!\n        clientMutationId: String\n        paymentMethodTypes: [StripePaymentMethodType!]!\n        priceId: String!\n        successUrl: URL!\n    }\n\n    type CreateCheckoutSessionPayload {\n        checkoutPageURL: URL!\n        clientMutationId: String\n    }\n\n    extend type Mutation {\n        createCheckoutSession(input: CreateCheckoutSessionInput!): CreateCheckoutSessionPayload\n    }\n"], ["\n    input CreateCheckoutSessionInput {\n        cancelUrl: URL!\n        clientMutationId: String\n        paymentMethodTypes: [StripePaymentMethodType!]!\n        priceId: String!\n        successUrl: URL!\n    }\n\n    type CreateCheckoutSessionPayload {\n        checkoutPageURL: URL!\n        clientMutationId: String\n    }\n\n    extend type Mutation {\n        createCheckoutSession(input: CreateCheckoutSessionInput!): CreateCheckoutSessionPayload\n    }\n"])));
var templateObject_1;
//# sourceMappingURL=types.js.map