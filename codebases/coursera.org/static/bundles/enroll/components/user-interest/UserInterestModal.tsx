import Naptime from 'bundles/naptimejs';

import PropTypes from 'prop-types';

import React from 'react';
import _t from 'i18n!nls/enroll';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import TrackedButton from 'bundles/page/components/TrackedButton';
import Modal from 'bundles/phoenix/components/Modal';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import BasicProfilesV1 from 'bundles/naptimejs/resources/basicProfiles.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ProductEventInterestsV1 from 'bundles/naptimejs/resources/productEventInterests.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { VerifiedCertificate } from 'bundles/enroll-course/common/EnrollmentProductTypes';
import 'css!./__styles__/UserInterestModal';

type PropsFromNaptime = {
  profile: BasicProfilesV1;
};

type PropsFromCaller = {
  courseId: string;
  onClose: () => void;
};

type PropsToComponent = PropsFromCaller & PropsFromNaptime;

type State = {
  isLoading: boolean;
  errorCode: string | null | undefined;
  registrationComplete: boolean;
};

class UserInterestModal extends React.Component<PropsToComponent, State> {
  static contextTypes = {
    executeMutation: PropTypes.func.isRequired,
  };

  constructor(props: PropsToComponent) {
    super(props);
    this.state = {
      isLoading: false,
      registrationComplete: false,
      errorCode: null,
    };
  }

  handleClose = () => {
    this.props.onClose();
  };

  handleInterestRegistration = () => {
    this.setState(({ isLoading }) => ({ isLoading: !isLoading }));
    const { profile, courseId } = this.props;
    this.registerProductLaunchedInterest(VerifiedCertificate, courseId, profile.emailAddress);
  };

  registerProductLaunchedInterest(productType: string, productItemId: string, emailAddress: string) {
    const body = {
      productType,
      productItemId,
      interestedEventType: 'PRODUCT_LAUNCHED',
      interestedEmailAddress: emailAddress,
      productEventInterestStatus: 'ACTIVE',
    };

    let errorCode: string | null | undefined;
    const eventClient = ProductEventInterestsV1.create(body);
    this.context
      .executeMutation(eventClient)
      .fail((error: Error) => {
        errorCode = JSON.parse(error.message).errorCode;
      })
      .finally(() => {
        this.setState({
          registrationComplete: true,
          errorCode,
          isLoading: false,
        });
      })
      .done();
  }

  render() {
    const { profile } = this.props;
    const { isLoading, registrationComplete, errorCode } = this.state;
    let modalMessage = _t(
      'Your course is not live yet - but you’ll be notified at {email} when your session is open for enrollment!'
    );
    let modalTitle = _t('Coming soon!');

    let buttonContent: string;
    if (isLoading) {
      buttonContent = _t('Registering...');
    } else if (registrationComplete) {
      if (errorCode && errorCode !== 'ExistingProductEventInterest') {
        modalMessage = _t('There was a problem registering with the following email: {email}');
      } else {
        modalTitle = _t('Thank you!');
        modalMessage = _t('Registration complete');
      }
      buttonContent = _t('Done');
    } else {
      buttonContent = _t('Yes, let me know');
    }

    return (
      <div className="rc-UserInterestModal">
        <Modal
          trackingName="user_interest_modal"
          key="UserInterestEnrollModal"
          modalName={_t('This product is not available yet')}
          handleClose={this.handleClose}
        >
          <div className="modal-container">
            <h2 className="headline-4-text modal-title">{modalTitle}</h2>
            <h3 className="headline-1-text detailed-message">
              <FormattedMessage message={modalMessage} email={profile.emailAddress} />
            </h3>
            <div className="horizontal-box align-items-right register-button">
              <TrackedButton
                trackingName="ra_user_interest_button"
                className="primary cozy register-button"
                onClick={registrationComplete ? this.handleClose : this.handleInterestRegistration}
                disabled={isLoading}
              >
                {buttonContent}
              </TrackedButton>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Naptime.createContainer<PropsToComponent, PropsFromCaller>(() => ({
  profile: BasicProfilesV1.me({
    fields: ['emailAddress'],
  }),
}))(UserInterestModal);
