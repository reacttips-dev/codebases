/* eslint-disable no-restricted-imports */
import React from 'react';
import ReactDOM from 'react-dom';

export { findDOMNode, createPortal } from 'react-dom';

/**
 * Use localStorage switch to flip which React rendering
 * mode to use.
 */
export const render = (
  Component: React.ReactElement,
  element: Element | DocumentFragment,
  callback?: () => void | undefined,
) => {
  /**
   * Render the component tree wrapped in <StrictMode> so that
   * React prints any usages of deprecated APIs to the console
   * when in dev mode
   */
  if (process.env.NODE_ENV === 'development') {
    return ReactDOM.render(
      <React.StrictMode>{Component}</React.StrictMode>,
      element,
      callback,
    );
  }
  /**
   * Render in regular mode
   */
  return ReactDOM.render(Component, element, callback);
};

export const unmountComponentAtNode = (
  element: Element | DocumentFragment,
): boolean => {
  return ReactDOM.unmountComponentAtNode(element);
};
