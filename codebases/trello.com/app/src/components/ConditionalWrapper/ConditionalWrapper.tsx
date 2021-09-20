import React from 'react';

export const ConditionalWrapper: React.FunctionComponent<{
  condition: boolean;
  wrapper: (children: React.ReactElement) => React.ReactElement;
  children: React.ReactElement;
}> = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;
