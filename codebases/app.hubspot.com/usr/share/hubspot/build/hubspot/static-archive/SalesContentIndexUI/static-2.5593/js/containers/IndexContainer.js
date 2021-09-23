'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import 'redux';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import IndexPage from 'SalesContentIndexUI/components/IndexPage';
export default createReactClass({
  displayName: "IndexContainer",
  propTypes: {
    children: PropTypes.any,
    defaultTab: PropTypes.string,
    location: PropTypes.object.isRequired,
    onMount: PropTypes.func,
    rootPath: PropTypes.string.isRequired,
    tabs: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  childContextTypes: {
    updateRouterWithQuery: PropTypes.func,
    location: PropTypes.object
  },
  getDefaultProps: function getDefaultProps() {
    return {
      rootPath: '/'
    };
  },
  getChildContext: function getChildContext() {
    return {
      location: this.props.location,
      updateRouterWithQuery: this.updateRouterWithQuery
    };
  },
  componentDidMount: function componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount();
    }
  },
  updateRouterWithQuery: function updateRouterWithQuery(updatedQuery) {
    var _this$props = this.props,
        rootPath = _this$props.rootPath,
        query = _this$props.location.query;
    this.context.router.push({
      pathname: rootPath,
      query: Object.assign({}, query, {}, updatedQuery)
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsx(IndexPage, Object.assign({}, this.props));
  }
});