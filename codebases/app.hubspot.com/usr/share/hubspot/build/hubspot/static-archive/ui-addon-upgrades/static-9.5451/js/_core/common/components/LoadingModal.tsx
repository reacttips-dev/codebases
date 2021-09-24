import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UINanoProgress from 'UIComponents/progress/UINanoProgress';
import UIAbstractProgress from 'UIComponents/progress/UIAbstractProgress';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
var LoadingSpinnerContainer = styled.div.withConfig({
  displayName: "LoadingModal__LoadingSpinnerContainer",
  componentId: "sc-1eydw50-0"
})(["height:420px;"]);
var LoadingContentContainer = styled.div.withConfig({
  displayName: "LoadingModal__LoadingContentContainer",
  componentId: "sc-1eydw50-1"
})(["height:500px;position:relative;"]);
var ModalContent = styled.div.withConfig({
  displayName: "LoadingModal__ModalContent",
  componentId: "sc-1eydw50-2"
})(["height:", ";width:", ";"], function (_ref) {
  var height = _ref.height;
  return height;
}, function (_ref2) {
  var width = _ref2.width;
  return width;
});
/* stylelint-disable hubspot-dev/no-private-classes */

var StyledLoadingModal = styled(function (props) {
  var __ = props.showParentModal,
      rest = _objectWithoutProperties(props, ["showParentModal"]);

  return /*#__PURE__*/_jsx(UIModal, Object.assign({}, rest));
}).withConfig({
  displayName: "LoadingModal__StyledLoadingModal",
  componentId: "sc-1eydw50-3"
})(["&&& .private-modal{background-color:", ";}"], function (_ref3) {
  var showParentModal = _ref3.showParentModal;
  return showParentModal ? undefined : 'transparent';
});
export var LoadingModal = function LoadingModal(_ref4) {
  var frameReady = _ref4.frameReady,
      children = _ref4.children,
      modalWidth = _ref4.modalWidth,
      modalHeight = _ref4.modalHeight,
      modalUse = _ref4.modalUse,
      showParentModal = _ref4.showParentModal,
      wrapContentSize = _ref4.wrapContentSize;
  var readyContent = wrapContentSize ? /*#__PURE__*/_jsx(ModalContent, {
    width: modalWidth,
    height: modalHeight,
    children: children
  }) : children;
  return /*#__PURE__*/_jsx(StyledLoadingModal, {
    width: modalWidth,
    use: modalUse,
    "data-test-id": "upgrade-loading-modal",
    showParentModal: showParentModal,
    children: frameReady ? readyContent : /*#__PURE__*/_jsxs(LoadingContentContainer, {
      children: [/*#__PURE__*/_jsx(UIAbstractProgress, {
        autoStart: true,
        render: function render(_ref5) {
          var value = _ref5.value;
          return /*#__PURE__*/_jsx(UINanoProgress, {
            value: value,
            animateOnComplete: true
          });
        }
      }), /*#__PURE__*/_jsx(UIDialogBody, {
        children: /*#__PURE__*/_jsx(LoadingSpinnerContainer, {
          children: /*#__PURE__*/_jsx(UILoadingSpinner, {
            size: "small",
            grow: true
          })
        })
      })]
    })
  });
};
LoadingModal.defaultProps = {
  modalWidth: 900,
  modalHeight: 500,
  modalUse: 'conversational',
  showParentModal: true,
  wrapContentSize: true
};