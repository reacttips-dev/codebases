'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import { isValidElement, cloneElement } from 'react';
import I18n from 'I18n';
import { commonPropTypes, I18nCommonMixin, getPassThroughProps, interpolateToArray } from './utils';
export default createReactClass({
  displayName: "FormattedReactMessage",
  mixins: [I18nCommonMixin],
  propTypes: commonPropTypes,
  getEscapedParam: function getEscapedParam(param, key, index) {
    if (! /*#__PURE__*/isValidElement(key)) {
      return /*#__PURE__*/_jsx("span", {
        dangerouslySetInnerHTML: {
          __html: I18n.formatParam(param, key)
        }
      }, param + "-" + index);
    }

    return /*#__PURE__*/cloneElement(key, {
      key: param + "-" + index,
      ref: key.ref
    });
  },
  renderFormattedMessage: function renderFormattedMessage() {
    return interpolateToArray(this.props.message, this.props.options, this.getEscapedParam);
  },
  render: function render() {
    var props = getPassThroughProps(this.props);
    return /*#__PURE__*/_jsx("span", Object.assign({}, props, {
      children: this.renderFormattedMessage()
    }));
  }
});