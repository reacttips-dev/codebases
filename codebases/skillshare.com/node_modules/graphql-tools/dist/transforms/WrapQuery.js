var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var WrapQuery = /** @class */ (function () {
    function WrapQuery(path, wrapper, extractor) {
        this.path = path;
        this.wrapper = wrapper;
        this.extractor = extractor;
    }
    WrapQuery.prototype.transformRequest = function (originalRequest) {
        var _a;
        var _this = this;
        var document = originalRequest.document;
        var fieldPath = [];
        var ourPath = JSON.stringify(this.path);
        var newDocument = graphql_1.visit(document, (_a = {},
            _a[graphql_1.Kind.FIELD] = {
                enter: function (node) {
                    fieldPath.push(node.name.value);
                    if (ourPath === JSON.stringify(fieldPath)) {
                        var wrapResult = _this.wrapper(node.selectionSet);
                        // Selection can be either a single selection or a selection set. If it's just one selection,
                        // let's wrap it in a selection set. Otherwise, keep it as is.
                        var selectionSet = wrapResult.kind === graphql_1.Kind.SELECTION_SET
                            ? wrapResult
                            : {
                                kind: graphql_1.Kind.SELECTION_SET,
                                selections: [wrapResult]
                            };
                        return __assign(__assign({}, node), { selectionSet: selectionSet });
                    }
                },
                leave: function (node) {
                    fieldPath.pop();
                }
            },
            _a));
        return __assign(__assign({}, originalRequest), { document: newDocument });
    };
    WrapQuery.prototype.transformResult = function (originalResult) {
        var rootData = originalResult.data;
        if (rootData) {
            var data = rootData;
            var path = __spreadArrays(this.path);
            while (path.length > 1) {
                var next = path.shift();
                if (data[next]) {
                    data = data[next];
                }
            }
            data[path[0]] = this.extractor(data[path[0]]);
        }
        return {
            data: rootData,
            errors: originalResult.errors
        };
    };
    return WrapQuery;
}());
exports.default = WrapQuery;
//# sourceMappingURL=WrapQuery.js.map