import React from 'react';

function asyncComponent(chunkName, getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;

    static loadComponent() {
      // The function we call before rendering
      return getComponent().then(Component => {
        AsyncComponent.Component = Component;
        return Component;
      });
    }

    mounted = false;

    state = {
      Component: AsyncComponent.Component,
    };

    UNSAFE_componentWillMount() {
      if (this.state.Component === null) {
        AsyncComponent.loadComponent().then(Component => {
          if (this.mounted) {
            this.setState({ Component });
          }
        });
      }
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const { Component } = this.state;

      if (Component !== null) {
        return <Component {...this.props} />;
      }
      return null; // or <div /> with a loading spinner, etc..
    }
  };
}

export default asyncComponent;
