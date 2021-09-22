import React from 'react';

import initBem from 'js/lib/bem';

import _t from 'i18n!nls/compound-assessments';

import { Notification } from '@coursera/coursera-ui';

import { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

const bem = initBem('OffPlatform');

export const checkInvalid = (response: any): FormPartsValidationStatus | null => null;

const OffPlatformView = () => {
  return (
    <div className={bem()}>
      <Notification
        message={_t(
          'Follow the instructions to complete this activity. Your grade will be updated after review by course staff.'
        )}
        type="info"
      />
    </div>
  );
};

export default OffPlatformView;
