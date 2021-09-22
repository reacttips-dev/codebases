import { __extends } from "tslib";
import { isNonEmptyArray } from "../utilities/index.js";
export function isApolloError(err) {
    return err.hasOwnProperty('graphQLErrors');
}
var generateErrorMessage = function (err) {
    var message = '';
    if (isNonEmptyArray(err.graphQLErrors)) {
        err.graphQLErrors.forEach(function (graphQLError) {
            var errorMessage = graphQLError
                ? graphQLError.message
                : 'Error message not found.';
            message += errorMessage + "\n";
        });
    }
    if (err.networkError) {
        message += err.networkError.message + "\n";
    }
    message = message.replace(/\n$/, '');
    return message;
};
var ApolloError = (function (_super) {
    __extends(ApolloError, _super);
    function ApolloError(_a) {
        var graphQLErrors = _a.graphQLErrors, networkError = _a.networkError, errorMessage = _a.errorMessage, extraInfo = _a.extraInfo;
        var _this = _super.call(this, errorMessage) || this;
        _this.graphQLErrors = graphQLErrors || [];
        _this.networkError = networkError || null;
        _this.message = errorMessage || generateErrorMessage(_this);
        _this.extraInfo = extraInfo;
        _this.__proto__ = ApolloError.prototype;
        return _this;
    }
    return ApolloError;
}(Error));
export { ApolloError };
//# sourceMappingURL=index.js.map