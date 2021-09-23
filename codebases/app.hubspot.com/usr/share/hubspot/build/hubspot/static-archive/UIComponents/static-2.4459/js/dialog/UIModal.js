'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef, useContext } from 'react';
import { hidden } from '../utils/propTypes/decorators';
import { MODAL_USE_CLASSES } from './DialogConstants';
import AbstractModal from './internal/AbstractModal';
import ModalTransition from './internal/ModalTransition';
import UIModalDialog from './UIModalDialog';
import { createPlacementWarning, DropdownContext } from '../context/DropdownContext';
var UIModal = /*#__PURE__*/forwardRef(function (props, ref) {
  var _useContext = useContext(DropdownContext),
      shouldLogModalWarning = _useContext.shouldLogModalWarning;

  var _createPlacementWarning = createPlacementWarning(UIModal.displayName);

  if (shouldLogModalWarning) {
    _createPlacementWarning();
  }

  return /*#__PURE__*/_jsx(AbstractModal, Object.assign({}, props, {
    componentName: "UIModal",
    Transition: ModalTransition,
    ref: ref
  }));
});
UIModal.propTypes = Object.assign({}, UIModalDialog.propTypes, {
  ModalDialog: hidden(PropTypes.func),
  onCloseComplete: PropTypes.func,
  onCloseStart: PropTypes.func,
  onOpenComplete: PropTypes.func,
  onOpenStart: PropTypes.func,
  use: PropTypes.oneOf(Object.keys(MODAL_USE_CLASSES)).isRequired,
  _contextual: PropTypes.bool,
  rootNode: AbstractModal.propTypes.rootNode
});
UIModal.defaultProps = Object.assign({}, UIModalDialog.defaultProps, {
  ModalDialog: UIModalDialog,
  _contextual: false
});
UIModal.displayName = 'UIModal';
export default UIModal;