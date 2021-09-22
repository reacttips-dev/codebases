import React from 'react';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/enroll';

const SANCTION_ERROR_CODE = 'sanctionReject';

export const getAllMessages = (
  isFinancialAid: boolean,
  isFreeEnroll: boolean
): Record<'generic' | 'sanction', React.ReactNode> => {
  let page;
  if (isFinancialAid) {
    page = _t('financial aid application page');
  } else if (isFreeEnroll) {
    page = _t('course page');
  } else {
    page = _t('payments page');
  }

  return {
    generic: (
      <FormattedMessage
        message={_t('There was an error redirecting you to the {page}. Please try again later.')}
        page={page}
      />
    ),
    sanction: (
      <FormattedMessage
        message={_t(`
          We could not complete your {request}, because we cannot offer services to users in certain sanctioned countries.
          More information on our international restrictions is available {link}.
        `)}
        link={
          <a
            href="https://learner.coursera.help/hc/articles/208280116-International-restrictions"
            target="_blank"
            rel="noopener noreferrer"
          >
            {_t('here')}
          </a>
        }
        request={isFinancialAid ? _t('financial aid application request') : _t('enrollment request')}
      />
    ),
  };
};

export type ApiError = {
  responseJSON?: {
    errorCode: string;
    message: string;
    details?: Record<string, string>;
  };
};

export const getMessage = (
  error: ApiError | undefined,
  isFinancialAid: boolean,
  isFreeEnroll: boolean
): React.ReactNode => {
  const messages = getAllMessages(isFinancialAid, isFreeEnroll);

  if (!error || !error.responseJSON) {
    return messages.generic;
  }

  const { errorCode, message } = error.responseJSON;
  // sanction error is returned in the errorCode for direct carts.v2 calls (standalone course, fin aid)
  // and in the message for second level subscription.v1 calls (s12n subs)
  if (errorCode === SANCTION_ERROR_CODE || (message && message.includes(SANCTION_ERROR_CODE))) {
    return messages.sanction;
  }
  return messages.generic;
};

export default {
  getAllMessages,
  getMessage,
};
