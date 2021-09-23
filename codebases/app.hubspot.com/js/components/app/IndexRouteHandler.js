'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { replace } from 'react-router-redux';
import { connect } from 'react-redux';
import { PUBLISHING_VIEW, APP_SECTIONS } from '../../lib/constants';
import { getMostRecentIndexView } from '../../redux/selectors/users';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';

var mapStateToProps = function mapStateToProps(state) {
  return {
    mostRecentIndexView: getMostRecentIndexView(state)
  };
};

var mapDispatchToProps = {
  replace: replace
};

var IndexRouteHandler = /*#__PURE__*/function (_PureComponent) {
  _inherits(IndexRouteHandler, _PureComponent);

  function IndexRouteHandler() {
    _classCallCheck(this, IndexRouteHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(IndexRouteHandler).apply(this, arguments));
  }

  _createClass(IndexRouteHandler, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var pageRedirect = this.props.mostRecentIndexView === PUBLISHING_VIEW.calendar ? "/" + PUBLISHING_VIEW.calendar : "/" + APP_SECTIONS.publishing;
      this.props.replace(pageRedirect);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsxs("div", {
        className: "app-container",
        children: [/*#__PURE__*/_jsx(UILoadingSpinner, {
          label: "Loading",
          showLabel: false
        }), ";"]
      });
    }
  }]);

  return IndexRouteHandler;
}(PureComponent);

IndexRouteHandler.propTypes = {
  mostRecentIndexView: PropTypes.string.isRequired,
  replace: PropTypes.func.isRequired
};
export default connect(mapStateToProps, mapDispatchToProps)(IndexRouteHandler);