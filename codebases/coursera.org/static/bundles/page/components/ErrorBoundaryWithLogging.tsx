import React from 'react';
import type { ErrorInfo } from 'react';
import { getShouldLoadRaven } from 'js/lib/sentry';
import raven from 'raven-js';

type State = {
  hasError: boolean;
};

// Copied from https://github.com/webedx-spark/infra-services/blob/049c1bee225804c19dbf3993ff3b17b00c705c05/playcour/playcour/src/main/scala/org/coursera/playcour/util/ErrorMessageHelper.scala#L9-L32
// Keeping this simple (in-line styles, no translation) to avoid potential errors in the error path (which would defeat the purpose).
export const ErrorPage = () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      margin: 'auto',
      height: '200px',
      width: '600px',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <img src="https://coursera.s3.amazonaws.com/error_pages/coursera-logo.svg" alt="Coursera" width="400" />
    </div>
    <h1
      style={{
        margin: '16px 0',
        textAlign: 'center',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '32px',
        fontWeight: 100,
        lineHeight: 'inherit',
        color: '#555',
      }}
      role="status"
    >
      Sorry, we are down for maintenance.
    </h1>
    <div
      style={{
        textAlign: 'center',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 300,
        fontSize: '13pt',
        color: '#555',
      }}
    >
      We will be back up shortly.
    </div>
    <style>
      {`
      body {
        background-color: #e4e4e4 !important;
      }
    `}
    </style>
  </div>
);

class ErrorBoundaryWithLogging extends React.Component<{}, State> {
  state = {
    hasError: false,
  };

  // for React 16.6+
  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (getShouldLoadRaven()) {
      raven.captureException(error, {
        extra: errorInfo,
        tags: { source: 'ErrorBoundaryWithLogging' },
      });
    }
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <ErrorPage />;
    }

    return children;
  }
}

export default ErrorBoundaryWithLogging;
