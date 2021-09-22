import React from 'react';
import Naptime from 'bundles/naptimejs';
import Modal from 'bundles/phoenix/components/Modal';

import Imgix from 'js/components/Imgix';

import { TrackedA } from 'bundles/page/components/TrackedLink2';
import _t from 'i18n!nls/enroll';
import onDemandSpecializationMembershipsApi from 'bundles/enroll/utils/onDemandSpecializationMembershipsApi';
import { checkSessionsV2Epic } from 'bundles/enroll-course/lib/sessionsV2ExperimentUtils';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { choiceTypeToHandleSubmitPromise } from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
import EnrollmentChoiceTypes from 'bundles/enroll-course/common/EnrollmentChoiceTypes';

import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';

import 'css!./__styles__/SubscriptionSubscribedModal';

import config from 'js/app/config';

const FREE_TRIAL_IMAGE = `${config.url.resource_assets}growth_free_trial/free-trial-enrollment-confirmation.png`;

type InputProps = {
  onClose: () => void;
  s12nId?: string;
  courseId: string;
};

type Props = InputProps & {
  course: CoursesV1;
};

type State = {
  didFinishEnroll: boolean;
  didFailToEnroll: boolean;
};

class SubscriptionSubscribedModal extends React.Component<Props, State> {
  state = {
    didFinishEnroll: false,
    didFailToEnroll: false,
  };

  componentDidMount() {
    const { s12nId, courseId } = this.props;
    const promise = s12nId
      ? this.enrollIntoS12n(s12nId, courseId)
      : choiceTypeToHandleSubmitPromise[EnrollmentChoiceTypes.ENROLL_COURSE]({ courseId });

    this.handlePromise(promise);
  }

  handlePromise(promise: any) {
    promise
      .then(() => {
        this.setState((state) => ({
          didFinishEnroll: true,
        }));
      })
      .fail(() => {
        this.setState((state) => ({
          didFinishEnroll: true,
          didFailToEnroll: true,
        }));
      })
      .done();
  }

  handleClose = () => {
    this.props.onClose();
  };

  enrollIntoS12n(s12nId: string, courseId: string): any {
    return checkSessionsV2Epic(courseId).then(() => {
      return onDemandSpecializationMembershipsApi.enrollInOwnedS12n(s12nId, courseId);
    });
  }

  render() {
    const { course } = this.props;
    const { didFinishEnroll, didFailToEnroll } = this.state;
    let headerText: React.ReactNode | undefined;
    let buttonDisabled: boolean | undefined;
    if (!didFinishEnroll) {
      headerText = _t('Enrolling...');
      buttonDisabled = true;
    } else if (didFinishEnroll && !didFailToEnroll) {
      headerText = _t("You're enrolled.");
      buttonDisabled = false;
    } else {
      headerText = _t('Sorry, enrollment failed.');
      buttonDisabled = true;
    }

    const buttonText = _t('Start Learning');

    return (
      <Modal
        className="rc-SubscriptionSubscribedModal"
        trackingName="subscription_subscribed_modal"
        modalName={_t('Subscription subscribed modal')}
        handleClose={this.handleClose}
      >
        <div className="vertical-box align-items-vertical-center modal-container">
          <Imgix alt={Imgix.DECORATIVE} src={FREE_TRIAL_IMAGE} width={300} height={300} />
          <h2 className="headline-5-text header">{headerText}</h2>
          {buttonDisabled ? (
            <button className="primary cozy" disabled>
              {buttonText}
            </button>
          ) : (
            <TrackedA
              trackingName="start_learning_button"
              className="link-button primary cozy"
              href={course.phoenixHomeLink}
            >
              {buttonText}
            </TrackedA>
          )}
        </div>
      </Modal>
    );
  }
}

export default Naptime.createContainer<Props, InputProps>(({ courseId }) => ({
  course: CoursesV1.get(courseId, {
    fields: ['slug'],
  }),
}))(SubscriptionSubscribedModal);
