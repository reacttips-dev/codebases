import React from 'react';
import _t from 'i18n!nls/page';

import { Loading } from '@coursera/coursera-ui';

import TrackedDiv from 'bundles/page/components/TrackedDiv';
import TrackedButton from 'bundles/page/components/TrackedButton';

import 'css!./__styles__/LazyLoadingHandler';

// Props passed from react-loadable (createLoadableComponent)
type LoadableProps = {
  pastDelay?: boolean;
  error?: boolean;
  retry?: () => void;
};

// Pass this to createLoadableComponent when creating lazy loading components.
// Handles showing a loading state when lazy import is taking more than 200ms
// and showing error states if import fails with an option to retry.
export default (props: LoadableProps) => {
  const { pastDelay, error, retry } = props;

  if (error) {
    return (
      <TrackedDiv
        trackingName="lazy_handler_error_message"
        className="rc-LazyLoadingHandler lazy-handler-error"
        withVisibilityTracking
      >
        <p>{_t('There was an error loading the content.')}</p>
        <TrackedButton trackingName="lazy_handler_retry_button" onClick={retry}>
          {_t('Retry')}
        </TrackedButton>
      </TrackedDiv>
    );
  } else if (pastDelay) {
    return (
      <TrackedDiv
        trackingName="lazy_handler_loading"
        className="rc-LazyLoadingHandler lazy-handler-loading"
        withVisibilityTracking
      >
        <Loading />
      </TrackedDiv>
    );
  } else {
    return null;
  }
};
