import React, { FunctionComponent } from 'react';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('error');

import { CaughtError } from './ErrorBoundary';

const getErrorString = (caughtError: CaughtError) => {
  const { error, info } = caughtError;

  return `Error: ${error.message || String(error)}.\nError info: ${
    info.componentStack
  }.`;
};

export const ErrorDetails: FunctionComponent<{ caughtError: CaughtError }> = ({
  caughtError,
}) => {
  return (
    <div style={{ textAlign: 'left', color: '#333' }}>
      <strong>{format('more-details')}</strong>
      <pre
        style={{
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          borderLeft: '2px solid red',
          color: '#333',
          backgroundColor: '#fff',
          paddingLeft: 20,
        }}
      >
        {getErrorString(caughtError)}
      </pre>
    </div>
  );
};
