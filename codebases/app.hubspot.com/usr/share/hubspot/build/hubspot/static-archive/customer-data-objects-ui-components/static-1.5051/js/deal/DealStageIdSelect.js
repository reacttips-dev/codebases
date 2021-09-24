'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { ALL_CLOSED_WON_VALUE } from 'customer-data-objects/deal/DealStageIdValues';
import I18n from 'I18n';
import map from 'transmute/map';
import once from 'transmute/once';
import pipe from 'transmute/pipe';
import translate from 'transmute/translate';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { iterableOf, mapContains } from 'react-immutable-proptypes';
import sortBy from 'transmute/sortBy';
import toJS from 'transmute/toJS';
import UISearchableSelectInput from 'UIComponents/input/UISearchableSelectInput';
import UISelect from 'UIComponents/input/UISelect';
import valueSeq from 'transmute/valueSeq';
import * as FormatDealStageOption from 'customer-data-objects/deal/FormatDealStageOption';
var getAllClosedWonOption = once(function () {
  return {
    text: I18n.text('customerDataObjectsUiComponents.DealStageIdSelect.allClosedWon'),
    value: ALL_CLOSED_WON_VALUE
  };
});
var dealStageToOptionTranslation = {
  text: FormatDealStageOption.format,
  value: 'value'
};
var dealStagesToOptions = pipe(valueSeq, sortBy(function (stage) {
  return stage.get('displayOrder');
}), sortBy(function (stage) {
  return stage.get('pipelineLabel');
}), map(function (stage) {
  return translate(dealStageToOptionTranslation, stage);
}), toJS);
var propTypes = {
  dealStages: iterableOf(mapContains({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired),
  includeAllClosedWon: PropTypes.bool,
  isInline: PropTypes.bool,
  multi: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.arrayOf(PropTypes.string.isRequired).isRequired])
};
var defaultProps = {
  includeAllClosedWon: false,
  menuWidth: 'auto',
  multi: false
};

var DealStageIdSelect = /*#__PURE__*/function (_PureComponent) {
  _inherits(DealStageIdSelect, _PureComponent);

  function DealStageIdSelect() {
    var _this;

    _classCallCheck(this, DealStageIdSelect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DealStageIdSelect).call(this));
    _this.state = {
      options: []
    };
    return _this;
  }

  _createClass(DealStageIdSelect, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      this.syncOptions(this.props);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.dealStages !== this.props.dealStages) {
        this.syncOptions(nextProps);
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      // eslint-disable-next-line react/no-find-dom-node
      var node = findDOMNode(this);

      if (node) {
        node.focus();
      }
    }
  }, {
    key: "syncOptions",
    value: function syncOptions(_ref) {
      var dealStages = _ref.dealStages,
          includeAllClosedWon = _ref.includeAllClosedWon;

      if (!dealStages) {
        this.setState({
          options: []
        });
        return;
      }

      var options = dealStagesToOptions(dealStages);

      if (includeAllClosedWon) {
        options.unshift(getAllClosedWonOption());
      }

      this.setState({
        options: options
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          dealStages = _this$props.dealStages,
          multi = _this$props.multi,
          readOnly = _this$props.readOnly,
          disabled = _this$props.disabled,
          value = _this$props.value,
          isInline = _this$props.isInline,
          __includeAllClosedWon = _this$props.includeAllClosedWon,
          rest = _objectWithoutProperties(_this$props, ["dealStages", "multi", "readOnly", "disabled", "value", "isInline", "includeAllClosedWon"]);

      var options = this.state.options;
      var SelectComponent = multi ? UISelect : UISearchableSelectInput;
      var inlineStyleProps = isInline && {
        buttonUse: 'transparent',
        className: 'p-left-0'
      };
      return /*#__PURE__*/_jsx(SelectComponent, Object.assign({}, rest, {}, inlineStyleProps, {
        multi: multi || undefined,
        options: options,
        readOnly: readOnly,
        disabled: disabled || !dealStages // if `dealStages` is undefined it might not be loaded yet so we don't
        // want to pass a value that will trip the invalid state
        ,
        value: dealStages ? value : null
      }));
    }
  }]);

  return DealStageIdSelect;
}(PureComponent);

export { DealStageIdSelect as default };
DealStageIdSelect.propTypes = propTypes;
DealStageIdSelect.defaultProps = defaultProps;