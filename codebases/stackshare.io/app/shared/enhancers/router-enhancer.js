import React from 'react';
import PropTypes from 'prop-types';

export const RouteContext = React.createContext();
export const NavigationContext = React.createContext();
export const __REWRITE__ = '__REWRITE__';
export const __REDIRECT__ = '__REDIRECT__';

function getRouteContext(routes, path, props, prevRouteContext = null) {
  const matchingRoute = Object.keys(routes).find(route => new RegExp(route).test(path));
  if (matchingRoute) {
    const res = routes[matchingRoute](
      new RegExp(matchingRoute).exec(path),
      props,
      prevRouteContext
    );
    if (res[__REDIRECT__]) {
      if (history) {
        history.replaceState({}, '', res[__REDIRECT__]);
      }
      return getRouteContext(routes, res[__REDIRECT__], props, prevRouteContext);
    } else if (res[__REWRITE__]) {
      if (history) {
        history.replaceState({}, '', res[__REWRITE__]);
      }
      return res;
    } else {
      return res;
    }
  }
  return null;
}

class Router extends React.Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    initialPath: PropTypes.string.isRequired,
    routeProps: PropTypes.object,
    children: PropTypes.any
  };

  state = {
    routeContext: getRouteContext(this.props.routes, this.props.initialPath, this.props.routeProps)
  };

  handlePopState = () => {
    const routeContext = getRouteContext(
      this.props.routes,
      document.location.pathname,
      this.props.routeProps,
      this.state.routeContext
    );
    this.setState({routeContext});
  };

  handleNavigate = (path, replace = false) => {
    const routeContext = getRouteContext(
      this.props.routes,
      path,
      this.props.routeProps,
      this.state.routeContext
    );
    if (replace) {
      history.replaceState({}, '', path);
    } else {
      history.pushState({}, '', path);
      if (routeContext.documentTitle) {
        document.title = routeContext.documentTitle;
      }
    }
    this.setState({routeContext});
  };

  componentDidMount() {
    window.addEventListener('popstate', this.handlePopState, false);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState, false);
  }

  render() {
    return (
      <NavigationContext.Provider value={this.handleNavigate}>
        <RouteContext.Provider value={this.state.routeContext}>
          {this.props.children}
        </RouteContext.Provider>
      </NavigationContext.Provider>
    );
  }
}

export const withRouter = (routes, mapPropsToInitialPath) => Component => {
  // eslint-disable-next-line react/display-name
  return props => (
    <Router routeProps={props} routes={routes} initialPath={mapPropsToInitialPath(props)}>
      <Component {...props} />
    </Router>
  );
};

// eslint-disable-next-line react/display-name
export const withRouteContext = Component => props => (
  <RouteContext.Consumer>
    {routeContext => <Component {...props} routeContext={routeContext} />}
  </RouteContext.Consumer>
);

// eslint-disable-next-line react/display-name
export const withNavigate = Component => props => (
  <NavigationContext.Consumer>
    {navigate => <Component {...props} navigate={navigate} />}
  </NavigationContext.Consumer>
);

export const GO_BACK = () => history.back();
