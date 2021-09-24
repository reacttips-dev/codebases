'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, Component } from 'react';
import PropTypes from 'prop-types';
import CloneModal from 'SalesContentIndexUI/components/clone/CloneModal';
import FolderNavModal from 'SalesContentIndexUI/components/folderNav/FolderNavModal';
import FolderModal from 'SalesContentIndexUI/components/folder/FolderModal';
export var SalesContentAppContext = /*#__PURE__*/createContext({
  openCloneModal: function openCloneModal() {},
  closeCloneModal: function closeCloneModal() {},
  openMoveModal: function openMoveModal() {},
  closeMoveModal: function closeMoveModal() {},
  openRenameFolderModal: function openRenameFolderModal() {},
  closeRenameFolderModal: function closeRenameFolderModal() {}
});

var SalesContentAppContainer = /*#__PURE__*/function (_Component) {
  _inherits(SalesContentAppContainer, _Component);

  function SalesContentAppContainer(props, context) {
    var _this;

    _classCallCheck(this, SalesContentAppContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SalesContentAppContainer).call(this, props, context));
    _this.state = {
      cloneModalProps: null,
      moveModalProps: null,
      renameFolderModalProps: null
    };
    return _this;
  }

  _createClass(SalesContentAppContainer, [{
    key: "getContext",
    value: function getContext() {
      var _this2 = this;

      return {
        closeCloneModal: function closeCloneModal() {
          return _this2.setState({
            cloneModalProps: null
          });
        },
        openCloneModal: function openCloneModal(cloneModalProps) {
          return _this2.setState({
            cloneModalProps: cloneModalProps
          });
        },
        closeMoveModal: function closeMoveModal() {
          return _this2.setState({
            moveModalProps: null
          });
        },
        openMoveModal: function openMoveModal(moveModalProps) {
          return _this2.setState({
            moveModalProps: moveModalProps
          });
        },
        closeRenameFolderModal: function closeRenameFolderModal() {
          return _this2.setState({
            renameFolderModalProps: null
          });
        },
        openRenameFolderModal: function openRenameFolderModal(renameFolderModalProps) {
          return _this2.setState({
            renameFolderModalProps: renameFolderModalProps
          });
        }
      };
    }
  }, {
    key: "renderCloneModal",
    value: function renderCloneModal() {
      if (this.state.cloneModalProps) {
        return /*#__PURE__*/_jsx(CloneModal, Object.assign({}, this.state.cloneModalProps));
      }

      return null;
    }
  }, {
    key: "renderMoveModal",
    value: function renderMoveModal() {
      if (this.state.moveModalProps) {
        return /*#__PURE__*/_jsx(FolderNavModal, Object.assign({}, this.state.moveModalProps));
      }

      return null;
    }
  }, {
    key: "renderRenameFolderModal",
    value: function renderRenameFolderModal() {
      if (this.state.renameFolderModalProps) {
        return /*#__PURE__*/_jsx(FolderModal, Object.assign({}, this.state.renameFolderModalProps));
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsxs(SalesContentAppContext.Provider, {
        value: this.getContext(),
        children: [this.props.children, this.renderCloneModal(), this.renderMoveModal(), this.renderRenameFolderModal()]
      });
    }
  }]);

  return SalesContentAppContainer;
}(Component);

SalesContentAppContainer.propTypes = {
  children: PropTypes.node.isRequired
};
export default SalesContentAppContainer;