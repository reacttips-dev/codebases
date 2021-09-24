'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import formatName from '../utils/formatName';
import formatFriendlyName from '../utils/formatFriendlyName';
import TitleTypes from '../constants/TitleTypes';
export default createReactClass({
  displayName: "FormattedName",
  propTypes: {
    email: PropTypes.string,
    familyName: PropTypes.string,
    givenName: PropTypes.string,
    isFriendly: PropTypes.bool,
    name: PropTypes.string,
    options: PropTypes.object,
    titleType: PropTypes.oneOf(Object.keys(TitleTypes).map(function (title) {
      return TitleTypes[title];
    }))
  },
  getDefaultProps: function getDefaultProps() {
    return {
      isFriendly: false
    };
  },
  render: function render() {
    var _this$props = this.props,
        email = _this$props.email,
        familyName = _this$props.familyName,
        givenName = _this$props.givenName,
        isFriendly = _this$props.isFriendly,
        name = _this$props.name,
        options = _this$props.options,
        titleType = _this$props.titleType;
    var formattedName = isFriendly ? formatFriendlyName({
      givenName: givenName,
      familyName: familyName,
      email: email
    }, options) : formatName({
      firstName: givenName,
      lastName: familyName,
      email: email,
      name: name,
      titleType: titleType
    }, options);
    return /*#__PURE__*/_jsx("span", {
      children: formattedName
    });
  }
});