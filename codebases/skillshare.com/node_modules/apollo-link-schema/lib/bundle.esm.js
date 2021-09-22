import { __extends } from 'tslib';
import { Observable, ApolloLink } from 'apollo-link';
import { execute } from 'graphql/execution/execute';

var SchemaLink = (function (_super) {
    __extends(SchemaLink, _super);
    function SchemaLink(_a) {
        var schema = _a.schema, rootValue = _a.rootValue, context = _a.context;
        var _this = _super.call(this) || this;
        _this.schema = schema;
        _this.rootValue = rootValue;
        _this.context = context;
        return _this;
    }
    SchemaLink.prototype.request = function (operation) {
        var _this = this;
        return new Observable(function (observer) {
            Promise.resolve(execute(_this.schema, operation.query, _this.rootValue, typeof _this.context === 'function'
                ? _this.context(operation)
                : _this.context, operation.variables, operation.operationName))
                .then(function (data) {
                if (!observer.closed) {
                    observer.next(data);
                    observer.complete();
                }
            })
                .catch(function (error) {
                if (!observer.closed) {
                    observer.error(error);
                }
            });
        });
    };
    return SchemaLink;
}(ApolloLink));

export default SchemaLink;
export { SchemaLink };
//# sourceMappingURL=bundle.esm.js.map
