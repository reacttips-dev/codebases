import React, { useState } from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { lookupSurveyQuestion, onFeedbackYesOrNoSelected, onSaveSurveyQuestionResponse } from 'store/ducks/feedback/actions';
import useMartyContext from 'hooks/useMartyContext';
import { AriaLiveTee } from 'components/common/AriaLive';

import css from 'styles/components/featureFeedback.scss';

export const FeatureFeedback = ({
  additionalFeedbackMessage,
  alwaysShowVocLinkOnCompletion = false,
  autoOpenOnYesNoClick,
  completionMessage,
  completionMessageClass,
  feedbackType,
  feedbackQuestion,
  feedbackQuestionId = 'feedbackQuestion',
  hasSurveyQuestion,
  lookupSurveyQuestion,
  isCustomer,
  noButtonClass,
  onFeedbackYesOrNoSelected,
  onSaveSurveyQuestionResponse,
  pageType,
  placeholder = '',
  responseClass,
  responseButtonWrapperClass,
  source,
  wrapperClass,
  yesButtonClass,
  yesNoWrapperClass,
  isYesNoOnly
}) => {
  const [isOpen, setOpen] = useState(false);
  const [isFeedbackCancelled, setIsFeedbackCancelled] = useState(!autoOpenOnYesNoClick);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [isYesNoSelected, setIsYesNoSelected] = useState(false);
  const [feedback, setFeedback] = useState('');
  const { testId, marketplace: { featureFeedback, vocUrl } } = useMartyContext();

  const yesOrNoOnClick = val => {
    onFeedbackYesOrNoSelected(val, pageType, feedbackType);
    if (isCustomer && !isYesNoOnly) { // isYesNoOnly - do not display the survey, just skip to the else/end
      lookupSurveyQuestion(featureFeedback);
      setIsYesNoSelected(true);
      if (autoOpenOnYesNoClick) {
        setOpen(true);
      }
    } else { // If a customer is authed (or component sends isYeseNoOnly), don't show feedback form/skip to the end
      setIsYesNoSelected(true);
      setIsFeedbackSubmitted(true);
    }
  };

  const onProvideMoreFeedbackClick = () => {
    setIsFeedbackCancelled(feedbackCancelled => !feedbackCancelled);
    setOpen(true);
  };

  const onSendFeedbackClick = e => {
    e.preventDefault();
    onSaveSurveyQuestionResponse({ feedback, source });
    setIsFeedbackSubmitted(isComplete => !isComplete);
  };

  const onFeedbackEntered = e => {
    const { currentTarget: { value } } = e;
    setFeedback(value);
  };

  const makeWhenYesOrNoNotSelected = () => (
    <div className={cn(css.yesNoWrapper, yesNoWrapperClass)}>
      <button
        className={yesButtonClass}
        aria-describedby={feedbackQuestionId}
        type="button"
        onClick={() => yesOrNoOnClick(true)}
      >
           Yes
      </button>
      <button
        className={noButtonClass}
        aria-describedby={feedbackQuestionId}
        type="button"
        onClick={() => yesOrNoOnClick(false)}
      >
           No
      </button>
    </div>
  );

  const makeWhenYesOrNoIsSelected = () => (
    <span id="additionalFeedback">
      Thank you!
      {
        hasSurveyQuestion && makeAdditionalFeedbackMsg()
      }
    </span>
  );

  const makeAdditionalFeedbackMsg = () => (
    <>
    {
      isFeedbackCancelled
        ? <button type="button" onClick={onProvideMoreFeedbackClick}>{additionalFeedbackMessage}</button>
        : ` ${additionalFeedbackMessage}:`
    }
    </>
  );

  if (isFeedbackSubmitted) {
    return (
      <div className={cn(css.wrapper, wrapperClass)}>
        <AriaLiveTee role="alert">
          <span className={completionMessageClass}>
            {completionMessage}
            {(!isCustomer || alwaysShowVocLinkOnCompletion || isYesNoOnly) &&
          <>
              {' '}For additional feedback,{' '}
              <a
                href={`${vocUrl}?source=${source}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="take this survey, (opens in new window)"
              >
                take this survey
              </a>.
          </>
            }
          </span>
        </AriaLiveTee>
      </div>
    );
  }

  return (
    <div data-test-id={testId('featureFeedback')} className={cn(css.wrapper, wrapperClass)}>
      <div className={css.feedbackQuestionSection}>
        { !isYesNoSelected && <span id={feedbackQuestionId}>{feedbackQuestion}</span> }
        {
          isYesNoSelected
            ? makeWhenYesOrNoIsSelected()
            : makeWhenYesOrNoNotSelected()
        }
      </div>

      {
        isOpen && hasSurveyQuestion && !isFeedbackCancelled && <form method="post" onSubmit={onSendFeedbackClick} className={cn(css.response, responseClass)}>
          <textarea
            onChange={onFeedbackEntered}
            placeholder={placeholder}
            defaultValue={feedback}
            aria-labelledby="additionalFeedback"
          />
          <div className={cn(css.buttons, responseButtonWrapperClass)}>
            <button type="button" onClick={() => setIsFeedbackCancelled(feedbackCancelled => !feedbackCancelled)}>Cancel</button>
            <button type="submit" disabled={!feedback}>Send Feedback</button>
          </div>
        </form>
      }
    </div>
  );
};

FeatureFeedback.propTypes = {
  additionalFeedbackMessage: PropTypes.string,
  alwaysShowVocLinkOnCompletion: PropTypes.bool,
  autoOpenOnYesNoClick: PropTypes.bool.isRequired,
  completionMessage: PropTypes.string.isRequired,
  feedbackType: PropTypes.string.isRequired,
  feedbackQuestionId: PropTypes.string,
  feedbackQuestion: PropTypes.string.isRequired,
  hasSurveyQuestion: PropTypes.bool.isRequired,
  lookupSurveyQuestion: PropTypes.func.isRequired,
  onFeedbackYesOrNoSelected: PropTypes.func.isRequired,
  onSaveSurveyQuestionResponse: PropTypes.func.isRequired,
  pageType: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  const { feedback: { questionId }, cookies } = state;

  return ({
    hasSurveyQuestion: !!questionId,
    isCustomer: !!cookies['x-main']
  });
};

const mapDispatchToProps = {
  onSaveSurveyQuestionResponse,
  onFeedbackYesOrNoSelected,
  lookupSurveyQuestion
};

export default connect(mapStateToProps, mapDispatchToProps)(FeatureFeedback);
