import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import Simple from '../base/simple';
import {NavigationContext} from '../../../enhancers/router-enhancer';
import {SIGN_IN_PATH} from '../../../../bundles/feed/constants/utils';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';
import {SIGNUP_CTA_CLICK} from '../../../constants/analytics';
// import DwellTracker from '../../../../shared/utils/dwell-tracker';

const SignUp = ({text, sendAnalyticsEvent, section}) => {
  const signupCtaRef = useRef(null);

  // useEffect(() => {
  //   if (signupCtaRef.current) {
  //     new DwellTracker(signupCtaRef.current, time =>
  //       sendAnalyticsEvent(SIGNUP_CTA_DWELL, {
  //         time,
  //         section
  //       })
  //     );
  //     new DwellTracker(
  //       signupCtaRef.current,
  //       () => {
  //         sendAnalyticsEvent(SIGNUP_CTA_SHOWN, {section});
  //       },
  //       1
  //     );
  //   }
  // }, []);

  const onButtonClick = navigate => {
    navigate(SIGN_IN_PATH);
    sendAnalyticsEvent(SIGNUP_CTA_CLICK, {section});
  };

  return (
    <NavigationContext.Consumer>
      {navigate => (
        <Simple innerRef={signupCtaRef} onClick={() => onButtonClick(navigate)}>
          {text}
        </Simple>
      )}
    </NavigationContext.Consumer>
  );
};

SignUp.propTypes = {
  text: PropTypes.string,
  sendAnalyticsEvent: PropTypes.func,
  section: PropTypes.string
};

export default withSendAnalyticsEvent(SignUp);
