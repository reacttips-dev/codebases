/**
 * connectToRouter
 *
 * Your router is a data source! It provides params, query strings that your components
 * might need to know about to properly display information. This is a higher order
 * component that gives you access to getting router properties into your component without
 * having to cloud up your component logic with router stuff.
 *
 * If the router updates its location, it automatically triggers an update on the component tree,
 * so this automatically propagates state change to child components.
 *
 * Example usage:
 *
 * class CourseDescriptionPage extends React.Component {
 *   static propTypes = {
 *     courseSlug: React.PropTypes.string,
 *   }
 *   ...
 * }
 *
 * module.exports = connectToRouter(router => {
 *   courseSlug: router.params.slug
 * })(CourseDescriptionPage)
 */
import React from 'react';

import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

export default function connectToRouter(getPropsFromRouterParams) {
  return function (Component) {
    const componentName = Component.displayName || Component.name;
    class RouterConnector extends React.Component {
      static displayName = componentName + 'RouterConnector';

      static contextTypes = {
        router: React.PropTypes.object,
      };

      render() {
        return React.createElement(
          Component,
          Object.assign({}, this.props, getPropsFromRouterParams(this.context.router, this.props || {}))
        );
      }
    }
    hoistNonReactStatics(RouterConnector, Component);

    return RouterConnector;
  };
}
