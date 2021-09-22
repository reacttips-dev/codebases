import { parser, DocumentType } from './parser';
import { query } from './query-hoc';
import { mutation } from './mutation-hoc';
import { subscribe } from './subscription-hoc';
export function graphql(document, operationOptions) {
    if (operationOptions === void 0) { operationOptions = {}; }
    switch (parser(document).type) {
        case DocumentType.Mutation:
            return mutation(document, operationOptions);
        case DocumentType.Subscription:
            return subscribe(document, operationOptions);
        case DocumentType.Query:
        default:
            return query(document, operationOptions);
    }
}
//# sourceMappingURL=graphql.js.map