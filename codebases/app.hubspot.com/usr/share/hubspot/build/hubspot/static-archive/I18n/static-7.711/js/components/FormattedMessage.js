'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import { classNameFix, commonPropTypes, I18nCommonMixin, getPassThroughProps } from './utils';
export default createReactClass({
  displayName: "FormattedMessage",
  mixins: [I18nCommonMixin],
  propTypes: commonPropTypes,
  render: function render() {
    var __message = this.props.message;
    var props = classNameFix(getPassThroughProps(this.props));
    return /*#__PURE__*/_jsx("i18n-string", Object.assign({}, props, {
      children: this._getValue(true)
    }));
  }
});