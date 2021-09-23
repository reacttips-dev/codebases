'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UISelect from 'UIComponents/input/UISelect';
import UITruncateString from 'UIComponents/text/UITruncateString';

var toI18nText = function toI18nText(name) {
  return I18n.text("draftPlugins.linkPlugin." + name);
};

var promptTextCreator = function promptTextCreator() {
  return toI18nText('promptText');
};

var isNotCustomOption = function isNotCustomOption(option) {
  return !(option.className && option.className === 'Select-create-option-placeholder');
};

var isOptionUnique = function isOptionUnique(_ref) {
  var options = _ref.options,
      valueKey = _ref.valueKey;
  // options added via the "add option" functionality do not have a "help" field
  // this allows "add option" for links that are substrings of user-added options
  var pageOptionsOnly = options.filter(isNotCustomOption); // override default to make sure that promptText isn't added to possible options

  if (pageOptionsOnly.length === 1 && pageOptionsOnly[0][valueKey] === promptTextCreator()) {
    return true;
  } else if (pageOptionsOnly.length >= 1) {
    return false;
  }

  return true;
};

var RenderValue = function RenderValue(_ref2) {
  var value = _ref2.value;
  return /*#__PURE__*/_jsx(UITruncateString, {
    className: "width-95",
    children: value
  });
};

RenderValue.propTypes = {
  value: PropTypes.string
};
export default createReactClass({
  displayName: "LinkFormPagesSelector",
  propTypes: {
    onChange: PropTypes.func.isRequired,
    pages: PropTypes.array.isRequired,
    showText: PropTypes.bool,
    text: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  },
  getDefaultProps: function getDefaultProps() {
    return {
      pages: [],
      showText: true
    };
  },
  getInitialState: function getInitialState() {
    return {
      inputValue: this.props.url
    };
  },
  handleInputChange: function handleInputChange(_ref3) {
    var target = _ref3.target;
    this.setState({
      inputValue: target.value || ''
    });
  },
  handlePagesChange: function handlePagesChange(_ref4) {
    var target = _ref4.target;
    var onChange = this.props.onChange;
    var value = target.value;
    var result = {
      url: value || ''
    };

    if (this.previousSelectionFromPagesOrBlank()) {
      result.text = this.updateTextForPagesChange(value) || '';
    }

    this.setState({
      inputValue: result.url
    });
    onChange(result);
  },
  previousSelectionFromPagesOrBlank: function previousSelectionFromPagesOrBlank() {
    var _this$props = this.props,
        pages = _this$props.pages,
        showText = _this$props.showText,
        text = _this$props.text,
        url = _this$props.url;
    return showText && (!text || pages.find(function (p) {
      return p.value === url && p.text === text;
    }));
  },
  updateTextForPagesChange: function updateTextForPagesChange(value) {
    var pages = this.props.pages;

    if (!value) {
      return '';
    }

    var matchedPage = pages.find(function (p) {
      return p.value === value;
    });

    if (matchedPage && matchedPage.text) {
      return matchedPage.text;
    }

    return value;
  },
  render: function render() {
    var pages = this.props.pages;
    return /*#__PURE__*/_jsx(UIFormControl, {
      label: toI18nText('url'),
      children: /*#__PURE__*/_jsx(UISelect, {
        allowCreate: true,
        anchorType: "input",
        clearable: true,
        inputValue: this.state.inputValue,
        isOptionUnique: isOptionUnique,
        onChange: this.handlePagesChange,
        onInputValueChange: this.handleInputChange,
        options: pages,
        placeholder: toI18nText('yourPagesPlaceholder'),
        promptTextCreator: promptTextCreator,
        valueRenderer: RenderValue
      })
    });
  }
});