import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

/**
 * A HOC to detect the window's scroll direction and position
 * then pass the information to the child component
 * Check 'SmartScrollWrapper' for example
 */
const withScrollInfo = ({ delta = 5, updateInterval = 100 }): $TSFixMe => {
  return (Component: $TSFixMe) => {
    const componentName = Component.displayName || Component.name || 'Component';
    class HOC extends React.Component {
      static displayName = `withScrollInfo(${componentName})`;

      static propTypes = {
        delta: PropTypes.number,
      };

      state = {
        isScrollingDown: true,
        lastScrollPosition: 0,
        didScroll: false,
      };

      componentDidMount() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isMounted' does not exist on type 'HOC'... Remove this comment to see the full error message
        this._isMounted = true;
        window.addEventListener('scroll', this.handleScroll);
      }

      componentWillUnmount() {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isMounted' does not exist on type 'HOC'... Remove this comment to see the full error message
        this._isMounted = false;
        window.removeEventListener('scroll', this.handleScroll);
        this.handleScroll.cancel();
      }

      handleScroll = _.throttle(() => {
        // Such a hack: http://stackoverflow.com/questions/16618785/ie8-alternative-to-window-scrolly
        const newScrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        const { lastScrollPosition } = this.state;
        // Only update state if the scroll has reached delta.
        const scrollDifference = Math.abs(lastScrollPosition - newScrollPosition);
        // Prioritize prop delta over HOC delta.
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'delta' does not exist on type 'Readonly<... Remove this comment to see the full error message
        const deltaLocal = this.props.delta || delta;
        if (scrollDifference + 1 < deltaLocal) return;

        const isScrollingDown = lastScrollPosition <= newScrollPosition;
        // @ts-expect-error ts-migrate(2339) FIXME: Property '_isMounted' does not exist on type 'HOC'... Remove this comment to see the full error message
        if (this._isMounted) {
          this.setState({
            didScroll: true,
            isScrollingDown,
            lastScrollPosition: newScrollPosition,
          });
        }
      }, updateInterval);

      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    hoistNonReactStatics(HOC, Component);
    return HOC;
  };
};

export default withScrollInfo;
