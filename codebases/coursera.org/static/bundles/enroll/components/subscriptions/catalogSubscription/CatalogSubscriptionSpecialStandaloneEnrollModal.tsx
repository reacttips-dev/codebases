import React from 'react';
import PropTypes from 'prop-types';
import Naptime from 'bundles/naptimejs';
import _ from 'underscore';

import type { CatalogSubscriptionStandaloneChoiceCardProps } from 'bundles/enroll/types/CatalogSubscriptionEnrollModalTypes';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import TrackedButton from 'bundles/page/components/TrackedButton';
import Modal from 'bundles/phoenix/components/Modal';
import subscriptionPriceUtils from 'bundles/s12n-common/utils/subscriptionPriceUtils';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import logger from 'js/app/loggerSingleton';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import type { EnrollmentChoiceTypesValues } from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import {
  PURCHASE_SINGLE_COURSE,
  SUBSCRIBE_TO_CATALOG,
  SUBSCRIBE_TO_CATALOG_TRIAL,
  UPGRADE_TO_CATALOG_SUBSCRIPTION,
  ENROLL_COURSE,
  AUDIT_COURSE,
} from 'bundles/enroll-course/common/EnrollmentChoiceTypes';
import withCatalogSubscriptions from 'bundles/enroll/components/catalog-subs-hoc/withCatalogSubscriptions';
import _t from 'i18n!nls/enroll';
import { MONTHLY } from 'bundles/subscriptions/common/BillingCycleType';
import { CATALOG_SUBSCRIPTION, VERIFIED_CERTIFICATE } from 'bundles/payments/common/ProductType';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { choiceTypeToHandleSubmitPromise } from 'bundles/enroll-course/lib/enrollmentChoiceUtils';
import CatalogSubscriptionStandaloneChoiceCard from 'bundles/enroll/components/subscriptions/catalogSubscription/CatalogSubscriptionStandaloneChoiceCard';
import redirect from 'js/lib/coursera.redirect';
import 'css!./__styles__/CatalogSubscriptionSpecialStandaloneEnrollModal';

import config from 'js/app/config';

const DISPLAY_CHOICES = [
  PURCHASE_SINGLE_COURSE,
  SUBSCRIBE_TO_CATALOG,
  SUBSCRIBE_TO_CATALOG_TRIAL,
  UPGRADE_TO_CATALOG_SUBSCRIPTION,
];

const CERTIFICATE_ICON_SUBSCRIPTION = `${config.url.resource_assets}growth_catalog_subscription/badge-green.png`;

const CERTIFICATE_ICON_PAYG = `${config.url.resource_assets}growth_catalog_subscription/badge-orange.png`;

type ModalProps = {
  onClose: () => void;
  courseId: string;
  course?: CoursesV1;
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
};

type ModalState = {
  isEnrolling: boolean;
};

