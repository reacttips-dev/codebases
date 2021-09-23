// https://reacttraining.com/react-router/web/guides/scroll-restoration
// In react-router-v3 this was a middleware: https://www.npmjs.com/package/react-router-scroll
import React, { Component } from 'react';
import { withRouter } from 'react-router';

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const prevLocation = prevProps.location;
    if (location !== prevLocation) {
      // special case of navigating between episodes of the same station
      if (
        location.pathname.indexOf('/episodes/') !== -1 &&
        vanitySlugMatches(location, prevLocation)
      ) {
        return;
      }
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);

function vanitySlugMatches(locationA, locationB) {
  return locationA.pathname.split('/')[1] === locationB.pathname.split('/')[1];
}
