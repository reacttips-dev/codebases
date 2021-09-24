'use es6';

import * as KeyCodes from 'UIComponents/constants/KeyCodes';
import invariant from 'react-utils/invariant';
var UndoRedoMixin = {
  UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
    invariant(typeof this.handleRedo === 'function', 'UndoRedoMixin: component must define a handleRedo method');
    invariant(typeof this.handleUndo === 'function', 'UndoRedoMixin: component must define a handleUndo method');
  },
  componentDidMount: function componentDidMount() {
    document.addEventListener('keydown', this.dispatchRedoOrUndo);
  },
  componentWillUnmount: function componentWillUnmount() {
    document.removeEventListener('keydown', this.dispatchRedoOrUndo);
  },
  dispatchRedoOrUndo: function dispatchRedoOrUndo(event) {
    var ctrlKey = event.ctrlKey,
        metaKey = event.metaKey,
        shiftKey = event.shiftKey,
        which = event.which;

    if (!ctrlKey && !metaKey) {
      return;
    }

    if (ctrlKey && which === KeyCodes.Y || metaKey && shiftKey && which === KeyCodes.Z) {
      event.preventDefault();
      this.handleRedo();
      return;
    }

    if (ctrlKey && which === KeyCodes.Z || metaKey && which === KeyCodes.Z) {
      event.preventDefault();
      this.handleUndo();
    }
  }
};
export default UndoRedoMixin;