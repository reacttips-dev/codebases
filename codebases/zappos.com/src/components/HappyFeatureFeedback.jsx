import React from 'react';
import propTypes from 'prop-types';
import cn from 'classnames';

import FeatureFeedback from 'components/FeatureFeedback';

import css from 'styles/components/happyFeatureFeedback.scss';

const HappyFeatureFeedback = ({
  additionalFeedbackMessage,
  className,
  completionMessage,
  feedbackQuestion,
  feedbackType,
  source,
  pageType
}) => (
  <FeatureFeedback
    additionalFeedbackMessage={additionalFeedbackMessage}
    autoOpenOnYesNoClick={true}
    completionMessage={completionMessage}
    feedbackQuestion={feedbackQuestion}
    feedbackType={feedbackType}
    source={source}
    pageType={pageType}
    completionMessageClass={css.completionMessage}
    noButtonClass={css.feedbackNoButton}
    responseButtonWrapperClass={css.responseButtonWrapper}
    responseClass={css.response}
    wrapperClass={cn(css.feedbackWrapper, className)}
    yesButtonClass={css.feedbackYesButton}
    yesNoWrapperClass={css.feedbackYesNoWrapper}
  />
);

HappyFeatureFeedback.propTypes = {
  className: propTypes.string,
  additionalFeedbackMessage: propTypes.string.isRequired,
  completionMessage: propTypes.string.isRequired,
  feedbackQuestion: propTypes.string.isRequired,
  feedbackType: propTypes.string.isRequired,
  source: propTypes.string.isRequired,
  pageType: propTypes.string.isRequired
};

export default HappyFeatureFeedback;
