import React, { Component } from 'react';
import withRouter from 'react-router-dom/withRouter';
/**
 * Higher-order component (HOC) to wrap pages with onEnter (v3)
 */
function withOnEnter(onEnter = () => {}, BaseComponent) {
  class WithRouter extends Component {
    UNSAFE_componentWillMount() {
      onEnter(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.location !== this.props.location) {
        onEnter(nextProps);
      }
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  }
  // TODO: better hack?
  // We rely on fetchData static SSR method but this HOC
  // will hide it in a router
  // https://github.com/acdlite/flummox/issues/173
  if (BaseComponent.fetchData) {
    WithRouter.fetchData = BaseComponent.fetchData;
  }
  return withRouter(WithRouter);
}

export default withOnEnter;
