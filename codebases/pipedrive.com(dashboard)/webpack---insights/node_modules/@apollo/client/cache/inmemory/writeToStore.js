import { __assign } from "tslib";
import { invariant, InvariantError } from 'ts-invariant';
import { equal } from '@wry/equality';
import { createFragmentMap, getFragmentFromSelection, getDefaultValues, getFragmentDefinitions, getOperationDefinition, getTypenameFromResult, makeReference, isField, resultKeyNameFromField, isReference, shouldInclude, hasDirectives, cloneDeep, } from "../../utilities/index.js";
import { makeProcessedFieldsMerger, fieldNameFromStoreName, storeValueIsStoreObject } from "./helpers.js";
;
var StoreWriter = (function () {
    function StoreWriter(cache, reader) {
        this.cache = cache;
        this.reader = reader;
    }
    StoreWriter.prototype.writeToStore = function (_a) {
        var query = _a.query, result = _a.result, dataId = _a.dataId, store = _a.store, variables = _a.variables;
        var operationDefinition = getOperationDefinition(query);
        var merger = makeProcessedFieldsMerger();
        variables = __assign(__assign({}, getDefaultValues(operationDefinition)), variables);
        var ref = this.processSelectionSet({
            result: result || Object.create(null),
            dataId: dataId,
            selectionSet: operationDefinition.selectionSet,
            mergeTree: { map: new Map },
            context: {
                store: store,
                written: Object.create(null),
                merge: function (existing, incoming) {
                    return merger.merge(existing, incoming);
                },
                variables: variables,
                varString: JSON.stringify(variables),
                fragmentMap: createFragmentMap(getFragmentDefinitions(query)),
            },
        });
        if (!isReference(ref)) {
            throw process.env.NODE_ENV === "production" ? new InvariantError(7) : new InvariantError("Could not identify object " + JSON.stringify(result));
        }
        store.retain(ref.__ref);
        return ref;
    };
    StoreWriter.prototype.processSelectionSet = function (_a) {
        var _this = this;
        var dataId = _a.dataId, result = _a.result, selectionSet = _a.selectionSet, context = _a.context, mergeTree = _a.mergeTree;
        var policies = this.cache.policies;
        var _b = policies.identify(result, selectionSet, context.fragmentMap), id = _b[0], keyObject = _b[1];
        dataId = dataId || id;
        if ("string" === typeof dataId) {
            var sets = context.written[dataId] || (context.written[dataId] = []);
            var ref = makeReference(dataId);
            if (sets.indexOf(selectionSet) >= 0)
                return ref;
            sets.push(selectionSet);
            if (this.reader && this.reader.isFresh(result, ref, selectionSet, context)) {
                return ref;
            }
        }
        var incomingFields = Object.create(null);
        if (keyObject) {
            incomingFields = context.merge(incomingFields, keyObject);
        }
        var typename = (dataId && policies.rootTypenamesById[dataId]) ||
            getTypenameFromResult(result, selectionSet, context.fragmentMap) ||
            (dataId && context.store.get(dataId, "__typename"));
        if ("string" === typeof typename) {
            incomingFields.__typename = typename;
        }
        var workSet = new Set(selectionSet.selections);
        workSet.forEach(function (selection) {
            var _a;
            if (!shouldInclude(selection, context.variables))
                return;
            if (isField(selection)) {
                var resultFieldKey = resultKeyNameFromField(selection);
                var value = result[resultFieldKey];
                if (typeof value !== 'undefined') {
                    var storeFieldName = policies.getStoreFieldName({
                        typename: typename,
                        fieldName: selection.name.value,
                        field: selection,
                        variables: context.variables,
                    });
                    var childTree = getChildMergeTree(mergeTree, storeFieldName);
                    var incomingValue = _this.processFieldValue(value, selection, context, childTree);
                    var childTypename = selection.selectionSet
                        && context.store.getFieldValue(incomingValue, "__typename")
                        || void 0;
                    var merge = policies.getMergeFunction(typename, selection.name.value, childTypename);
                    if (merge) {
                        childTree.info = {
                            field: selection,
                            typename: typename,
                            merge: merge,
                        };
                    }
                    else {
                        maybeRecycleChildMergeTree(mergeTree, storeFieldName);
                    }
                    incomingFields = context.merge(incomingFields, (_a = {},
                        _a[storeFieldName] = incomingValue,
                        _a));
                }
                else if (policies.usingPossibleTypes &&
                    !hasDirectives(["defer", "client"], selection)) {
                    throw process.env.NODE_ENV === "production" ? new InvariantError(8) : new InvariantError("Missing field '" + resultFieldKey + "' in " + JSON.stringify(result, null, 2).substring(0, 100));
                }
            }
            else {
                var fragment = getFragmentFromSelection(selection, context.fragmentMap);
                if (fragment &&
                    policies.fragmentMatches(fragment, typename, result, context.variables)) {
                    fragment.selectionSet.selections.forEach(workSet.add, workSet);
                }
            }
        });
        if ("string" === typeof dataId) {
            var entityRef_1 = makeReference(dataId);
            if (mergeTree.map.size) {
                incomingFields = this.applyMerges(mergeTree, entityRef_1, incomingFields, context);
            }
            if (process.env.NODE_ENV !== "production") {
                var hasSelectionSet_1 = function (storeFieldName) {
                    return fieldsWithSelectionSets_1.has(fieldNameFromStoreName(storeFieldName));
                };
                var fieldsWithSelectionSets_1 = new Set();
                workSet.forEach(function (selection) {
                    if (isField(selection) && selection.selectionSet) {
                        fieldsWithSelectionSets_1.add(selection.name.value);
                    }
                });
                var hasMergeFunction_1 = function (storeFieldName) {
                    var childTree = mergeTree.map.get(storeFieldName);
                    return Boolean(childTree && childTree.info && childTree.info.merge);
                };
                Object.keys(incomingFields).forEach(function (storeFieldName) {
                    if (hasSelectionSet_1(storeFieldName) &&
                        !hasMergeFunction_1(storeFieldName)) {
                        warnAboutDataLoss(entityRef_1, incomingFields, storeFieldName, context.store);
                    }
                });
            }
            context.store.merge(dataId, incomingFields);
            return entityRef_1;
        }
        return incomingFields;
    };
    StoreWriter.prototype.processFieldValue = function (value, field, context, mergeTree) {
        var _this = this;
        if (!field.selectionSet || value === null) {
            return process.env.NODE_ENV === 'production' ? value : cloneDeep(value);
        }
        if (Array.isArray(value)) {
            return value.map(function (item, i) {
                var value = _this.processFieldValue(item, field, context, getChildMergeTree(mergeTree, i));
                maybeRecycleChildMergeTree(mergeTree, i);
                return value;
            });
        }
        return this.processSelectionSet({
            result: value,
            selectionSet: field.selectionSet,
            context: context,
            mergeTree: mergeTree,
        });
    };
    StoreWriter.prototype.applyMerges = function (mergeTree, existing, incoming, context, getStorageArgs) {
        var _a;
        var _this = this;
        if (mergeTree.map.size && !isReference(incoming)) {
            var e_1 = (!Array.isArray(incoming) &&
                (isReference(existing) || storeValueIsStoreObject(existing))) ? existing : void 0;
            var i_1 = incoming;
            if (e_1 && !getStorageArgs) {
                getStorageArgs = [isReference(e_1) ? e_1.__ref : e_1];
            }
            var changedFields_1;
            var getValue_1 = function (from, name) {
                return Array.isArray(from)
                    ? (typeof name === "number" ? from[name] : void 0)
                    : context.store.getFieldValue(from, String(name));
            };
            mergeTree.map.forEach(function (childTree, storeFieldName) {
                if (getStorageArgs) {
                    getStorageArgs.push(storeFieldName);
                }
                var eVal = getValue_1(e_1, storeFieldName);
                var iVal = getValue_1(i_1, storeFieldName);
                var aVal = _this.applyMerges(childTree, eVal, iVal, context, getStorageArgs);
                if (aVal !== iVal) {
                    changedFields_1 = changedFields_1 || new Map;
                    changedFields_1.set(storeFieldName, aVal);
                }
                if (getStorageArgs) {
                    invariant(getStorageArgs.pop() === storeFieldName);
                }
            });
            if (changedFields_1) {
                incoming = (Array.isArray(i_1) ? i_1.slice(0) : __assign({}, i_1));
                changedFields_1.forEach(function (value, name) {
                    incoming[name] = value;
                });
            }
        }
        if (mergeTree.info) {
            return this.cache.policies.runMergeFunction(existing, incoming, mergeTree.info, context, getStorageArgs && (_a = context.store).getStorage.apply(_a, getStorageArgs));
        }
        return incoming;
    };
    return StoreWriter;
}());
export { StoreWriter };
var emptyMergeTreePool = [];
function getChildMergeTree(_a, name) {
    var map = _a.map;
    if (!map.has(name)) {
        map.set(name, emptyMergeTreePool.pop() || { map: new Map });
    }
    return map.get(name);
}
function maybeRecycleChildMergeTree(_a, name) {
    var map = _a.map;
    var childTree = map.get(name);
    if (childTree &&
        !childTree.info &&
        !childTree.map.size) {
        emptyMergeTreePool.push(childTree);
        map.delete(name);
    }
}
var warnings = new Set();
function warnAboutDataLoss(existingRef, incomingObj, storeFieldName, store) {
    var getChild = function (objOrRef) {
        var child = store.getFieldValue(objOrRef, storeFieldName);
        return typeof child === "object" && child;
    };
    var existing = getChild(existingRef);
    if (!existing)
        return;
    var incoming = getChild(incomingObj);
    if (!incoming)
        return;
    if (isReference(existing))
        return;
    if (equal(existing, incoming))
        return;
    if (Object.keys(existing).every(function (key) { return store.getFieldValue(incoming, key) !== void 0; })) {
        return;
    }
    var parentType = store.getFieldValue(existingRef, "__typename") ||
        store.getFieldValue(incomingObj, "__typename");
    var fieldName = fieldNameFromStoreName(storeFieldName);
    var typeDotName = parentType + "." + fieldName;
    if (warnings.has(typeDotName))
        return;
    warnings.add(typeDotName);
    var childTypenames = [];
    if (!Array.isArray(existing) &&
        !Array.isArray(incoming)) {
        [existing, incoming].forEach(function (child) {
            var typename = store.getFieldValue(child, "__typename");
            if (typeof typename === "string" &&
                !childTypenames.includes(typename)) {
                childTypenames.push(typename);
            }
        });
    }
    process.env.NODE_ENV === "production" || invariant.warn("Cache data may be lost when replacing the " + fieldName + " field of a " + parentType + " object.\n\nTo address this problem (which is not a bug in Apollo Client), " + (childTypenames.length
        ? "either ensure all objects of type " +
            childTypenames.join(" and ") + " have an ID or a custom merge function, or "
        : "") + "define a custom merge function for the " + typeDotName + " field, so InMemoryCache can safely merge these objects:\n\n  existing: " + JSON.stringify(existing).slice(0, 1000) + "\n  incoming: " + JSON.stringify(incoming).slice(0, 1000) + "\n\nFor more information about these options, please refer to the documentation:\n\n  * Ensuring entity objects have IDs: https://go.apollo.dev/c/generating-unique-identifiers\n  * Defining custom merge functions: https://go.apollo.dev/c/merging-non-normalized-objects\n");
}
//# sourceMappingURL=writeToStore.js.map