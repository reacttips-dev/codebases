import React from 'react';
import ErrorBoundary from '../utils/error-boundry';

// eslint-disable-next-line react/prop-types
const withErrorBoundary = (inlineError = null) => Component => ({...props}) => {
  return (
    <ErrorBoundary inlineError={inlineError}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export default withErrorBoundary;
