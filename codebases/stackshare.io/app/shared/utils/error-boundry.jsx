import React from 'react';
import FullPageError from '../library/error/full-page-error';
import InlineError from '../library/error/inline-error';
import * as Sentry from '@sentry/browser';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {error: null, errorInfo: null, eventId: null};
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    if (process.env.NODE_ENV !== 'development') {
      Sentry.withScope(scope => {
        scope.setExtras(errorInfo);
        const eventId = Sentry.captureException(error);
        this.setState({eventId});
      });
    }
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      // eslint-disable-next-line react/prop-types
      if (this.props.inlineError) {
        return (
          <div>
            <InlineError state={this.state} />
          </div>
        );
      } else {
        return (
          <div>
            <FullPageError state={this.state} />
          </div>
        );
      }
    }
    // Normally, just render children
    // eslint-disable-next-line react/prop-types
    return this.props.children;
  }
}
