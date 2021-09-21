import Promise from 'bluebird';
import React, { Component } from 'react';
import withRouter from 'react-router-dom/withRouter';
import { windowUndefined } from '../helpers/serverRenderingUtils';
/**
 * Higher-order component (HOC) to wrap pages with onEnter (v3)
 * Similar to withOnEnter but leverages static fetchData function which
 * allows async operations to block server side rendering until complete
 * TODO: move all withOnEnter to this component?
 */
export default function withBlockingOnEnter(
  onEnter = () => Promise.resolve(),
  BaseComponent
) {
  class WithRouter extends Component {
    // Static SSR data function
    static fetchData(props) {
      return onEnter(props).then(
        () =>
          // delegate to wrapped static SSR function if it exists
          BaseComponent.fetchData && BaseComponent.fetchData(props)
      );
    }

    UNSAFE_componentWillMount() {
      // only run this when fetchData would not have been called
      !windowUndefined() && onEnter(this.props);
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
  return withRouter(WithRouter);
}
