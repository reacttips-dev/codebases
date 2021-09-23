'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import { OLAF, OZ_MEDIUM } from 'HubStyleTokens/colors';
import Controllable from '../decorators/Controllable';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import classNames from 'classnames';
import memoize from 'react-utils/memoize';
import SyntheticEvent from '../core/SyntheticEvent';
import UIButton from '../button/UIButton';
import UIIconCircle from '../icon/UIIconCircle';
import { uniqueId } from '../utils/underscore';
import lazyEval from '../utils/lazyEval';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
var FilePreviewLabel = styled.label.withConfig({
  displayName: "UIFileInput__FilePreviewLabel",
  componentId: "sc-19zj9vx-0"
})(["margin-left:12px;"]);
var getSuccessIcon = memoize(function () {
  return /*#__PURE__*/_jsx(UIIconCircle, {
    backgroundColor: OZ_MEDIUM,
    color: OLAF,
    name: "success",
    padding: 0.25,
    size: 9,
    verticalAlign: "text-top"
  });
});

var UIFileInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIFileInput, _PureComponent);

  function UIFileInput(props) {
    var _this;

    _classCallCheck(this, UIFileInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIFileInput).call(this, props));

    _this.handleClick = function (evt) {
      var onClick = _this.props.onClick;

      _this._inputEl.click();

      if (onClick) onClick(evt);
    };

    _this.handleFileSelect = function (evt) {
      var onChange = _this.props.onChange;
      onChange(SyntheticEvent(evt.target.files[0], evt));
    };

    _this._id = uniqueId('file-input-');
    return _this;
  }

  _createClass(UIFileInput, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          accept = _this$props.accept,
          buttonClassName = _this$props.buttonClassName,
          changeLabel = _this$props.changeLabel,
          className = _this$props.className,
          id = _this$props.id,
          __onChange = _this$props.onChange,
          __onClick = _this$props.onClick,
          selectLabel = _this$props.selectLabel,
          showFilePreview = _this$props.showFilePreview,
          use = _this$props.use,
          value = _this$props.value,
          rest = _objectWithoutProperties(_this$props, ["accept", "buttonClassName", "changeLabel", "className", "id", "onChange", "onClick", "selectLabel", "showFilePreview", "use", "value"]);

      var computedId = id || this._id;
      return /*#__PURE__*/_jsxs("span", {
        className: classNames('private-file-button', className),
        children: [/*#__PURE__*/_jsx(UIButton, {
          className: buttonClassName,
          onClick: this.handleClick,
          use: use,
          children: lazyEval(value ? changeLabel : selectLabel)
        }), showFilePreview && value && /*#__PURE__*/_jsxs(FilePreviewLabel, {
          htmlFor: computedId,
          children: [getSuccessIcon(), " ", value.name]
        }), /*#__PURE__*/_jsx("input", Object.assign({}, rest, {
          accept: accept.join(','),
          className: "hidden",
          id: computedId,
          onChange: this.handleFileSelect,
          ref: function ref(_ref) {
            return _this2._inputEl = _ref;
          },
          type: "file"
        }))]
      });
    }
  }]);

  return UIFileInput;
}(PureComponent);

UIFileInput.propTypes = {
  accept: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonClassName: PropTypes.string,
  changeLabel: createLazyPropType(PropTypes.node).isRequired,
  onChange: PropTypes.func,
  selectLabel: createLazyPropType(PropTypes.node).isRequired,
  showFilePreview: PropTypes.bool.isRequired,
  use: UIButton.propTypes.use,
  value: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.shape({
    name: PropTypes.string
  })])
};
UIFileInput.defaultProps = {
  accept: [],
  changeLabel: function changeLabel() {
    return I18n.text('salesUI.UIFileInput.defaultChangeLabel');
  },
  selectLabel: function selectLabel() {
    return I18n.text('salesUI.UIFileInput.defaultSelectLabel');
  },
  showFilePreview: true,
  use: 'secondary'
};
UIFileInput.displayName = 'UIFileInput';
export default Controllable(UIFileInput);