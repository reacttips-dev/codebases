import type { EventEntity } from '../schema/EventEntity';
import assignWith from 'lodash-es/assignWith';
import { isObservableArray, isObservable } from 'mobx';

export function updateEventProperties<T extends EventEntity>(
    targetEvent: T,
    newEvent: any,
    forceOverrideAllProperties: boolean = false
) {
    // When there is existing event we don't want to assign the existing properties
    // with the `undefined` properties of `eventToAdd` hence we create a new object without `undefined`
    // properties and then assign those to existing event.
    // We also extract the key out before updating the properties as we don't want existing event Key to
    // be overriden
    const { Key: _, ...newEventWithoutKey } = newEvent;
    const eventToUpdatePropertiesFrom = forceOverrideAllProperties
        ? newEventWithoutKey
        : getEventWithoutUndefinedProperties(newEventWithoutKey);

    if (!isObservable(targetEvent)) {
        // if the event being updated isn't observable, no point in merging, just assign
        assignWith(targetEvent, eventToUpdatePropertiesFrom, undefined);
    } else {
        mergeAndAssignUndefinedValues(targetEvent, eventToUpdatePropertiesFrom);
    }
}

function getEventWithoutUndefinedProperties<T extends EventEntity>(event: T): T {
    return Object.keys(event).reduce<T>((eventWithoutUndefinedProps, prop) => {
        if (event[prop] !== undefined) {
            eventWithoutUndefinedProps[prop] = event[prop];
        }

        return eventWithoutUndefinedProps;
    }, {} as T);
}

/**
 * deep recursive merge of objects that still sets values from newObject
 * that are present but undefined (otherwise we would just use lodash merge function)
 * see https://stackoverflow.com/q/41872065
 * @param targetObject object to write data into
 * @param newObject object to pull values from
 */
function mergeAndAssignUndefinedValues(targetObject: object, newObject: object) {
    if (targetObject === newObject) {
        // if the object references are the same, no changes necessary
        return undefined;
    }

    const targetObjectIsArray = Array.isArray(targetObject) || isObservableArray(targetObject);
    const newObjectIsArray = Array.isArray(newObject) || isObservableArray(newObject);

    if (targetObjectIsArray || newObjectIsArray) {
        // assignWith doesn't handle arrays well
        const targetObjectArray = targetObject as unknown[];
        const newObjectArray = newObject as unknown[];
        if (!targetObject && newObjectIsArray) {
            // if object is empty, but we try assigning to an empty array, keep it as null/undefined instead of firing updates
            return newObjectArray.length > 0 ? newObjectArray : targetObjectArray;
        } else if (!newObject && targetObjectIsArray) {
            // remove all objects from array but keep array instance the same instead of setting to undefined
            if (targetObjectArray.length > 0) {
                targetObjectArray.splice(0);
            }
            return targetObjectArray;
        } else if (targetObjectIsArray && newObjectIsArray) {
            if (
                targetObjectArray.length === newObjectArray.length &&
                targetObjectArray.length > 0
            ) {
                // same length, so merge all objects in the array
                for (let i = 0; i < targetObjectArray.length; i++) {
                    if (isObject(targetObjectArray[i])) {
                        assignWith(
                            targetObjectArray[i],
                            newObjectArray[i],
                            mergeAndAssignUndefinedValues
                        );
                    } else {
                        // if the property isn't an object, assignWith(...) will fail. Just assign value directly, object reference
                        // can't change if it's not an object.
                        targetObjectArray[i] = newObjectArray[i];
                    }
                }
            } else if (targetObjectArray.length !== newObjectArray.length) {
                // arrays are different lengths, which means there's going to be some updates from the array changing
                targetObjectArray.splice(0);
                targetObjectArray.push(...newObjectArray);
            }
            return targetObjectArray;
        } else {
            // being assigned to new type, so just set it to newObject
            return newObjectArray;
        }
    } else if (isObject(targetObject) && isObject(newObject)) {
        if (!isObservable(targetObject)) {
            // if the target object isn't observable, no purpose in trying to do a recursive merge
            // need to replace whole object in order for the change to be noticed by MobX
            return undefined;
        }

        return assignWith(targetObject, newObject, mergeAndAssignUndefinedValues);
    }
    // if not an array or object, use assignWith's default behavior of just replacing the value by returning undefined
    return undefined;
}

function isObject(object: any) {
    return Object.prototype.toString.call(object) === '[object Object]';
}
