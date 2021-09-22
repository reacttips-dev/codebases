import React from 'react';
import { Item } from 'bundles/learner-progress/types/Item';

import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import SessionStoreType from 'bundles/course-sessions/stores/SessionStore';

import _t from 'i18n!nls/learner-progress';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

type PropsFromCaller = {
  computedItem: Item;
};

type PropsFromStores = {
  startDate: string;
};

type Stores = {
  SessionStore: SessionStoreType;
};

type PropsToComponent = PropsFromCaller & PropsFromStores;

const LockReason = ({
  startDate,
  computedItem: { itemLockedReasonCode, isLockedBeforeSessionStart },
}: PropsToComponent) => {
  let content: React.ReactNode;
  if (itemLockedReasonCode === 'SESSION_ENDED') {
    content = <p>{_t('This session has ended. To resubmit, enroll in the next session.')}</p>;
  } else if (itemLockedReasonCode === 'SESSION_ENDED_FOR_FLEXIBLE_SCHEDULE') {
    content = (
      <p>{_t('All deadlines have passed. To unlock and submit additional assignments, reset your deadlines.')}</p>
    );
  } else if (itemLockedReasonCode === 'ENROLLMENT_PREVIEW') {
    content = <p>{_t('You must be enrolled to access this item. Please enroll from the course page to continue.')}</p>;
  } else if (isLockedBeforeSessionStart) {
    content = (
      <p>
        <FormattedMessage
          message={_t(
            'This session has not yet started. You may access this item after the session starts on {startDate}.'
          )}
          startDate={startDate}
        />
      </p>
    );
  } else {
    return null;
  }

  return <div className="rc-LockReason">{content}</div>;
};

export default connectToStores<PropsToComponent, PropsFromCaller, Stores>(['SessionStore'], ({ SessionStore }) => ({
  startDate: SessionStore.getStartDate(),
}))(LockReason);
