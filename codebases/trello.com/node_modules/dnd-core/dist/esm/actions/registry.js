export var ADD_SOURCE = 'dnd-core/ADD_SOURCE';
export var ADD_TARGET = 'dnd-core/ADD_TARGET';
export var REMOVE_SOURCE = 'dnd-core/REMOVE_SOURCE';
export var REMOVE_TARGET = 'dnd-core/REMOVE_TARGET';
export function addSource(sourceId) {
  return {
    type: ADD_SOURCE,
    payload: {
      sourceId: sourceId
    }
  };
}
export function addTarget(targetId) {
  return {
    type: ADD_TARGET,
    payload: {
      targetId: targetId
    }
  };
}
export function removeSource(sourceId) {
  return {
    type: REMOVE_SOURCE,
    payload: {
      sourceId: sourceId
    }
  };
}
export function removeTarget(targetId) {
  return {
    type: REMOVE_TARGET,
    payload: {
      targetId: targetId
    }
  };
}