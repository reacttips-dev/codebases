import { DragDropManagerImpl } from './classes/DragDropManagerImpl';
import { createStore } from 'redux';
import { reduce } from './reducers';
import { DragDropMonitorImpl } from './classes/DragDropMonitorImpl';
import { HandlerRegistryImpl } from './classes/HandlerRegistryImpl';
export function createDragDropManager(backendFactory) {
  var globalContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  var backendOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var debugMode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var store = makeStoreInstance(debugMode);
  var monitor = new DragDropMonitorImpl(store, new HandlerRegistryImpl(store));
  var manager = new DragDropManagerImpl(store, monitor);
  var backend = backendFactory(manager, globalContext, backendOptions);
  manager.receiveBackend(backend);
  return manager;
}

function makeStoreInstance(debugMode) {
  // TODO: if we ever make a react-native version of this,
  // we'll need to consider how to pull off dev-tooling
  var reduxDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;
  return createStore(reduce, debugMode && reduxDevTools && reduxDevTools({
    name: 'dnd-core',
    instanceId: 'dnd-core'
  }));
}