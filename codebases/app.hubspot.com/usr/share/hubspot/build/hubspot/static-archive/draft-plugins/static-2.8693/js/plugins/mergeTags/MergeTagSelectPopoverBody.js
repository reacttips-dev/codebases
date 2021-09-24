'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { createRef } from 'react';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UILink from 'UIComponents/link/UILink';
import UITypeahead from 'UIComponents/typeahead/UITypeahead';
import UITextInput from 'UIComponents/input/UITextInput';
import UIPopoverBody from 'UIComponents/tooltip/UIPopoverBody';
import { MergeTagTypes } from 'draft-plugins/lib/mergeTagConstants';
export default createReactClass({
  displayName: "MergeTagSelectPopoverBody",
  propTypes: {
    selectedType: PropTypes.string.isRequired,
    tokens: PropTypes.array.isRequired,
    placeholderToken: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onPlaceholderTokenChange: PropTypes.func.isRequired
  },
  focus: function focus() {
    if (this._typeaheadRef.current) {
      this._typeaheadRef.current.focus();
    }
  },
  renderLabel: function renderLabel() {
    var selectedType = this.props.selectedType;

    if (selectedType !== MergeTagTypes.PLACEHOLDER) {
      return null;
    }

    return /*#__PURE__*/_jsx("div", {
      className: "m-top-3",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "draftPlugins.mergeTagGroupPlugin.form.placeholderTokenLabel"
      })
    });
  },
  renderBody: function renderBody() {
    var _this$props = this.props,
        selectedType = _this$props.selectedType,
        tokens = _this$props.tokens,
        placeholderToken = _this$props.placeholderToken,
        _onChange = _this$props.onChange,
        onPlaceholderTokenChange = _this$props.onPlaceholderTokenChange;

    if (selectedType === MergeTagTypes.PLACEHOLDER) {
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(UITextInput, {
          className: "m-bottom-4",
          value: placeholderToken,
          onChange: onPlaceholderTokenChange
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.mergeTagGroupPlugin.form.placeholderTokenDescription",
          useGap: true
        }), /*#__PURE__*/_jsx(UILink, {
          external: true,
          href: "https://knowledge.hubspot.com/conversations/how-do-i-add-personalization-tokens-to-a-template-or-snippet#placeholder",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "draftPlugins.mergeTagGroupPlugin.form.learnMore"
          })
        })]
      });
    }

    return /*#__PURE__*/_jsx(UITypeahead, {
      options: tokens,
      placeholder: I18n.text('draftPlugins.mergeTagGroupPlugin.form.searchPlaceholder', selectedType),
      onChange: function onChange(_ref) {
        var value = _ref.target.value;
        return _onChange(value);
      },
      inputRef: this._typeaheadRef,
      resultsClassName: "selenium-token-results"
    });
  },
  render: function render() {
    var selectedType = this.props.selectedType;
    this._typeaheadRef = this._typeaheadRef || /*#__PURE__*/createRef();
    var className = 'merge-tag-popover-body' + (selectedType === MergeTagTypes.PLACEHOLDER ? " p-x-6" : "");
    return /*#__PURE__*/_jsx(UIPopoverBody, {
      children: /*#__PURE__*/_jsx(UIFormControl, {
        className: className,
        "aria-label": "Merge tag popover body",
        label: this.renderLabel(),
        children: this.renderBody()
      })
    });
  }
});