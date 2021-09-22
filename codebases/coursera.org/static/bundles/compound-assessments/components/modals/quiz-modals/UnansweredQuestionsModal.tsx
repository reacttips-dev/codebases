import React from 'react';

import _t from 'i18n!nls/compound-assessments';

import AssessmentModalLayout from '../AssessmentModalLayout';

type Props = {
  onCancelButtonClick: () => void;
  onPrimaryButtonClick: () => void;
};

const UnansweredQuestionsModal = ({ onCancelButtonClick, onPrimaryButtonClick }: Props) => {
  return (
    <AssessmentModalLayout
      title={_t('Unanswered Questions')}
      content={_t(
        `There are some questions that you didn't answer.  Do you want to go back and answer them or
            continue and submit your current answers?`
      )}
      primaryButtonContents={_t('Submit')}
      cancelButtonContents={_t('Go Back')}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onCancelButtonClick={onCancelButtonClick}
    />
  );
};

export default UnansweredQuestionsModal;
