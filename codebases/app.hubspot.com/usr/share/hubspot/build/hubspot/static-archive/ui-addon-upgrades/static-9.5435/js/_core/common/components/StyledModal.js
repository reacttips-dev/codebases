'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import UIModal from 'UIComponents/dialog/UIModal';
export var StyledModal = styled(function (props) {
  var __ = props.hideBackground,
      ModalComponent = props.ModalComponent,
      rest = _objectWithoutProperties(props, ["hideBackground", "ModalComponent"]);

  return /*#__PURE__*/_jsx(ModalComponent, Object.assign({}, rest));
}).withConfig({
  displayName: "StyledModal",
  componentId: "sc-3yox4g-0"
})(["&&&{background-color:", ";}"], function (props) {
  return props.hideBackground ? 'transparent' : undefined;
});
StyledModal.defaultProps = {
  ModalComponent: UIModal
};