import React from 'react';
import PropTypes from 'prop-types';
import MobilePortal from '../../../../shared/library/modals/base/portal-mobile';
import MobileModal from '../../../../shared/library/modals/base/modal-mobile';
import SigninContent from './content';
import {GO_BACK} from '../../../enhancers/router-enhancer';
import {useSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';

const SigninMobileModal = ({onDismiss = GO_BACK, redirect}) => {
  const sendAnalyticsEvent = useSendAnalyticsEvent();

  const handleDismiss = () => {
    sendAnalyticsEvent('signup.clicked_close', {});
    onDismiss && onDismiss();
  };

  return (
    <MobilePortal>
      <MobileModal title="Signup / Login" onDismiss={handleDismiss}>
        <div style={{marginTop: 40}}>
          <SigninContent redirect={redirect} isMobile={true} />
        </div>
      </MobileModal>
    </MobilePortal>
  );
};

SigninMobileModal.propTypes = {
  onDismiss: PropTypes.func,
  redirect: PropTypes.string
};

export default SigninMobileModal;
