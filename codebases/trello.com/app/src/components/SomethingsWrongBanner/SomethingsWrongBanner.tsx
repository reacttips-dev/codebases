import React from 'react';

import { Banner } from 'app/src/components/Banner';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { forNamespace } from '@trello/i18n';

const format = forNamespace('somethings wrong');

export const SomethingsWrongBanner = () => {
  const showSomethingsWrong = useFeatureFlag(
    'fep.show_somethings_wrong',
    false,
  );

  return showSomethingsWrong ? (
    <Banner>
      <div style={{ textAlign: 'center' }}>
        <strong>{format('currently-experiencing-issues')}</strong>&nbsp;
        <a href="http://status.trello.com" target="_blank">
          https://status.trello.com
        </a>
      </div>
    </Banner>
  ) : null;
};
