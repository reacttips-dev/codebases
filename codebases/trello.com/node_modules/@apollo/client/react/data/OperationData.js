import { equal } from '@wry/equality';
import { invariant } from 'ts-invariant';
import { parser, operationName } from "../parser/index.js";
var OperationData = (function () {
    function OperationData(options, context) {
        this.isMounted = false;
        this.previousOptions = {};
        this.context = {};
        this.options = {};
        this.options = options || {};
        this.context = context || {};
    }
    OperationData.prototype.getOptions = function () {
        return this.options;
    };
    OperationData.prototype.setOptions = function (newOptions, storePrevious) {
        if (storePrevious === void 0) { storePrevious = false; }
        if (storePrevious && !equal(this.options, newOptions)) {
            this.previousOptions = this.options;
        }
        this.options = newOptions;
    };
    OperationData.prototype.unmount = function () {
        this.isMounted = false;
    };
    OperationData.prototype.refreshClient = function () {
        var client = (this.options && this.options.client) ||
            (this.context && this.context.client);
        process.env.NODE_ENV === "production" ? invariant(!!client, 29) : invariant(!!client, 'Could not find "client" in the context or passed in as an option. ' +
            'Wrap the root component in an <ApolloProvider>, or pass an ' +
            'ApolloClient instance in via options.');
        var isNew = false;
        if (client !== this.client) {
            isNew = true;
            this.client = client;
            this.cleanup();
        }
        return {
            client: this.client,
            isNew: isNew
        };
    };
    OperationData.prototype.verifyDocumentType = function (document, type) {
        var operation = parser(document);
        var requiredOperationName = operationName(type);
        var usedOperationName = operationName(operation.type);
        process.env.NODE_ENV === "production" ? invariant(operation.type === type, 30) : invariant(operation.type === type, "Running a " + requiredOperationName + " requires a graphql " +
            (requiredOperationName + ", but a " + usedOperationName + " was used instead."));
    };
    return OperationData;
}());
export { OperationData };
//# sourceMappingURL=OperationData.js.map