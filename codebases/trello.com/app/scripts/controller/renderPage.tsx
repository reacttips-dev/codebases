import React from 'react';

import { renderComponent } from 'app/src/components/ComponentWrapper';
import { PageError } from 'app/src/components/PageError';
import { sendChunkLoadErrorEvent } from '@trello/error-reporting';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderPage = (promise: Promise<any>) => {
  return promise.catch((error: Error) => {
    if (error.name === 'ChunkLoadError') {
      sendChunkLoadErrorEvent(error);
      const contentElement = document.getElementById('content');
      if (contentElement) {
        renderComponent(<PageError />, contentElement);
      }
    } else {
      throw error;
    }
  });
};
