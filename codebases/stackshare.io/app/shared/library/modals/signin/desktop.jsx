import React from 'react';
import PropTypes from 'prop-types';
import BaseModal from '../base/modal';
import {withPortal} from '../base/portal';
import SigninContent from './content';
import {GO_BACK} from '../../../enhancers/router-enhancer';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';

// This is a hack to compensate for showing the desktop sign in modal on mobile devices on legacy pages
// This should probably be baked into the permanent signin component after the experiment is done

const SigninDesktopModal = ({onDismiss, redirect}) => {
  return (
    <BaseModal width={619} onDismiss={onDismiss} hideTitleBar={true} layout="auto">
      <div>
        <SigninContent redirect={redirect} />
      </div>
    </BaseModal>
  );
};

SigninDesktopModal.propTypes = {
  onDismiss: PropTypes.func,
  redirect: PropTypes.string
};

const SigninPortal = withPortal(SigninDesktopModal);

const SigninPortalDismiss = ({onDismiss = GO_BACK, sendAnalyticsEvent, ...restProps}) => {
  const handleDismiss =
    typeof onDismiss === 'function'
      ? () => {
          sendAnalyticsEvent('signup.clicked_close', {});
          onDismiss && onDismiss();
        }
      : null;
  return <SigninPortal {...restProps} onDismiss={handleDismiss} />;
};

SigninPortalDismiss.propTypes = {
  onDismiss: PropTypes.func,
  redirect: PropTypes.string,
  sendAnalyticsEvent: PropTypes.func
};

export default withSendAnalyticsEvent(SigninPortalDismiss);
