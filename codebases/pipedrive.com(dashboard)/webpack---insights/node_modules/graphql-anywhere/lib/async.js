"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var apollo_utilities_1 = require("apollo-utilities");
var graphql_1 = require("./graphql");
function graphql(resolver, document, rootValue, contextValue, variableValues, execOptions) {
    if (execOptions === void 0) { execOptions = {}; }
    var mainDefinition = apollo_utilities_1.getMainDefinition(document);
    var fragments = apollo_utilities_1.getFragmentDefinitions(document);
    var fragmentMap = apollo_utilities_1.createFragmentMap(fragments);
    var resultMapper = execOptions.resultMapper;
    var fragmentMatcher = execOptions.fragmentMatcher || (function () { return true; });
    var execContext = {
        fragmentMap: fragmentMap,
        contextValue: contextValue,
        variableValues: variableValues,
        resultMapper: resultMapper,
        resolver: resolver,
        fragmentMatcher: fragmentMatcher,
    };
    return executeSelectionSet(mainDefinition.selectionSet, rootValue, execContext);
}
exports.graphql = graphql;
function executeSelectionSet(selectionSet, rootValue, execContext) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var fragmentMap, contextValue, variables, result, execute;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fragmentMap = execContext.fragmentMap, contextValue = execContext.contextValue, variables = execContext.variableValues;
                    result = {};
                    execute = function (selection) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var fieldResult, resultFieldKey, fragment, typeCondition, fragmentResult;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!apollo_utilities_1.shouldInclude(selection, variables)) {
                                        return [2];
                                    }
                                    if (!apollo_utilities_1.isField(selection)) return [3, 2];
                                    return [4, executeField(selection, rootValue, execContext)];
                                case 1:
                                    fieldResult = _a.sent();
                                    resultFieldKey = apollo_utilities_1.resultKeyNameFromField(selection);
                                    if (fieldResult !== undefined) {
                                        if (result[resultFieldKey] === undefined) {
                                            result[resultFieldKey] = fieldResult;
                                        }
                                        else {
                                            graphql_1.merge(result[resultFieldKey], fieldResult);
                                        }
                                    }
                                    return [2];
                                case 2:
                                    if (apollo_utilities_1.isInlineFragment(selection)) {
                                        fragment = selection;
                                    }
                                    else {
                                        fragment = fragmentMap[selection.name.value];
                                        if (!fragment) {
                                            throw new Error("No fragment named " + selection.name.value);
                                        }
                                    }
                                    typeCondition = fragment.typeCondition.name.value;
                                    if (!execContext.fragmentMatcher(rootValue, typeCondition, contextValue)) return [3, 4];
                                    return [4, executeSelectionSet(fragment.selectionSet, rootValue, execContext)];
                                case 3:
                                    fragmentResult = _a.sent();
                                    graphql_1.merge(result, fragmentResult);
                                    _a.label = 4;
                                case 4: return [2];
                            }
                        });
                    }); };
                    return [4, Promise.all(selectionSet.selections.map(execute))];
                case 1:
                    _a.sent();
                    if (execContext.resultMapper) {
                        return [2, execContext.resultMapper(result, rootValue)];
                    }
                    return [2, result];
            }
        });
    });
}
function executeField(field, rootValue, execContext) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var variables, contextValue, resolver, fieldName, args, info, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    variables = execContext.variableValues, contextValue = execContext.contextValue, resolver = execContext.resolver;
                    fieldName = field.name.value;
                    args = apollo_utilities_1.argumentsObjectFromField(field, variables);
                    info = {
                        isLeaf: !field.selectionSet,
                        resultKey: apollo_utilities_1.resultKeyNameFromField(field),
                        directives: apollo_utilities_1.getDirectiveInfoFromField(field, variables),
                        field: field,
                    };
                    return [4, resolver(fieldName, rootValue, args, contextValue, info)];
                case 1:
                    result = _a.sent();
                    if (!field.selectionSet) {
                        return [2, result];
                    }
                    if (result == null) {
                        return [2, result];
                    }
                    if (Array.isArray(result)) {
                        return [2, executeSubSelectedArray(field, result, execContext)];
                    }
                    return [2, executeSelectionSet(field.selectionSet, result, execContext)];
            }
        });
    });
}
function executeSubSelectedArray(field, result, execContext) {
    return Promise.all(result.map(function (item) {
        if (item === null) {
            return null;
        }
        if (Array.isArray(item)) {
            return executeSubSelectedArray(field, item, execContext);
        }
        return executeSelectionSet(field.selectionSet, item, execContext);
    }));
}
//# sourceMappingURL=async.js.map