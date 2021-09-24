'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import { getSelectImageToEditAction } from 'FileManagerCore/actions/Files';
import { isAnimation } from 'FileManagerCore/utils/file';
import ScopedFeatureTooltip from 'FileManagerCore/components/permissions/ScopedFeatureTooltip';
import { getIsReadOnly } from 'FileManagerCore/selectors/Permissions';

var EditButton = /*#__PURE__*/function (_Component) {
  _inherits(EditButton, _Component);

  function EditButton() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, EditButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(EditButton)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleClick = function () {
      var _this$props = _this.props,
          file = _this$props.file,
          openedFrom = _this$props.openedFrom,
          dispatchSelectImageToEdit = _this$props.dispatchSelectImageToEdit;
      dispatchSelectImageToEdit(file, openedFrom);
    };

    return _this;
  }

  _createClass(EditButton, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          file = _this$props2.file,
          size = _this$props2.size,
          use = _this$props2.use,
          isReadOnly = _this$props2.isReadOnly;

      if (isAnimation(file)) {
        return null;
      }

      return /*#__PURE__*/_jsx(ScopedFeatureTooltip, {
        children: /*#__PURE__*/_jsx(UIButton, {
          onClick: this.handleClick,
          size: size,
          use: use,
          disabled: isReadOnly,
          "data-test-id": "edit-button",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "FileManagerCore.actions.cloneAndEdit"
          })
        })
      });
    }
  }]);

  return EditButton;
}(Component);

EditButton.propTypes = {
  file: PropTypes.instanceOf(Immutable.Map),
  openedFrom: PropTypes.string,
  size: UIButton.propTypes.size,
  use: UIButton.propTypes.use,
  isReadOnly: PropTypes.bool.isRequired,
  dispatchSelectImageToEdit: PropTypes.func.isRequired
};
EditButton.defaultProps = {
  use: 'tertiary-light',
  size: 'xs'
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    dispatchSelectImageToEdit: function dispatchSelectImageToEdit(file, selectedFrom) {
      return dispatch(getSelectImageToEditAction(file, selectedFrom));
    }
  };
};

var mapStateToProps = function mapStateToProps(state) {
  return {
    isReadOnly: getIsReadOnly(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditButton);