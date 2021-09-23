'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import { Set as ImmutableSet, is } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import I18n from 'I18n';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UISelect from 'UIComponents/input/UISelect';
import UIFormControl from 'UIComponents/form/UIFormControl';
import { getSubscriptionTypes } from '../api';
import { formatTypeOption } from 'ui-gdpr-components/utils/subscriptionSelectUtils';

var formatSubscriptions = function formatSubscriptions(subscriptions) {
  return subscriptions.map(function (sub) {
    return {
      text: formatTypeOption(sub.category, sub.channel, sub.name),
      value: sub.id
    };
  });
};

var filterSubmissions = function filterSubmissions(subscriptionDefinitions, _ref) {
  var hideInternal = _ref.hideInternal,
      showInactive = _ref.showInactive,
      hideIds = _ref.hideIds,
      customFilter = _ref.customFilter;
  return subscriptionDefinitions.filter(function (sub) {
    return !(hideInternal && sub.internal) && !(!showInactive && !sub.active) && !hideIds.has(sub.id);
  }).filter(customFilter || function () {
    return true;
  });
};

var LegacySubscriptionTypeSelect = /*#__PURE__*/function (_Component) {
  _inherits(LegacySubscriptionTypeSelect, _Component);

  function LegacySubscriptionTypeSelect(props) {
    var _this;

    _classCallCheck(this, LegacySubscriptionTypeSelect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LegacySubscriptionTypeSelect).call(this, props));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_this));
    _this.onSelectAllChange = _this.onSelectAllChange.bind(_assertThisInitialized(_this));
    _this.getDropdownFooter = _this.getDropdownFooter.bind(_assertThisInitialized(_this));
    _this.state = {
      subscriptions: [],
      options: [],
      isLoading: true,
      hideIds: ImmutableSet(props.hideIds),
      value: null
    };
    return _this;
  }

  _createClass(LegacySubscriptionTypeSelect, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      var _this2 = this;

      var _this$props = this.props,
          _this$props$hideInter = _this$props.hideInternal,
          hideInternal = _this$props$hideInter === void 0 ? false : _this$props$hideInter,
          _this$props$showInact = _this$props.showInactive,
          showInactive = _this$props$showInact === void 0 ? false : _this$props$showInact,
          customFilter = _this$props.customFilter;
      var hideIds = this.state.hideIds;
      getSubscriptionTypes(hideInternal).then(function (_ref2) {
        var subscriptionDefinitions = _ref2.subscriptionDefinitions;
        var subscriptions = filterSubmissions(subscriptionDefinitions, {
          hideInternal: hideInternal,
          showInactive: showInactive,
          hideIds: hideIds,
          customFilter: customFilter
        });

        _this2.setState({
          subscriptions: subscriptions,
          options: formatSubscriptions(subscriptions),
          isLoading: false
        });
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var _this$state = this.state,
          oldHideIds = _this$state.hideIds,
          options = _this$state.options,
          value = _this$state.value;
      var newHideIds = ImmutableSet(this.props.hideIds);
      var newState = {};

      if (!is(oldHideIds, newHideIds)) {
        newState.options = options.filter(function (sub) {
          return sub.value === value || !newHideIds.has(sub.value);
        });
        newState.hideIds = newHideIds;
      }

      if (newState.hasOwnProperty('options')) {
        this.setState(Object.assign({}, newState));
      }
    }
  }, {
    key: "getDropdownFooter",
    value: function getDropdownFooter() {
      var options = this.state.options;
      var _this$props2 = this.props,
          value = _this$props2.value,
          _this$props2$showSele = _this$props2.showSelectAllFooter,
          showSelectAllFooter = _this$props2$showSele === void 0 ? false : _this$props2$showSele,
          _this$props2$customFo = _this$props2.customFooter,
          customFooter = _this$props2$customFo === void 0 ? null : _this$props2$customFo,
          multi = _this$props2.multi;
      var hasSelectedValue = value && (!multi || value.length > 0);
      var hasSelectAll = multi && showSelectAllFooter;
      var isSelectAllChecked = hasSelectAll && hasSelectedValue && options.every(function (option) {
        return value.includes(option.value);
      });

      if (customFooter) {
        return customFooter;
      } else if (hasSelectAll) {
        return /*#__PURE__*/_jsx(UICheckbox, {
          checked: isSelectAllChecked,
          indeterminate: hasSelectedValue,
          onChange: this.onSelectAllChange,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "labels.subscriptionTypeSelectAll"
          })
        });
      } else {
        return null;
      }
    } // eslint-disable-next-line consistent-return

  }, {
    key: "onChange",
    value: function onChange(_ref3) {
      var value = _ref3.target.value;
      var subscriptions = this.state.subscriptions;
      var _this$props3 = this.props,
          onChange = _this$props3.onChange,
          multi = _this$props3.multi;
      var result = [];
      var selectedIds = [].concat(value);
      selectedIds.forEach(function (id) {
        var selection = subscriptions.filter(function (sub) {
          return sub.id === id;
        })[0];

        if (selection && !selection.category) {
          selection.category = I18n.text('options.marketing');
        }

        if (selection && !selection.channel) {
          selection.channel = I18n.text('options.email');
        }

        result.push(selection);
      });
      this.setState({
        value: value
      });

      if (onChange) {
        if (multi) {
          onChange(result || []);
        } else {
          onChange(result[0] || null);
        }
      }
    }
  }, {
    key: "onSelectAllChange",
    value: function onSelectAllChange(_ref4) {
      var checked = _ref4.target.checked;
      var options = this.state.options;

      if (checked) {
        this.onChange(SyntheticEvent(options.map(function (option) {
          return option.value;
        })));
      } else {
        this.onChange(SyntheticEvent([]));
      }
    }
  }, {
    key: "render",
    value: function render() {
      // eslint-disable-next-line no-unused-vars
      var _this$props4 = this.props,
          value = _this$props4.value,
          propsWithoutValue = _objectWithoutProperties(_this$props4, ["value"]);

      var _this$state2 = this.state,
          options = _this$state2.options,
          isLoading = _this$state2.isLoading;
      return /*#__PURE__*/_jsx(UIFormControl, Object.assign({
        label: I18n.text('labels.subscriptionType')
      }, this.props.formControlProps, {
        children: /*#__PURE__*/_jsx(UISelect, Object.assign({
          placeholder: I18n.text('placeholders.subscriptionType')
        }, isLoading ? propsWithoutValue : this.props, {
          options: options,
          isLoading: isLoading,
          onChange: this.onChange,
          dropdownClassName: "untruncate",
          "data-selenium-test": "gdpr-sub-type-select",
          dropdownFooter: this.getDropdownFooter()
        }))
      }));
    }
  }]);

  return LegacySubscriptionTypeSelect;
}(Component);

export default LegacySubscriptionTypeSelect;