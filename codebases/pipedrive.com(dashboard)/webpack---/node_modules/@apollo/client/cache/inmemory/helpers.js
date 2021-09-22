import { isReference, isField, DeepMerger, resultKeyNameFromField, shouldInclude, } from "../../utilities/index.js";
export var hasOwn = Object.prototype.hasOwnProperty;
export function getTypenameFromStoreObject(store, objectOrReference) {
    return isReference(objectOrReference)
        ? store.get(objectOrReference.__ref, "__typename")
        : objectOrReference && objectOrReference.__typename;
}
export var TypeOrFieldNameRegExp = /^[_a-z][_0-9a-z]*/i;
export function fieldNameFromStoreName(storeFieldName) {
    var match = storeFieldName.match(TypeOrFieldNameRegExp);
    return match ? match[0] : storeFieldName;
}
export function selectionSetMatchesResult(selectionSet, result, variables) {
    if (result && typeof result === "object") {
        return Array.isArray(result)
            ? result.every(function (item) { return selectionSetMatchesResult(selectionSet, item, variables); })
            : selectionSet.selections.every(function (field) {
                if (isField(field) && shouldInclude(field, variables)) {
                    var key = resultKeyNameFromField(field);
                    return hasOwn.call(result, key) &&
                        (!field.selectionSet ||
                            selectionSetMatchesResult(field.selectionSet, result[key], variables));
                }
                return true;
            });
    }
    return false;
}
export function storeValueIsStoreObject(value) {
    return value !== null &&
        typeof value === "object" &&
        !isReference(value) &&
        !Array.isArray(value);
}
export function isFieldValueToBeMerged(value) {
    var field = value && value.__field;
    return field && isField(field);
}
export function makeProcessedFieldsMerger() {
    return new DeepMerger(reconcileProcessedFields);
}
var reconcileProcessedFields = function (existingObject, incomingObject, property) {
    var existing = existingObject[property];
    var incoming = incomingObject[property];
    if (isFieldValueToBeMerged(existing)) {
        existing.__value = this.merge(existing.__value, isFieldValueToBeMerged(incoming)
            ? incoming.__value
            : incoming);
        return existing;
    }
    if (isFieldValueToBeMerged(incoming)) {
        incoming.__value = this.merge(existing, incoming.__value);
        return incoming;
    }
    return this.merge(existing, incoming);
};
//# sourceMappingURL=helpers.js.map