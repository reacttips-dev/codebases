import React from 'react';
import { compose, withProps } from 'recompose';
import _ from 'underscore';

import CourseraPlusEnrollModal from 'bundles/enroll/components/coursera-plus/CourseraPlusEnrollModal';
import SubscriptionEnrollModal from 'bundles/enroll/components/subscriptions/SubscriptionEnrollModal';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentChoicesApi from 'bundles/enroll/utils/enrollmentChoicesApi';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import NaptimeStore from 'bundles/naptimejs/stores/NaptimeStore';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import S12nEnrollModal from 'bundles/s12n-enroll/components/S12nEnrollModal';
import S12nBulkPayEnrollModal from 'bundles/s12n-enroll/components/bulk-pay/S12nBulkPayEnrollModal';
import NonRecurringEnrollModal from 'bundles/s12n-enroll/components/non-recurring/NonRecurringEnrollModal';
import S12nPaymentMethodEnrollModal from 'bundles/s12n-enroll/components/non-recurring/S12nPaymentMethodEnrollModal';
import CatalogSubscriptionEnrollModal from 'bundles/enroll/components/subscriptions/catalogSubscription/CatalogSubscriptionEnrollModal';
import type { PropsFromWithCourseraPlusMonthlyVariant } from 'bundles/coursera-plus/components/xdp/withCourseraPlusMonthlyVariant';
import withCourseraPlusMonthlyVariant from 'bundles/coursera-plus/components/xdp/withCourseraPlusMonthlyVariant';
import user from 'js/lib/user';

import withEnrollmentGraphql from 'bundles/enroll/components/xdp/withEnrollmentGraphql';
import epic from 'bundles/epic/client';

type PropsFromCaller = {
  s12nId: string;
  onSdp?: boolean;
  onClose?: () => void;
  title?: string;
  courseIdOverride?: string;
  showFreeOption?: boolean;
};

type PropsFromNaptime = {
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
};

type PropsToComponent = PropsFromCaller & PropsFromNaptime & PropsFromWithCourseraPlusMonthlyVariant;

type State = {
  didMakeEnrollmentsCall: boolean;
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
};

class EnrollModal extends React.Component<PropsToComponent, State> {
  // TODO: refactor of enroll modal to get rid of its own context may result in us
  // not needing this anymore
  state = {
    didMakeEnrollmentsCall: false,
    enrollmentAvailableChoices: null,
  };

  componentDidMount() {
    if (this.shouldMakeExtraEnrollmentsCall()) {
      const { s12nId } = this.props;
      const userId = user.get().id;
      EnrollmentChoicesApi.loadEnrollmentChoices(s12nId, userId)
        .then((enrollmentChoices: EnrollmentAvailableChoicesV1) => {
          const enrollmentAvailableChoices =
            enrollmentChoices &&
            !_(enrollmentChoices.elements).isEmpty() &&
            new EnrollmentAvailableChoicesV1(enrollmentChoices.elements[0]);

          this.setState({
            didMakeEnrollmentsCall: true,
            enrollmentAvailableChoices,
          });
        })
        .done();
    }
  }

  shouldMakeExtraEnrollmentsCall() {
    // if there is an s12nId but we didn't get an enrollment available choices,
    // then something went wrong
    const { s12nId, enrollmentAvailableChoices } = this.props;
    return !!s12nId && !enrollmentAvailableChoices;
  }

  renderEnrollmentModals(enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1) {
    const { s12nId } = this.props;

    let ModalImpl;

    const canSubscribeToS12n = enrollmentAvailableChoices?.canSubscribeToS12n;
    const canSubscribeToCatalog = enrollmentAvailableChoices?.canSubscribeToCatalog;
    const canEnrollThroughCourseraPlus = enrollmentAvailableChoices?.canEnrollThroughCourseraPlus;
    const canBulkPaySpecialization = enrollmentAvailableChoices?.canBulkPaySpecialization;
    const canEnrollThroughS12nPrepaid = enrollmentAvailableChoices?.canEnrollThroughS12nPrepaid;

    const indiaBulkPayIds = epic.get('payments-backend', 'indiaBulkpayEnabledS12nIds');
    const isInIndiaBulkPayRollout = indiaBulkPayIds.includes(s12nId);

    if (canSubscribeToCatalog) {
      ModalImpl = CatalogSubscriptionEnrollModal;
      // Only trigger Coursera Plus flow for users who are already subscribed users
    } else if (canEnrollThroughCourseraPlus) {
      ModalImpl = CourseraPlusEnrollModal;
    } else if (canBulkPaySpecialization && isInIndiaBulkPayRollout) {
      ModalImpl = S12nBulkPayEnrollModal;
    } else if (canEnrollThroughS12nPrepaid && canSubscribeToS12n) {
      ModalImpl = S12nPaymentMethodEnrollModal;
    } else if (canEnrollThroughS12nPrepaid && !canSubscribeToS12n) {
      ModalImpl = NonRecurringEnrollModal;
    } else if (canSubscribeToS12n) {
      ModalImpl = SubscriptionEnrollModal;
    } else {
      ModalImpl = S12nEnrollModal;
    }
    return <ModalImpl {...this.props} />;
  }

  render() {
    const { didMakeEnrollmentsCall } = this.state;

    const shouldMakeExtraEnrollmentsCall = this.shouldMakeExtraEnrollmentsCall();
    if (shouldMakeExtraEnrollmentsCall && !didMakeEnrollmentsCall) {
      return false;
    }

    let enrollmentAvailableChoices;
    if (shouldMakeExtraEnrollmentsCall) {
      ({ enrollmentAvailableChoices } = this.state);
    } else {
      ({ enrollmentAvailableChoices } = this.props);
    }
    return this.renderEnrollmentModals(enrollmentAvailableChoices);
  }
}

export default compose<PropsToComponent, PropsFromCaller>(
  withProps(() => ({
    isSpecialization: true,
  })),
  withEnrollmentGraphql(),
  withCourseraPlusMonthlyVariant<PropsFromCaller & PropsFromNaptime>()
)(EnrollModal);
