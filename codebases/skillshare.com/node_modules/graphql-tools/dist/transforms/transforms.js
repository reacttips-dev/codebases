var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
function applySchemaTransforms(originalSchema, transforms) {
    return transforms.reduce(function (schema, transform) {
        return transform.transformSchema ? transform.transformSchema(schema) : schema;
    }, originalSchema);
}
exports.applySchemaTransforms = applySchemaTransforms;
function applyRequestTransforms(originalRequest, transforms) {
    return transforms.reduce(function (request, transform) {
        return transform.transformRequest
            ? transform.transformRequest(request)
            : request;
    }, originalRequest);
}
exports.applyRequestTransforms = applyRequestTransforms;
function applyResultTransforms(originalResult, transforms) {
    return transforms.reduce(function (result, transform) {
        return transform.transformResult ? transform.transformResult(result) : result;
    }, originalResult);
}
exports.applyResultTransforms = applyResultTransforms;
function composeTransforms() {
    var transforms = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        transforms[_i] = arguments[_i];
    }
    var reverseTransforms = __spreadArrays(transforms).reverse();
    return {
        transformSchema: function (originalSchema) {
            return applySchemaTransforms(originalSchema, transforms);
        },
        transformRequest: function (originalRequest) {
            return applyRequestTransforms(originalRequest, reverseTransforms);
        },
        transformResult: function (result) {
            return applyResultTransforms(result, reverseTransforms);
        },
    };
}
exports.composeTransforms = composeTransforms;
//# sourceMappingURL=transforms.js.map