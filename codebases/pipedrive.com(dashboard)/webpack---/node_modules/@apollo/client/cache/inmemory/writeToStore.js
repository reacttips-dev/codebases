import { __assign } from "tslib";
import { invariant, InvariantError } from 'ts-invariant';
import { equal } from '@wry/equality';
import { createFragmentMap, getFragmentFromSelection, getDefaultValues, getFragmentDefinitions, getOperationDefinition, getTypenameFromResult, makeReference, isField, resultKeyNameFromField, isReference, shouldInclude, hasDirectives, cloneDeep, } from "../../utilities/index.js";
import { makeProcessedFieldsMerger, fieldNameFromStoreName } from "./helpers.js";
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
        var dataId = _a.dataId, result = _a.result, selectionSet = _a.selectionSet, context = _a.context, _b = _a.out, out = _b === void 0 ? {
            shouldApplyMerges: false,
        } : _b;
        var policies = this.cache.policies;
        var _c = policies.identify(result, selectionSet, context.fragmentMap), id = _c[0], keyObject = _c[1];
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
        var mergedFields = Object.create(null);
        if (keyObject) {
            mergedFields = context.merge(mergedFields, keyObject);
        }
        var typename = (dataId && policies.rootTypenamesById[dataId]) ||
            getTypenameFromResult(result, selectionSet, context.fragmentMap) ||
            (dataId && context.store.get(dataId, "__typename"));
        if ("string" === typeof typename) {
            mergedFields.__typename = typename;
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
                    var incomingValue = _this.processFieldValue(value, selection, context, out);
                    if (policies.hasMergeFunction(typename, selection.name.value)) {
                        incomingValue = {
                            __field: selection,
                            __typename: typename,
                            __value: incomingValue,
                        };
                        out.shouldApplyMerges = true;
                    }
                    mergedFields = context.merge(mergedFields, (_a = {},
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
            if (out.shouldApplyMerges) {
                mergedFields = policies.applyMerges(entityRef_1, mergedFields, context);
            }
            if (process.env.NODE_ENV !== "production") {
                Object.keys(mergedFields).forEach(function (storeFieldName) {
                    var fieldName = fieldNameFromStoreName(storeFieldName);
                    if (!policies.hasMergeFunction(typename, fieldName)) {
                        warnAboutDataLoss(entityRef_1, mergedFields, storeFieldName, context.store);
                    }
                });
            }
            context.store.merge(dataId, mergedFields);
            return entityRef_1;
        }
        return mergedFields;
    };
    StoreWriter.prototype.processFieldValue = function (value, field, context, out) {
        var _this = this;
        if (!field.selectionSet || value === null) {
            return process.env.NODE_ENV === 'production' ? value : cloneDeep(value);
        }
        if (Array.isArray(value)) {
            return value.map(function (item) { return _this.processFieldValue(item, field, context, out); });
        }
        return this.processSelectionSet({
            result: value,
            selectionSet: field.selectionSet,
            context: context,
            out: out,
        });
    };
    return StoreWriter;
}());
export { StoreWriter };
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
            childTypenames.join(" and ") + " have IDs, or "
        : "") + "define a custom merge function for the " + typeDotName + " field, so InMemoryCache can safely merge these objects:\n\n  existing: " + JSON.stringify(existing).slice(0, 1000) + "\n  incoming: " + JSON.stringify(incoming).slice(0, 1000) + "\n\nFor more information about these options, please refer to the documentation:\n\n  * Ensuring entity objects have IDs: https://go.apollo.dev/c/generating-unique-identifiers\n  * Defining custom merge functions: https://go.apollo.dev/c/merging-non-normalized-objects\n");
}
//# sourceMappingURL=writeToStore.js.map