class CatalogSubscriptionSpecialStandaloneEnrollModal extends React.Component<ModalProps, ModalState> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    isEnrolling: false,
  };

  onEnroll = () => {
    this.setState(() => ({ isEnrolling: true }));
  };

  onAuditClick = () => {
    const { courseId, course, enrollmentAvailableChoices } = this.props;
    const { router } = this.context;

    if (!courseId || !course || !enrollmentAvailableChoices) {
      return;
    }

    const { hasFreeEnrollOptionIntoCourse, canAuditCourse } = enrollmentAvailableChoices;

    let enrollmentType: EnrollmentChoiceTypesValues;

    if (hasFreeEnrollOptionIntoCourse) {
      enrollmentType = ENROLL_COURSE;
    } else if (canAuditCourse) {
      enrollmentType = AUDIT_COURSE;
    } else {
      logger.warn('Invalid enrollment type for auditing');
      return;
    }

    const freeEnrollCall = choiceTypeToHandleSubmitPromise[enrollmentType];

    freeEnrollCall({ courseId }).then((status: $TSFixMe /* TODO: type choiceTypeToHandleSubmitPromise */) => {
      if (enrollmentType === AUDIT_COURSE) {
        return router.push({
          ...router.location,
          params: router.params,
          query: Object.assign({}, router.location.query, {
            showOnboardingModal: 'check',
            courseSlug: course?.slug,
          }),
        });
      }
      if (status) {
        const redirectLocation = (course && course.phoenixHomeLink) || '/';
        redirect.setLocation(redirectLocation);
      }
    });
  };

  getStandaloneCardProps(
    enrollmentChoice: $TSFixMe /* TODO: type enrollmentChoice */
  ): CatalogSubscriptionStandaloneChoiceCardProps | null {
    const { enrollmentAvailableChoices, courseId } = this.props;
    const { isEnrolling } = this.state;
    const { enrollmentChoiceType } = enrollmentChoice;

    const canEnrollThroughCatalogSubscriptionFreeTrial =
      enrollmentAvailableChoices && enrollmentAvailableChoices.canEnrollThroughCatalogSubscriptionFreeTrial;

    let productId;
    let productType;
    let iconSrc;
    if (
      enrollmentChoiceType === SUBSCRIBE_TO_CATALOG ||
      enrollmentChoiceType === SUBSCRIBE_TO_CATALOG_TRIAL ||
      enrollmentChoiceType === UPGRADE_TO_CATALOG_SUBSCRIPTION
    ) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      productId = subscriptionPriceUtils.getSubscriptionSkuId(
        enrollmentAvailableChoices.availableCatalogSubscriptions,
        MONTHLY
      )!;
      productType = CATALOG_SUBSCRIPTION;
      iconSrc = CERTIFICATE_ICON_SUBSCRIPTION;
    } else if (enrollmentChoiceType === PURCHASE_SINGLE_COURSE) {
      productId = courseId;
      productType = VERIFIED_CERTIFICATE;
      iconSrc = CERTIFICATE_ICON_PAYG;
    } else {
      logger.error(`Unsupported enrollment choice type ${enrollmentChoiceType}`);
      return null;
    }

    return {
      courseId,
      productId,
      productType,
      enrollmentChoiceType,
      iconSrc,
      canEnrollThroughCatalogSubscriptionFreeTrial,
      disableContinueButton: isEnrolling,
      onEnroll: this.onEnroll,
    };
  }

  renderFooter() {
    const { enrollmentAvailableChoices } = this.props;

    if (!enrollmentAvailableChoices || !enrollmentAvailableChoices.enrollmentChoices) {
      return null;
    }

    const { canAuditCourse } = enrollmentAvailableChoices;

    const message = canAuditCourse
      ? _t(
          'Or {audit} this course. You will not have access to graded assignments and will not earn an official certificate.'
        )
      : _t('Or {audit} this course. You will not earn an official certificate.');

    return (
      <p className="footer-container align-horizontal-center">
        <FormattedMessage
          message={message}
          audit={
            <TrackedButton trackingName="choice_card_audit" className="button-link" onClick={this.onAuditClick}>
              {_t('audit')}
            </TrackedButton>
          }
        />
      </p>
    );
  }

  render() {
    const { enrollmentAvailableChoices } = this.props;

    if (!enrollmentAvailableChoices || !enrollmentAvailableChoices.enrollmentChoices) {
      return null;
    }

    const { enrollmentChoices, hasFreeEnrollOptionIntoCourse, canAuditCourse } = enrollmentAvailableChoices;

    const choiceCardChoices = _(enrollmentChoices).filter((choice) =>
      _(DISPLAY_CHOICES).contains(choice.enrollmentChoiceType)
    );

    const canFreeEnroll = hasFreeEnrollOptionIntoCourse || canAuditCourse;

    return (
      <Modal
        modalName={_t('Course Enroll Modal with Catalog Subscriptions')}
        className="rc-CatalogSubscriptionSpecialStandaloneEnrollModal"
        handleClose={this.props.onClose}
      >
        <div className="body-container">
          {choiceCardChoices.map((enrollmentChoice, idx) => {
            const cardProps = this.getStandaloneCardProps(enrollmentChoice);
            return cardProps ? (
              <CatalogSubscriptionStandaloneChoiceCard {...cardProps} key={`card_index_${idx}`} />
            ) : null;
          })}
        </div>
        {canFreeEnroll && this.renderFooter()}
      </Modal>
    );
  }
}

const WithCourse = Naptime.createContainer<ModalProps, Omit<ModalProps, 'course'>>(({ courseId }) => ({
  course: CoursesV1.get(courseId, {
    fields: ['name'],
  }),
}))(CatalogSubscriptionSpecialStandaloneEnrollModal);

export default withCatalogSubscriptions(WithCourse);
