'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Children } from 'react';
import I18n from 'I18n';

var childrenToArray = function childrenToArray(children) {
  var result = [];
  Children.forEach(children, function (child) {
    result.push(child);
  });
  return result;
};

var listOptions = {
  excessKey: true,
  exclusive: true,
  lastWordConnector: true,
  limit: true,
  locale: true,
  twoWordsConnector: true,
  wordsConnector: true
};
export default createReactClass({
  displayName: "FormattedList",
  propTypes: {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    excessKey: PropTypes.string,
    exclusive: PropTypes.bool,
    lastWordConnector: PropTypes.string,
    limit: PropTypes.number,
    locale: PropTypes.string,
    twoWordsConnector: PropTypes.string,
    wordsConnector: PropTypes.string
  },
  getPassThroughProps: function getPassThroughProps() {
    var _this = this;

    var passThrough = {};
    Object.keys(this.props).forEach(function (key) {
      if (!listOptions[key]) {
        passThrough[key] = _this.props[key];
      }
    });
    return passThrough;
  },
  render: function render() {
    return /*#__PURE__*/_jsx("span", Object.assign({}, this.getPassThroughProps(), {
      children: I18n.formatListArray(childrenToArray(this.props.children), this.props)
    }));
  }
});