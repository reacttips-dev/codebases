import React from 'react';

export type ForwardedComponent<T, P> = React.ComponentType<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>;

export const forwardRefComponent = <T, P>(
  displayName: string,
  fn: React.RefForwardingComponent<T, P>,
): ForwardedComponent<T, P> => {
  fn.displayName = displayName;

  return React.forwardRef<T, P>(fn);
};
