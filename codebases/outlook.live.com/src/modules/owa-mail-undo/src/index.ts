import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "UndoAction" */ './lazyIndex'));

export let lazyUndo = new LazyAction(lazyModule, m => m.undo);

export {
    addActionToUndoStack,
    clearLastUndoableAction,
    hasUndoableAction,
    dismissLastUndoRequest,
} from './actions/undoActions';
export { default as doesTableSupportUndo } from './util/doesTableSupportUndo';
