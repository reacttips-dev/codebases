import { useCallback, useEffect } from 'react';
import Actions from 'actions';
import React from 'react';
import { connect } from 'react-redux';

const mapDispatchToProps = {
  onWindowBlur: Actions.onWindowBlur,
  onWindowFocus: Actions.onWindowFocus,
};

export function WindowManagerContainer({
  onWindowBlur,
  onWindowFocus,
  children,
}) {
  const handleVisibilityChange = useCallback(
    () =>
      document.visibilityState === 'hidden' ? onWindowBlur() : onWindowFocus(),
    [onWindowBlur, onWindowFocus]
  );

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  return <React.Fragment>{children}</React.Fragment>;
}

export default connect(null, mapDispatchToProps)(WindowManagerContainer);
