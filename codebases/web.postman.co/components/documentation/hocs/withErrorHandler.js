import React from 'react';
import CrashHandler from '../../js/components/empty-states/CrashHandler';

/**
 * Higher Order Component to wrap an existic component
 */
export default function withErrorHandler (WrappingComponent) {
  class WrappedComponent extends React.Component {
    render () {
      return (
        <CrashHandler>
          <WrappingComponent {...this.props} />
        </CrashHandler>
      );
    }
  }

  WrappedComponent.displayName = `withErrorHandler(${WrappingComponent.displayName || WrappingComponent.name})`;

  return WrappedComponent;
}
