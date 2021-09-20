import { useEffect } from 'react';

const getPathWithIframeSource = function (path: string, _iframeSource: string) {
  if (/\?[^=]+=[^&]+/.test(path)) {
    // check for existing query parameters
    return `${path}&iframeSource=${_iframeSource}`;
  } else {
    return `${path}?iframeSource=${_iframeSource}`;
  }
};

// eslint-disable-next-line @trello/no-module-logic
const iframeSourceOnLoad = new URLSearchParams(window?.location?.search).get(
  'iframeSource',
);

const onUrlChange = function () {
  if (iframeSourceOnLoad === null) {
    return;
  }

  const newIframeSource = new URLSearchParams(window?.location?.search).get(
    'iframeSource',
  );

  if (iframeSourceOnLoad === newIframeSource) {
    return;
  }

  history.replaceState(
    {},
    document.title,
    getPathWithIframeSource(window.location.pathname, iframeSourceOnLoad),
  );
};

// This hook relies on @trello/history-events to polyfill the pushstate and replacestate events.
export const useIframeSourcePreservation = () => {
  useEffect(() => {
    window.addEventListener('pushstate', onUrlChange);
    window.addEventListener('popstate', onUrlChange);
    window.addEventListener('replacestate', onUrlChange);

    return () => {
      window.removeEventListener('pushstate', onUrlChange);
      window.removeEventListener('popstate', onUrlChange);
      window.removeEventListener('replacestate', onUrlChange);
    };
  }, []);
};
