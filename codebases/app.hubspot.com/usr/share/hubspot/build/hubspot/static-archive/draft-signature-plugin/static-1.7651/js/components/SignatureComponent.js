'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import emptyFunction from 'react-utils/emptyFunction';
import AtomicFocus from 'draft-plugins/components/AtomicFocus';
import SignatureIframeWrapper from 'EmailSignatureEditor/components/SignatureIframeWrapper';
var PARENT_CLASS = 'signature-component';

var SignatureComponent = function SignatureComponent(_ref) {
  var _ref$allowEditing = _ref.allowEditing,
      allowEditing = _ref$allowEditing === void 0 ? false : _ref$allowEditing,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === void 0 ? emptyFunction : _ref$onClick,
      AsyncFileManager = _ref.AsyncFileManager;
  var EditableSignature = createReactClass({
    displayName: "EditableSignature",
    propTypes: {
      block: PropTypes.object.isRequired,
      selected: PropTypes.bool.isRequired
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
      var _this$props = this.props,
          block = _this$props.block,
          selected = _this$props.selected;

      if (!block.equals(nextProps.block) || selected !== nextProps.selected) {
        return true;
      }

      return false;
    },
    handleClick: function handleClick(e) {
      var selected = this.props.selected;

      if (!selected && !allowEditing) {
        e.preventDefault();
        e.stopPropagation();
      }

      onClick();
    },
    render: function render() {
      var block = this.props.block;
      var signature = block.getData().get('signature');
      return /*#__PURE__*/_jsx("div", {
        className: PARENT_CLASS,
        children: /*#__PURE__*/_jsx(SignatureIframeWrapper, {
          signature: signature,
          allowEditing: allowEditing,
          onClick: this.handleClick,
          AsyncFileManager: AsyncFileManager
        })
      });
    }
  });
  return AtomicFocus(PARENT_CLASS)(EditableSignature);
};

export default SignatureComponent;