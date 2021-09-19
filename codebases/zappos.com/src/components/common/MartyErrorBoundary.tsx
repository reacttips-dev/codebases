import React, { forwardRef, useCallback } from 'react';
import ErrorBoundary from 'react-error-boundary';

import { logErrorAndLogToServer } from 'middleware/logger';

interface Props {
  boundaryTag: string;
  children: React.ReactNode;
}

const MartyErrorBoundary = ({ boundaryTag, children }: Props) => {
  // useCallback w/ react-hooks so we don't pass a brand new function every time this re-renders
  const FallbackComponent = useCallback(() => <div style={{ display: 'none' }} data-component-boundary-error={`Error while rendering the component ${boundaryTag ? `([${boundaryTag}])` : ''}`}/>, [boundaryTag]);
  const onError = useCallback(() => (error: Error) => {
    const errorMessage = `An error has occurred while rendering component contained with MartyErrorBoundary: ${error.toString()}`;
    logErrorAndLogToServer(`${boundaryTag ? `[${ boundaryTag}]: ` : ''}${errorMessage}`);
  }, [boundaryTag]);

  return <ErrorBoundary FallbackComponent={FallbackComponent} onError={onError}>{children}</ErrorBoundary>;
};

export const withErrorBoundary = <Props extends object>(boundaryTag: string, Component: React.ComponentType<Props>) => {
  const WrappedComponent = forwardRef<React.ReactNode, Props>((props, ref) => <MartyErrorBoundary boundaryTag={boundaryTag}><Component ref={ref} {...props}/></MartyErrorBoundary>);
  WrappedComponent.displayName = `${getDisplayName(Component)}ErrorBoundary`;
  return WrappedComponent;
};
// helper for HOC
function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default MartyErrorBoundary;
