/* eslint-disable @trello/filename-case */
import { sendCrashEvent } from '@trello/error-reporting';
import React from 'react';
import ReactDOM from '@trello/react-dom-wrapper';
import { ComponentWrapper } from './ComponentWrapper';

interface Disposer {
  (): void;
}

export const renderComponent = (
  children: React.ReactChild,
  container: Element | DocumentFragment | null,
): Disposer => {
  if (
    !container ||
    !(container instanceof Element || container instanceof DocumentFragment)
  ) {
    sendCrashEvent(
      new Error('Tried to mount component into undefined container'),
    );

    return () => {};
  }

  ReactDOM.render(<ComponentWrapper>{children}</ComponentWrapper>, container);

  return () => ReactDOM.unmountComponentAtNode(container);
};
