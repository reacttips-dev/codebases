import PropTypes from 'prop-types';
import { useCallback, useRef } from 'react';

import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import useEvent from 'hooks/useEvent';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import HtmlToReact from 'components/common/HtmlToReact';

import css from 'styles/components/hf/zappos/footerSurvey.scss';

export const FooterSurvey = ({ isMobile, survey }) => {
  const source = isMobile ? 'mobile-footer' : 'footer';
  const surveyContainer = useRef();

  const clickHandler = useCallback(evt => {
    if (evt.target.tagName === 'A') {
      trackEvent('TE_FOOTER_FEEDBACK', source);
      trackLegacyEvent('Footer', 'Feedback', 'How-do-you-like-our-website');
    }
  }, [source]);

  useEvent(surveyContainer.current, 'click', clickHandler);
  return survey?.componentName === 'pageContent' && (
    <HtmlToReact className={css.survey} ref={surveyContainer}>
      {survey.pageContent.body.replace(/\?source/g, `?source=${source}`)}
    </HtmlToReact>
  );
};

FooterSurvey.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('FooterSurvey', FooterSurvey);
