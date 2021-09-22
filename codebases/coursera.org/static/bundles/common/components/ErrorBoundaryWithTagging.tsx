import React from 'react';
import type { ErrorInfo } from 'react';
import { getShouldLoadRaven } from 'js/lib/sentry';
import Retracked from 'js/lib/retracked';
import raven from 'raven-js';
import PropTypes from 'prop-types';

type Props = {
  componentName: string;
  errorComponent: JSX.Element;
};

export default class ErrorBoundaryWithTagging extends React.Component<Props> {
  state = {
    hasError: false,
  };

  static contextTypes = {
    _eventData: PropTypes.object,
    _withTrackingData: PropTypes.func,
  };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (getShouldLoadRaven()) {
      raven.captureException(error, {
        extra: errorInfo,
        tags: { source: this.props.componentName },
      });
    }
    const { _eventData } = this.context;
    Retracked.trackComponent(_eventData, {}, this.props.componentName, 'error_thrown');
  }

  render() {
    if (this.state.hasError) {
      return this.props.errorComponent;
    }
    return this.props.children;
  }
}
